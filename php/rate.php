<?php
$url = "https://api.paybear.io/v1/eth/exchange/usd/rate";

if ($response = file_get_contents($url)) {
    $response = json_decode($response);
    if ($response->success) {
        echo $response->data->mid;
    }
}