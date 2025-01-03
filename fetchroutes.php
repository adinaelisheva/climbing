<?php
/* Usage: GET fetchroutes.php
*  Returns all routes and their info
*/
  include("common.php"); 

  $json = [];

  $sql = "SELECT * from routes"; 
  
  $entryresult = mysqli_query($db, $sql) or die(mysqli_error($db));

  while ($entry = mysqli_fetch_assoc($entryresult)) {
      $json[] = $entry;
  }

  echo(json_encode($json, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT));
  
?> 
