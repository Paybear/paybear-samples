require 'open-uri'

def pay
  order_id = 12345
  payout_address = '0x39ee76948d238fad2b750998f8a38d80c73c7cd7' # your address
  callback_url = "http://CHANGEME.com/callback/#{order_id}"
  url = "https://api.paybear.io/v1/eth/payment/#{payout_address}/#{CGI.escape(callback_url)}"

  response = ActiveSupport::JSON.decode(open(url).read)

  if response[:data][:address]
    puts response[:data][:address]
    # save response[:data][:invoice] and keep it secret
  end
end