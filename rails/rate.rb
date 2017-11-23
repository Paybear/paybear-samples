require 'open-uri'

def get_rate(cur_code)
  url = "https://api.paybear.io/v1/#{cur_code.downcase!}/exchange/usd/rate"

  response = ActiveSupport::JSON.decode(open(url).read)

  if response['success']
    response['data']['mid']
  end
end