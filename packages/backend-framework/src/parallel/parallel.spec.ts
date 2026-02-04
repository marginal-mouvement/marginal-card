import { parallel } from "./parallel";

describe("parallel", () => {
  it("should execute all items", async () => {
    const result: number[] = [];

    await parallel([1, 2, 3, 4], 2, async (item) => {
      result.push(item * 2);
    });

    expect(result).toEqual([2, 4, 6, 8]);
  });

  it("should throw an error if an item fails", async () => {
    await expect(
      parallel([1, 2, 3, 4], 2, async (item) => {
        if (item === 3) {
          throw undefined;
        }
      }),
    ).rejects.toThrow(Error);

    await expect(
      parallel([1, 2, 3, 4], 2, async (item) => {
        if (item === 3) {
          throw undefined;
        }
      }),
    ).rejects.toThrow(Error);
  });

  test("concurrency", async () => {
    const result: number[] = [];

    try {
      await parallel([1, 2, 3, 4, 5, 6, 7], 3, async (item) => {
        result.push(item * 2);
        await new Promise((resolve) => setTimeout(resolve, 0));
        throw undefined;
      });
    } catch (e) {}

    expect(result).toEqual([2, 4, 6]);
  });
});
