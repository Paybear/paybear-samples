def callback
  if params[:confirmations] && params[:id]
    order_id = params[:id]
    data = params
    invoice = data[:invoice]

    if data[:confirmations] >= ETH_CONFIRMATIONS
      amount_paid = data[:inTransaction][:amount] / 10**18 # amount in ETH
      # compare $amountPaid with order total
      # compare $invoice with one saved in the database to ensure callback is legitimate
      # mark the order as paid
      render plain: invoice # stop further callbacks
    else
      render plain: 'waiting for confirmations'
    end
  else
    render plain: 'error'
  end
end
