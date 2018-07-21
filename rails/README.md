### Rails 5

The guide assumes your app has:
 1. `Order` model which belongs to `User` model and includes `amount:float` column
 2. `current_user` helper which returns an instance of `User` model
 3. `RAILS_DOMAIN` environment variable, e.g. `https://g.co`
 4. `PAYBEAR_SECRET` environment variable

#### Generate Model and Controller
```bash
$ bin/rails g model Payment order:belongs_to currencies:string invoice:string confirmations:integer max_confirmations:integer invoice:string success:boolean coin:string coins_received:float
$ bin/rails g controller Payment create status callback
$ bin/rails db:migrate
```

#### Define Model
```ruby
# app/models/payment.rb

require 'open-uri'

class Payment < ApplicationRecord
  belongs_to   :order

  after_create :set_currencies
  after_update :update_success

  def get_address(coin)
    callback_url = CGI.escape("#{ENV.fetch('RAILS_DOMAIN')}/payment/#{id}/callback")
    api_resp     = api_call("https://api.paybear.io/v2/#{coin.downcase}/payment/#{callback_url}?token=#{ENV.fetch('PAYBEAR_SECRET')}")

    update(coin: coin)
    update(invoice: api_resp["data"]["invoice"])
    {error: nil, address: api_resp["data"]["address"]}
  end

  private
  
  def api_call(url)
    resp = ActiveSupport::JSON.decode(open(url).read)
    raise unless resp["success"]
    
    resp
  end

  def set_currencies
    api_resp  = api_call("https://api.paybear.io/v2/currencies?token=#{ENV.fetch('PAYBEAR_SECRET')}")
    rates     = get_rates
    responses = api_resp["data"].map do |coin, response|
      response["coinsValue"]  = (order.amount / rates[coin]["mid"]).round(8)
      response["currencyUrl"] = "/payment/#{id}/address/#{coin}"
      response
    end

    update(currencies: responses.to_json)
  end

  def get_rates
    api_resp = api_call(open("https://api.paybear.io/v2/exchange/usd/rate")

    rates = api_resp["data"]
  end

  def update_success
    return unless max_confirmations && confirmations && (confirmations >= max_confirmations) && (success.nil?)
    
    update(success: true)
  end
end

```

#### Define Controller

```ruby
# app/controllers/payment_controller.rb

class PaymentController < ApplicationController
  skip_before_action :require_login,             only: [:callback]
  skip_before_action :verify_authenticity_token, only: [:callback]
  before_action      :set_order,                 only: [:create]
  before_action      :set_payment,               only: [:address, :status, :callback]
  before_action      :check_ownership,           only: [:address, :status]

  def create
    @payment = Payment.create(order: @order)

    response = {
      currencies:  JSON.parse(@payment.currencies),
      fiatValue:   @order.amount,
      onBackClick: "/",
      redirectTo:  "/",
      statusUrl:   "/payment/#{@payment.id}/status"
    }

    render json: response
  end

  def address
    response = @payment.get_address(params.require(:coin))

    render json: response
  end

  def status
    response = {
      success:       @payment.success,
      confirmations: @payment.confirmations
    }

    render json: response
  end

  def callback
    head :unauthorized unless @payment.invoice == params.require(:invoice)

    @payment.update(max_confirmations: params.require(:maxConfirmations))
    @payment.update(confirmations:     params.require(:confirmations))
    
    if @payment.success
      in_transaction = params.require(:inTransaction)
      @payment.update(coins_received: (in_transaction[:amount].to_f / 10 ** in_transaction[:exp].to_f))
      render plain: @payment.invoice
    else
      render plain: 'waiting for confirmations'
    end
  end

  private
  
  def set_order
    @order = Order.find(params.require(:order))
    head :unauthorized unless @order.user == current_user
  end

  def set_payment
    @payment = Payment.find(params.require(:id))
  end

  def check_ownership
    head :unauthorized unless @payment.order.user == current_user
  end
end
```

#### Add Routes

```ruby
# config/routes.rb

get  '/payment',                   to: 'payment#create'
get  '/payment/:id/address/:coin', to: 'payment#address'
get  '/payment/:id/status',        to: 'payment#status'
post '/payment/:id/callback',      to: 'payment#callback'
```

#### Client-side code with [Stimulus](https://github.com/stimulusjs/stimulus)

```html
<!-- app/views/home/pay.html -->

<html>
  <head>
    <script type="text/javascript" src="/paybear.js"></script>
    <link rel="stylesheet" type="text/css" href="/paybear.css" />
  </head>
  <body>
    <!-- Place paybear.html here -->
    <button data-controller="payment" data-action="payment#newPaybearModal" data-payment-order="1">Pay</button>
  </body>
</html>
```


```javascript
// app/javascript/conrtollers/payment_conrtoller.js

import { Controller } from "stimulus"

export default class extends Controller {
  newPaybearModal() {
    window.paybear = new Paybear({settingsUrl: `/payment?order=${this.data.get("order")}`})
  }
}
```
