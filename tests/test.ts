import { expect, test } from "vitest";

import "~/main.ts";

test("加法1", () => {
  console.log(document.querySelector("#app"));
  expect(document.querySelector("#app")).toBeNull(); // 测试 1 + 1 = 2
});
