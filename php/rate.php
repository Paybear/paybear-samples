<?php
function getRate($curCode) {
    $url = "https://api.paybear.io/v1/".strtolower($curCode)."/exchange/usd/rate";

    if ($response = file_get_contents($url)) {
        $response = json_decode($response);
        if ($response->success) {
            return $response->data->mid;
        }
    }
    return null;
}

