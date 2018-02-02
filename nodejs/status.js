const app = new (require('express').Router)();

app.get('/paybear/status/:order', (req, res) => {
  var orderId = req.params.order;

var confirmations = null;

confirmations = 0; //get from DB, see callback.php
maxConfirmations = 3; //get from DB, see callback.php

var resp = {
  success: confirmations >= maxConfirmations
};

if (confirmations!==null)
  resp['confirmations'] = confirmations;

res.json(resp); //return this data to PayBear form
});

module.exports = app;
