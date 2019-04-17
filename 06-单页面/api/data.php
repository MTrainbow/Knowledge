<?php
header("Content-type:application/json");
$page = 'index';
$html = '发现音乐网页内容';

if(array_key_exists('page',$_GET)){
    $page = $_GET['page'];
}
if($page == 'friend'){
        $html = '朋友网页内容';
    }else if($page == 'my'){
        $html = '我的音乐网页内容';
    }
$arr = array('page'=>$page,'html'=>$html);

echo json_encode($arr);

?>