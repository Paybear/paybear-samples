<?php

$orderId = 12345;
$payoutAddress = '0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7'; //your address
$callbackUrl = 'http://CHANGEME.com/callback.php?id='.$orderId;

$url = sprintf('https://api.paybear.io/v1/eth/payment/%s/%s', $payoutAddress, urlencode($callbackUrl));
if ($response = file_get_contents($url)) {
    $data = json_decode($response);
    if (isset($data->data->address)) {
        echo $data->data->address;
        //save $data->data->invoice and keep it secret
    }
}