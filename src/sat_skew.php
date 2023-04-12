<?
$tm = $_REQUEST["tm"];   if ($tm == "") $tm = "0";
$lat   = $_REQUEST["lat"];     if ($lat == "") $lat = 38.;
$lon   = $_REQUEST["lon"];     if ($lon == "") $lon = 126.;
$opt = $tm.",".$lat.",".$lon;
?>

<HTML>
<HEAD>
<title>통합분석-단열선도</title>
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
.TB10 {width:39px; Height:19px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; vertical-align:top; text-align:center; border-style:outset; border-width:1; border-color:#888888; line-height:17px; cursor:hand;}
.TB11 {Font-size:13px; padding:0 0 0 0;}
.filter_point {font-family:'맑은 고딕'; font-size:10pt; color: #000000; font-weight:bold;}
.filter_small_point {font-family:'맑은 고딕'; font-size:8pt; color: #000000; font-weight:bold;}
.filter_point_white {font-family:'맑은 고딕'; font-size:10pt; color: #ffffff;}
.filter_point_white_b {font-family:'맑은 고딕'; font-size:10pt; color: #ffffff; font-weight:bold;}
.circle {background: rgba(153,217,234,0.8); border-radius: 50%; height: 20; width: 20;}
._ku_LoadingBar {position:relative; top:50%; left:50%; width: 100px; height: 100px; background: url(../fgd/htdocs/images/loading.gif) no-repeat 96% 15%; z-index: 65535; opacity:1.0;}
-->
</style>

<link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>
<script language="javascript" src="/sys/js/dateutil.js"></script>
<script language="javascript" src="/sys/js/popupCalendar.js"></script>
<script type="text/javascript" src="./sat_skew.js?<?=date('Ymdhis')?>"></script>

</HEAD>

<BODY onload='onLoad("<?=$opt?>");' onkeydown='var key = doKey(event,0); if (key == 0) return false;' onkeyup='var key = doKey(event,1); if (key == 0) return false;' onresize='fnBodyResize();' bgcolor=#ffffff topmargin=5 leftmargin=5 marginwidth=5 marginheight=5 style='overflow:hidden;'>
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
        <tr height=4></tr>
        <tr>
          <td nowrap class=T02_Title02>&middot;&nbsp;시각&nbsp;</td>
          <td nowrap width=5></td>
          <td nowrap><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(1, 'ana');" value=' NOW '></td>

          <td nowrap width=5></td> 
          <td nowrap style='padding:0 0 0 2;'><input type="text" name="tm_ana" id="tm_ana" value="0" maxlength="16" class=TimeBox style="width:130px;" onkeypress="tm_input('ana');"></td>
          <td nowrap><a href="#" onclick="calendarPopup('tm_ana', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
          <td nowrap width=5></td>
          <td nowrap class=TB09 style="background-color:#d4f3ff;" onmouseup="tm_move('-24H', 'ana');">-1D</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#d4f3ff;" onmouseup="tm_move('-12H', 'ana');">-12H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#e5f8ff;" onmouseup="tm_move('-6H', 'ana');">-6H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-3H', 'ana');">-3H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-1H', 'ana');">-1H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-30m', 'ana');">-30m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#f3fcff;" onmouseup="tm_move('-10m', 'ana');">-10m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+10m', 'ana');">+10m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+30m', 'ana');">+30m</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+1H', 'ana');">+1H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#fff4f1;" onmouseup="tm_move('+3H', 'ana');">+3H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#ffebe5;" onmouseup="tm_move('+6H', 'ana');">+6H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#ffdfd5;" onmouseup="tm_move('+12H', 'ana');">+12H</td>
          <td nowrap width=1></td> 
          <td nowrap class=TB09 style="background-color:#ffdfd5;" onmouseup="tm_move('+24H', 'ana');">+1D</td>
          <td nowrap width=4></td> 
          <td nowrap><input type="button" id=ani class=TB10 value="동화 off" onClick="fnAnimate();" style="width:55px; background-color:#fff;"></td>

          <td nowrap width=15></td>
          <td nowrap class=T02_Title02>&middot;&nbsp;지점&nbsp;</td>
          <td nowrap width=5></td>
          <td nowrap class=text1>위도</td>
          <td nowrap width=4></td>
          <td nowrap><input class='text1 prevent-keydown' type="number" step="any" name="lat" id=lat autocomplete="off" value=37.8 style='IME-MODE: disabled; width:50px;'></td>
          <td nowrap width=5></td>
          <td nowrap class=text1>경도</td>
          <td nowrap width=4></td>
          <td nowrap><input class='text1 prevent-keydown' type="number" step="any" name="lon" id=lon autocomplete="off" value=128.4 style='IME-MODE: disabled; width:50px;'></td>
          <td nowrap width=5></td>
          <td nowrap><input class=TB08 style="width:35px; font-size:11px;" type="submit" value="변경" onclick="stn_id = 0; doSubmit();"></td>

          <td nowrap width=15></td>
          <td nowrap class=T02_Title02>&middot;&nbsp;대표 지점&nbsp;</td>
          <td nowrap width=5></td>
          <td nowrap> 
            <div style='display:flex;'>
              <div id=tms_stn1></div>
              <div style='width:2px;'></div>
              <div id=tms_stn2></div>
            </div>
          </td>
          <td nowrap width=5></td>
          <td nowrap><input class=TB08 style="width:35px; font-size:11px;" type="submit" value="변경" onclick="stn_id = document.getElementById('select_stn').value; console.log(stn_id); doSubmit();"></td>
        </tr>
        </table>
      </td>
    </tr>

    <tr height=2>
    </tr>

    <!-- 2번째 줄
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr height=4></tr>
        <tr>
        <td nowrap> 
          <table border=0 cellpadding=0 cellspacing=0 align=left id=nwp_info style='visibility:visible;'>
            <tr class=T02_Title02>

              <td nowrap>&middot;&nbsp;수치모델 비교&nbsp;
                <input type=checkbox class=checkbox2 id=sat onclick='doChtVal();'>
              </td>

              <td nowrap width=10></td>
              <td nowrap>&nbsp;&middot;&nbsp;종류&nbsp;</td>
              <td nowrap> 
                <select id=model class="text3" onChange="doSubmit();">
                  <option value='UM' selected>UM
                  <option value='ECMWF'>ECMWF
                  <option value='KIMG'>KIM
                </select>
              </td>

              <td nowrap width=10></td>
              <td nowrap>&nbsp;&middot;&nbsp;발표시각&nbsp;</td>
              <td nowrap width=4></td> 
              <td nowrap><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onmouseup="tm_init(1, 'fc');" value=' NOW '></td>
              <td nowrap width=5></td> 
              <td nowrap><input type=text name="tm_fc" id="tm_fc" class=TimeBox style='width:130;' size=15 maxlength=17 onkeypress="tm_input('fc');" value=0></td>
              <td nowrap style="cursor:hand;" onclick="calendarPopup('tm_fc',calPress);"><img src="/images/calendar.gif" border=0></td>
              <td nowrap width=5></td>
              <td nowrap class=TB09 style="background-color:#d4f3ff;" onmouseup="tm_move('-1D', 'fc');">-1D</td>
              <td nowrap width=1></td> 
              <td nowrap class=TB09 style="background-color:#d4f3ff;" onmouseup="tm_move('-12H', 'fc');">-12H</td>
              <td nowrap width=1></td> 
              <td nowrap class=TB09 style="background-color:#ffdfd5;" onmouseup="tm_move('+12H', 'fc');">+12H</td>
              <td nowrap width=1></td> 
              <td nowrap class=TB09 style="background-color:#ffdfd5;" onmouseup="tm_move('+1D', 'fc');">+1D</td>
            </tr>
          </table>
        </td>
        </tr>
        -->
        </table>
      </td>
    </tr>

    <tr height=2>
    </tr>

    </table>
  </td>
</tr>
</table>
</div>

<div style='position:relative; height:10px; z-index:200;'></div>
<!-- 동화 -->
<div id='skew_ani' style='height:29px; display:none;'>
  <div style='display:flex;'>
    <div style='min-width:4px;'></div>
    <div class='text1' style='font-weight:bold;'>프레임수</div>
    <div style='min-width:4px;'></div>
    <div>
      <select id=ani_frame onChange="fnTimeBar(); doSubmit();" class="text3">
        <option value=4>4개
        <option value=6>6개
        <option value=8 selected>8개
        <option value=10>10개
        <option value=12>12개
      </select>
    </div>
    <div style='min-width:6px;'></div>
    <div class='text1' style='font-weight:bold;'>/</div>
    <div style='min-width:4px;'></div>
    <div class='text1' style='font-weight:bold;'>시간간격</div>
    <div style='min-width:4px;'></div>
    <div>
      <select id=ani_itv onChange="fnTimeBar(); doSubmit();" class="text3">
        <option value=0.1>10분
        <option value=0.3>30분
        <option value=1 selected>1시간
        <option value=3>3시간
        <option value=6>6시간
        <option value=12>12시간
        <option value=24>24시간
      </select>
    </div>

    <div style='min-width:20px;'></div>
    <div id=ani_tm1 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm1 style='width:4px;'></div>
    <div id=ani_tm2 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm2 style='width:4px;'></div>
    <div id=ani_tm3 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm3 style='width:4px;'></div>
    <div id=ani_tm4 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm4 style='width:4px;'></div>
    <div id=ani_tm5 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm5 style='width:4px;'></div>
    <div id=ani_tm6 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm6 style='width:4px;'></div>
    <div id=ani_tm7 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm7 style='width:4px;'></div>
    <div id=ani_tm8 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm8 style='width:4px;'></div>
    <div id=ani_tm9 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm9 style='width:4px;'></div>
    <div id=ani_tm10 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm10 style='width:4px;'></div>
    <div id=ani_tm11 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm11 style='width:4px;'></div>
    <div id=ani_tm12 class=TB10 style='border:1px solid #888888; background-color:white; height:17px; width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm12 style='width:4px;'></div>

    <div style='min-width:10px;'></div>
    <div><i class='fas fa-step-backward' id=ani_back style='cursor:hand; position:relative; top:3px;' onclick="tmbarLeft();"></i></div>
    <div style='min-width:4px;'></div>
    <div><i class='fas fa-step-forward' id=ani_forward style='cursor:hand; position:relative; top:3px;' onclick="tmbarRight();"></i></div>
  </div>
</div>
<!-- 동화 끝 -->

<!-- 바디 -->
<div id='skew_body' style='overflow:auto;'>
  <div id='skew_img1'><div id=nocht1 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img2'><div id=nocht2 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img3'><div id=nocht3 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img4'><div id=nocht4 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img5'><div id=nocht5 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img6'><div id=nocht6 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img7'><div id=nocht7 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img8'><div id=nocht8 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img9'><div id=nocht9 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img10'><div id=nocht10 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img11'><div id=nocht11 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
  <div id='skew_img12'><div id=nocht12 class=text1 style='display:none;'>단열선도가 생성되지 않았습니다.</div></div>
</div>

<!-- 로딩 바 -->
<div id=loading style='position:absolute; top:0px; left:0px; z-index:1000; width:100%; height:100%; background-color:#eeeeee; opacity:0.5; text-align:center; vertical-align:middle; display:none;'>
  <div class=_ku_LoadingBar></div>
</div>

<div id=loadingStatus style='position:absolute; top:65%; left:25%; width:50%; text-align:center; vertical-align:middle; display:none; opacity:1.0; z-index:1100;'>
  <div id=loadingnum style='position:relative; left:50px; font-size:10pt;' class=filter_point></div>
  <div id=loadingbar style='position:relative; left:50px; background-color:lightblue; height:25px; width:0%; border:1px solid black;'></div>
</div>

</html>