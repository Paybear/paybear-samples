# How to Integrate a Crypto Payment Form?

1. Include CSS and JS files. Insert the following code before `</head>` or immediately after `<body>`.

```
<script src="paybear.js"></script>
<link rel="stylesheet" href="paybear.css" />
```

2. Paste the contents of `paybear.html` to the place where your form should appear.
If you need to translate the form to a different language or change some text, you can manipulate the HTML code directly.

3. Immediately after that insert a button to invoke the form:
```
<button id="paybear-bitcoin">Pay With Bitcoin</button>
```
You can style the button to match your design. If you need to support several currencies, you can add multiple buttons:
```
<button id="paybear-ethereum">Pay with Ethereum</button>
```
Alternatively you can create a single button for all crypto currencies and enable currency selection screen in the form itself (see instructions below):
```
<button id="paybear-all">Pay with Crypto</button>
```
4. Add a piece of code binding your button(s) to the form.

Single currency example:

```
<script>
    (function () {
        window.paybear = new Paybear({
            button: '#paybear-ethereum',
            fiatValue: 19.95,
            statusUrl: "status.php?order=123",
            redirectTo: "success.php?order=123",
            currencies: "currencies.php?order=123&token=eth",
        });
    })();
</script>
```

Multiple currencies example:
```
<script>
    (function () {
        window.paybear = new Paybear({
            button: '#paybear-all',
            fiatValue: 19.95,
            currencies: "currencies.php?order=123",
            statusUrl: "status.php?order=123",
            redirectTo: "success.php?order=123",
            modal: true
        });
    })();
</script>
```

If you don't want a modal window, you can change the `modal` parameter to false.

If you want the form to appear immediately, without any buttons, the `button` parameter can be removed.

