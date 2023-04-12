<?
//////////////////////////////////////////////////////////////////////////////////////////
//
//  1개 GTS지점의 한 시간에 대한 전문 이미지 출력
//
//////////////////////////////////////////////////////////////////////////////////////////
$ip_addr = gethostbyname(gethostname());

//
//  함수 등록
//
function gts_upp_wd($im, $xs, $ys, $wd, $ws, $color_wd)
{
  ImageFilledRectangle($im, $xs-1, $ys-1, $xs+1, $ys+1, $color_wd);

  if ($wd < 0 || $wd > 360) return;
  if ($ws < 0 || $ws > 100) return;

  $DEGRAD = 3.1415927/180.0;
  $WR = 20.0;

  // 풍향
  $wd *= $DEGRAD;

  $x1 = $xs;
  $y1 = $ys;
  $x2 = $xs + intval($WR*sin($wd) + 0.5);
  $y2 = $ys - intval($WR*cos($wd) + 0.5);
  if ($ws > 0.2) ImageLine($im, $x1, $y1, $x2, $y2, $color_wd);

  // 풍속깃
  while ($ws > 0.0)
  {
    if ($ws < 5)
      $wr_s = 2.0*$ws;
    else
      $wr_s = 10.0;

    $wd_s = $wd + 60.0*$DEGRAD;
    $x1 = $x2 + intval($wr_s*sin($wd_s) + 0.5);
    $y1 = $y2 - intval($wr_s*cos($wd_s) + 0.5);

    if ($ws >= 25) {
      $WR -= 2.5;
      $x3 = $xs + intval($WR*sin($wd) + 0.5);
      $y3 = $ys - intval($WR*cos($wd) + 0.5);
      ImageFilledPolygon($im, array($x1, $y1, $x2, $y2, $x3, $y3), 3, $color_wd);

      $ws -= 25.0;
      $x2 = $x3;
      $y2 = $y3;
    }
    else {
      ImageLine($im, $x1, $y1, $x2, $y2, $color_wd);
      $ws -= 5.0;
      $WR -= 2.5;
      $x2 = $xs + intval($WR*sin($wd) + 0.5);
      $y2 = $ys - intval($WR*cos($wd) + 0.5);
    }
  }
  return;
}

//
//  Header
//
Header("HTTP/1.0 200 OK\n");
Header("Server: Netscape-Enterprise/3.0\n");
//Header("Content-Type: text");
Header("Content-Type: image/png");

//
//  사용자 입력사항
//
$font_size = 3;
$size = 100;

$tm = $_REQUEST["tm"];
$stn_id = $_REQUEST["stn"];
$disp = $_REQUEST["disp"];

if ($tm == "" || strlen($tm) < 10)
{
  $nt = intval(time()/(3*60*60)) * (3*60*60);
  $nt -= 9*60*60;
}
else
  $nt = mktime(substr($tm,8,2),substr($tm,10,2),0,substr($tm,4,2),substr($tm,6,2),substr($tm,0,4));

$tm  = date("YmdHi",$nt);
$tm0 = date("YmdHi",$nt-6*60*60);

// 2. DB 연결
$mode_login = 2;  // AFS
$login_php = "../../include/tb_login.php";
require( $login_php );
$dbconn = TB_Login($mode_login);


$ntime = 36;
$nheight = 20;
//
//  이미지 영역
//
$GX = 1300;
$GY = 850;
$im = ImageCreate($GX, $GY);
$color_img_bg = ImageColorAllocate($im, 254, 254, 254);
$color_img_fg = ImageColorAllocate($im,  150,  150,  150);
$color_img_red  = ImageColorAllocate($im, 253,   0,   0);
$color_img_blue = ImageColorAllocate($im,   0,   0, 254);
$color_line  = ImageColorAllocate($im,   0,   0,   0);

$color_style1 = array($color_img_blue, $color_img_blue, $color_img_blue, IMG_COLOR_TRANSPARENT, IMG_COLOR_TRANSPARENT);
$color_style2 = array($color_img_red, $color_img_red, $color_img_red, IMG_COLOR_TRANSPARENT, IMG_COLOR_TRANSPARENT);
$color_style3 = array($color_img_fg, $color_img_fg, $color_img_fg, IMG_COLOR_TRANSPARENT, IMG_COLOR_TRANSPARENT);

