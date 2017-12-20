<?php

const MIN_CONFIRMATIONS = 3;

$orderId = (int)$_GET['order'];

$confirmations = 0; //get from DB, see callback.php

$data = array();
if ($confirmations > 3) { //set max confirmations
	$data['success'] = true;
} else {
	$data['success'] = false;
}

if (is_numeric($confirmations)) $data['confirmations'] = $confirmations;

echo json_encode($data); //return this data to PayBear form