5. Set up your backend as described in [one of the examples](https://github.com/Paybear/paybear-samples)


# Advanced usage

You can make the form download the settings via AJAX by passing the link to `settingsUrl` parameter.

```
<script>
    (function () {
		window.paybear = new Paybear({settingsUrl: "settings.php?order=123"});
    })();
</script>
```

Similarly, `currencies` can be either the URL or the array of currencies.


You can find the complete list of settings below:

<table>
	<tr><th>Key</th><th>Description</th><th>Example</th></tr>
	<tr><td>currencies</td><td>array of currencies to use or URL of the page to download it from. Detailed description below</td><td>[{`see structure below`}]</td></tr>
	<tr><td>button</td><td>DOM selector of the button to use as a form trigger. If set to null, the form is shown immediately on page load</td><td>null </td></tr>
	<tr><td>fiatValue</td><td>your order total</td><td>"19.99"</td></tr>
	<tr><td>enableFiatTotal</td><td>show fiat (USD) total at the top of the form</td><td>true</td></tr>
	<tr><td>fiatCurrency</td><td>currency code you use (default=USD)</td><td>"USD"</td></tr>
	<tr><td>fiatSign</td><td>short abbreviation/sign of your currency (default=$)</td><td>"\$"</td></tr>
	<tr><td>modal</td><td>set to true to display in a modal window, false to display inline (default=true)</td><td>true</td></tr>
	<tr><td>enableBack</td><td>Enable back button (always true in `modal` mode)</td><td>false</td></tr>
	<tr><td>onBackClick</td><td>Back button URL (or callback function)</td><td>"payment_failed.php?order=123"</td></tr>
	<tr><td>statusUrl</td><td>the status of the payment will be checked every several seconds by downloading this URL. The reply format is described below</td><td>/status.php?order=123</td></tr>
	<tr><td>settingsUrl</td><td>URL to get form settings from</td><td>/settings.php?order=123</td></tr>
	<tr><td>redirectTo</td><td>after the payment is complete, the customer will be redirected to this URL</td><td>/success.php?order=123</td></tr>
	<tr><td>redirectTimeout</td><td>number of seconds before redirecting the customer automatically. 0 disables the redirect. Default is 5</td><td>5</td></tr>
	<tr><td>timer</td><td>time (in seconds) for the payment window. 0 disables the timer. Default value is 15 minutes</td><td>15*60</td></tr>
</table>


Structure of `currencies` array

<table>
	<tr><th>Key</th><th>Description</th><th>Example</th></tr>
	<tr><td>title</td><td>Currency name</td><td>Ethereum</td></tr>
	<tr><td>code</td><td>Short name / code</td><td>ETH</td></tr>
	<tr><td>icon</td><td>Logo (link or data:image)</td><td>images/eth.png</td></tr>
	<tr><td>metamask</td><td>Set to true to allow Metamask payments (only for ETH)</td><td>false</td></tr>
	<tr><td>metamaskAuto</td><td>Show Metamask payment automatically (only if metamask is enabled)</td><td>true</td></tr>
	<tr><td>blockExplorer</td><td>`format`-compatible string to generate the link to block explorer. Parameter used: wallet address</td><td>"https://etherscan.io/address/%s"</td></tr>
	<tr><td>walletLink</td><td>Link to wallet/APP. Set to `null` to disable wallet links. Parameters used: wallet address and amount to send</td><td>"ethereum:%s?amount=%s"</td></tr>
	<tr><td>currencyUrl</td><td>For multi-currency forms allows to get address by making an AJAX call to this URL when the currency is selected</td><td>"currency.php?order=123&token=ETH</td></tr>
	<tr><td>coinsValue</td><td>Amount to charge (in crypto)</td><td>0.001</td></tr>
	<tr><td>rate</td><td>Conversion rate (USD/Crypto)</td><td>739.35</td></tr>
	<tr><td>maxConfirmations</td><td>Wait for this number of confirmations from the blockchain before showing 'success' message</td><td>1</td></tr>
	<tr><td>address</td><td>Wallet address to show to the client (generated by PayBear API call). For multi currency forms use `currencyUrl` parameter instead</td><td>"0x39ee76948d238fad2b750998f8a38d80c73c7cd7"</td></tr>
</table>


Example (single currency form):

```
<script>
    (function () {
        window.paybear = new Paybear({
            button: '#paybear-ltc',
            fiatValue: 19.95,
            statusUrl: "status.php?order=123",
            redirectTo: "success.php?order=123",
            currencies: [
                    {
                    "title":"Litecoin",
                    "code":"LTC",
                    "icon":"images/ltc.svg",
                    "blockExplorer":"https://live.blockcypher.com/ltc/address/%s/",
                    "walletLink":"litecoin:%s?amount=%s",
                    "maxConfirmations":3,
                    "address":"LWUx4FKFXmw1K12GRyZj9RavdBz6jNQNqX",
                    "coinsValue":0.058516,
                    "rate":341.6141
                    }
                ]
        });
    })();
</script>
```

Example (multi currency form):

```
<script>
    (function () {
        window.paybear = new Paybear({
            button: '#paybear-all',
            fiatValue: 19.95,
            statusUrl: "status.php?order=123",
            redirectTo: "success.php?order=123",
            currencies: [
                    {
                    "title":"Bitcoin Cash",
                    "code":"BCH",
                    "icon":"images/bch.svg",
                    "blockExplorer":"https://blockdozer.com/insight/address/%s",
                    "maxConfirmations":1,
                    "currencyUrl":"currency.php?order=123&token=BCH",
                    "coinsValue":0.008797,
                    "rate":2272.2751
                    },
                    {
                    "title":"Bitcoin Gold",
                    "code":"BTG",
                    "icon":"images/btg.svg",
                    "blockExplorer":"https://btgexp.com/address/%s",
                    "maxConfirmations":3,
                    "currencyUrl":"currency.php?order=123&token=BTG",
                    "coinsValue":0.066913,
                    "rate":298.745
                    }
                ]
        });
    })();
</script>
```



# Code contributions
- Have a suggestion or found a bug? Please [email us](mailto:contact@paybear.io) or [ping our Telegram](https://t.me/paybear)
- We offer bounties for developers, which means if you are capable of writing a shopping cart plugin or any other integration, please [email us](mailto:contact@paybear.io).
- Check our website for more information: https://www.paybear.io/
