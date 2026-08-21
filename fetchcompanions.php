<?php
/* Usage: GET fetchclimbs.php
*  Returns all logs in the past year
*/
  include("common.php"); 

  $json = array();

  $sql = "SELECT DISTINCT companions FROM `climbs` WHERE companions <> '';"; 

  $entryresult = mysqli_query($db, $sql) or die(mysqli_error($db));

  while ($entry = mysqli_fetch_assoc($entryresult)) {
      $json[] = $entry['companions'];
  }

  echo(json_encode($json, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT));
  
?> 
