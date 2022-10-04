const getVindstoedReadings = require('./index')

async function main () {
  const readings = await getVindstoedReadings({
    username: process.env.VINDSTOED_USERNAME,
    password: process.env.VINDSTOED_PASSWORD
  })
  console.log(readings)
}

main()
