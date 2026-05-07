import { cookies } from "next/headers";
import { type Lang, getT } from "./translations";

export { getT, type Lang, LANGUAGES } from "./translations";

export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  if (lang && ["uz", "en", "ru", "fr"].includes(lang)) {
    return lang as Lang;
  }
  return "uz";
}

export async function getServerT() {
  const lang = await getLang();
  return getT(lang);
}
