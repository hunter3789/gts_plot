<?
//putenv("NLS_LANG=KOREAN_KOREA.KO16MSWIN949");
//putenv("NLS_LANG=AMERICAN_AMERICA.KO16MSWIN949");

$mode = $_REQUEST["mode"];

if(empty($mode) && $mode != "0") {
  printf("###error");
  return;
}

$tm = $_REQUEST["tm"];
$ip = $_REQUEST["ip"];
$port = $_REQUEST["port"];
$chnnl_no = $_REQUEST["chnnl_no"];

Header("Content-Type: text/plain");

// ----- COMIS-4
$url = "http://172.20.134.176/gts/cctv_db.php?mode=".$mode."&chnnl_no=".$chnnl_no."&ip=".$ip."&port=".$port;

$fp = fopen($url,"r");
if ($fp) {
  while (!feof($fp)) {
    $str = fgets($fp, 2048);
    echo $str;
  }
  fclose($fp);
}
// ----- COMIS-4

// COMIS-5 전환 시 변경 필요
/*
// 시간 정보 조회(최신 수치모델 발표 시각)
if ($mode == "0") {

  $itv = 12;
  $nt = time();
  $nt = intval($nt / ($itv * 60 * 60)) * $itv * 60 * 60;

  echo date("YmdHi",$nt);
}
// cctv 지점정보 목록 조회
if ($mode == "1") {
  // DB 연결
  $mode_login = 2;  // AFS
  $login_php = "../../include/tb_login.php";
  require( $login_php );
  $dbconn = TB_Login($mode_login);

  $sz = "
    select eqp_nm, chnnl_no, svr_ip, svr_port, lat, lon, agency_dtl_info from cctv_stn_info
    order by disp_zoom_lvl
  ";

  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt);
  while($rs = odbc_fetch_array($stmt)) {
    $name = str_replace(",", "·", $rs[EQP_NM]);
    $name = str_replace("\n", "", $name);
    echo $name.",".$rs[CHNNL_NO].",".$rs[SVR_IP].",".$rs[SVR_PORT].",".$rs[LAT].",".$rs[LON].",".$rs[AGENCY_DTL_INFO]."\n";
  }

  odbc_close($dbconn);
}
// cctv 지점명 조회
else if ($mode == "2") {
  // DB 연결
  $mode_login = 2;  // AFS
  $login_php = "../../include/tb_login.php";
  require( $login_php );
  $dbconn = TB_Login($mode_login);

  $sz = "
    select eqp_nm, chnnl_no, svr_ip, svr_port, lat, lon, agency_dtl_info, eqp_loc from cctv_stn_info
    where svr_ip = :svr_ip and svr_port = :svr_port and chnnl_no = :chnnl_no
  ";

  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($ip, $port, $chnnl_no));
  while($rs = odbc_fetch_array($stmt)) {
    $name = str_replace(",", "·", $rs[EQP_NM]);
    $name = str_replace("\n", "", $name);
    echo $name.",".$rs[CHNNL_NO].",rstp://".$rs[SVR_IP].":".$rs[SVR_PORT]."/".$rs[CHNNL_NO].",".$rs[EQP_LOC].",".$rs[AGENCY_DTL_INFO];
  }

  odbc_close($dbconn);
}
*/
?>