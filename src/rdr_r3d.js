/*
  �ϱ⵵ �м�-�ܿ����� JS(vanilla, without jquery)
  �ۼ���: ��â��(2020.10.29)
*/
var tm_ana;
var x1, y1, x2, y2;
var click_count = 0;
//document.addEventListener('load', onLoad(), false);

// ù ����(ȭ�� �ε� ��)
function onLoad(opt) {
  fnInit(opt);
  fnBodyResize();
}

function fnInit(opt) {
  var tm = opt.split(',')[0];

  var point = {};
  point.lat = parseFloat(opt.split(',')[1]);
  point.lon = parseFloat(opt.split(',')[2]);
  point = pixel_to_LatLon_lamc(point, 0);
  x1 = point.x; y1 = point.y;

  point.lat = parseFloat(opt.split(',')[3]);
  point.lon = parseFloat(opt.split(',')[4]);
  point = pixel_to_LatLon_lamc(point, 0);
  x2 = point.x; y2 = point.y;

  if (tm != "0") {
    document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_ana = tm;
    doSubmit();
  }
  else tm_init(0);
}

// �ڷ� ��ȸ
function doSubmit() {
  var err_point = 0;
  if (x1 < 0 || x1 > 1024 || y1 < 0 || y1 > 1024) {
    err_point++;
  }
  if (x2 < 0 || x2 > 1024 || y2 < 0 || y2 > 1024) {
    err_point++;
  }

  if (x1 < 0) x1 = 0;
  else if (x1 > 1024) x1 = 1024;

  if (y1 < 0) y1 = 0;
  else if (y1 > 1024) y1 = 1024;

  if (x2 < 0) x2 = 0;
  else if (x2 > 1024) x2 = 1024;

  if (y2 < 0) y2 = 0;
  else if (y2 > 1024) y2 = 1024;

  if (err_point == 2) {
    alert('�� ������ ��� ���̴� ������ ������ϴ�.');
  }

  document.getElementById('rdr_map').src = "http://rdr.kma.go.kr/cgi-bin/rdr/nph-rdr_cmp_img?&tm=" + tm_ana + "&cmp=HSP&qcd=HSL&obs=ECHD&map=HR&xp=512&yp=512&lon=&lat=&zoom=1&size=495&title=1&legend=1&lonlat=0&gov=KMA&x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2;

  var src = "";
  // �ٶ�
  if (document.getElementById("layer01").checked) src += "&barb=1";
  // ����
  if (document.getElementById("layer02").checked) src += "&gc=T";
  
  document.getElementById('r3d_img1').src = "http://rdr.kma.go.kr/cgi-bin/rdr/nph-rdr_r3d_rhi_img?&tm=" + tm_ana + "&qcd=EXT&obs=ECHO&vol=RN&x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2 + "&ht_max=16&z_resol=400&size_y=300&ta=0:-10:-20&barb=0&gc=&gc_itv=0" + src;
  document.getElementById('r3d_img2').src = "http://rdr.kma.go.kr/cgi-bin/rdr/nph-rdr_r3d_rhi_img?&tm=" + tm_ana + "&qcd=EXT&obs=ECHO&vol=HCI&x1=" + x1 + "&y1=" + y1 + "&x2=" + x2 + "&y2=" + y2 + "&ht_max=16&z_resol=400&size_y=300&ta=0:-10:-20&barb=0&gc=&gc_itv=0" + src;
}

// �ܸ� ��ġ Ŭ��
function fnClickImg() {
  //console.log(event);
  var LEG_pixel = 35;     // ���� ��(pixel)
  var TITLE_pixel = 20;   // ���� ��(pixel)
  var img_NI = document.getElementById('rdr_map').width - LEG_pixel;
  var img_NJ = document.getElementById('rdr_map').height - TITLE_pixel;
  var img_OJ = TITLE_pixel;  // ����̹����� ���� ��(pixel)
  var xx  = event.pageX - document.getElementById('rdr_map').getBoundingClientRect().left;
  var yy  = event.pageY - document.getElementById('rdr_map').getBoundingClientRect().top;
  if (yy < img_OJ || xx > img_NI) {
    alert('���̴� �̹��� �� ������ Ŭ�����ּ���.');
    return;
  }
  yy = img_NJ - (yy - img_OJ);

  xx = (parseFloat(xx) - 0.5*img_NI)*parseFloat(1024/(img_NI));
  yy = (parseFloat(yy) - 0.5*img_NJ)*parseFloat(1024/(img_NJ));


  if (click_count == 0) {
    click_count++;
    x1 = 512 + xx;
    y1 = 512 + yy;
  }
  else {
    click_count = 0;
    x2 = 512 + xx;
    y2 = 512 + yy;
  }

  //console.log(parseFloat(xx.toFixed(1)) + 512, parseFloat(yy.toFixed(1)) + 512);
  if (click_count == 0) {
    doSubmit();
  }
}

