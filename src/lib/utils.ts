import type { Chef, SortOption } from "@/types";

/** Format raw input into Canadian postal code (A1A 1A1) */
export function formatPostal(raw: string): string {
  const clean = raw.replace(/\s/g, "").toUpperCase().slice(0, 6);
  return clean.length > 3 ? `${clean.slice(0, 3)} ${clean.slice(3)}` : clean;
}

/** Validate Canadian postal code */
export function validatePostal(value: string): boolean {
  return /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(value.trim());
}

/** Apply cuisine filter and sort to chef list */
export function filterAndSort(
  chefs: Chef[],
  cuisine: string,
  sort: SortOption
): Chef[] {
  let list = [...chefs];

  if (cuisine !== "All") {
    list = list.filter((c) =>
      c.cuisines.some((cu) =>
        cu.toLowerCase().includes(cuisine.toLowerCase())
      )
    );
  }

  switch (sort) {
    case "Nearest":      list.sort((a, b) => a.distance - b.distance);  break;
    case "Top Rated":    list.sort((a, b) => b.rating - a.rating);       break;
    case "Most Reviews": list.sort((a, b) => b.reviews - a.reviews);     break;
    case "Price: Low":   list.sort((a, b) => a.price.length - b.price.length); break;
    case "Price: High":  list.sort((a, b) => b.price.length - a.price.length); break;
  }

  return list;
}

/** Sleep helper for simulated async calls */
export const sleep = (ms: number) =>
  new Promise<void>((r) => setTimeout(r, ms));
