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

  const [, translated] = await Promise.all([
    translator.$eval(
      ".lmt__source_textarea",
      (element, value) => {
        if (typeof value === "string") {
          (element as HTMLInputElement).value = value;
          element.dispatchEvent(new KeyboardEvent("input"));
        }
      },
      value
    ),
    translator.$eval("#target-dummydiv", async (element) => {
      const waitAsync = async <T extends () => any>(
        conditionCallback: () => boolean,
        callback: T,
        intervalMillSecond = 100
      ): Promise<ReturnType<T>> => {
        if (conditionCallback()) {
          return callback();
        }

        return new Promise((resolve, _reject) => {
          const intervalId = setInterval(() => {
            if (!conditionCallback()) {
              return;
            }
            clearInterval(intervalId);
            resolve(callback());
          }, intervalMillSecond);
        });
      };

      const translated = await waitAsync(
        () => Boolean(element.innerHTML.trim()),
        () => element.innerHTML.trim()
      );

      element.innerHTML = "";
      return translated;
    }),
  ]);
};
