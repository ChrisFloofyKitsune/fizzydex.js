it("should import from src", async () => {
  const fromSrc = await import("../src");
  expect(fromSrc).toBeTruthy();
  expect(fromSrc.isWorking()).toEqual(true);
})

it("should import from dist", async () => {
  const fromDist = await import("../dist");
  expect(fromDist).toBeTruthy();
  expect(fromDist.isWorking()).toEqual(true);
});