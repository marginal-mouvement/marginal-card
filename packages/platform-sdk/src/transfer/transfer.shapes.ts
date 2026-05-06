import type { z } from "zod";

import type { SimpleTransferSchema } from "./transfer.schemas";

export type SimpleTransfer = z.infer<typeof SimpleTransferSchema>;
