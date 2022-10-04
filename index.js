const puppeteer = require('puppeteer')

function formatVindstoedReading ({ month: vindstoedFormattedMonth, kWh: vindstoedReading }) {
  return {
    month: `${vindstoedFormattedMonth.substring(2)}-${vindstoedFormattedMonth.substring(0,2)}`,
    kWh: Number(vindstoedReading.substring(0, vindstoedReading.length - 3))
  }
}

module.exports = async ({
  username,
  password,
  controlPanelURL = 'https://kontrolpanel.vindstoed.dk/kontrolpanel/login',
  readingsURL = 'https://kontrolpanel.vindstoed.dk/kontrolpanel/readings',
  headless = true
}) => {
  const browser = await puppeteer.launch({ headless })
  const page = await browser.newPage()

  await page.goto(controlPanelURL, { waitUntil: 'networkidle0' })
  await page.type('#inputUsername', username)
  await page.type('#inputPassword', password)
  const [loginButton] = await page.$x('//*[@id="login_form"]/button')
  await Promise.all([
    loginButton.click(),
    page.waitForNavigation({ waitUntil: 'networkidle0' })
  ])
  await page.goto(readingsURL)

  const [labelElements, valueElements] = await Promise.all([
    page.$$('div.xAxis > div.tickLabel'),
    page.$$('#readingsContainer > div > div:not(.tickLabels)')
  ])

  const isLabelAndValueLengthsOutOfSync = labelElements.length !== valueElements.length
  if (isLabelAndValueLengthsOutOfSync) {
    console.log(`Something is off, labelElements -> ${labelElements.length} and valueElements -> ${valueElements.length}`) 
    const keys = await Promise.all(labelElements.map(element => page.evaluate(el => el.textContent, element)))
    const values = await Promise.all(valueElements.map(element => page.evaluate(el => el.textContent, element)))
    console.log({ keys, values })
    return null
  }

  const readings = []
  for (let i = 0; i < labelElements.length; i++) {
    const [month, kWh] = await Promise.all([
      page.evaluate(el => el.textContent, labelElements[i]),
      page.evaluate(el => el.textContent, valueElements[i])
    ])
    readings.push(formatVindstoedReading({ month, kWh }))
  }

  await browser.close()

  return readings
}
