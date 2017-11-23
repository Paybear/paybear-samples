<?php

include "currencies.php";

$usdAmount = 10;
$currencies = ["ETH"];

$data = getReq($usdAmount, $currencies);

echo json_encode($data->request); //return this data to PayBear form


function getReq($amount, $currencies)
{
    $orderId = 1;

    $request = (object)[
        'currencies' => [],
        'invoice' => $orderId,
        'fiatValue' => $amount,
        'accepted' => false,
        'redirectTo' => 'https://www.mysite.com/success.html'
    ];

    $data = sendReq($orderId);

    if ($data->address) {
        $result = getCurrencies($currencies, $data->address, $request);
        $request->currencies = $result;

        return (object)[
            'error' => null,
            'request' => $request
        ];
    }

    return (object)[
        'error' => $data->error,
        'request' => null
    ];
}

function sendReq($orderId) {
    $payoutAddress = '0x39EE76948d238Fad2b750998F8A38d80c73c7Cd7'; //your address
    $callbackUrl = 'http://CHANGEME.com/callback.php?id='.$orderId;

    $url = sprintf('https://api.paybear.io/v1/eth/payment/%s/%s', $payoutAddress, urlencode($callbackUrl));
    if ($response = file_get_contents($url)) {
        $response = json_decode($response);
        if (isset($response->data->address)) {
            return (object)[
                'error' => null,
                'address' => $response->data->address
            ];
        }
    }
    return (object)[
        'error' => 'can\'t send request',
        'address' => null
    ];
}