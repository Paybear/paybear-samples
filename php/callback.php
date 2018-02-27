<?php

$orderId = $_GET['order'];
$data = file_get_contents('php://input');
if ($data) {
    $params = json_decode($data);
    $invoice = $params->invoice;

	//save number of confirmations to DB: $params->confirmations

    if ($params->confirmations >= $params->maxConfirmations) {
        $amountPaid = $params->inTransaction->amount / pow(10, $params->inTransaction->exp);
        //compare $amountPaid with order total
        //compare $invoice with one saved in the database to ensure callback is legitimate
        //mark the order as paid
        echo $invoice; //stop further callbacks
    } else {
        die("waiting for confirmations");
    }
}