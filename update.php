<?php

/*
*  Usage: POST update.php
*    routenum: 46 // Number of route to update
*    color: "yellow" // Color of route to set
*    difficulty: 7 // 5.X difficulty score to set
*
*  Returns: JSON representation of new route, or object with "Error" key if failure
*/

  include("common.php");
  if (isset($_POST["routenum"])) {
    $routenum = $_POST["routenum"];
  }
  if (empty($routenum)) die('{"Error":"routenum cannot be empty"}');
  if (isset($_POST["color"])) {
    $color = mysqli_real_escape_string($db, $_POST["color"]);
  }
  if (empty($color)) die('{"Error":"color cannot be empty"}');
  if (isset($_POST["difficulty"])) {
    $difficulty = $_POST["difficulty"];
  }
  if (empty($difficulty)) die('{"Error":"difficulty cannot be empty"}');
  
  $sql = "UPDATE routes SET `color`='$color',`difficulty`='$difficulty' WHERE `routenum`='$routenum';";
 
  echo("SQL: $sql ");
  
  $result = mysqli_query($db, $sql) or die('{"Error":"'+mysqli_error($db)+'"}');

  echo("Executed. ");
  
  $result = mysqli_query($db, "SELECT * FROM routes WHERE routenum = $routenum LIMIT 1") or die('{"Error":"'+mysqli_error($db)+'"}');
  $entry = mysqli_fetch_assoc($result);

  echo(json_encode($entry, JSON_NUMERIC_CHECK));
?>
