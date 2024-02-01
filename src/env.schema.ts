import { z } from "zod";

export const schema = z.object({
  TARGET_URL: z.string(),
  TARGET_PATH: z.string(),
});