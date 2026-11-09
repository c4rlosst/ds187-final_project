export const COLOUR_GROUPS = [
  "red", "orange_yellow", "green", "blue_purple", "white_brown",
] as const;

export type ColourGroup = (typeof COLOUR_GROUPS)[number];

type LoggedFood = {
  category: "fruit" | "vegetable" | "grain";
  colourGroup: ColourGroup | null;
};

export function summarizeRainbow(foods: readonly LoggedFood[]) {
  const eaten = new Set(foods
    .filter((food) => food.category !== "grain")
    .map((food) => food.colourGroup)
    .filter((colour): colour is ColourGroup => colour !== null));
  return {
    colours: COLOUR_GROUPS.filter((colour) => eaten.has(colour)),
    missing: COLOUR_GROUPS.filter((colour) => !eaten.has(colour)),
    count: eaten.size,
    reachedFour: eaten.size >= 4,
  };
}
