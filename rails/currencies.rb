require 'paybear.rb'

def currencies
    if params[:order]
      order_id = params[:order]

      fiat_total = 19.99 # get from order

      if params[:token]
        token = params[:token]

        data = get_currency(token, order_id, true)
      else
        data = []
        get_currencies.each do |currency|
          currency = get_currency(currency[0], order_id)
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