// â ũ�� ���濡 ���� �ϱ⵵ ǥ��� ũ�� ����
function fnBodyResize() {
  var width  = window.innerWidth - 5;
  var height = window.innerHeight - 55;
  document.getElementById('body').style.width = parseInt(width) + "px";
  document.getElementById('body').style.height = parseInt(height) + "px";
}

// ******�ð� ó��
// �޷�(popupCalendar.js���� callback)
function calPress() {
  var tm = targetId.value;
  tm_ana = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
  console.log("tm :" + tm);
  doSubmit();
}

//  ��ǥ�ð� �Է� �� ����()
function tm_input() {
  var tm = document.getElementById("tm").value;

  if (event.keyCode == 13) {
      if (tm.length != 16) {
          alert("�ð� �Է��� Ʋ�Ƚ��ϴ�. (��.��.��.��:��)");
          tm = tm_ana;
          document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          return;
      }else if (tm.charAt(4) != "." || tm.charAt(7) != "." || tm.charAt(10) != "." || tm.charAt(13) != ":") {
          alert("�ð� �Է� ����� Ʋ�Ƚ��ϴ�. (��.��.��.��:��)");
          tm = tm_ana;
          document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          return;
      }else {
          var YY = tm.substring(0,4);
          var MM = tm.substring(5,7);
          var DD = tm.substring(8,10);
          var HH = tm.substring(11,13);
          var MI = tm.substring(14,16);

          err = 0;
          if (YY < 1990 || YY > 2100) err = 1;
          else if (MM < 1 || MM > 12) err = 2;
          else if (DD < 1 || DD > 31) err = 3;
          else if (HH < 0 || HH > 24) err = 4;
          else if (MI < 0 || MI > 60) err = 5;

          if (err > 0)
          {
            if      (err == 1) alert("�⵵�� Ʋ�ǽ��ϴ�.(" + YY + ")");
            else if (err == 2) alert("���� Ʋ�Ƚ��ϴ�.(" + MM + ")");
            else if (err == 3) alert("���� Ʋ�Ƚ��ϴ�.(" + DD + ")");
            else if (err == 4) alert("�ð��� Ʋ�Ƚ��ϴ�.(" + HH + ")");
            else if (err == 5) alert("���� Ʋ�Ƚ��ϴ�.(" + MI + ")");

            tm = tm_ana;
            document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            return;
          }
      }

      tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
      document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_ana = tm;
      console.log("tm :" + tm);
      doSubmit();
  }else if (event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 58) {
      event.returnValue = true;
  }else if (event.keyCode >= 48 && event.keyCode <= 57) {
      event.returnValue = true;
  }else {
      event.returnValue = false;
  }
}

// �ֱٽð�(mode = 0:ù �ε� ��)
function tm_init(mode) {
  var now = new Date();
  var MI = parseInt(now.getMinutes()/5)*5;
  var tm = addZeros(now.getFullYear(),4) + addZeros(now.getMonth()+1,2) + addZeros(now.getDate(),2) + addZeros(now.getHours(),2) + addZeros(MI,2);

  document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
  tm_ana = tm;
  console.log("tm :" + tm);
  doSubmit();
}

// �ð� �̵�()
function tm_move(moving) {
  var n = moving.length - 1;
  var mode = moving.charAt(n);
  var value = parseInt(moving);

  var tm = document.getElementById("tm").value;
  var YY = tm.substring(0,4);
  var MM = tm.substring(5,7);
  var DD = tm.substring(8,10);
  var HH = tm.substring(11,13);
  var MI = tm.substring(14,16);
  var date = new Date(YY, MM-1, DD, HH, MI);
  if (mode == "H") date.setTime(date.getTime() + value*60*60*1000);
  else if (mode == "m") date.setTime(date.getTime() + value*60*1000);
  var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

  document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
  tm_ana = tm;
  console.log("tm :" + tm);
  doSubmit();
}

// ���� �ڸ��� ����
function addZeros(num, digit) {
  var zero = '';
  num = num.toString();
  if (num.length < digit) {
    for (var i=0; i < digit - num.length; i++) {
      zero += '0'
    }
  }
  return zero + num;
}

