var https = require('https');

module.exports = function() {
  var orderId = 12345;
  var payoutAddress = '0x39ee76948d238fad2b750998f8a38d80c73c7cd7'; //your address
  var callbackUrl = 'http://CHANGEME.com/callback/' + orderId;
  var url = 'https://api.paybear.io/v1/eth/payment/' + payoutAddress + '/' + encodeURIComponent(callbackUrl);

  console.log(url);

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var response = JSON.parse(rawData);
      if (response.success) {
        console.log(response.data.address);
        //save data.data.invoice and keep it secret
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
  });
};
