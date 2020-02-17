<?php
session_start();
$user = $_SESSION['user'];
$servername = "localhost";
$username = "localhost";
$password = "";

if($user == 'admin'){
  echo '{
  "message": "This is a message for admin only",
  "success": true
}';
}

else {
  echo '{
    "message": "who is this",
    "success": false
  }';
}



// // creating connection
// $conn = mysqli_connect($servername, $username, $password);
//
// // Checking connection
// if (!$conn) {
//     // die("Connection failed: " . mysqli_connect_error());
//     echo("connected");
// }
// echo "Connected successfully";
$servername = "localhost";
$username = "";
$password = "";

// Create connection
$conn = mysqli_connect($servername, $username, $password);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully";



 ?>
