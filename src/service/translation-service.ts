import puppeteer from "puppeteer";
import { waitAsync } from "../utility/waitAsync";

// Page cache
const translators: puppeteer.Page[] = [];

export const launch = async (parallelCount: number = 10) => {
  const browser = await puppeteer.launch({ headless: true });

  // parallelCountと同数のタブを生成する
  const pages = await Promise.all(
    [...Array(parallelCount).keys()].map(() => browser.newPage())
  );

  // 全てのTabでDeepLを開く
  await Promise.all(
    pages.map((p) =>
      p.goto("https://www.deepl.com/ja/translator", {
        waitUntil: "networkidle2",
      })
    )
  );

  translators.push(...pages);
};

export const translation = async (value: string) => {
  const translator = await waitAsync(
    () => Boolean(translators.length),
    () => translators.shift()!
  );

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

      return translated;
    }),
  ]);

  await Promise.all([
    translator.$eval(".lmt__source_textarea", (element) => {
      (element as HTMLTextAreaElement).value = "";
    }),
    translator.$eval(".lmt__target_textarea", (element) => {
      (element as HTMLTextAreaElement).value = "";
    }),
  ]);

  translators.push(translator);
  return translated;
};
