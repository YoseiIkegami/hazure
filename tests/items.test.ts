import assert from "node:assert/strict";
import test from "node:test";

import { items, pickItem } from "../src/items";

test("ボタン番号を景品へ循環して割り当てる", () => {
  assert.equal(pickItem(0), items[0]);
  assert.equal(pickItem(items.length), items[0]);
});

test("すべての景品に表示文がある", () => {
  assert.ok(items.every((item) => item.label.length > 0 && item.note.length > 0));
});
