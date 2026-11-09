import assert from "node:assert/strict";
import test from "node:test";
import { summarizeRainbow } from "../lib/rainbow.ts";

const vegetable = (colourGroup) => ({ category: "vegetable", colourGroup });

test("an empty day leaves all colours available", () => {
  const day = summarizeRainbow([]);
  assert.equal(day.count, 0);
  assert.equal(day.missing.length, 5);
  assert.equal(day.reachedFour, false);
});

test("repeated foods count their colour only once", () => {
  assert.deepEqual(summarizeRainbow([vegetable("green"), vegetable("green")]).colours, ["green"]);
});

test("grains and unclassified foods do not count as fruit and vegetable colours", () => {
  assert.equal(summarizeRainbow([
    { category: "grain", colourGroup: "white_brown" }, vegetable(null),
  ]).count, 0);
});

test("four distinct fruit and vegetable colours meet the daily rule", () => {
  const foods = ["red", "orange_yellow", "green", "blue_purple"].map(vegetable);
  assert.equal(summarizeRainbow(foods.slice(0, 3)).reachedFour, false);
  const day = summarizeRainbow(foods);
  assert.equal(day.reachedFour, true);
  assert.deepEqual(day.missing, ["white_brown"]);
  assert.equal(summarizeRainbow([...foods, { category: "fruit", colourGroup: "white_brown" }]).count, 5);
});
