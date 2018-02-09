
## API v1 is Deprecated!
We would like to thank you for using the first version of our API. PayBear is moving forward and created a new version of the API, allowing for easier access to your settings and faster integration compared to our previous version. Version 1 of the API will be functional until **March, 1st 2018**. We encourage to upgrade to Version 2 as soon as possible, the process is described below.

### Integrations
If you are using one of our integrations (such as WooCommerce plugin), the process is simple:

 1. Sign up for a free PayBear account: https://www.paybear.io/
 2. Set up currencies in Member Dashboard
 3. Get your API keys
 4. Download the newest version of the integrations from [PayBear Integrations](https://www.paybear.io/integrations)
 5. Install the integration and enter your API Key in Settings
 6. Make a test payment

### Custom Code

If you are using custom code, please check the new API docs to update to APIv2:
https://github.com/Paybear/paybear-samples
Step-by-step instructions are below:

 1. Sign up for a free PayBear account: https://www.paybear.io/
 2. Set up currencies in Member Dashboard
 3. Get your API keys
 4. Change `/v1/` in API URLs to `/v2/`
 5. Use `/v2/currencies?token={token}` to get currency list. If you had the list hardcoded in your code, you can remove it now. Make sure you save or cache this list for at least 5-10 minutes, otherwise you may hit the Rate Limit for your API key.
 6. Change the call generating wallets to the new format: `/v2/{crpyto}/payment/{callback_url}?token={token}`
 7. Make a test payment

### Need help?
We are glad to help. Email us at contact@paybear.io