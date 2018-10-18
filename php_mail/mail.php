<?php
header("Content-Type:text/html;charset=UTF8");
$data = file_get_contents('php://input');
$data = json_decode($data, true);
var_dump($data);
// Повідомлення
 $message  = 'Клієнт: '.$data['name']."\n";
 $message .= 'Телефон: '.$data['phone']."\n";
 $message .= 'Адреса: '.$data['adress']."\n";
 $message .= ">>>>>>>>>>>>>>>>>>>>>>>>>>";
 
 // $key - id товару
 // $value = ("name" => apple)
 $summa = 0;
 
 foreach ($data['cart'] as $key => $value) {
    // $message .='id: '.$key."\n";
    $message .= "\n";
    $message .='Назва товара: '.$value['name']."\n";
    $message .='Склад: '.$value['description']."\n";
    $message .='Ціна: '.$value['coast']."\n";
    $message .='Кількість: '.$value['count']."\n";
    $message .='----------------------------------------'."\n";
    $summa += $value['count'] * $value['coast'];
 }

$message .= 'Сума: '.$summa;

$to = $data['email'].','.'metod.ilchyshyn@gmail.com';

// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n";

// Відправляємо
// $mail = mail($data['email'], 'GoogleRestaurant', $message);
$mail = mail($to, 'Gluttony-KP', $message);
if ($mail){
    echo 'yes';
}
else {
    echo 'no';
}
?>