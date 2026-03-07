import type { Reader } from "@tockawa/nfc-pcsc";
import type {
  DatetimeService,
  KeyId,
  SubscriptionRegistry,
} from "@marginal-card/backend-framework";
import { Logger } from "@marginal-card/backend-framework";
import type { RfidStationSubscriptionTopics } from "@marginal-card/rfid-station-sdk";

import type { UriPrefix } from "./utils/uriPrefix";
import { MarginalisedReader } from "./marginalisedReader";

export class ReaderManager {
  constructor(
    private readonly uriPrefix: UriPrefix,
    private readonly path: string,
    private readonly subscriptionRegistry: SubscriptionRegistry<RfidStationSubscriptionTopics>,
    private readonly dateTimeService: DatetimeService,
  ) {}

  private readonly readers: Map<string, MarginalisedReader> = new Map();

  private readonly logger = Logger.for(ReaderManager);

  async register(reader: Reader) {
    const marginalisedReader = new MarginalisedReader(reader);
    this.readers.set(marginalisedReader.name, new MarginalisedReader(reader));

    this.logger.info(`Registered reader "${marginalisedReader.name}"`);

    reader.on("end", () => this.unregister(marginalisedReader));
    reader.on("card", () => this.read(marginalisedReader.name));
  }

  private async read(readerName: string) {
    const now = this.dateTimeService.now();
    const reader = this.readers.get(readerName);

    if (!reader) {
      await this.subscriptionRegistry.publish(["reader:*"], {
        name: "ReaderNotFound",
        payload: {
          forwardedName: readerName,
        },
        at: now,
      });
      return;
    }

    const keyId = await reader.loadKeyId(this.path);

    if (!keyId) {
      await this.subscriptionRegistry.publish(["reader:*"], {
        name: "NoTagRead",
        payload: {
          readerId: readerName,
        },
        at: this.dateTimeService.now(),
      });

      return;
    }

    reader.setBusy();
    await this.subscriptionRegistry.publish(["reader:*"], {
      name: "KeyIdRead",
      payload: {
        readerId: readerName,
        keyId: keyId.serialize(),
      },
      at: this.dateTimeService.now(),
    });
  }

  setIdle(readerName: string) {
    const reader = this.readers.get(readerName);

    if (!reader) {
      this.logger.error(`Reader "${readerName}" not found`);
      return;
    }

    reader.setIdle();
  }

  async write(readerName: string, keyId: KeyId) {
    const reader = this.readers.get(readerName);

    if (!reader) {
      this.logger.error(`Reader "${readerName}" not found`);
      return;
    }

    await reader.writeKeyId(this.uriPrefix, this.path, keyId);

    await this.subscriptionRegistry.publish(["reader:*"], {
      name: "KeyIdWritten",
      payload: {
        readerId: readerName,
      },
      at: this.dateTimeService.now(),
    });

    reader.setIdle();
  }

  unregister(reader: MarginalisedReader) {
    reader.removeAllListeners();
    this.readers.delete(reader.name);
    this.logger.warn(`Unregistered reader "${reader.name}"`);
  }
}
