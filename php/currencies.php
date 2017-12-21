<?php

include "paybear.php";

$orderId = (int)$_GET['order'];

$fiatTotal = 19.99; //get from order

if (isset($_GET['token'])) {
	$token = $_GET['token'];

	$data = getCurrency($token, $orderId, true);
} else {
	$data = array();
	foreach(array('ETH', 'BTC', 'LTC', 'BCH', 'BTG', 'DASH') as $token) {
		$currency = getCurrency($token, $orderId);
		if ($currency) $data[] = $currency;
	}
}

echo json_encode($data); //return this data to PayBear form



