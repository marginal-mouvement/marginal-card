import { InfrastructureError } from "../error";

export async function parallel<T>(
  iterable: AsyncIterable<T> | Iterable<T>,
  concurrency: number,
  fn: (value: T, index: number) => Promise<any>,
) {
  const errors: { error: Error; item: T }[] = [];
  const running: Promise<any>[] = [];
  let index = 0;

  for await (const result of iterable) {
    while (running.length >= concurrency) {
      await Promise.race(running);
      if (errors.length > 0) {
        throw InfrastructureError.because(
          "Error during parallel processing",
          errors,
        );
      }
    }

    const promise = fn(result, index)
      .catch((e: unknown) => {
        const error =
          e instanceof Error
            ? e
            : InfrastructureError.because(
                `Error during parallel processing: ${String(e)}`,
              );

        errors.push({
          error: error,
          item: result,
        });
      })
      .finally(() => {
        void running.splice(running.indexOf(promise), 1);
      });

    running.push(promise);
    index += 1;
  }

  await Promise.allSettled(running);
  if (errors.length > 0) {
    throw InfrastructureError.because(
      "Error during parallel processing",
      errors,
    );
  }

  return index;
}
