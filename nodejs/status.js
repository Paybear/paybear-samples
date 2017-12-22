var MIN_CONFIRMATIONS = 3;
const app = new (require('express').Router)();

app.get('/paybear/status/:order', (req, res) => {
  var orderId = req.params.order;

var confirmations = null;

confirmations = 0; //get from DB, see callback.php

var resp = {
  success: confirmations >= MIN_CONFIRMATIONS //set max confirmations
};

if (confirmations)
  resp['confirmations'] = confirmations;

res.json(resp); //return this data to PayBear form
});

module.exports = app;
