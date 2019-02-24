const app = new (require('express').Router)()

app.post('/paybear/callback/:order', (req, res) => {
  if (req.body && req.params.order) {
    // const orderId = req.params.order
    const data = req.body
    const invoice = data.invoice

    // save data.confirmations - number of confirmations to DB

    if (data.confirmations >= data.maxConfirmations) {
      // const amountPaid = data.inTransaction.amount / Math.pow(10, data.inTransaction.exp)

      // compare $amountPaid with order total
      // compare $invoice with one saved in the database to ensure callback is legitimate
      // mark the order as paid
      res.send(invoice) // stop further callbacks
    } else {
      res.send('waiting for confirmations')
    }
  } else {
    res.send('error')
  }
})

module.exports = app
