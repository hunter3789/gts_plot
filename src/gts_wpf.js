/*
  �ϱ⵵ �м�-�ܿ����� JS(vanilla, without jquery)
  �ۼ���: ��â��(2020.10.29)
*/
var tm_ana;
var stn_id;
var host = 'http://' + location.hostname + '/';
//document.addEventListener('load', onLoad(), false);

// ù ����(ȭ�� �ε� ��)
function onLoad(opt) {
  fnInit(opt);
  fnBodyResize();
}

function fnInit(opt) {
  var tm = opt.split(',')[0];
  stn_id = opt.split(',')[1];

  if (tm != "0") {
    document.getElementById("tm").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_ana = tm;
    doSubmit();
  }
  else tm_init(0);
}

// �ڷ� ��ȸ
function doSubmit() {
  var tm = tm_ana;
  var YY = tm.substring(0,4);
  var MM = tm.substring(4,6);
  var DD = tm.substring(6,8);
  var HH = tm.substring(8,10);
  var MI = tm.substring(10,12);
  var date = new Date(YY, MM-1, DD, HH, MI);
  date.setTime(date.getTime() - 9*60*60*1000);
  var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

  document.getElementById('wpf').src = host + "/gts/gts_wpf_img.php?tm=" + tm + "&stn=" + stn_id;
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
  var MI = parseInt(now.getMinutes()/10)*10;
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