<?
$ip = $_REQUEST["ip"];
$port = $_REQUEST["port"];
$chnnl_no = $_REQUEST["chnnl_no"];

$url = "http://cht.kma.go.kr/gts/cctv_stn_info.php?mode=2&chnnl_no=".$chnnl_no."&ip=".$ip."&port=".$port;

$fp = fopen($url,"r");
if ($fp) {
  while (!feof($fp)) {
    $str = fgets($fp, 2048);
    if ($str[0] == "#") continue;
    $arr = explode(",", $str);
    $f0 = $arr[0];
    $f1 = $arr[1];
    $f2 = $arr[2];
    $f3 = $arr[3];
    $f4 = $arr[4];
  }
  fclose($fp);
}
?>

<!DOCTYPE HTML>
<HTML>
<HEAD>
<title>CCTV (<?echo $f0?>)</title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR"/>

<link rel="stylesheet" href="http://portal.comis5.kma.go.kr/html/map/lib/css/anaMap.css">

<!-- cctv -->
<script type="text/javascript" src="./htdocs/js/AcesVideo.js"></script>
<script type="text/javascript" src="./htdocs/js/AcesServer.js"></script>
<script type="text/javascript" src="./htdocs/js/AcesServerHDS7000.js"></script>
<script type="text/javascript" src="./htdocs/js/AcesServerMaster.js"></script>

<script type="text/javascript">
var serverMaster;
var videoSession;

//aces 웹소켓 연결
serverMaster = new AcesServerMaster(true);
['111','112','113','114'].forEach(function(item){
  serverMaster.addServer('172.20.86.'+item, '8880', true, true);
});

window.addEventListener("DOMContentLoaded", function(e){
  // cctv_stn_info 테이블의 요소를 참조하여 아래와 같이 맵핑
  // java request에 cctv라는 이름의 hashmap이 있다고 가정함
  var currentVideo = {
    f0  : <?echo "\"".$f0."\"\n"?>
    ,f1 : <?echo "\"".$f1."\"\n"?>
    ,f2 : <?echo "\"".$f2."\"\n"?>
    ,f3 : <?echo "\"".$f3."\"\n"?>
    ,f4 : <?echo "\"".$f4."\"\n"?>
  }

  var targetVideo = document.getElementById('cctvVideo');
  var loadingDiv = document.getElementById('loadingDiv');
  loadingDiv.style.display = "block";

  //cctv 웹소켓 연결
  videoSession = serverMaster.openVideo(targetVideo,currentVideo,true,loadingDiv);
});

//팝업 닫을시 웹소켓 연결끊기
window.addEventListener("beforeunload", function(e){
  if(videoSession != null) videoSession.shutdown();
  if(serverMaster != null) serverMaster.shutdown();
});

</script>

</HEAD>


<BODY>

<div id="contents">
    <div class="btn_fl" style="padding-left:10px;font">
        <h1 class="left" style="font-size: 15px;"><?echo $f0?></h1>
    </div>

    <div id="screen" style="padding-left:10px;padding-right:10px;">
        <video autoplay loop muted controls id="cctvVideo" width='100%' height='93%'></video>
    </div>
</div>
<div class="loading_wrap" id="loadingDiv" style="display: none;">
  <div class="loading" style="z-index: 1000;">
    <div class="dot" style="z-index: 1000;">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</div>

</BODY>
</HTML>