<h3>Create payment request</h3>
<h4>Use Get query to create payment request:</h4>
<table border="0" cellspacing="0" cellpadding="10" >
        <tbody><tr>
            <td>GET</td>
            <td>https://api.paybear.io/v1/eth/payment/{payout_address=""}/{callback_url=urlencode("")}?fee_level= {slow | normal | fast | flash}</td>
        </tr>
    </tbody>
</table>
<h4>Parameters:</h4>
<table>
  <tbody>
  <tr>
    <td>{payout_address}</td>
    <td>Your address for payment</td>
  </tr>
  <tr>
      <td>{callback_url}</td>
      <td>Your server callback url for process payment status</td>
  </tr>
  <tr>
    <td>{fee_level}</td>
    <td>Fee level, optional, default "normal"</td>
  </tr>
</tbody></table>
<h4>Fee levels cost:</h4>
<table>
    <tr><td>Slow</td><td>1 GWei</td></tr>
    <tr><td>Normal</td><td>4 GWei</td></tr>
    <tr><td>Fast</td><td>20 GWei</td></tr>
    <tr><td>Flash</td><td>40 GWei</td></tr>
</table>
<h4>Response:</h4>
<p>As a response generated 2 values: address for receive payment, and invoice.</p>
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
curl "https://api.paybear.io/v1/eth/payment/0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7/${REPLY}?fee_level=slow"
```

<h3>Call back</h3>
<h4>Input:</h4>
<table>
  <tbody>
  <tr>
    <td>'GET' {id}</td>
    <td>Order id</td>
  </tr>
  <tr>
      <td>'POST' {confirmations}</td>
      <td>Count confirmations</td>
  </tr>
  <tr>
      <td>'POST' {inTransaction->amount}</td>
      <td>Amount of coins</td>
    </tr>
  <tr>
      <td>'POST' {invoice}</td>
      <td>Invoice id</td>
  </tr>
</tbody></table>
<h4>Input example:</h4>

```json
{
    "invoice": "052387b66bb93515a36ca4c099e44ebb"
    "confirmations": 4,
    "block": {
        "number": 2134623434,
        "hash": "0x1023401243..."
    },
    "inTransaction": {
        "hash": "0x1023401243...",
        "amount": 21000000000000
    }
}
```

<h4>Output:</h4>
1 - If you want to stop callback calls - answer the number of the invoice id<br>
2 - If you want to continue calling a callback, answer something other than the invoice id

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

