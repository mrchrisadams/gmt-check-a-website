import puppeteer from 'puppeteer';
import microtime from 'microtime';

(async () => {
    let puppeteerArgs = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
    // assume we are in development environment working on scripts
    // so we want to see the browser doing its thing
    if (process.env.LIVE_DEMO) {
        puppeteerArgs.headless = false;
    }
    // assume we running puppeteer in a dedicated docker container 
    // for GMT. We want to be explicit about the path to the browser
    // and we want it to be headless
    else {
        puppeteerArgs.headless = true;
        puppeteerArgs.executablePath = "/usr/bin/chromium-browser";
    }


    const browser = await puppeteer.launch(puppeteerArgs);
    const page = await browser.newPage();
    // page.setDefaultTimeout(5000);
    await page.setViewport({ "width": 1280, "height": 800 });

    await page.goto(process.env.USAGE_SCENARIO_DOMAIN, { waitUntil: "networkidle0" });
    console.log(microtime.now(), await page.title());
    console.log("GMT_SCI_R=1");

    await page.waitForNetworkIdle();

    await page.click('[aria-controls="site-search-modal"]')

    const searchResultSelector = '.modal__container';
    await page.waitForSelector(searchResultSelector);

    await new Promise(r => setTimeout(r, 500));

    // Type into search box
    await page.type('.search__input', 'bakery');

    await new Promise(r => setTimeout(r, 500));

    // TODO why would search_button not be clickable in puppeteer,
    // but respond to click() in the browser?
    // const SearchButton = '.search__button'
    // await page.waitForSelector(SearchButton);
    // await page.click(SearchButton)

    await page.keyboard.press('Enter');

    // wait for 5 seconds
    await new Promise(r => setTimeout(r, 3 * 1000));
    await page.evaluate(() => document.querySelector('footer').scrollIntoView());

    await new Promise(r => setTimeout(r, 3 * 1000));

    await browser.close();
})().catch(err => {
    console.error(err);
    process.exit(1);
});