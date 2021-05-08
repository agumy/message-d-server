import puppeteer = require("puppeteer-core");

const translators: puppeteer.Page[] = [];

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.deepl.com/ja/translator");

  translators.push(page);
})();

export const translation = (value: string) => {
  const translator = translators.pop();
  if (!translator) {
    // TODO: Wait for translator availability
    return;
  }

  translator.$eval(".lmt__source_textarea", (element) => {
    (element as HTMLInputElement).value = value;
    element.dispatchEvent(new KeyboardEvent("input"));
  });
};
