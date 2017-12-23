require 'paybear.rb'

def currencies
  if params[:order]
    orderId = params[:order]

    fiatTotal = 19.99 # get from order

    if params[:token]
      token = params[:token]

      data = get_currency(token, orderId, true)
    else
      data = []
      for token in ['ETH', 'BTC', 'LTC', 'BCH', 'BTG', 'DASH']
        currency = get_currency(token, orderId)
        if currency
          data.push(currency)
        end
      end
    end
    render json: data # return this data to PayBear form
  else
    render json: {error: 'send the order number'}
  end
end