import type { z } from "zod";

import type { SimpleUserSchema } from "./user.schemas";

export type SimpleUser = z.Infer<typeof SimpleUserSchema>;
