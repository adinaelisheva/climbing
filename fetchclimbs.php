<?php
/* Usage: GET fetchclimbs.php
*  Returns all logs in the past year
*/
  include("common.php"); 

  $json = [];

  $pastdate = date("Y-m-d",strtotime("-1 year"));
  $sql = "SELECT * from climbs WHERE `date` > '$pastdate' ORDER BY `climbs`.`date` DESC;"; 

  $entryresult = mysqli_query($db, $sql) or die(mysqli_error($db));

  while ($entry = mysqli_fetch_assoc($entryresult)) {
      $json[] = $entry;
  }

  echo(json_encode($json, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT));
  
?> 
