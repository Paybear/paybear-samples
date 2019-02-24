const app = new (require('express').Router)()

app.get('/paybear/status/:order', (req, res) => {
  // const orderId = req.params.order
  const confirmations = 0 // get from DB, see callback.php
  const maxConfirmations = 3 // get from DB, see callback.php
  const resp = {
    success: confirmations >= maxConfirmations
  }
  if (confirmations !== null) { resp.confirmations = confirmations }
  res.json(resp) // return this data to PayBear form
})

module.exports = app