// ********�ΰ����
// ��.�浵 ��ȯ
var PI = Math.asin(1.0)*2.0;
var DEGRAD = PI/180.0;
var RADDEG = 180.0/PI;

var ea = 6378.138;              // ��ݰ� (km)
var f  = 1.0/298.257223563;     // ���� : (��ݰ�-�ܹݰ�)/��ݰ�
var ep = Math.sqrt(2.0*f - f*f);

// LCC
var slat1 = 30. * DEGRAD;
var slat2 = 60. * DEGRAD;
var olon = 126. * DEGRAD;
var olat = 38. * DEGRAD;

var m1 = Math.cos(slat1)/Math.sqrt(1.0-ep*ep*Math.sin(slat1)*Math.sin(slat1));
var m2 = Math.cos(slat2)/Math.sqrt(1.0-ep*ep*Math.sin(slat2)*Math.sin(slat2));
var t1 = Math.tan(PI*0.25 - slat1*0.5)/Math.pow((1.0-ep*Math.sin(slat1))/(1.0+ep*Math.sin(slat1)), ep*0.5);
var t2 = Math.tan(PI*0.25 - slat2*0.5)/Math.pow((1.0-ep*Math.sin(slat2))/(1.0+ep*Math.sin(slat2)), ep*0.5);

var sn = (Math.log(m1) - Math.log(m2))/(Math.log(t1) - Math.log(t2));
var sf = m1/(sn*Math.pow(t1, sn));

// �Ϲݱ�
var EPSLN = 1.0e-10;
var slon = 120. * DEGRAD;
var slat = 90. * DEGRAD;

var cons = Math.sqrt(Math.pow(1+ep,1+ep)*Math.pow(1-ep,1-ep));
if (Math.abs(Math.cos(slat)) > EPSLN) {
  var ms1 = Math.cos(slat) / Math.sqrt(1-ep*Math.sin(slat)*ep*Math.sin(slat)); 
  var x0 = 2*Math.atan(Math.tan(0.5*(PI/2 + slat) * Math.pow((1-Math.sin(slat)*ep)/(1+Math.sin(slat)*ep), ep*0.5))) - PI/2;
}

if (slat > 0) con = 1;
else con = -1;


// ���浵 ��ȯ(lcc)
function pixel_to_LatLon_lamc(point,opt) {
  var SX = 440;  var SY = 770;  var NX = 1024;  var NY = 1024;

  var grid = 1;
  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;

  xo = SX;
  yo = SY;

  var re = ea/grid;
  var t0 = Math.tan(PI*0.25 - olat*0.5)/Math.pow((1.0-ep*Math.sin(olat))/(1.0+ep*Math.sin(olat)), ep*0.5);
  var ro = re*sf*Math.pow(t0, sn);

  var result = new Object();

  if (opt == 0) {
    t0 = Math.tan(PI*0.25 - (point.lat)*DEGRAD*0.5)/Math.pow((1.0-ep*Math.sin((point.lat)*DEGRAD))/(1.0+ep*Math.sin((point.lat)*DEGRAD)), ep*0.5);
    var ra = re*sf*Math.pow(t0, sn);
    var theta = sn*((point.lon)*DEGRAD - olon);

    result.x = (ra*Math.sin(theta) + xo);
    result.y = (ro - ra*Math.cos(theta) + yo);
    console.log('lat:' + parseFloat(point.lat).toFixed(1) + ', lon:' + parseFloat(point.lon).toFixed(1) + ', x:' + result.x.toFixed(1) + ', y:' + result.y.toFixed(1));
  }
  else {
    var xn = X - xo;
    var yn = ro - Y + yo;
    var ra = Math.sqrt(xn*xn+yn*yn);
    if (sn < 0.0) ra = -1*ra;

    t0 = Math.pow(ra/(re*sf), 1.0/sn);
    var alat = PI*0.5 - 2.0*Math.atan(t0);

    for (i=0; i<5; i++) {
      alat = PI*0.5 - 2.0*Math.atan(t0*Math.pow((1.0-ep*Math.sin(alat))/(1.0+ep*Math.sin(alat)), ep*0.5));
    }

    var alon = Math.atan2(xn, yn)/sn + olon;

    result.lat = alat*RADDEG;
    result.lon = alon*RADDEG;

    //console.log('lat:' + result.lat + ', lon:' + result.lon);
  }

  return result;
}
