var https = require('https');

module.exports = function() {
  var url = 'https://api.paybear.io/v1/eth/exchange/usd/rate';

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var response = JSON.parse(rawData);
      if (response.success) {
        console.log(response.data.mid);
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
  });
};
