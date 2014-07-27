<?php
$dbinfo = 'mysql:dbname=demo_test;host=localhost';
$user = 'root';
$pass = 'thaydoichinhminh';

$db = new PDO($dbinfo, $user, $pass);
$db->exec("SET NAMES 'utf8';");
$sql = "SELECT * FROM locations LIMIT 100";
$sth = $db->prepare($sql);
$sth->execute();
$res = $sth->fetchAll(PDO::FETCH_ASSOC);

?>