ImageSetStyle($im, $color_style3);

$color_file = "/home/fct/REF/COLOR/color_wpf.rgb";
$i = 0;
$fp = fopen($color_file, "r");
while($b = fscanf($fp, "%d %d %d %f", $R, $G, $B, $v1)) {
  $color_lvl[$i] = ImageColorAllocate($im, $R, $G, $B);
  $data_lvl[$i] = $v1;
  $i++;
}
fclose($fp);

for ($i=0; $i<=$ntime+1; $i++) {
  ImageLine($im, 60+30*$i, $GY-40*$nheight-20, 60+30*$i, $GY-20, IMG_COLOR_STYLED);
  if ($i%6 == 0) ImageString($im, 2, 30+15+30*($i+1), $GY-20, date("H:i",$nt-10*60*$i+9*60*60), $color_line);
}

for ($j=0; $j<=$nheight; $j++) {
  ImageLine($im, 60, $GY-20-40*$j, 60+30*($ntime+1), $GY-20-40*$j, IMG_COLOR_STYLED);
  ImageString($im, 2, 20, 20+40*$j, sprintf("%.1fkm", 0.5*($nheight-$j)), $color_line);
}

// 범례 표시
$dy = ($nheight*40)/count($color_lvl);
for($k = 0; $k < count($color_lvl); $k++) {
  $y = $GY - $dy*$k - 20;
  ImageFilledRectangle($im, 60+45+30*($ntime+1), $y, 60+60+30*($ntime+1), $y-$dy, $color_lvl[$k]);
  ImageString($im, 2, 60+65+30*($ntime+1), $y-8, $data_lvl[$k], $color_line);
}
ImageString($im, 2, 60+65+30*($ntime+1), $GY-($nheight*40)-30, "(kt)", $color_line);
ImageRectangle($im, 60+45+30*($ntime+1), $GY-20, 60+60+30*($ntime+1), $GY-($nheight*40)-20, $color_line);


/////////////////////////////////////////////////////////////////////////////////////////
// WIND_PROFILER 처리 (UPP_TEMP, TAC, BUFR 지점은 제외하고)
/////////////////////////////////////////////////////////////////////////////////////////
//echo "# YYMMDDHHMI   STN          LON            LAT      PA      GH      TA      TD      WD      WS FLAG\n";
//echo "#        UTC    ID          deg            deg     hPa       m       C       C  degree     m/s 123456789012\n";

$sz  = "
    select stn_sp, case stn_ko when NULL then stn_en else stn_ko end as stn_ko
    from stn_wpf
    where tm_st <= to_date(:tm,'yyyymmddhh24mi')
      and tm_ed > to_date(:tm,'yyyymmddhh24mi')
      and stn_id = :stn_id";

$stmt = odbc_prepare($dbconn, $sz);
$exec = odbc_execute($stmt, array($tm0,$tm,$stn_id));

