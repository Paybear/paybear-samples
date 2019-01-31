const https = require('https')

const PAYBEAR_SECRET = 'secAPIKEY'

function getAddress (orderId, token, callback) {
  // const callbackUrl = `http://CHANGEME.com/payBear/callback/${orderId}`
  const url = `https://api.paybear.io/v2/${token.toLowerCase()}/payment/?token=${PAYBEAR_SECRET}`

  https.get(url, (res) => {
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })

    res.on('end', () => {
      const response = JSON.parse(rawData)
      if (response.success) {
        callback(response.data.address)
      }
    })
  })
    .on('error', function (e) {
      console.error(e)
      callback(null)
    })
}

function getCurrencies (callback) {
  // const currencies = null // TODO: add cache here?

  const url = `https://api.paybear.io/v2/currencies?token=${PAYBEAR_SECRET}`

  https.get(url, (res) => {
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })

    res.on('end', () => {
      const response = JSON.parse(rawData)
      if (response.success) {
        callback(response.data)
      }
    })
  })
    .on('error', (e) => {
      console.error(e)
      callback(null)
    })
}

function getCurrency (token, orderId, getAddr, callback) {
  getRate(token, (rate) => {
    if (rate) {
      const fiatValue = 19.99 // get from $orderId
      const coinsValue = +(fiatValue / rate).toFixed(8)
      let currency = null

      getCurrencies((currencies) => {
        token = token.toLowerCase()
        currency = currencies[token]
        currency['coinsValue'] = coinsValue

        if (getAddr) {
          getAddress(orderId, token, (address) => {
            currency['address'] = address
            currency['blockExplorer'] = currency['blockExplorer'] + address
            callback(currency)
          })
        } else {
          currency['currencyUrl'] = `/paybear/currencies?order=${orderId}&token=${token}`
          callback(currency)
        }
      })
    }
  })
}

function getRate (curCode, callback) {
  curCode = curCode.toLowerCase()
  getRates(function (rates) {
    if (rates[curCode]) callback(rates[curCode].mid)
    else callback(false)
  })
}

function getRates (callback) {
  const url = 'https://api.paybear.io/v2/exchange/usd/rate'

  https.get(url, (res) => {
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })

    res.on('end', () => {
      const response = JSON.parse(rawData)
      if (response.success) {
        callback(response.data)
      }
    })
  })
    .on('error', (e) => {
      console.error(e)
      callback(null)
    })
}

module.exports = {
  getAddress: getAddress,
  getCurrency: getCurrency,
  getCurrencies: getCurrencies,
  getRate: getRate,
  getRates: getRates
}
