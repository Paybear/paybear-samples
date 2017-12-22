var MIN_CONFIRMATIONS = 3;
const app = new (require('express').Router)();

app.post('/paybear/callback/:order', (req, res) => {
  if(req.body && req.params.order) {
  var orderId = req.params.order;
  var data = req.body;
  var invoice = data.invoice;

  if(data.confirmations >= MIN_CONFIRMATIONS) {
    var amountPaid = data.inTransaction.amount / Math.pow(10, data.inTransaction.exp);
    //compare $amountPaid with order total
    //compare $invoice with one saved in the database to ensure callback is legitimate
    //mark the order as paid
    res.send(invoice); //stop further callbacks
  } else {
    //save number of confirmations to DB
    res.send('waiting for confirmations');
  }
} else {
  res.send('error');
}

});

module.exports = app;