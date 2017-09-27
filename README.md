<h3>Create payment request</h3>
<h4>Use GET query to create payment request:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td>https://api.paybear.io/v1/eth/payment/{payout_address}/{callback_url}</td>
        </tr>
    </tbody>
</table>
<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
    <td>payout_address</td>
    <td>Your address for payment</td>
  </tr>
  <tr>
      <td>callback_url</td>
      <td>Your server callback url for process payment status</td>
  </tr>
  <tr>
    <td>fee_level</td>
    <td>Fee level, optional, default "normal"</td>
  </tr>
</tbody></table>
<h4>Fee levels for Ethereum:</h4>
<table>
    <tr><td>Parameter</td><td><a href="http://ethgasstation.info/FAQpage.php">Gas price</a></td><td>Time</td></tr>
    <tr><td>Slow</td><td>1 GWei</td><td>~10 min</td></tr>
    <tr><td>Normal (default)</td><td>4 GWei</td><td>~3 min</td></tr>
    <tr><td>Fast</td><td>20 GWei</td><td>~2 min</td></tr>
    <tr><td>Flash</td><td>40 GWei</td><td>~1 min</td></tr>
</table>
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

<p>
    <span style="color:red;">
        Store all two values and keep "invoice" in safe place ! Because it's an important code to control your money.
    </span>
</p>

<h4>Curl example:</h4>

```curl
rawurlencode() {
local string="${1}"
local strlen=${#string}
local encoded=""
local pos c o
for (( pos=0 ; pos<strlen ; pos++ )); do
  c=${string:$pos:1}
  case "$c" in
    [-_.~a-zA-Z0-9] ) o="${c}" ;;
    * ) printf -v o '%%%02x' "'$c"
  esac
  encoded+="${o}"
done
REPLY="${encoded}"
}

rawurlencode "http://www.change.me/callback.php"
curl "https://api.paybear.io/v1/eth/payment/0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7/${REPLY}?fee_level=fast"
```
<h4>Other examples</h4>
<a href="php">PHP</a><br>
<a href="nodejs">NodeJS</a><br>
<a href="rails">Ruby on Rails</a><br>

<h3>Callback</h3>
A callback is sent every time a new block is mined. To stop further callbacks, reply with the invoice ID. See example below.
<h4>Callback example:</h4>

```json
{
    "invoice": "7e691214bebe31eaa4b813c59825391b",
    "confirmations": 4,
    "block": {
        "number": 4316966,
        "hash": "0xf80718e3021cc6c226a01ea69b98131cd9b03fa5a0cac1f2469cc32d0f09e110"
    },
    "inTransaction": {
        "hash": "0x7e29e165d15ec1c6fc0b71eed944471308c10d0450fe7e768843241f944bdfde",
        "amount": 21000000000000
    }
}
```
<h4>PHP example:</h4>

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

