<?php

const ETH_CONFIRMATIONS = 3;

$orderId = $_GET['id'];
$data = file_get_contents('php://input');
if ($data) {
    $params = json_decode($data);
    $invoice = $params->invoice;
    if ($params->confirmations>=ETH_CONFIRMATIONS) {
        $amountPaid = $params->inTransaction->amount / pow(10, 18); //amount in ETH
        //compare $amountPaid with order total
        //compare $invoice with one saved in the database to ensure callback is legitimate
        //mark the order as paid
        echo $invoice; //stop further callbacks
    } else {
        die("waiting for confirmations");
    }
}