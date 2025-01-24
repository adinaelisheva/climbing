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
  if (isset($_POST["difficulty"])) {
    $difficulty = mysqli_real_escape_string($db, $_POST["difficulty"]);
  }
  if (empty($difficulty) && empty($color)) die('{"Error":"difficulty and color cannot both be empty"}');
  
  $toSet = "";
  if (!empty($color)) {
    $toSet = "`color`='$color'";
  }
  if (!empty($color) && !empty($difficulty)) {
    $toSet = $toSet . ",";
  }
  if (!empty($difficulty)) {
    $toSet = "`difficulty`='$difficulty'";
  }

  $sql = "UPDATE routes SET $toSet WHERE `routenum`='$routenum';";
 
  echo("SQL: $sql ");
  
  $result = mysqli_query($db, $sql) or die('{"Error":"'+mysqli_error($db)+'"}');

  echo("Executed. ");
  
  $result = mysqli_query($db, "SELECT * FROM routes WHERE routenum = $routenum LIMIT 1") or die('{"Error":"'+mysqli_error($db)+'"}');
  $entry = mysqli_fetch_assoc($result);

  echo(json_encode($entry, JSON_NUMERIC_CHECK));
?>
