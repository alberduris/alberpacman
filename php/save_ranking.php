<?php
    $data = $_POST['jsonString'];
    //set mode of file to writable.
    chmod("../website-contents.json",0777);
    $f = fopen("ranking_json.json", "w+") or die("fopen failed");
    fwrite($f, $data);
    fclose($f);
?>