<?php

/*
*  Usage: POST logclimb.php
*    routenum: 46 // Number of route climbed
*    date: YYYY-mm-dd // Date climbed
*    pct: 50 // Percent climbed
*    companions: "Alex, Bob" // Who was there
*    notes: "2 small rests" // Any misc notes
*
*  Returns: JSON representation of climb log, or object with "Error" key if failure
*/

  include("common.php");
  if (isset($_POST["routenum"])) {
    $routenum = $_POST["routenum"];
  }
  if (empty($routenum)) die('{"Error":"routenum cannot be empty"}');
  if (isset($_POST["date"])) {
    $date = mysqli_real_escape_string($db, $_POST["date"]);
  }
  if (empty($date)) die('{"Error":"date cannot be empty"}');
  $datestr = date ("Y-m-d", strtotime($date));
  if (isset($_POST["pct"])) {
    $pct = $_POST["pct"];
  }
  if (empty($pct)) die('{"Error":"pct cannot be empty"}');
  if (isset($_POST["color"])) {
    $color = mysqli_real_escape_string($db, $_POST["color"]);
  }
  if (empty($color)) die('{"Error":"color cannot be empty"}');
  if (isset($_POST["difficulty"])) {
    $difficulty = mysqli_real_escape_string($db, $_POST["difficulty"]);
  }
  if (empty($difficulty)) die('{"Error":"difficulty cannot be empty"}');
  $companions = "";
  if (isset($_POST["companions"])) {
    $companions = mysqli_real_escape_string($db, $_POST["companions"]);
  }
  $notes = "";
  if (isset($_POST["notes"])) {
    $notes = mysqli_real_escape_string($db, $_POST["notes"]);
  }
  
  $sql = "INSERT INTO climbs (routenum, date, pct, color, difficulty, companions, notes) VALUES ($routenum, '$datestr', '$color', '$difficulty', $pct, '$companions', '$notes');";
 
  echo("SQL: $sql ");
  
  $result = mysqli_query($db, $sql) or die('{"Error":"'+mysqli_error($db)+'"}');

  echo("Executed. ");
  
  $result = mysqli_query($db, "SELECT * FROM climbs WHERE routenum = $routenum AND date = '$datestr' LIMIT 1") or die('{"Error":"'+mysqli_error($db)+'"}');
  $entry = mysqli_fetch_assoc($result);

  echo(json_encode($entry, JSON_NUMERIC_CHECK));
?>
