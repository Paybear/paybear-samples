<h3>PayBear.io API</h3>
This API allows to accept Ethereum, Bitcoin, Bitcoin Cash, Bitcoin Gold, Litecoin and Dash payments. No signup required, authorization is not required. More details and pricing can be found on our website: https://www.paybear.io
<h3>Create payment request</h3>
<h4>Use GET query to create payment request:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td>https://api.paybear.io/v1/{crpyto}/payment/{payout_address}/{callback_url}</td>
        </tr>
    </tbody>
</table>
<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
      <td>crypto</td>
      <td>Crpyto currency for exchange (eth, btc, bch, ltc, dash, btg)</a></td>
    </tr>
  <tr>
    <td>payout_address</td>
    <td>Your address for payment <a href="#where-can-i-get-my-payout-address">(?)</a></td>
  </tr>
  <tr>
      <td>callback_url</td>
      <td>Your server callback url (urlencoded)</td>
  </tr>
</tbody></table>
<h4>Optional GET parameters:</h4>
<table>
  <tr>
    <td>fee_level</td>
    <td>Fee level, optional, default "Normal"</td>
  </tr>
</table>
<h4>Fee levels:</h4>
<table>
    <tr><td>Blockchain</td><td>Slow</td><td>Normal (default)</td><td>Fast</td><td>Flash</td></tr>
    <tr><td>Ethereum <a href="http://ethgasstation.info/FAQpage.php">Gas price</a></td><td>1 GWei (~10 min)</td><td>4 GWei (~3 min)</td><td>20 GWei (~2 min)</td><td>40 GWei (~1 min)</td></tr>
    <tr><td>Bitcoin</td><td>0.0000226 (~? min)</td><td>0.000113 (~? min)</td><td>0.0002938 (~? min)</td><td>0.0004746 (~? min)</td></tr>
    <tr><td>Bitcoin Cash</td><td>0.0000226 (~? min)</td><td>0.000113 (~? min)</td><td>0.0002938 (~? min)</td><td>0.0004746 (~? min)</td></tr>
    <tr><td>Litecoin</td><td>0.0000226 (~? min)</td><td>0.000113 (~? min)</td><td>0.0002938 (~? min)</td><td>0.0004746 (~? min)</td></tr>
    <tr><td>Dash</td><td>0.0000226 (~? min)</td><td>0.000113 (~? min)</td><td>0.0002938 (~? min)</td><td>0.0004746 (~? min)</td></tr>
    <tr><td>Bicoin Gold</td><td>0.0000226 (~? min)</td><td>0.000113 (~? min)</td><td>0.0002938 (~? min)</td><td>0.0004746 (~? min)</td></tr>
</table>
<h4>Example request URL:</h4>
<a href="https://api.paybear.io/v1/eth/payment/0x39ee76948d238fad2b750998f8a38d80c73c7cd7/http%3A%2F%2Fputsreq.com%2FUv8u7ofxXDWVoaVawDWd/?fee_level=normal">
https://api.paybear.io/v1/eth/payment/0x39ee76948d238fad2b750998f8a38d80c73c7cd7/http%3A%2F%2Fputsreq.com%2FUv8u7ofxXDWVoaVawDWd/?fee_level=normal</a>
<h4>Response:</h4>
<p>The API always responds with a JSON string. [data] collection contains the important values: [address] is the payment address to show to the customer, [invoice] is our inner payment identifier, keep it in a safe place and never disclose to your clients.</p>
<h4>Response example:</h4>
<p>

```json
{
    "success": true,
    "data": {
        "invoice": "d1ddf6e3767030b08032cf2eae403600",
        "address": "0x2073eb3be1a41908e0353427da7f16412a01ae71"
    }
}
```

<h4>PHP example:</h4> More examples: <a href="nodejs">Node.js</a>, <a href="rails">Ruby on Rails</a>

```php
$orderId = 12345;
$payoutAddress = '0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7'; //your address
$callbackUrl = 'http://CHANGEME.com/callback.php?id='.$orderId;

$url = sprintf('https://api.paybear.io/v1/eth/payment/%s/%s', $payoutAddress, urlencode($callbackUrl));
if ($response = file_get_contents($url)) {
    $response = json_decode($response);
    if (isset($response->data->address)) {
        echo $response->data->address;
        //save $response->data->invoice and keep it secret
    }
}
```

<h3>Callback</h3>
A callback is sent every time a new block is mined. To stop further callbacks, reply with the invoice ID. See example below.
<h4>Callback example:</h4>

