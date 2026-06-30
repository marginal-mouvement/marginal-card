import type { z } from "zod";

import type { SimpleShowSchema } from "./show.schemas";

export type SimpleShow = z.infer<typeof SimpleShowSchema>;
