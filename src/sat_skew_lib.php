<?

$mode = $_REQUEST["mode"];

if(empty($mode) && $mode != "0") {
  printf("###error");
  return;
}

$tm_ef = $_REQUEST["tm_ef"];
$tm_fc = $_REQUEST["tm_fc"];
$save = $_REQUEST["save"];
$mdl = $_REQUEST["mdl"];
$lat = $_REQUEST["lat"];
$lon = $_REQUEST["lon"];
$stn_id = $_REQUEST["stn_id"];
$sat = $_REQUEST["sat"];
$cht_mode = $_REQUEST["cht_mode"];

Header("Content-Type: text/plain");

// 시간 정보 조회(최신 수치모델 발표 시각)
if ($mode == "0") {

  $itv = 12;
  $nt = time();
  $nt = intval($nt / ($itv * 60 * 60)) * $itv * 60 * 60;

  for ($k = 0; $k < 4; $k++) {
    if ($mdl == "ECMWF_1H10G1") {
      if (nwp_file($nt, $nt, "ECMWF_1H10G1")) break;
      else $nt -= 12*60*60;
    }
    else {
      if (nwp_file($nt, $nt, "GDAPS")) break;
      else $nt -= 12*60*60;
    }
  }

  echo date("YmdHi",$nt);

}
// 일기도 이미지 파일명 조회
else if ($mode == "1") {

  $fn1 = substr($img_name, 1, strlen($img_name) - 1);
  $chk = 0;

  $nt_ef = mktime(substr($tm_ef,8,2),substr($tm_ef,10,2),0,substr($tm_ef,4,2),substr($tm_ef,6,2),substr($tm_ef,0,4)) - 9*60*60;
  $nt_fc = mktime(substr($tm_fc,8,2),substr($tm_fc,10,2),0,substr($tm_fc,4,2),substr($tm_fc,6,2),substr($tm_fc,0,4)) - 9*60*60;

  if ($sat == 1) {
    if (($nt_ef + 9*60*60) > (time() - 30*60)) {
      $src = "@no nwp data";
      echo $src;
      return;
    }
  }

  //$nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl);

  $img_dir1 = "/fct/www/ROOT/img/skew/";
  $img_dir2 = "/img/skew/";

  if ($sat == 2) {
    if ($stn_id != 0) $fname = "skew_sat_stn=".$stn_id."_".date("YmdHi",$nt_ef).".png";
    else $fname = "skew_sat_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_".date("YmdHi",$nt_ef).".png";
  }
  else if ($sat == 3) {
    if ($stn_id != 0) $fname = "skew_".$mdl."_stn=".$stn_id."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
    else $fname = "skew_".$mdl."_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
  }
  if (file_exists($img_dir1.$fname)) $flag = 1;

  if ($flag == 1 && $save == 1) {
    $src = $img_dir2.$fname;
  }
  else {
    if ($sat == 2) {
      $src = "/cgi-bin/url/nph-skew_img?tm=".date("YmdHi",$nt_ef)."&mode=2&flag=1&sat=".$sat;
    }
    else {
      $src = "/cgi-bin/url/nph-skew_img?model=".$mdl."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdHi",$nt_ef)."&mode=2&flag=1&sat=".$sat;
    }
    if ($stn_id != 0) $src .= "&stn_id=".$stn_id;
    else $src .= "&lat=".sprintf("%.2f",$lat)."&lon=".sprintf("%.2f",$lon);
  }

  echo $src;
}
// 지점 정보 조회
else if ($mode == "2") {
  // DB 연결
  $mode_login = 2;  // AFS
  $login_php = "../../include/tb_login.php";
  require( $login_php );
  $dbconn = TB_Login($mode_login);

  $sz = "
    select 'A' tp, stn_id, stn_ko
    from comis.stn_aws
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')
    order by stn_id";
  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm));
  while($rs = odbc_fetch_array($stmt)) {
    echo $rs[TP].",".$rs[STN_ID].",".$rs[STN_KO]."\n";
  }

  odbc_close($dbconn);
}



//=====================
// 수치모델 자료 존재여부 체크 //2019.12.05. 이창재
//=====================
function nwp_file($tm, $tm_ef, $model, $opt)
{
  $ft = sprintf("%03d", intval(($tm_ef - $tm)/(60*60)));

  $tm = date("YmdHi",$tm-9*60*60);

  $YY          = substr($tm, 0, 4);
  $MM          = substr($tm, 4, 2);
  $DD          = substr($tm, 6, 2);
  $HH          = substr($tm, 8, 2);
  $MI          = substr($tm, 10, 2);

  if ($opt != "radm") {
    if ($opt == "afs2") { //단일면
      if ($model == "GDAPS" || $model == "ISEN-UMGL")      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_v070_ergl_unis_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
      else if ($model == "ECMWF" || $model == "ECMWF_H")   $fname = "/C4N2_DATA/NWP/ECMW/".$YY.$MM."/".$DD."/e025_v025_nhem_h".$ft.".".$tm.".gb1";
      else if ($model == "KIM"   || $model == "GDAPS_KIM") $fname = "/ARCV/RAWD/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/".$HH."/ERLY/FCST/post/sfc.ft".$ft.".nc";
      else if ($model == "ECMWF_1H10G1")                   $fname = "/C4N2_DATA/NWP/ECMW/".$YY.$MM."/".$DD."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
    }
    else {
      if ($model == "GDAPS" || $model == "ISEN-UMGL")      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
      else if ($model == "ECMWF" || $model == "ECMWF_H")   $fname = "/C4N2_DATA/NWP/ECMW/".$YY.$MM."/".$DD."/e025_v025_nhem_h".$ft.".".$tm.".gb1";
      else if ($model == "KIM"   || $model == "GDAPS_KIM") $fname = "/ARCV/RAWD/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/".$HH."/ERLY/FCST/post/prs.ft".$ft.".nc";
      else if ($model == "ECMWF_1H10G1")                   $fname = "/C4N2_DATA/NWP/ECMW/".$YY.$MM."/".$DD."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
    }
  }
  else {
    if ($model == "GDAPS")                             $fname = "/C4N2_DATA/NWP/APPM/".$YY.$MM."/".$DD."/RDTB_gdps_gkompsat2_".$YY.$MM.$DD.$HH."_f".$ft.".dat";
    else if ($model == "KIM" || $model == "GDAPS_KIM") $fname = "/C4N2_DATA/NWP/APPM/".$YY.$MM."/".$DD."/RDTB_kimgdps_gkompsat2_".$YY.$MM.$DD.$HH."_f".$ft.".dat";
  }

  if (file_exists($fname)) {
    return 1;
  }
  else {
    return 0;
  }
}
?>