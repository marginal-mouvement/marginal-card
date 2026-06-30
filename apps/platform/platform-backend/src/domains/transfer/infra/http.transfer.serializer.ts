import type { Transfer } from "../domain/transfer";

export class HttpTransferSerializer {
  serializeTransfer(transfer: Transfer) {
    return {
      id: transfer.id.serialize(),
      userId: transfer.userId.serialize(),
      label: transfer.label,
      amount: transfer.amount,
      kind: transfer.kind,
      date: transfer.date,
    };
  }

  serializeTransfers(transfers: Transfer[]) {
    return { transfers: transfers.map(this.serializeTransfer) };
  }
}
