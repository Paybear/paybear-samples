def callback
  @MIN_CONFIRMATIONS = 3

  if params[:confirmations] && params[:order]
    order_id = params[:order]
    data = params
    invoice = data[:invoice]

    if data[:confirmations] >= @MIN_CONFIRMATIONS
      amount_paid = data[:inTransaction][:amount] / 10**data[:inTransaction][:exp]
      # compare $amountPaid with order total
      # compare $invoice with one saved in the database to ensure callback is legitimate
      # mark the order as paid
      render plain: invoice # stop further callbacks
    else
      # save number of confirmations to DB
      render plain: 'waiting for confirmations'
    end
  else
    render plain: 'error'
  end
end
