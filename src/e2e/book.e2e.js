import puppeteer from "puppeteer";

async function typeWithDelay(page, selector, text) {
  await page.focus(selector);
  await page.keyboard.type(text, { delay: 100 });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // change this accordingly
  await page.goto("http://localhost:5173/");

  // *** Test: Display List of Books or no Books ***
  await page.waitForFunction(
    () =>
      document.querySelector(".book-render") ||
      document.querySelector(".no-books-message")
  );

  // *** Test: Calculate Total Books ***
  const initialBookCount = await page.$eval(
    "#totalBooks",
    (element) => element.textContent
  );
  console.log("✅ Initial Books:", initialBookCount);

  // *** Test: Add Books ***
  await typeWithDelay(page, "#name", "A New Book Title");
  await typeWithDelay(page, "#author", "Great Author");
  await typeWithDelay(page, "#description", "Interesting description.");
  await page.click('button[type="submit"]');

  console.log("✅ 1 book added.");

  // *** Test: Search for Books ***
  await typeWithDelay(page, "#search-book", "New Book");

  await page.waitForSelector(".book-render");

  console.log("✅ New books searched.");

  // *** Test: Calculate Total Books ***
  const totalBooksText = await page.$eval(
    "#totalBooks",
    (element) => element.textContent
  );
  console.log("✅ Books Count label after adding:", totalBooksText);

  // *** Test: Remove Book ***
  const firstRemoveLink = await page.$(".remove-book-link");
  await firstRemoveLink.click();

  await page.waitForSelector(".book-render");

  console.log("✅ Test Book Removed.");

  await browser.close();
})();
