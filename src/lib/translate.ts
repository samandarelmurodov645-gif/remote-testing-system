const MYMEMORY_URL = "https://api.mymemory.translated.net/get";

async function translateText(
  text: string,
  from: string,
  to: string,
  retries = 2
): Promise<string> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (translated && typeof translated === "string") return translated;
      throw new Error("No translation");
    } catch {
      if (attempt === retries) return text;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  return text;
}

export async function translateBatch(
  texts: string[],
  from: string,
  to: string,
  chunkSize = 5
): Promise<string[]> {
  const results: string[] = new Array(texts.length).fill("");
  for (let i = 0; i < texts.length; i += chunkSize) {
    const chunk = texts.slice(i, i + chunkSize);
    const translated = await Promise.all(
      chunk.map((text) => translateText(text, from, to))
    );
    for (let j = 0; j < translated.length; j++) {
      results[i + j] = translated[j];
    }
    if (i + chunkSize < texts.length) {
      await new Promise((r) => setTimeout(r, 150));
    }
  }
  return results;
}
