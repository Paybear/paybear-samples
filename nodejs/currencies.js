const getCurrency = require('./paybear').getCurrency
const getCurrencies = require('./paybear').getCurrencies
const app = new (require('express').Router)()

app.get('/paybear/currencies', (req, res) => {
  if (req.query.order) {
    const orderId = +req.query.order
    // const fiatTotal = 19.99 // get from order

    const token = req.query.token

    if (token) {
      getCurrency(token, orderId, true, (curr) => {
        res.json(curr) // return this data to PayBear form
      })
    } else {
      const returnCurrs = []
      getCurrencies((currs) => {
        const collectCurrencies = (currCodes) => {
          if (currCodes.length === 0) {
            res.json(returnCurrs)
            return
          }
          getCurrency(currCodes.pop(), orderId, true, (currency) => {
            returnCurrs.push(currency)
            collectCurrencies(currCodes)
          })
        }
        collectCurrencies(Object.keys(currs))
      })
    }
  } else {
    res.json({error: 'send the order number'})
  }
})

module.exports = app
