<?php

const MIN_CONFIRMATIONS = 3;

$orderId = $_GET['order'];
$data = file_get_contents('php://input');
if ($data) {
    $params = json_decode($data);
    $invoice = $params->invoice;
    if ($params->confirmations>=MIN_CONFIRMATIONS) {
        $amountPaid = $params->inTransaction->amount / pow(10, $params->inTransaction->exp);
        //compare $amountPaid with order total
        //compare $invoice with one saved in the database to ensure callback is legitimate
        //mark the order as paid
        echo $invoice; //stop further callbacks
    } else {
    	//save number of confirmations to DB
        die("waiting for confirmations");
    }
}