var getCurrency = require('./paybear').getCurrency;
const app = new (require('express').Router)();

app.get('/paybear/currencies', (req, res) => {
  if(req.query.order) {
  var orderId = +req.query.order;
  var fiatTotal = 19.99; //get from order

  var token = req.query.token;

  if(token) {
    getCurrency(token, orderId, true, function (curr) {
      res.json(curr); //return this data to PayBear form
    });
  } else {
    var currs = [];
    ['ETH', 'BTC', 'LTC', 'BCH', 'BTG', 'DASH'].forEach(function(token) {
      getCurrency(token, orderId, true, function(curr) {
        currs.push(curr);
      });
    });
    var i = setInterval(function() {
      if (currs.length >= 6) {
        clearInterval(i);
        res.json(currs); //return this data to PayBear form
      }
    }, 100);
  }
} else {
  res.json({error: 'send the order number'});
}
});

module.exports = app;