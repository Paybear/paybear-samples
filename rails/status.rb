def status
  @MIN_CONFIRMATIONS = 3

  if params[:order]
    orderId = params[:order]

    confirmations = nil

    confirmations = 0 # get from DB, see callback.rb
    max_confirmations = 3 # get from DB, see callback.rb

    data = {
      success: confirmations >= max_confirmations
    }

    if confirmations
      data['confirmations'] = confirmations
    end

    render json: data
  end
end