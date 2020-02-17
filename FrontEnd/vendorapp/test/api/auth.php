<?php
session_start();

$_POST = json_decode(file_get_contents('php://input'), true);

if(isset($_POST) && !empty($_POST)) {
  $username = $_POST['username'];
  $password = $_POST['password'];

  if($username == 'cb61fe003e9d1304b01b40de32ad2fa36116769536c42c27e64a942997b16cc504f2d7' && $password == 'admin') {
    $_SESSION['user'] = 'cb61fe003e9d1304b01b40de32ad2fa36116769536c42c27e64a942997b16cc504f2d7';
    ?>
{
  "success": true,
  "secret": "This is the secret no one knows but the vendor"
}
    <?php
  } elseif($username == '028e08a232bd02b0daba7ad9e4e963bd02a4891d78fdbf0a320c895853d4d86e99' && $password == 'customer') ) {
    $_SESSION['user'] = '028e08a232bd02b0daba7ad9e4e963bd02a4891d78fdbf0a320c895853d4d86e99';
    ?>

    {
      "success": true,
      "secret": "This is for customer"
      }
  }
  else(){
{
  "success": false,
  "message": "Invalid credentials"
}
    <?php
  }
}

 else {
  var_dump($_POST)
  ?>
{
  "success": false,
  "message": "Only POST access accepted"
}
  <?php
}

?>
