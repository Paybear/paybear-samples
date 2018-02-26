<h3>PayBear.io API</h3>
This API allows to accept <b>Ethereum</b>, <b>Bitcoin</b>, <b>Bitcoin Cash</b>, <b>Bitcoin Gold</b>, <b>Litecoin</b>, <b>Dash</b> and <b>Ethereum Classic</b> payments. More details can be found on our website: https://www.paybear.io

[**Important note for APIv1 users**](UPGRADE.md)

<h3>API Keys</h3>
In order to use the system you need an API key. Getting a key is free and easy, sign up here:
https://www.paybear.io

<h3>Multiple Currencies</h3>
Once registered, you can manage the currencies you want to integrate in the Membership area / Currencies. Please enable the currencies there before using this API.

<h3>Get Currencies</h3>
<h4>Get a list of enabled currencies with this GET request:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td>https://api.paybear.io/v2/currencies?token={token}</td>
        </tr>
    </tbody>
</table>
<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
      <td>token</td>
      <td>API Secret Key</td>
    </tr>
</tbody></table>

<h3>Create payment request</h3>
<h4>Use GET query to create payment request:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td>https://api.paybear.io/v2/{crypto}/payment/{callback_url}?token={token}</td>
        </tr>
    </tbody>
</table>
<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
      <td>crypto</td>
      <td>Crypto currency to accept (eth, btc, bch, ltc, dash, btg, etc)</td>
    </tr>
  <tr>
    <td>token</td>
    <td>API Secret Key</td>
  </tr>
</tbody></table>
<h4>Optional parameters:</h4>
<table>
  <tr>
        <td>callback_url</td>
        <td>Your server callback url (urlencoded)</td>
    </tr>
</table>


<h4>Example request URL:</h4>
<a href="https://api.paybear.io/v2/eth/payment/http%3A%2F%2Fputsreq.com%2FUv8u7ofxXDWVoaVawDWd/?token=YOURSECRET">
https://api.paybear.io/v2/eth/payment/http%3A%2F%2Fputsreq.com%2FUv8u7ofxXDWVoaVawDWd/?token=YOURSECRET</a>
<h4>Response:</h4>
<p>The API always responds with a JSON string. [data] collection contains the important values:
[address] is the payment address to show to the customer
[invoice] is our inner payment identifier, keep it in a safe place and never disclose to your clients.</p>

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
$apiSecret = 'YOURSECRET'; //your api key
$callbackUrl = 'http://CHANGEME.com/callback.php?id='.$orderId;

$url = sprintf('https://api.paybear.io/v2/eth/payment/%s?token=%s', urlencode($callbackUrl), $apiSecret);
if ($response = file_get_contents($url)) {
    $response = json_decode($response);
    if (isset($response->data->address)) {
        echo $response->data->address;
        //save $response->data->invoice and keep it secret
    }
}
```

<h3>Callback</h3>
A callback is sent every time a new block is mined. To stop further callbacks, reply with the invoice ID. See code sample below.
<h4>Callback example:</h4>

```json
{
    "invoice": "7e691214bebe31eaa4b813c59825391b",
    "confirmations": 2,
    "maxConfirmations": 4,
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
    if ($params->confirmations>=$params->maxConfirmations) {
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

<h4>Use GET query to obtain the current average market rates:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td><a href="https://api.paybear.io/v2/exchange/usd/rate">https://api.paybear.io/v2/exchange/{fiat}/rate</a></td>
        </tr>
    </tbody>
</table>

<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
      <td>fiat</td>
      <td>Fiat currency (usd, eur, cad, rub etc)</td>
  </tr>
</tbody></table>

<h4>Response:</h4>
The API returns a JSON string containing the rates from several online exchanges, as well as the average rate. It is recommended to cache the rates for 10-15 minutes.

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

<h4>Exchange rates for one currency*:</h4>
*If you are using more than one currency, we recommend usng the call above to get all rates with one request.
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td><a href="https://api.paybear.io/v2/eth/exchange/usd/rate">https://api.paybear.io/v2/{crypto}/exchange/{fiat}/rate</a></td>
        </tr>
    </tbody>
</table>

<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
    <td>crypto</td>
    <td>Crypto currency (eth, btc, bch, ltc, dash, btg)</a></td>
  </tr>
  <tr>
      <td>fiat</td>
      <td>Fiat currency (usd, eur, cad, rub etc)</td>
  </tr>
</tbody></table>

<h4>Response:</h4>
The API returns a JSON string containing the rates from several online exchanges, as well as the average rate. It is recommended to cache the rates for 10-15 minutes.

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
$url = "https://api.paybear.io/v2/eth/exchange/usd/rate";

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

### What to use as a payout address?
You will need payout addresses for all crypto currencies you want to accept. Only you will have access to your payout wallets.
You can use any online wallet, service or exchange of your choice.
If you don't have one, consider reading our [Wallet Guide](https://www.paybear.io/wallets)
