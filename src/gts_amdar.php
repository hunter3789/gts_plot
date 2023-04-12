<?
$tm       = $_REQUEST["tm"];
$aircraft = $_REQUEST["aircraft"];
$bufr     = $_REQUEST["bufr"];
$msg      = $_REQUEST["msg"];
$opt = $tm.",".$aircraft.",".$bufr.",".$msg;
?>

<HTML>
<HEAD>
<title>AMDAR 자료 조회</title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR"/>
<meta http-equiv='X-UA-Compatible' content='IE=edge'/>
<style type='text/css'>
<!--
* {
  font-size: 12px;
}

img {image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;}
.text1 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 8pt; color: #000000; Font-weight:bold;}
.text2 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 10pt; color: #000C65; font-weight:bold;}
.pop {font-family:'맑은 고딕','굴림체',,'Verdana'; color: #222222;}
.pop th {text-align:center; min-width:72px; font-size:10pt;}
.pop td {text-align:center; font-size:10pt;}
.temp {
  fill: none;
  stroke-width: 2px;
  stroke: red;
}
.dwpt {
  fill: none;
  stroke-dasharray: 3;
  stroke-width: 2px;
  stroke: red;
}
.skline   { stroke-width: 1.8px; opacity: 0.8;}
.mean     { stroke-width: 2.5px; }

.gridline, .tempzero {
   stroke: #dfdfdf;
   stroke-width: 0.75px;
   fill: none;
}
.tempzero { stroke: #aaa; stroke-width: 1.25px; }

.windbarb { stroke: #000; stroke-width: 0.75px; fill: black; stroke: black;}

.overlay {
  fill: none;
  pointer-events: all;
}

.focus.tmpc circle { fill: red;   stroke: none; }
.focus.dwpc circle { fill: green; stroke: none; }
.focus text { font-size: 12px; }
-->
</style>

<link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>
<script src="../fgd/htdocs/js/d3.v5.min.js"></script>
<script type="text/javascript" src="./skewt2.js?<?=date('Ymdhis')?>"></script>
<script type="text/javascript" src="./gts_amdar.js?<?=date('Ymdhis')?>"></script>
</HEAD>

<BODY onload='onLoad("<?=$opt?>");' onresize='fnBodyResize();' bgcolor=#ffffff topmargin=5 leftmargin=5 marginwidth=5 marginheight=5>
  <div id=info class=text2></div>
  <div style='display:flex;'>
    <div id=image style='width:700px;'></div>
    <div style='min-width:10px;'></div>
    <div id=table></div>
  </div>
</BODY>

</html>