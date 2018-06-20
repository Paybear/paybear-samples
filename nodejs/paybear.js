var https = require('https');

var PAYBEAR_SECRET = 'secAPIKEY';

function getAddress(orderId, token, callback) {
  var callbackUrl = 'http://CHANGEME.com/payBear/callback/' + orderId;
  var url = 'https://api.paybear.io/v2/' + token.toLowerCase() + '/payment/' + '?token=' + PAYBEAR_SECRET;

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var response = JSON.parse(rawData);
      if (response.success) {
        callback(response.data.address);
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
    callback(null);
  });
}

function getCurrencies(callback)
{
    var currencies = null; //TODO: add cache here?

    var url = 'https://api.paybear.io/v2/currencies?token=' + PAYBEAR_SECRET;

    https.get(url, function (res) {
        var rawData = '';
        res.on('data', function (chunk) { rawData += chunk; });

        res.on('end', function () {
            var response = JSON.parse(rawData);
            if (response.success) {
                callback(response.data);
            }
        });
    }).
    on('error', function (e) {
        console.error(e);
        callback(null);
    });
}

function getCurrency(token, orderId, getAddr, callback) {
  getRate(token, function(rate) {
    if (rate) {
      var fiatValue = 19.99; //get from $orderId
      var coinsValue = +(fiatValue / rate).toFixed(8);
      var currency = null;

      getCurrencies(function(currencies) {
          token = token.toLowerCase();
          currency = currencies[token];
          currency['coinsValue'] = coinsValue;

          if (getAddr) {
              getAddress(orderId, token, function(address) {
                  currency['address'] = address;
                  currency['blockExplorer'] = currency['blockExplorer'] + address;
                  callback(currency);
              });
          } else {
              currency['currencyUrl'] = '/paybear/currencies?order=' + orderId + '&token=' + token;
              callback(currency);
          }
      });

    }
  });
}

function getRate(curCode, callback) {
  curCode = curCode.toLowerCase();
  getRates(function (rates) {
    rates[curCode] ? callback(rates[curCode].mid) : callback(false);
  });
}

function getRates(callback) {
  var url = 'https://api.paybear.io/v2/exchange/usd/rate';

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var response = JSON.parse(rawData);
      if (response.success) {
        callback(response.data);
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
    callback(null);
  });
}

module.exports = {
  getAddress: getAddress,
  getCurrency: getCurrency,
  getCurrencies: getCurrencies,
  getRate: getRate,
  getRates: getRates
};
