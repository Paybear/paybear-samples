var ETH_CONFIRMATIONS = 3;

app.post('/callback/:id', function (req, res) {
  if(req.body && req.params.id) {
    var orderId = req.params.id;
    var data = req.body;
    var invoice = data.invoice;

    if(data.confirmations >= ETH_CONFIRMATIONS) {
      var amountPaid = data.inTransaction.amount / Math.pow(10, 18); //amount in ETH
      //compare $amountPaid with order total
      //compare $invoice with one saved in the database to ensure callback is legitimate
      //mark the order as paid
      res.send(invoice); //stop further callbacks
    } else {
      res.send('waiting for confirmations');
    }
  } else {
    res.send('error');
  }

});