require 'open-uri'

def pay
  url = 'https://api.paybear.io/v1/eth/exchange/usd/rate'

  response = ActiveSupport::JSON.decode(open(url).read)

  if response[:success]
    puts response[:data][:mid]
  end
end