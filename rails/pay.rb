require 'currencies.rb'

def pay
  usd_amount = 10
  currencies = ['ETH']
  puts get_req(usd_amount, currencies)[:request] # return this data to PayBear form
end

def get_req(amount, currencies)
  order_id = 1

  request = {
    currencies: [],
    invoice: order_id,
    fiatValue: amount,
    accepted: false,
    redirectTo: 'https://www.mysite.com/success.html'
  }

  data = send_req(order_id)

  if data[:address]
    result = get_currencies(currencies, data[:address], request)
    request[:currencies] = result

    {
      error: nil,
      request: request
    }
  else
    {
      error: data[:error],
      request: nil
    }
  end
end

def send_req(order_id)
  payout_address = '0x39ee76948d238fad2b750998f8a38d80c73c7cd7' # your address
  callback_url = "http://CHANGEME.com/callback/#{order_id}"
  url = "https://api.paybear.io/v1/eth/payment/#{payout_address}/#{CGI.escape(callback_url)}"

  begin
    response = ActiveSupport::JSON.decode(open(url).read)
    rescue *HTTP_ERRORS => e
    {
      error: e,
      address: nil
    }
  else
    if response['success']
      {
        error: nil,
        address: response['data']['address']
      }
    end
  end
end