<?php

$orderId = (int)$_GET['order'];

$confirmations = null;

$confirmations = 0; //get from DB, see callback.php
$maxConfirmations = 3; //get from DB, see callback.php

$data = array();
if ($confirmations >= $maxConfirmations) { //set max confirmations
	$data['success'] = true;
} else {
	$data['success'] = false;
}

if (is_numeric($confirmations)) $data['confirmations'] = $confirmations;

echo json_encode($data); //return this data to PayBear form
