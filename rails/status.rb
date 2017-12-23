def status
  @MIN_CONFIRMATIONS = 3

  if params[:order]
    orderId = params[:order]

    confirmations = nil

    confirmations = 0 # get from DB, see callback.php

    data = {
      success: confirmations >= @MIN_CONFIRMATIONS
    }

    if confirmations
      data['confirmations'] = confirmations
    end

    render json: data
  end
end