while ($rs = odbc_fetch_array($stmt)) { 
  $stn_name = $rs['STN_KO'];
  if ($rs['STN_SP'] == 'K') {
    $sz  = "
    select to_char(tm,'yyyymmddhh24mi') tm, stn_id, ht, wd, ws, 'L' as typ
    from comis.wpf_kma_ul_wind       
    where tm between to_date(:tm,'yyyymmddhh24mi') and to_date(:tm,'yyyymmddhh24mi')
      and qc = 1
      and stn_id = :stn_id

    union
    select to_char(tm,'yyyymmddhh24mi') tm, stn_id, ht, wd, ws, 'H' as typ 
    from comis.wpf_kma_uh_wind       
    where tm between to_date(:tm,'yyyymmddhh24mi') and to_date(:tm,'yyyymmddhh24mi')
      and qc = 1
      and stn_id = :stn_id

    ORDER BY stn_id ASC, tm ASC, ht ASC, typ DESC ";
    $stmt = odbc_prepare($dbconn, $sz);
    $exec = odbc_execute($stmt, array($tm0,$tm,$stn_id,$tm0,$tm,$stn_id));

    $pre_ht = -999;
    while ($rs = odbc_fetch_array($stmt)) { 
      if ($rs['WD'] != -999 && $rs['WS'] != -999) {
        if ($pre_ht == $rs['HT']) continue;
        if ($pre_ht != -999 && abs($rs['HT'] - $pre_ht) < 200) continue;
        $nt2 = mktime(substr($rs['TM'],8,2),substr($rs['TM'],10,2),0,substr($rs['TM'],4,2),substr($rs['TM'],6,2),substr($rs['TM'],0,4));
        $color1 = $color_lvl[count($data_lvl)-1];
        for($i = 0; $i < count($data_lvl)-1; $i++) {
          if($rs['WS']*2 <= $data_lvl[$i]) {
            $color1 = $color_lvl[$i];
            break;
          }
        }
        gts_upp_wd($im, 60+30+($nt-$nt2)/60*3, $GY-($rs['HT']/100*8)-20, $rs['WD'], $rs['WS'], $color1);
        //printf("%s %5d ", $rs['TM'], $rs['STN_ID']);
        //printf("%7.1f %7.1f %7.1f %s\n", $rs['WD'], $rs['WS'], $rs['HT'], $rs['TYP']);
        $pre_ht = $rs['HT'];
      }
    }
  }
  else {
    $sz  = "
    select to_char(tm,'yyyymmddhh24mi') tm, stn_id, h as ht, u, v, 'J' as typ 
    from comis.jma_wpf       
    where tm between to_date(:tm,'yyyymmddhh24mi') and to_date(:tm,'yyyymmddhh24mi')
      and stn_id = :stn_id

    ORDER BY stn_id ASC, tm ASC, ht ASC, typ DESC ";
    $stmt = odbc_prepare($dbconn, $sz);
    $exec = odbc_execute($stmt, array($tm0,$tm,$stn_id));

    $pre_ht = -999;
    while ($rs = odbc_fetch_array($stmt)) { 
      if ($rs['U'] != -999 && $rs['V'] != -999) {
        if ($pre_ht == $rs['HT']) continue;

        $rs['WD'] = 180./3.141592 * atan($rs['U']/$rs['V']);
        if ($rs['V'] > 0.0) $rs['WD'] = $rs['WD'] + 180;
        if ($rs['V'] < 0.0 && $rs['U'] >= 0.0) $rs['WD'] = $rs['WD'] + 360;
        if ($rs['V'] == 0.0 && $rs['U'] > 0.0) $rs['WD'] = 270.;
        if ($rs['V'] == 0.0 && $rs['U'] < 0.0) $rs['WD'] = 90.;
        if ($rs['WD'] > 360.0) $rs['WD'] -= 360.;
        if ($rs['WD'] > -999.0 && $rs['WD'] < 0.0) $rs['WD'] += 360.;
        $rs['WS'] = sqrt($rs['U']*$rs['U'] + $rs['V']*$rs['V']);

        $nt2 = mktime(substr($rs['TM'],8,2),substr($rs['TM'],10,2),0,substr($rs['TM'],4,2),substr($rs['TM'],6,2),substr($rs['TM'],0,4));
        $color1 = $color_lvl[count($data_lvl)-1];
        for($i = 0; $i < count($data_lvl)-1; $i++) {
          if($rs['WS']*2 <= $data_lvl[$i]) {
            $color1 = $color_lvl[$i];
            break;
          }
        }
        gts_upp_wd($im, 60+30+($nt-$nt2)/60*3, $GY-($rs['HT']/100*8)-20, $rs['WD'], $rs['WS'], $color1);
        //printf("%s %5d ", $rs['TM'], $rs['STN_ID']);
        //printf("%7.1f %7.1f %7.1f %s\n", $rs['WD'], $rs['WS'], $rs['HT'], $rs['TYP']);
        $pre_ht = $rs['HT'];
      }
    }
  }
}

// 7. 종료
odbc_close($dbconn);
//gts_upp_wd($im, $wd_x, $pa_y2, $stn_wd, $stn_ws, $color_line);

// 제목 표시
//ImageFilledRectangle($im, 0, 0, $GX, 20, $color_img_bg);
$txt = "STN_ID : ".$stn_id." (".$stn_name.") ".date("Y.m.d.H:i",$nt+9*60*60);
ImageTTFText($im, 10, 0, 16, 12, $color_line, "/usr/share/fonts/korean/TrueType/gulim.ttf", iconv("EUC-KR","UTF-8",$txt)); 
//ImageString($im, 5, 20, 2, $txt, $color_line);

//
//  이미지 전송
//
ImagePng($im);
ImageDestroy($im);

?>
