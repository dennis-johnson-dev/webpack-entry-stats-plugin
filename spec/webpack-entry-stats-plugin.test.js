it('should pass', async () => {
  const val = await Promise.resolve(3);
  expect(val).toBe(3);
});
