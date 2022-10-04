# @westh/vindstoed

Extracts the monthly power consumption from Vindstød.

_Seems like the data for the current month is updated daily._

## Usage

```js
const getVindstoedReadings = require('@westh/vindstoed')

async function main () {
  const readings = await getVindstoedReadings({
    username: process.env.VINDSTOED_USERNAME,
    password: process.env.VINDSTOED_PASSWORD
  })

  console.log(readings)
}

main()
```

Which outputs something like this:

```
[
  { month: '2022-04', kWh: 1233 },
  { month: '2022-05', kWh: 1234 },
  { month: '2022-06', kWh: 1255 },
  { month: '2022-07', kWh: 1223 },
  { month: '2022-08', kWh: 1274 },
  { month: '2022-09', kWh: 1285 },
  { month: '2022-10', kWh: 100 }
]
```

## Installation

```
npm i @westh/vindstoed
```

## License

MIT

