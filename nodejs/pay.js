var https = require('https');
var getCurrencies = require('./currencies');

var usdAmount = 10;
var currencies = ["ETH"];

getReq(usdAmount, currencies, function(data) {
  console.log(JSON.stringify(data.request)); //return this data to PayBear form
});

function getReq(amount, currencies, callback) {
  var orderId = 1;

  var request = {
    currencies: [],
    invoice: ""+orderId,
    fiatValue: +amount,
    accepted: false,
    redirectTo: 'https://www.mysite.com/success.html'
  };

  sendReq(orderId, function(data) {
    if(data.address) {
      getCurrencies(currencies, data.address, request, function(result) {
        request.currencies = result;
        callback({
          error: null,
          request: request
        });
      });
    } else {
      callback({
        error: data.error,
        request: null
      });
    }
  });
}

function sendReq(orderId, callback) {
  var payoutAddress = '0x39ee76948d238fad2b750998f8a38d80c73c7cd7'; //your address
  var callbackUrl = 'https://www.mysite.com/payBear/callback/' + orderId;
  var url = 'https://api.paybear.io/v1/eth/payment/' + payoutAddress + '/' + encodeURIComponent(callbackUrl);

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var response = JSON.parse(rawData);
      if (response.success) {
        callback({
          error: null,
          address: response.data.address
        });
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
    callback({
      error: e,
      address: null
    });
  });
}

