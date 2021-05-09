import puppeteer from "puppeteer";

const translators: puppeteer.Page[] = [];

export const launch = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const pages = await Promise.all([
    browser.newPage(),
    // browser.newPage(),
    // browser.newPage(),
  ]);

  await Promise.all([
    pages[0]?.goto("https://www.deepl.com/ja/translator", {
      waitUntil: "networkidle2",
    }),
    // pages[1].goto("https://www.deepl.com/ja/translator", {
    //   waitUntil: "networkidle2",
    // }),
    // pages[2].goto("https://www.deepl.com/ja/translator", {
    //   waitUntil: "networkidle2",
    // }),
  ]);

  await Promise.all([
    pages[0]?.exposeFunction("translationResult", translationResult),
    // pages[1].goto("https://www.deepl.com/ja/translator", {
    //   waitUntil: "networkidle2",
    // }),
    // pages[2].goto("https://www.deepl.com/ja/translator", {
    //   waitUntil: "networkidle2",
    // }),
  ]);

  translators.push(...pages);
};

const translationResult = (key: string, text: string) => {
  console.log(key, text);
};

export const translation = async (value: string = "around the wrold.") => {
  const translator = translators.shift();
  if (!translator) {
    // TODO: Wait for translator availability
    return;
  }

  await translator.$eval("#target-dummydiv", (element) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const text = (mutation.target as Element).innerHTML;
        // @ts-ignore
        translationResult(text, text);
      }
    });

    observer.observe(element, {
      attributes: false,
      childList: true,
      characterData: true,
      subtree: false,
    });
  });

  await translator.$eval(
    ".lmt__source_textarea",
    (element, value) => {
      if (typeof value === "string") {
        (element as HTMLInputElement).value = value;
        element.dispatchEvent(new KeyboardEvent("input"));
      }
    },
    value
  );
};
