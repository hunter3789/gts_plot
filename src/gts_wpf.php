<?
$tm    = $_REQUEST["tm"];      if ($tm == "")     $tm = "0";
$stn_id = $_REQUEST["stn"];    if ($stn_id == "") $stn_id = "47102";
$opt = $tm.",".$stn_id;
?>

<HTML>
<HEAD>
<title>윈드프로파일러-시계열</title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR"/>
<meta http-equiv='X-UA-Compatible' content='IE=edge'/>
<style type='text/css'>
<!--
img {image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;}
.checkboxs {display: inline-block; width: 14px; height: 14px; margin: 3px 0 0 0;}
.checkbox2 {display: inline-block; width: 12px; height: 12px; margin: 0px 1 0 1; position: relative; top: 2px;}
.head  {font-family:'굴림','Verdana';   font-size:10pt; color: #222222;}
.ehead {font-family:'굴림체','Verdana'; font-size:11pt; color: #000000;}
.text1 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 8pt; color: #000000; Font-weight:bold;}
.text2 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 9pt; color: #000C65; font-weight:bold;}
.text3 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 9pt; color: #000000; height:14pt;}
.T02_Style01   {Border-Top: 1px solid #CCCCCC; Border-Bottom: 1px solid #CCCCCC; Border-collapse:collapse; Background-Color:#F1F1F1;}
.T02_Header01  {text-align:center; Background-Color:#FFECD2; Font-family:"맑은 고딕"; Font-size:14px; Font-weight:bold; letter-spacing:-1pt; Color:#3C48A1; Border-Right: 1px solid #CCCCCC;}
.T02_List01    {Padding:3 8 2 8; text-align:center; Background-Color:#FFF5E6;}
.T02_Title02   {Font-family:"맑은 고딕","굴림"; Font-size:12px; Font-weight:bold; Color:#3C48A1;}
.TimeBox       {Height:15px; Border: 0px solid #FFFFFF; Background-Color:transparent; Font-family:"Verdana"; Font-size:9pt; Color:#000C65; Font-weight:bold;}
.TextBox       {Height:14px; Width:48px; Border: 1px solid #F0F0F0; Font-family:"Verdana"; Font-size:7pt; Color:#000C65; Font-weight:bold;}
.Zoom {Font-family:"맑은 고딕"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; vertical-align:top; text-align:center; border-style:outset; border-width:1; border-color:#888888; Background-Color:transparent; cursor:hand;}
.TB08 {Height:19px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; text-align:center; border-style:outset; border-width:1; border-color:#888888; cursor:hand;}
.TB09 {width:37px; Height:16px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; vertical-align:top; text-align:center; border-style:outset; border-width:1; border-color:#888888; cursor:hand; display:inline-block; line-height:16px;}
.TB10 {width:39px; Height:12px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:2 0 0 1; Font-weight:bold; vertical-align:top; text-align:center;}
.TB11 {Font-size:13px; padding:0 0 0 0;}
-->
</style>

<link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>
<script language="javascript" src="/sys/js/dateutil.js"></script>
<script language="javascript" src="/sys/js/popupCalendar.js"></script>
<script type="text/javascript" src="./gts_wpf.js?<?=date('Ymdhis')?>"></script>

</HEAD>

<BODY onload='onLoad("<?=$opt?>");' onresize='fnBodyResize();' bgcolor=#ffffff topmargin=5 leftmargin=5 marginwidth=5 marginheight=5 style='overflow:hidden;'>
<!-- 메뉴 -->
<div id=menu style='position:relative; overflow:hidden; z-index:200;'>
<table cellpadding=0 cellspacing=0 border=0 width=100% class=T02_Style01 style='z-index:200;'>
<tr>
  <td nowrap class=T02_List01>
    <table border=0 cellpadding=0 cellspacing=0 align=left>
    <!-- 1번째 줄 -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr>
          <td nowrap class=T02_Title02>&middot;&nbsp;</td>
          <td nowrap width=5></td>
          <td nowrap><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(0);" value=' NOW '></td>

          <td nowrap width=5></td> 
          <td nowrap style='padding:0 0 0 2;'><input type="text" name="tm" id="tm" value="0" maxlength="16" class=TimeBox style="width:130px;" onkeypress="tm_input();"></td>
          <td nowrap><a href="#" onclick="calendarPopup('tm', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
          <td nowrap width=5></td>
          <td nowrap class=TB09 style="background-color:#d4f3ff;" onmouseup="tm_move('-12H');">-12H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#d4f3ff;" onmouseup="tm_move('-6H');">-6H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#e5f8ff;" onmouseup="tm_move('-3H');">-3H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-1H');">-1H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-30m');">-30m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-10m');">-10m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+10m');">+10m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+30m');">+30m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+1H');">+1H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#ffebe5;" onmouseup="tm_move('+3H');">+3H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#ffdfd5;" onmouseup="tm_move('+6H');">+6H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#ffdfd5;" onmouseup="tm_move('+12H');">+12H</td>
        </tr>
        </table>
      </td>
    </tr>

    </table>
  </td>
</tr>
</table>
</div>

<div style='position:relative; height:10px; z-index:200;'></div>
<!-- 바디 -->
<div id='body' style='overflow:auto;'>
  <div style='display:flex;'>
    <div id=container style='min-width:1000px;'>
      <div><img id=wpf></div>
    </div>
  </div>
</div>

</html>