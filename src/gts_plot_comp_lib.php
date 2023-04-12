<?

$mode = $_REQUEST["mode"];

if(empty($mode) && $mode != "0") {
  printf("###error");
  return;
}

$tm = $_REQUEST["tm"];
$mdl = $_REQUEST["mdl"]; if ($mdl == "") $mdl = "GDAPS";
$area = $_REQUEST["area"]; 

Header("Content-Type: text/plain");

// 시간 정보 조회(최신 수치모델 발표 시각)
if ($mode == "0") {

  $itv = 12;
  $nt = time();
  $nt = intval($nt / ($itv * 60 * 60)) * $itv * 60 * 60;

  for ($k = 0; $k < 4; $k++) {
    if (nwp_file($nt, $nt, $mdl)) break;
    else $nt -= 12*60*60;
  }

  echo date("YmdHi",$nt);
}
// 수치모델 발표 시각 정상여부 조회
if ($mode == "1") {

  $itv = 12;
  $nt = mktime(substr($tm,8,2),0,0,substr($tm,4,2),substr($tm,6,2),substr($tm,0,4)) + 9*60*60;

  for ($k = 0; $k < 4; $k++) {
    if (nwp_file($nt, $nt, $mdl)) break;
    else $nt -= 12*60*60;
  }

  echo date("YmdHi",$nt);
}
// 지점명(STN_KO) 조회
else if ($mode == "2") {
  // DB 연결
  $mode_login = 2;  // AFS
  $login_php = "../../include/tb_login.php";
  require( $login_php );
  $dbconn = TB_Login($mode_login);

  $lat1 = -90;
  $lat2 = 90;
  $lon1 = -180;
  $lon2 = 180;

  $sz = "
    select 'S' tp, stn_id, stn_ko
    from stn_gts
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')
    and isn = 0
    and lon between :lon1 and :lon2 
    and lat between :lat1 and :lat2 
    order by stn_id";

  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm,$lon1,$lon2,$lat1,$lat2));
  while($rs = odbc_fetch_array($stmt)) {
    echo $rs[TP].",".$rs[STN_ID].",".$rs[STN_KO]."\n";
  }

  $sz = "
    select 'A' tp, stn_id, stn_ko, lat, lon
    from comis.stn_aws
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')
    order by stn_id";
  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm));
  while($rs = odbc_fetch_array($stmt)) {
    echo $rs[TP].",".$rs[STN_ID].",".$rs[STN_KO].",".$rs[LAT].",".$rs[LON]."\n";
  }

  $sz = "
    select 'J' tp, stn_id, stn_en
    from comis.stn_amedas
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')
    order by stn_id";
  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm));
  while ($rs = odbc_fetch_array($stmt)) {
    echo $rs[TP].",".$rs[STN_ID].",".$rs[STN_EN]."\n";
  }

  $sz = "
    select stn_id, stn_ko
    from comis.stn_buoy
    where tm_ed > to_date(:tm,'yyyymmddhh24mi') and tm_st <= to_date(:tm,'yyyymmddhh24mi')
    union all

    select stn_id, stn_ko
    from comis.stn_buoy_drift
    where tm_ed > to_date(:tm,'yyyymmddhh24mi') and tm_st <= to_date(:tm,'yyyymmddhh24mi')
    union all

    select stn_id, stn_ko
    from comis.stn_buoy_ext
    where tm_ed > to_date(:tm,'yyyymmddhh24mi') and tm_st <= to_date(:tm,'yyyymmddhh24mi')
    union all

    select stn_id, stn_ko
    from comis.stn_nori_koga
    where tm_ed > to_date(:tm,'yyyymmddhh24mi') and tm_st <= to_date(:tm,'yyyymmddhh24mi')
    union all

    select 1612501 stn_id, '이어도' stn_ko
    from comis.ext_kordi_ieodo 
    where tm = to_date(:tm,'yyyymmddhh24mi')
    union all

    select 1112501 stn_id, '가거초' stn_ko
    from comis.ext_kordi_gageocho 
    where tm = to_date(:tm,'yyyymmddhh24mi')
    union all

    select 1012501 stn_id, '소청초' stn_ko
    from comis.ext_kordi_socheongcho 
    where tm = to_date(:tm,'yyyymmddhh24mi')";
  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm,$tm,$tm,$tm,$tm,$tm,$tm,$tm,$tm,$tm));
  while ($rs = odbc_fetch_array($stmt)) {
    echo "K,".$rs[STN_ID].",".$rs[STN_KO]."\n";
  }

  $sz = "
    select stn_id, stn_ko
    from comis.stn_upp
    where tm_ed > to_date(:tm,'yyyymmddhh24mi') and tm_st <= to_date(:tm,'yyyymmddhh24mi')
    union all

    select stn_id, stn_ko
    from comis.stn_kship
    where tm_ed > to_date(:tm,'yyyymmddhh24mi') and tm_st <= to_date(:tm,'yyyymmddhh24mi')";
  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm,$tm,$tm,$tm,$tm));
  while ($rs = odbc_fetch_array($stmt)) {
    echo "K,".$rs[STN_ID].",".$rs[STN_KO]."\n";
  }

  // 중국 환경기상관측망
  $sz = "
    select stn_cd as stn_id, stn_ko
    from stn_dst_cma
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')";

  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm));
  while ($rs = odbc_fetch_array($stmt)) {
    echo "DC,".$rs[STN_ID].",".$rs[STN_KO]."\n";
  }

  // 윈드프로파일러
  $sz = "
    select stn_id, case when stn_ko is NULL then stn_en else stn_ko end as stn_ko
    from stn_wpf
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')";

  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm));
  while ($rs = odbc_fetch_array($stmt)) {
    echo "W,".$rs[STN_ID].",".$rs[STN_KO]."\n";
  }

  odbc_close($dbconn);
}