```json
{
    "invoice": "7e691214bebe31eaa4b813c59825391b",
    "confirmations": 4,
    "blockchain": "eth",
    "block": {
        "number": 4316966,  
        "hash": "0xf80718e3021cc6c226a01ea69b98131cd9b03fa5a0cac1f2469cc32d0f09e110"
    },
    "inTransaction": {
        "hash": "0x7e29e165d15ec1c6fc0b71eed944471308c10d0450fe7e768843241f944bdfde",
        "exp": 18,
        "amount": 21000000000000
    }
}
```
<h4>PHP example:</h4> More examples: <a href="nodejs">Node.js</a>, <a href="rails">Ruby on Rails</a>

```php
const CONFIRMATIONS = 3;

$orderId = $_GET['id'];
$data = file_get_contents('php://input');
if ($data) {
    $params = json_decode($data);
    $invoice = $params->invoice;
    $amount = $params->inTransaction->amount
    if ($params->confirmations>=CONFIRMATIONS) {
        //compare $amount with order total
        //compare $invoice with one saved in the database to ensure callback is legitimate
        //mark the order as paid
        echo $invoice; //stop further callbacks
    } else {
        die("waiting for confirmations");
    }
}
```

<h3>Get Market Rate</h3>

<h4>Use GET query to obtain all the current average market rates:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td><a href="https://api.paybear.io/v1/exchange/usd/rate">https://api.paybear.io/v1/exchange/{fiat}/rate</a></td>
        </tr>
    </tbody>
</table>

<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
      <td>fiat</td>
      <td>Fiat currency for exchange</td>
  </tr>
</tbody></table>

<h4>Response:</h4>
The API always with a JSON string containing the rates from several online exchanges, as well as the average rate. It is recommended to cache the rates for 10-15 minutes.

<h4>Response example:</h4>

```json
{
    "success": true,
    "data": {
        "ltc": {
            "poloniex": 340.986909455,
            "hitbtc": 340.568,
            "bittrex": 340.25,
            "bitfinex": 341.295,
            "mid": 340.77497736375
        },
        "eth": {
            "poloniex": 804.580989955,
            "hitbtc": 805.88,
            "bittrex": 803.47641155,
            "bitfinex": 805.125,
            "mid": 804.76560037625
        },
        "dash": {
            "poloniex": 1129.8512215,
            "hitbtc": 1130.145,
            "bittrex": 1134.1035001,
            "mid": 1131.3665738666666
        },
        "btg": {
            "hitbtc": 320.485,
            "bittrex": 317.90500002,
            "bitfinex": 320.46500003,
            "mid": 319.61833334
        },
        "btc": {
            "poloniex": 17348.94643245,
            "hitbtc": 17322.91,
            "bittrex": 17347.05,
            "bitfinex": 17355.5,
            "mid": 17343.6016081125
        },
        "bch": {
            "poloniex": 2595.49999996,
            "hitbtc": 2600.6334100004,
            "bitfinex": 2591.55,
            "mid": 2595.8944699866665
        }
    }
}
```

<h4>Use GET query to obtain the current average market rate:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td><a href="https://api.paybear.io/v1/eth/exchange/usd/rate">https://api.paybear.io/v1/{crypto}/exchange/{fiat}/rate</a></td>
        </tr>
    </tbody>
</table>

<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
    <td>crypto</td>
    <td>Crpyto currency for exchange (eth, btc, bch, ltc, dash, btg)</a></td>
  </tr>
  <tr>
      <td>fiat</td>
      <td>Fiat currency for exchange (usd, eur, cad and other)</td>
  </tr>
</tbody></table>

<h4>Response:</h4>
The API always with a JSON string containing the rates from several online exchanges, as well as the average rate. It is recommended to cache the rates for 10-15 minutes.

<h4>Response example:</h4>

```json
{
    "success": true,
    "data": {
        "poloniex": 301.71905,
        "bittrex": 302.05,
        "bitfinex": 301.53499,
        "mid": 301.76807
    }
}
```

<h4>PHP example:</h4> More examples: <a href="nodejs">Node.js</a>, <a href="rails">Ruby on Rails</a>

```php
$url = "https://api.paybear.io/v1/eth/exchange/usd/rate";

if ($response = file_get_contents($url)) {
    $response = json_decode($response);
    if ($response->success) {
        echo $response->data->mid;
    }
}
```

<h3>Request Limit</h3>
The system is designed to process thousands of transactions per second, so we do not limit the number of payments you can process.
However, for DDoS protection reasons, the API calls are limited to 1000 per minute from one IP.

### Where can I get my payout address?
You will need payout addresses for all crypto currencies to get your payout money. Only you will have access to your payout wallets.
You can use any online wallet you like or use a paper wallet https://en.bitcoin.it/wiki/Paper_wallet.
If you don't know how to create one, we suggest using MyEtherWallet https://www.myetherwallet.com/ for Ethereum and BitAddress https://www.bitaddress.org/ for Bitcoin.
There are many more available options and you can use any wallet of your choice.