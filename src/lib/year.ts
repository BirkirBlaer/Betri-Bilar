import { cacheLife } from "next/cache";

/** Current year, cached for a day so the page can stay statically rendered. */
export async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
