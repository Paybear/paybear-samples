var https = require('https');

module.exports = function (curCode, callback) {
  var url = 'https://api.paybear.io/v1/' + curCode.toLowerCase() + '/exchange/usd/rate';

  https.get(url, function (res) {
    var rawData = '';
    res.on('data', function (chunk) { rawData += chunk; });

    res.on('end', function () {
      var response = JSON.parse(rawData);
      if (response.success) {
        callback({
          error: null,
          rate: response.data.mid
        });
      }
    });
  }).
  on('error', function (e) {
    console.error(e);
    callback({
      error: e,
      rate: null
    });
  });
};
