require 'open-uri'

def pay
  order_id = 12345
  payout_address = '0x296c781e905F5f83aFB7f0949D8bAac76D8D4c35' # your address
  callback_url = "http://staging.ethering.io:3002/callback/#{order_id}"
  url = "https://api.paybear.io/v1/eth/payment/#{payout_address}/#{CGI.escape(callback_url)}"

  data = ActiveSupport::JSON.decode(open(url).read)

  if data[:data][:address]
    puts data[:data][:address]
    # save data[:data][:invoice] and keep it secret
  end
end