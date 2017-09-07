var https = require('https');

module.exports = function() {
  var orderId = 12345;
  var payoutAddress = '0x296c781e905F5f83aFB7f0949D8bAac76D8D4c35'; //your address
  var callbackUrl = 'http://staging.ethering.io:3001/callback/' + orderId;
  var url = 'https://api.paybear.io/v1/eth/payment/' + payoutAddress + '/' + encodeURIComponent(callbackUrl);

  console.log(url);

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var data = JSON.parse(rawData);
      if (data.data.address) {
        console.log(data.data.address);
        //save data.data.invoice and keep it secret
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
  });
};