//=====================
// 수치모델 자료 존재여부 체크 //2019.12.05. 이창재
//=====================
function nwp_file($tm, $tm_ef, $model, $opt)
{
  $nt = $tm;  
  $nt1 = mktime(0,0,0,6,7,2018) + 9*60*60;
  $nt2 = mktime(0,0,0,7,1,2016) + 9*60*60;
  $nt3 = mktime(0,0,0,6,1,2011) + 9*60*60;
  $ft = sprintf("%03d", intval(($tm_ef - $tm)/(60*60)));

  $tm = date("YmdHi",$tm-9*60*60);
  $YY          = substr($tm, 0, 4);
  $MM          = substr($tm, 4, 2);
  $DD          = substr($tm, 6, 2);
  $HH          = substr($tm, 8, 2);
  $MI          = substr($tm, 10, 2);

  if ($opt != 1) {
    if ($model == "GDAPS" || $model == "UM") {
      if ($nt >= $nt1) $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_v070_ergl_pres_h000.".$YY.$MM.$DD.$HH.".gb2";
      else if ($nt >= $nt2) $fname = "/ARCV/GRIB/MODL/GDPS/N768/".$YY.$MM."/".$DD."/g768_v070_ergl_pres_h000.".$YY.$MM.$DD.$HH.".gb2";
      else if ($nt >= $nt3) $fname = "/ARCV/GRIB/MODL/GDPS/N512/".$YY.$MM."/".$DD."/g512_v070_ergl_pres_h000.".$YY.$MM.$DD.$HH.".gb2";
      else $fname = "/ARCV/GRIB/MODL/GDPS/N320/".$YY.$MM."/".$DD."/g320_v050_ergl_pres_h000.".$YY.$MM.$DD.$HH.".gb2";
    }
    else if ($model == "ISEN-UMGL") {
      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/gdps_isen_".$YY.$MM.$DD.$HH."_000.grib2";
    }
    else if ($model == "ECMWF" || $model == "ECMWF_H") {
      $fname = "/C4N2_DATA/NWP/ECMW/".$YY.$MM."/".$DD."/e025_v025_nhem_h000.".$tm.".gb1";
    }
    else if ($model == "KIM"   || $model == "GDAPS_KIM" || $model == "KIMG") {
      $fname = "/ARCV/RAWD/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/".$HH."/ERLY/FCST/post/prs.ft000.nc";
    }
    else if ($model == "ECMWF_1H10G1") {
      $fname = "/C4N2_DATA/NWP/ECMW/".$YY.$MM."/".$DD."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
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