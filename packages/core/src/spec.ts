import { z } from 'zod';

export const StepType = z.enum(['task', 'choice', 'parallel', 'map', 'wait', 'end', 'fail']);

export const StepSchema = z.object({
  type: StepType,
  next: z.string().optional(),
  end: z.boolean().optional(),
  // choice/parallel/map specifics can be added incrementally
});

export const SpecSchema = z.object({
  id: z.string(),
  version: z.string().default('v1'),
  start: z.string(),
  steps: z.record(z.string(), StepSchema),
});

export type OrkestrSpec = z.infer<typeof SpecSchema>;

export function parseSpec(input: unknown): OrkestrSpec {
  return SpecSchema.parse(input);
}
