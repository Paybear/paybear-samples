# How to Integrate a Crypto Payment Form?

1. First include CSS and JS files. Insert the following code before `</head>` or immediately after `<body>`.

```
<script src="paybear.js"></script>
<link rel="stylesheet" href="paybear.css" />
```

2. There are two ways to place a form within a page: inline form and modal window. Depending on what you choose paste the contents of inline.html or modal.html to the place where your form should appear.
If you need to translate the form to a different language or change some text, you can manipulate the HTML code directly.

3. Immediately after that insert a button to invoke the form:
```
<button id="paybear-bitcoin">Pay With Bitcoin</button>
```
You can style the button to match your website. If you need to support several currencies, you can add multiple buttons:
```
<button id="paybear-ethereum">Pay with Ethereum</button>
```
Alternatively you can create a single button for all crypto currencies and enable currency selection screen in the form itself (see instructions below):
```
<button id="paybear-all">Pay with Crypto</button>
```
4. Add a piece of code binding your button to the form. If using a modal:
```
<script>
    (function () {
        var button = document.querySelector('#paybear-bitcoin');
        var modal = document.querySelector('#paybear-modal');
        var url = 'https://YOURDOMAIN.com/payment/new/10';

        paybearForm(button, url, modal);
    })();
</script>
```
If using inline form:
```
<script>
    (function () {
        var button = document.querySelector('#paybear-bitcoin');
        var url = 'https://YOURDOMAIN.com/payment/new/10';

        paybearForm(button, url);
    })();
</script>
```
5. Set up your backend as described in [one of the examples](https://github.com/Paybear/paybear-samples)

The form accepts the following settings (in JSON format):
```
{  
   "currencies":[  
      {  
         "coinsValue":0.9143,
         "rate":364.18,
         "title":"Ethereum",
         "code":"ETH",
         "metamask":true,
         "icon":"data:image\/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjQxNyIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIHZpZXdCb3g9IjAgMCAyNTYgNDE3IiB3aWR0aD0iMjU2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xMjcuOTYxMSAwLTIuNzk1IDkuNXYyNzUuNjY4bDIuNzk1IDIuNzkgMTI3Ljk2Mi03NS42Mzh6IiBmaWxsPSIjMzQzNDM0Ii8+PHBhdGggZD0ibTEyNy45NjIgMC0xMjcuOTYyIDIxMi4zMiAxMjcuOTYyIDc1LjYzOXYtMTMzLjgwMXoiIGZpbGw9IiM4YzhjOGMiLz48cGF0aCBkPSJtMTI3Ljk2MTEgMzEyLjE4NjYtMS41NzUgMS45MnY5OC4xOTlsMS41NzUgNC42MDEgMTI4LjAzOC0xODAuMzJ6IiBmaWxsPSIjM2MzYzNiIi8+PHBhdGggZD0ibTEyNy45NjIgNDE2LjkwNTJ2LTEwNC43MmwtMTI3Ljk2Mi03NS42eiIgZmlsbD0iIzhjOGM4YyIvPjxwYXRoIGQ9Im0xMjcuOTYxMSAyODcuOTU3NyAxMjcuOTYtNzUuNjM3LTEyNy45Ni01OC4xNjJ6IiBmaWxsPSIjMTQxNDE0Ii8+PHBhdGggZD0ibSAuMDAwOSAyMTIuMzIwOCAxMjcuOTYgNzUuNjM3di0xMzMuNzk5eiIgZmlsbD0iIzM5MzkzOSIvPjwvc3ZnPg==",
         "blockExplorer":"https:\/\/etherscan.io\/address\/0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7",
         "walletLink":"ethereum:0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7?amount=0.9143",
         "address":"0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7"
      }
   ],
   "invoice":1111,
   "fiatValue":333,
   "statusUrl":"http:\/\/yourdomain.com\/status.php?order=1111"
}
```
Add more elements to `currencies` array to support multiple currencies in the same form.


# Advanced usage
You can create the form instance yourself (without using a button) by passing the array of settings to the constructor directly:

```
<script>
    (function () {
        var settings = {....};
	window.paybear = new Paybear(settings);
    })();
</script>
```

# Code contributions
- Have a suggestion or found a bug? Please [email us](mailto:contact@paybear.io) or [ping our Telegram](https://t.me/paybear)
- We offer bounties for developers, which means if you are capable of writing a shopping cart plugin or any other integration, please [email us](mailto:contact@paybear.io).
- Check our website for more information: https://www.paybear.io/
