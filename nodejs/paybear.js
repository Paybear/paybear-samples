var https = require('https');

function getAddress(orderId, token, callback) {
  var payoutAddress = getPayout(token);
  var callbackUrl = 'http://CHANGEME.com/payBear/callback/' + orderId;
  var url = 'https://api.paybear.io/v1/' + token.toLowerCase() + '/payment/' + payoutAddress + '/' + encodeURIComponent(callbackUrl);

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

function getPayout(token) {
  //TODO
  return '0x39ee76948d238fad2b750998f8a38d80c73c7cd7';
}

function getCurrency(token, orderId, getAddr, callback) {
  getRate(token, function(rate) {
    if (rate) {
      var fiatValue = 19.99; //get from $orderId
      var coinsValue = +(fiatValue / rate).toFixed(5);
      var currency = null;

      switch (token) {
        case 'ETH':
          currency = {
            coinsValue: coinsValue,
            rate: rate,
            title: 'Ethereum',
            code: 'ETH',
            metamask: true,
            confirmations: 3,
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQxNyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHZpZXdCb3g9IjAgMCAyNTYgNDE3IiB3aWR0aD0iMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xMjcuOTYxMSAwLTIuNzk1IDkuNXYyNzUuNjY4bDIuNzk1IDIuNzkgMTI3Ljk2Mi03NS42Mzh6IiBmaWxsPSIjMzQzNDM0Ii8+PHBhdGggZD0ibTEyNy45NjIgMC0xMjcuOTYyIDIxMi4zMiAxMjcuOTYyIDc1LjYzOXYtMTMzLjgwMXoiIGZpbGw9IiM4YzhjOGMiLz48cGF0aCBkPSJtMTI3Ljk2MTEgMzEyLjE4NjYtMS41NzUgMS45MnY5OC4xOTlsMS41NzUgNC42MDEgMTI4LjAzOC0xODAuMzJ6IiBmaWxsPSIjM2MzYzNiIi8+PHBhdGggZD0ibTEyNy45NjIgNDE2LjkwNTJ2LTEwNC43MmwtMTI3Ljk2Mi03NS42eiIgZmlsbD0iIzhjOGM4YyIvPjxwYXRoIGQ9Im0xMjcuOTYxMSAyODcuOTU3NyAxMjcuOTYtNzUuNjM3LTEyNy45Ni01OC4xNjJ6IiBmaWxsPSIjMTQxNDE0Ii8+PHBhdGggZD0ibSAuMDAwOSAyMTIuMzIwOCAxMjcuOTYgNzUuNjM3di0xMzMuNzk5eiIgZmlsbD0iIzM5MzkzOSIvPjwvc3ZnPg==',
            blockExplorer: 'https://etherscan.io/address/'
          };
          break;
        case 'BTC':
          currency = {
            coinsValue: coinsValue,
            rate: rate,
            title: 'Bitcoin',
            code: 'BTC',
            confirmations: 1,
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjU0IiB2aWV3Qm94PSIwIDAgMzkgNTQiIHdpZHRoPSIzOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNDkuNzc1MTEwNiAzOS43MzQyMDE1YzAtOC43MDg2MTEyLTYuMDg0MDk4My0xMC40OTgwNTE4LTYuMDg0MDk4My0xMC40OTgwNTE4czQuNDEzOTUzNi0xLjQzMTU1MjYgNC40MTM5NTM2LTYuOTE5MTcwNi00LjI5NDY1NzUtOC4zNTA3MjMxLTguMzUwNzIzLTguMzUwNzIzMWMtLjExOTI5NjEgMC0uMzU3ODg4MiAwLS40NzcxODQyIDB2LTcuMTU3NzYyNjFoLTQuNzcxODQxOHY3LjE1Nzc2MjYxYy0xLjU1MDg0ODUgMC0zLjEwMTY5NzEgMC00Ljc3MTg0MTcgMHYtNy4xNTc3NjI2MWgtNC43NzE4NDE4djcuMTU3NzYyNjFjLTEuMzEyMjU2NSAwLTEwLjczNjY0NCAwLTEwLjczNjY0NCAwdjUuOTY0ODAyMmg0Ljc3MTg0MTh2MjUuMDUyMTY5M2gtNC43NzE4NDE4djUuOTY0ODAyMmgxMC43MzY2NDR2Ny4xNTc3NjI2aDQuNzcxODQxOHYtNy4xNTc3NjI2aDQuNzcxODQxN3Y3LjE1Nzc2MjZoNC43NzE4NDE4di03LjI3NzA1ODdjMy40NTk1ODUzLS4xMTkyOTYgMTAuNDk4MDUxOS0yLjYyNDUxMjkgMTAuNDk4MDUxOS0xMS4wOTQ1MzIxem0tMjQuOTMyODczMi0xOS44MDMxNDMzaDEyLjUyNjA4NDZjLjgzNTA3MjMgMCAzLjgxNzQ3MzQtLjM1Nzg4ODEgMy44MTc0NzM0IDQuNDEzOTUzNyAwIDQuNDEzOTUzNi0zLjkzNjc2OTUgMy45MzY3Njk0LTMuOTM2NzY5NSAzLjkzNjc2OTRoLTEyLjQwNjc4ODV6bTEzLjI0MTg2MDggMjMuODU5MjA4OGgtMTMuMjQxODYwOHYtOC4zNTA3MjNoMTMuMjQxODYwOGMuOTU0MzY4NCAwIDQuMDU2MDY1NS0uNTk2NDgwMyA0LjA1NjA2NTUgNC40MTM5NTM2LjExOTI5NjEgNC43NzE4NDE3LTQuMDU2MDY1NSAzLjkzNjc2OTQtNC4wNTYwNjU1IDMuOTM2NzY5NHoiIGZpbGw9IiNmN2FjMzEiIHRyYW5zZm9ybT0ibWF0cml4KC45ODE2MjcxOCAuMTkwODA5IC0uMTkwODA5IC45ODE2MjcxOCAtNC4yMTg5NTUgLTEwLjUwOTU1OSkiLz48L3N2Zz4=',
            blockExplorer: 'https://blockchain.info/address/'
          };
          break;
        case 'DASH':
          currency = {
            coinsValue: coinsValue,
            rate: rate,
            title: 'Dash',
            code: 'DASH',
            confirmations: 3,
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM4IiB2aWV3Qm94PSIwIDAgNjQgMzgiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNjMuOTEzNjQ2MiAxOC45NjkwMDk1Yy4yMDkzMjQyIDEuMjkwODMyNC4wMzQ4ODczIDIuNjE2NTUyMS0uNDg4NDIzMSAzLjgwMjcyMjRsLTUuNzU2NDE0NiAxOC4xMDY1NDA2Yy0uNTIzMzEwNCAxLjI1NTk0NS0xLjE1MTI4MjkgMi40NDIxMTUzLTEuOTE4ODA0OSAzLjU5MzM5ODItLjkwNzA3MTQgMS4xNTEyODI5LTEuOTUzNjkyMiAyLjE5NzkwMzgtMy4xMDQ5NzUyIDMuMTA0OTc1Mi0xLjE4NjE3MDMuOTc2ODQ2MS0yLjU4MTY2NDcgMS42NzQ1OTMzLTMuODAyNzIyNCAyLjM3MjM0MDYtMS4yMTg4ODA0LjQ1MDg4MDktMi41MDM1NzI1LjY5ODM5MDQtMy44MDI3MjI0LjczMjYzNDZoLTQzLjYwOTIwMTc4bDMuMTA0OTc1MTctOS4zMTQ5MjU1aDM5LjMxODA1NjMxbDYuMjA5OTUwNC0xOS4wNDg0OTk0aC0zOS4zMTgwNTY0bDMuMTA0OTc1Mi05LjMxNDkyNTVoNDMuMzk5ODc3NmMxLjE1MTI4My0uMDM0ODg3NCAyLjMwMjU2NTkuMjA5MzI0MiAzLjM0OTE4NjcuNzMyNjM0NiAxLjAxMTczMzUuMzgzNzYxIDEuODgzOTE3NiAxLjE1MTI4MjkgMi4zNzIzNDA2IDIuMTI4MTI5LjU1ODE5NzguOTQxOTU4OC44NzIxODQxIDIuMDIzNDY3Ljk0MTk1ODggMy4xMDQ5NzUyem0tMzcuNjc4MzUwNCA4LjU0NzQwMzYtMi44NjA3NjM2IDguNjE3MTc4MmgtMjMuMzc0NTMyMmwzLjEwNDk3NTE3LTguNjE3MTc4MnoiIGZpbGw9IiMxZTc1YmIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTEzKSIvPjwvc3ZnPg==',
            blockExplorer: 'https://explorer.dash.org/address/'
          };
          break;
        case 'BTG':
          currency = {
            coinsValue: coinsValue,
            rate: rate,
            title: 'Bitcoin Gold',
            code: 'BTG',
            confirmations: 2,
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjgwMCIgdmlld0JveD0iMCAwIDgwMCA4MDAiIHdpZHRoPSI4MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQwMCAwYTQwMCA0MDAgMCAwIDAgLTQwMCA0MDAgNDAwIDQwMCAwIDAgMCA0MDAgNDAwIDQwMCA0MDAgMCAwIDAgNDAwLTQwMCA0MDAgNDAwIDAgMCAwIC00MDAtNDAwem0wIDE0YTM4NiAzODYgMCAwIDEgMzg2IDM4NiAzODYgMzg2IDAgMCAxIC0zODYgMzg2IDM4NiAzODYgMCAwIDEgLTM4Ni0zODYgMzg2IDM4NiAwIDAgMSAzODYtMzg2eiIgZmlsbD0iIzAwMjA2YiIvPjxwYXRoIGQ9Im00MDAgMzVhMzY1IDM2NSAwIDAgMCAtMzY1IDM2NSAzNjUgMzY1IDAgMCAwIDM2NSAzNjUgMzY1IDM2NSAwIDAgMCAzNjUtMzY1IDM2NSAzNjUgMCAwIDAgLTM2NS0zNjV6bTAgMTE1YTI1MCAyNTAgMCAwIDEgMjUwIDI1MCAyNTAgMjUwIDAgMCAxIC0yNTAgMjUwIDI1MCAyNTAgMCAwIDEgLTI1MC0yNTAgMjUwIDI1MCAwIDAgMSAyNTAtMjUweiIgZmlsbD0iI2ViYTgwOSIvPjxwYXRoIGQ9Im00MDAgMTcyYTIyOCAyMjggMCAwIDAgLTIyOCAyMjggMjI4IDIyOCAwIDAgMCAyMjggMjI4IDIyOCAyMjggMCAwIDAgMjI4LTIyOCAyMjggMjI4IDAgMCAwIC0yMjgtMjI4em0wIDE2YTIxMiAyMTIgMCAwIDEgOC45MTc5Ny40NDUzMXY2MC44NDU3MWgtMzIuMTYyMTF2LTU5Ljc1OTc3YTIxMiAyMTIgMCAwIDEgMjMuMjQ0MTQtMS41MzEyNXptNDguOTM5NDUgNS45Njg3NWEyMTIgMjEyIDAgMCAxIDE2My4wNjA1NSAyMDYuMDMxMjUgMjEyIDIxMiAwIDAgMSAtMTYzLjE4MzU5IDIwNi4wNDQ5MnYtNTYuNzI0NjFzMzcuNDQzMjItMS45NjQwNSA1Ni43MTY3OS04LjM0NzY1YzE5LjI3MzU4LTYuMzgzNjEgMzIuMTYyNDQtMTMuMDEzMjcgNDQuMDcwMzItMjcuMTMwODYgMTEuOTA3ODctMTQuMTE3NTggMTguNTM2NTQtNDEuMDAxNTQgMTguMjkxMDEtNjAuMTUyMzUtLjI0NTUyLTE5LjE1MDgxLTYuMTM3MDMtMzQuODY0ODEtMTIuMTUyMzQtNDMuMDg5ODQtNi4wMTUzMi04LjIyNTAyLTE4LjQxNDA0LTE1Ljk1ODk2LTE4LjQxNDA3LTE1Ljk1ODk5IDAgMC03LjQ4ODI5LTMuOTI3MDEtMTMuMzgwODUtNi4xMzY3MS01Ljg5MjU1LTIuMjA5NzEtMTIuNTIzNDQtMy44MDY2NC0xMi41MjM0NC0zLjgwNjY0czEyLjg5MTQ2LTguNDcwNzMgMTguMjkyOTctMTQuMzYzMjkgMTMuOTk1MDMtMTYuNDQ5NjUgMTUuMjIyNjUtMzUuOTY4NzVjMS4yMjc2MS0xOS41MTkwOS0yLjU3ODY1LTM3LjQ0MTc3LTEyLjg5MDYyLTUwLjIwODk4LTEwLjMxMTk3LTEyLjc2NzItMjYuMjcwNjMtMjEuOTc1NDQtNDcuNzUzOTEtMjcuMzc2OTVzLTM1LjM1NTQ3LTYuMTM2NzItMzUuMzU1NDctNi4xMzY3MnptLTExMS4wOTk2MSAzLjU2ODM2djUzLjQ3MjY2bC04MS42MzY3Mi4xODM1OWMtMy4wODk0OS41MTE1MS01LjI1ODMgMi45ODcyNC01Ljg5MjU3IDYuMzIyMjZsLS4yNDYxIDI5Ljk1NTA4Yy0uMDgzOCAzLjY5MjI1IDIuMTc3NTQgNC44MjMxNiA1LjIxODc1IDUuMjE2OGgzNC40MzM2YzYuOTAwODQtLjg0NTQyIDE4LjkyODkyIDYuMjY1MDIgMTkuNjQyNTggMTcuNjE3MTl2MTc5LjU5OTYxYy4xOTgwNSAzLjY5MTAzLTQuODE4MzIgMTIuMzMxMzItMTIuMzk4NDQgMTIuMzk4NDNoLTMzLjg4Mjgycy0xLjcxNzk4LjM2ODM3LTMuMDY4MzUgMS43MTg3NWMtMS4zNTAzOCAxLjM1MDM3LTIuNTc4MTMgNC41NDI5Ny0yLjU3ODEzIDQuNTQyOTdsLTYuMjYxNzIgMjkuNzA3MDNzLS43MzY4NiA1LjE1Njg3LS4xMjMwNCA2LjI2MTcyYy42MTM4MSAxLjEwNDg2IDMuNTYwMDYgNC40MjAyMSA1LjAzMzIgNC41NDI5NyAxLjQ3MzEzLjEyMjc2IDgyLjM3MzA3IDAgODIuMzczMDQgMHY1My43MzYzM2EyMTIgMjEyIDAgMCAxIC0xNTAuNDUzMTItMjAyLjgxMjUgMjEyIDIxMiAwIDAgMSAxNDkuODM5ODQtMjAyLjQ2Mjg5em0zOS44NDM3NSA5OC4yMDcwM2MyNC4wOTQ0MyAxLjI5MjU5IDQ5LjY4ODc4LTIuNDEzNjggNzEuNTMzMjEgNy42Mjg5MSAxOC42Nzc3NyA3LjIwOTI1IDIxLjM1NTQzIDIyLjQxNzcgMjEuNTMzMiAzMi4xMjY5NS0uMjQ5MzggMTAuMzU5MzgtMi42MjA5NCAyMC4xODg0My0xOS4zMTA1NSAzMS4wNzgxMi0xNi42MzA2OCA5LjQxNjU3LTQ4Ljk5MzQ1IDkuMjg3NTktNzMuNzU1ODYgOS4xNTgyMXptLjU5OTYxIDExOS41NzQyMmMyOC44MTgxMiAxLjQwNDUgNTkuNDI5NjItMi42MjQ5IDg1LjU1NjY0IDguMjg3MTEgMjIuMzM5NTIgNy44MzMzOCAyNS41NDMyNCAyNC4zNjAzNSAyNS43NTU4NiAzNC45MTAxNS0uMjk4MjggMTEuMjU2MjItMy4xMzQxMSAyMS45MzcwOC0yMy4wOTU3IDMzLjc2OTU0LTE5Ljg5MTExIDEwLjIzMTc4LTU4LjU5OTc0IDEwLjA4OTgtODguMjE2OCA5Ljk0OTIyem0zMS4yMzA0NyAxMzQuNTQ2ODd2NjEuNzk2ODhhMjEyIDIxMiAwIDAgMSAtOS41MTM2Ny4zMzc4OSAyMTIgMjEyIDAgMCAxIC0yMi4wMTc1OC0xLjE4NzV2LTYwLjc1NTg2aDMwLjgxNDQ2eiIgZmlsbD0iIzAwMjA2YiIvPjwvc3ZnPg==',
            blockExplorer: 'https://btgexp.com/address/'
          };
          break;
        case 'LTC':
          currency = {
            coinsValue: coinsValue,
            rate: rate,
            title: 'Litecoin',
            code: 'LTC',
            confirmations: 2,
            icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTAwIiBoZWlnaHQ9IjI1MDAiIHZpZXdCb3g9IjAuODQ3IDAuODc2IDMyOS4yNTQgMzI5LjI1NiI+PHRpdGxlPkxpdGVjb2luPC90aXRsZT48cGF0aCBkPSJNMzMwLjEwMiAxNjUuNTAzYzAgOTAuOTIyLTczLjcwNSAxNjQuNjI5LTE2NC42MjYgMTY0LjYyOUM3NC41NTQgMzMwLjEzMi44NDggMjU2LjQyNS44NDggMTY1LjUwMy44NDggNzQuNTgyIDc0LjU1NC44NzYgMTY1LjQ3Ni44NzZjOTAuOTIgMCAxNjQuNjI2IDczLjcwNiAxNjQuNjI2IDE2NC42MjciIGZpbGw9IiNiZWJlYmUiLz48cGF0aCBkPSJNMjk1LjE1IDE2NS41MDVjMCA3MS42MTMtNTguMDU3IDEyOS42NzUtMTI5LjY3NCAxMjkuNjc1LTcxLjYxNiAwLTEyOS42NzctNTguMDYyLTEyOS42NzctMTI5LjY3NSAwLTcxLjYxOSA1OC4wNjEtMTI5LjY3NyAxMjkuNjc3LTEyOS42NzcgNzEuNjE4IDAgMTI5LjY3NCA1OC4wNTcgMTI5LjY3NCAxMjkuNjc3IiBmaWxsPSIjYmViZWJlIi8+PHBhdGggZD0iTTE1NS44NTQgMjA5LjQ4MmwxMC42OTMtNDAuMjY0IDI1LjMxNi05LjI0OSA2LjI5Ny0yMy42NjMtLjIxNS0uNTg3LTI0LjkyIDkuMTA0IDE3Ljk1NS02Ny42MDhoLTUwLjkyMWwtMjMuNDgxIDg4LjIzLTE5LjYwNSA3LjE2Mi02LjQ3OCAyNC4zOTUgMTkuNTktNy4xNTYtMTMuODM5IDUxLjk5OGgxMzUuNTIxbDguNjg4LTMyLjM2MmgtODQuNjAxIiBmaWxsPSIjZmZmIi8+PC9zdmc+',
            blockExplorer: 'https://live.blockcypher.com/ltc/address/'
          };
          break;
        case 'BCH':
          currency = {
            coinsValue: coinsValue,
            rate: rate,
            title: 'BCH',
            code: 'Bitcoin Cash',
            confirmations: 2,
            icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjM2IiB2aWV3Qm94PSIwIDAgMjggMzYiIHdpZHRoPSIyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjcuNDE0OTE2MyAyNC4xMDY4MTk4YzAtNS43MTUwMjYxLTMuOTkyNjg5NS02Ljg4OTM0NjYtMy45OTI2ODk1LTYuODg5MzQ2NnMyLjg5NjY1NzEtLjkzOTQ1NjMgMi44OTY2NTcxLTQuNTQwNzA1N2MwLTMuNjAxMjQ5MjgtMi44MTgzNjktNS40ODAxNjE5OC01LjQ4MDE2Mi01LjQ4MDE2MTk4LS4wNzgyODgxIDAtLjIzNDg2NDEgMC0uMzEzMTUyMSAwdi00LjY5NzI4MTczaC0zLjEzMTUyMTJ2NC42OTcyODE3M2MtMS4wMTc3NDQ0IDAtMi4wMzU0ODg3IDAtMy4xMzE1MjExIDB2LTQuNjk3MjgxNzNoLTMuMTMxNTIxMnY0LjY5NzI4MTczYy0uODYxMTY4MyAwLTcuMDQ1OTIyNiAwLTcuMDQ1OTIyNiAwdjMuOTE0NDAxNDhoMy4xMzE1MjExNXYxNi40NDA0ODZoLTMuMTMxNTIxMTV2My45MTQ0MDE1aDcuMDQ1OTIyNnY0LjY5NzI4MTdoMy4xMzE1MjEydi00LjY5NzI4MTdoMy4xMzE1MjExdjQuNjk3MjgxN2gzLjEzMTUyMTJ2LTQuNzc1NTY5OGMyLjI3MDM1MjgtLjA3ODI4OCA2Ljg4OTM0NjUtMS43MjIzMzY2IDYuODg5MzQ2NS03LjI4MDc4NjZ6bS0xNi4zNjIxOTgtMTIuOTk1ODEyOGg4LjIyMDI0M2MuNTQ4MDE2MiAwIDIuNTA1MjE2OS0uMjM0ODY0MSAyLjUwNTIxNjkgMi44OTY2NTcgMCAyLjg5NjY1NzEtMi41ODM1MDQ5IDIuNTgzNTA1LTIuNTgzNTA0OSAyLjU4MzUwNWgtOC4xNDE5NTV6bTguNjg5OTcxMiAxNS42NTc2MDU3aC04LjY4OTk3MTJ2LTUuNDgwMTYyaDguNjg5OTcxMmMuNjI2MzA0MiAwIDIuNjYxNzkzLS4zOTE0NDAxIDIuNjYxNzkzIDIuODk2NjU3MS4wNzgyODggMy4xMzE1MjExLTIuNjYxNzkzIDIuNTgzNTA0OS0yLjY2MTc5MyAyLjU4MzUwNDl6IiBmaWxsPSIjZGM5ODI5IiB0cmFuc2Zvcm09Im1hdHJpeCguOTcwMjk1NzMgLS4yNDE5MjE5IC4yNDE5MjE5IC45NzAyOTU3MyAtNC45NTg4MSAzLjM1MzI0MSkiLz48L3N2Zz4=',
            blockExplorer: 'https://bitcoincash.blockexplorer.com/address/'
          };
          break;
        // case 'XMR':
        //   callback({
        //     coinsValue: coinsValue,
        //     rate: data.rate,
        //     title: 'Monero',
        //     code: 'XMR',
        //     confirmations: 0,
        //     icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMzEuODc0OTg4MyAwYy0xNy42MDEyNDUxIDAtMzEuODc0OTg4MyAxNC4yNzM0OTQyLTMxLjg3NDk4ODMgMzEuODc1MjM3NCAwIDMuNTE4MDA3Ny41NzAyNzIzNyA2LjkwMjAzODkgMS42MjMxNTk1MyAxMC4wNjgxNzEyaDkuNTMzMjYwNjd2LTI2LjgxOTIzNzRsMjAuNzE5MDY2MiAyMC43MTkwNjYyIDIwLjcxODU2ODEtMjAuNzE5MDY2MnYyNi44MTg5ODgzaDkuNTMzMjYwN2MxLjA1MzYzNDItMy4xNjYxMzIzIDEuNjIzOTA2Ni02LjU1MDE2MzQgMS42MjM5MDY2LTEwLjA2ODE3MTItLjAwMDI0OS0xNy42MDIyNDEyLTE0LjI3NDI0MTMtMzEuODc0OTg4My0zMS44NzYyMzM1LTMxLjg3NDk4ODMiIGZpbGw9IiNmNjAiLz48cGF0aCBkPSJtMjcuMTEwODQ4MiA0MC42MDY4Nzk0LTkuMDQyMTc4OS05LjA0MjQyOHYxNi44NzUzMzA3aC0xMy40MzEwMzUwNmM1LjU5NTY0MjA2IDkuMTc5ODkxMSAxNS43MDE0MTYzNiAxNS4zMTAxOTQ2IDI3LjIzNjg1NjA2IDE1LjMxMDE5NDZzMjEuNjQyMjEwMS02LjEzMDMwMzUgMjcuMjM3MTA1LTE1LjMxMDE5NDZoLTEzLjQzMDc4NnYtMTYuODc1NTc5OGwtOS4wNDIxNzg5IDkuMDQyMTc5LTQuNzYzODkxMSA0Ljc2MzY0Mi00Ljc2MzM5My00Ljc2MzM5MjloLS4wMDA0OTgxeiIgZmlsbD0iIzRjNGM0YyIvPjwvZz48L3N2Zz4=',
        //     blockExplorer: 'https://moneroblocks.info/tx/' + address
        //   });
        //   break;
        // case 'WAVES':
        //   callback({
        //     coinsValue: coinsValue,
        //     rate: data.rate,
        //     title: 'Waves',
        //     code: 'WAVES',
        //     confirmations: 0,
        //     icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHdpZHRoPSI2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im01Mi44NDQ1MTcyIDE4LjAyNjg0MTItMTUuODU4NTkyNS0xNS44NjkwNjcwNmMtMi43NDQzNTM1LTIuNzQ0MzUzNTItNy4yMjc0OTU5LTIuNzQ0MzUzNTItOS45NjEzNzQ4IDBsLTE1Ljg0ODExNzggMTUuODM3NjQzMTZjLS45MTEyOTMuOTExMjkzLS45MTEyOTMgMi40MDkxNjU0IDAgMy4zMjA0NTgzbDQuODA3ODU2IDQuODA3ODU2IDMuMTk0NzYyNiAyLjk1Mzg0NjFjLjk1MzE5MTUuODc5ODY5MSAyLjM5ODY5MDcuODc5ODY5MSAzLjM1MTg4MjIgMGw2LjQtNS45MTgxNjY5YzEuNzU5NzM4MS0xLjYyMzU2NzkgNC40NjIxOTMxLTEuNjIzNTY3OSA2LjIxMTQ1NjYgMGw2LjQgNS45MTgxNjY5Yy45NDI3MTY5Ljg3OTg2OTEgMi4zOTg2OTA3Ljg3OTg2OTEgMy4zNDE0MDc2IDBsMy4xOTQ3NjI2LTIuOTUzODQ2MSA0Ljc2NTk1NzUtNC43NjU5NTc1Yy45MjE3Njc2LS45MjE3Njc2LjkyMTc2NzYtMi40MDkxNjUzIDAtMy4zMzA5MzI5IiBmaWxsPSIjM2RiNmQzIi8+PHBhdGggZD0ibTIuMTQ3Mjk5NTEgMzYuOTk2Mzk5MyAyNC44NjY3NzU3OSAyNC44NjY3NzU4YzIuNzQ0MzUzNSAyLjc0NDM1MzUgNy4yMjc0OTU5IDIuNzQ0MzUzNSA5Ljk2MTM3NDggMGwyNC44NjY3NzU4LTI0Ljg2Njc3NThjNC4zMTU1NDgyLTQuMzE1NTQ4MiAxLjI3NzkwNS01LjU4Mjk3ODctMS44ODU0MzM4LTguNTc4NzIzNGwtMy44OTY1NjMtMy42OTc1NDVjLS45NDI3MTY4LS44OTAzNDM3LTIuMzk4NjkwNi0uODc5ODY5LTMuMzUxODgyMSAwbC02LjQgNS45MTgxNjdjLTEuNzU5NzM4MiAxLjYyMzU2NzktNC40NjIxOTMyIDEuNjIzNTY3OS02LjIxMTQ1NjcgMGwtNi40LTUuOTE4MTY3Yy0uOTQyNzE2OC0uODc5ODY5LTIuMzk4NjkwNi0uODc5ODY5LTMuMzQxNDA3NSAwbC02LjQgNS45MTgxNjdjLTEuNzU5NzM4MSAxLjYyMzU2NzktNC40NjIxOTMxIDEuNjIzNTY3OS02LjIxMTQ1NjYgMGwtNi40LTUuOTE4MTY3Yy0uOTUzMTkxNS0uODc5ODY5LTIuMzk4NjkwNjgtLjg3OTg2OS0zLjM1MTg4MjE3IDBsLTMuNTgyMzI0MDYgMy4zMDk5ODM3Yy0zLjI4OTAzNDM3IDMuMDU4NTkyNC02Ljc2NjYxMjExIDQuNDYyMTkzMS0yLjI2MjUyMDQ2IDguOTY2Mjg0NyIgZmlsbD0iI2UyZTFlMSIvPjwvZz48L3N2Zz4=',
        //     blockExplorer: 'https://wavesexplorer.com/address/' + address
        //   });
        //   break;
        // case 'EOS':
        //   callback({
        //     coinsValue: coinsValue,
        //     rate: data.rate,
        //     title: 'Eos',
        //     code: 'EOS',
        //     confirmations: 0,
        //     icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAA9CAAAAADXfFsjAAAC0klEQVRIx9WXra70IBCGz42dq9lL6CXsNWBISEhIKjAoVFUdDlNTg8EgqhCIJuT9RH+3Z88p3aqvYtOS7sN0Zt6Z4Qt3r6/TN0y+SWi/1T2CJ4T0dwgj9TSQeIOgWpBs688JnUAmCdJ8SogkIpOERMKHBGGBTBLgaP6IYBRmAprmE0IgaSVk5q4TMnVYCTPuGmE2fCbAyqsEx/ILAbW9RlgDGB5uCe1wiaDmJMrM0HG67Xm+QLBii6hu53vdlBPiIqZEItLyMFJfTBBmUxawKsuRUkKumiWp8j6dukcqJAxk3pVPxSXMslDvis1bgm3EAABd/RKZkZmmkKBcYwCMawZMnu1lrMsImSdfvwrSKADagqciQhTINGEg405mHplGKFdE6DWgulchOIogAGOKCI0FOu35y6LsTAt4VUQQAUj0UBsjpQFIP7XxhpBYBvDkh2VdAUAdCghOAkiVPlbNxwCgMQWEtgWglTjYK7UE0KsCQu2BQLI4+iEzB0R2Thj5CIhuMmWX6RqeZkAMp4QggZ4D4RDNHlAW0P0pwbbI1AOZDi91cwQiSbDNKUH1MBJHt3dy7gChPiNkHuey5sVLSk6WDPkorh+EgaNp5zIdd5PI2nekOyFYHRdN6k1arl40Gkx7QtC9svvkPMAcD/KEUNs1iuPabfM2Skkrxj8JUez6/OQ+AJ5ufmIHcR0J/rkzchWB3gW2eXZ/EppH3M+Cs8Fsv1jVfxKePMXtYl2MMUZHdmtxKhS/EsiDCb5c4lkJzrmoqt0af1T5L8LY0J100uRBuvOdZzqdaZPLTVLcAxjIumlUP/r3u0prabv8xTTLz/RIyqo9kl6SIrIMiHlbz2UsnmE8V9PLPCBOnXvDFs5ys8FtC6sBwJI2X5wno2IeCAzCAUHI+MFc7ahOoJ4cQnxlts+GdIY1/W8fUHLGiYp8P+Vw66znSHf3vHn/xPo/EP4BiV3eIZgOCrEAAAAASUVORK5CYII=',
        //     blockExplorer: 'https://etherscan.io/token/EOS?a=' + address
        //   });
        //   break;
        // case 'ETC':
        //   callback({
        //     coinsValue: coinsValue,
        //     rate: data.rate,
        //     title: 'Eth. Classic',
        //     code: 'ETC',
        //     confirmations: 0,
        //     icon: 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMzkgNjQiIHdpZHRoPSIzOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTMuNjk2NTk4NiAyOC42NzY2NDQgMTguODY2MjEzMi03Ljk1MjgzNDUgMTguMjg1NzE0MyA4LjE1NjAwOTEtMTguMzE0NzM5My0yOC44Nzk4MTg2em0uMDU4MDQ5OSA4LjgyMzU4MjggMTguODM3MTg4MiAxMC45MTMzNzg2IDE5LjIxNDUxMjUtMTAuOTEzMzc4Ni0xOS4wNDAzNjI4IDI2LjQ5OTc3MzJ6bTE4Ljg5NTIzODEtMTIuODg3MDc0OSAxOS4wOTg0MTI3IDguNTA0MzA4NC0xOS4wOTg0MTI3IDEwLjY4MTE3OTItMTkuNjQ5ODg2Ni0xMC45MTMzNzg3eiIgZmlsbD0iIzY2OTA3MyIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTMpIi8+PC9zdmc+',
        //     blockExplorer: 'https://etcchain.com/addr/' + address
        //   });
        //   break;
        default:
          console.log('currency ' + code + ' not found');
          currency = null;
      }
      if (getAddr) {
        getAddress(orderId, token, function(address) {
          currency['address'] = address;
          currency['blockExplorer'] = currency['blockExplorer'] + address;
          callback(currency);
        });
      } else {
        //$currency->currencyUrl = sprintf('currencies.php?order=%s&token=%s', $orderId, $token); TODO
        callback(currency);
      }
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
  var url = 'https://api.paybear.io/v1/exchange/usd/rate';

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
  getPayout: getPayout,
  getCurrency: getCurrency,
  getRate: getRate,
  getRates: getRates
};
