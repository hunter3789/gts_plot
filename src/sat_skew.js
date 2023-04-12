/*
  �ϱ⵵ �м�-�ܿ����� JS(vanilla, without jquery)
  �ۼ���: ��â��(2020.10.29)
*/
var tm_fc, tm_ana, lat, lon;
var ajaxNum    = 0;
var tm_st      = 0;  // Ÿ�ӹ��� ù��° �ð�
var host = 'http://' + location.hostname + '/';
var cht_mode, tm_itv, autoload = 1;
var stn_id = 0;
var nmax = 12, ani = 0, nload = 0;

var reg_arr = [
  {reg_name: "������", reg_id: ["11A0","11B1","11B2"], stn: []},
  {reg_name: "�泲��", reg_id: ["11H2"], stn: []},
  {reg_name: "��ϱ�", reg_id: ["11H1","11E0"], stn: []},
  {reg_name: "������", reg_id: ["11F2"], stn: []},
  {reg_name: "����",  reg_id: ["11F1"], stn: []},
  {reg_name: "�泲��", reg_id: ["11C2"], stn: []},
  {reg_name: "���",  reg_id: ["11C1"], stn: []},
  {reg_name: "������",  reg_id: ["11D1","11D2"], stn: []},
  {reg_name: "���ֵ�",  reg_id: ["11G0"], stn: []}
];

//document.addEventListener('load', onLoad(), false);

// ù ����(ȭ�� �ε� ��)
function onLoad(opt) {
  fnInit(opt);
  fnAnimate();
  fnInitStn();
  fnBodyResize();
}

// �ʱ� ����
function fnInit(opt) {
  tm_ana = opt.split(',')[0];
  lat  = opt.split(',')[1];
  lon  = opt.split(',')[2];

  if (tm_ana != "0") {
    var now = new Date();
    now.setTime(now.getTime() - 20*60*1000);
    var MI = parseInt(now.getMinutes()/10)*10;
    var tm = addZeros(now.getFullYear(),4) + addZeros(now.getMonth()+1,2) + addZeros(now.getDate(),2) + addZeros(now.getHours(),2) + addZeros(MI,2);

    var YY = tm.substring(0,4);
    var MM = tm.substring(4,6);
    var DD = tm.substring(6,8);
    var HH = tm.substring(8,10);
    var MI = tm.substring(10,12);
    var date = new Date(YY, MM-1, DD, HH, MI);

    var YY = tm_ana.substring(0,4);
    var MM = tm_ana.substring(4,6);
    var DD = tm_ana.substring(6,8);
    var HH = tm_ana.substring(8,10);
    var MI = tm_ana.substring(10,12);
    var date2 = new Date(YY, MM-1, DD, HH, MI);

    if (date2 > date) {
      document.getElementById("tm_ana").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_ana = tm;
    }
    else {
      document.getElementById("tm_ana").value = tm_ana.substring(0,4) + "." + tm_ana.substring(4,6) + "." + tm_ana.substring(6,8) + "." + tm_ana.substring(8,10) + ":" + tm_ana.substring(10,12);
    }
  }
  else tm_init(0, "ana");
}

// â ũ�� ���濡 ���� �ϱ⵵ ǥ��� ũ�� ����
function fnBodyResize() {
  var width  = window.innerWidth - 5;
  var height = window.innerHeight - 55;
  document.getElementById('skew_body').style.width = parseInt(width) + "px";
  document.getElementById('skew_body').style.height = parseInt(height) + "px";
}

// �ܿ����� ǥ��
function doSubmit() {
  var frame = 1;
  document.getElementById("loading").style.display = "block";
  document.getElementById("loadingStatus").style.display = "block";
  document.getElementById('loadingbar').style.minWidth = "0px";
  document.getElementById('loadingnum').innerText = "�ε� �����Ȳ(0%)";
  if (ani == 1) frame = document.getElementById("ani_frame").value;

  nload = 0;
  for (var i=0; i<frame; i++) {
    if (ani == 1) {
      var item = document.getElementById("skew_img"+parseInt(i+1));
    }

    if (document.getElementById("img"+parseInt(i+1)) == null) {
      var img = document.createElement("img");
      document.getElementById("skew_img"+parseInt(i+1)).appendChild(img);
      img.id = "img"+parseInt(i+1);
    }
    fnGetUrl(i+1);
  }
}

// API ȣ��
function fnGetUrl(frame) {

  var tm = tm_ana;
  if (ani == 1) {
    var YY = tm.toString().substring(0,4);
    var MM = tm.toString().substring(4,6);
    var DD = tm.toString().substring(6,8);
    var HH = tm.toString().substring(8,10);
    var MI = tm.toString().substring(10,12);
    var date_ana = new Date(YY, MM-1, DD, HH, MI);
    var date  = new Date;
    var nbar = document.getElementById("ani_frame").value;
    var itv  = document.getElementById("ani_itv").value;
    if (itv < 1) itv *= 100/60;
    date.setTime(date_ana.getTime() - itv*(nbar - frame)*60*60*1000);
    tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
  }

  if (stn_id > 0) {
    document.getElementById('lat').value = 0;
    document.getElementById('lon').value = 0;
  }
  else {
    document.getElementById('lat').value = parseFloat(lat).toFixed(1);
    document.getElementById('lon').value = parseFloat(lon).toFixed(1);
  }

  var url = host + "/gts/sat_skew_lib.php?mode=1&tm_ef=" + tm + "&save=1";// + document.getElementById('save').value;
  url += "&lat=" + lat + "&lon=" + lon + "&sat=2"; //"&mdl=" + document.getElementById('model').value + 
  if (stn_id != 0) url += "&stn_id=" + stn_id;
  console.log(url);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        if (l[0] == "@" || l.indexOf(".png") != -1) {
          if (l[0] != "@") {
            document.getElementById("nocht" + frame).style.display = 'none';
            if (document.getElementById("img" + frame) == null) {
              var img = document.createElement("img" + frame);
              document.getElementById("skew_img" + frame).appendChild(img);
              img.id = "img" + frame;
            }
            document.getElementById("img" + frame).src = host + l + "?timestamp=" + new Date().getTime();
          }
          else {
            document.getElementById("nocht" + frame).style.display = 'block';
            if (document.getElementById("img" + frame) != null) document.getElementById("skew_img" + frame).removeChild(document.getElementById("img"));
          }

          nload++;
          if (ani == 0) var nimg = 1;
          else var nimg = document.getElementById("ani_frame").value;
          document.getElementById('loadingbar').style.minWidth = parseFloat(nload/nimg*100).toFixed(1) + "%";
          document.getElementById('loadingnum').innerText = "�ε� �����Ȳ(" + parseFloat(nload/nimg*100).toFixed(1) + "%)";
          if (nload == nimg) {
            document.getElementById("loading").style.display = "none";
            document.getElementById("loadingStatus").style.display = "none";
          }

          if (l[0] != "@") console.log("img" + frame + ": " + host + l);
          else console.log("img" + frame + ": @no data");
        }
        else setTimeout(get_api_result, (frame-1)*10, l);
      });
    }
  };
  xhr.send();

  function get_api_result(l) {
    console.log(host + l);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", l, true);
    xhr.timeout = 60000;
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      if (line[0][0] != "@") {
        document.getElementById("nocht" + frame).style.display = 'none';
        if (document.getElementById("img" + frame) == null) {
          var img = document.createElement("img" + frame);
          document.getElementById("skew_img" + frame).appendChild(img);
          img.id = "img" + frame;
        }
        document.getElementById("img" + frame).src = host + line[0] + "?timestamp=" + new Date().getTime();
        console.log("img" + frame + ": " + host + line[0]);
      }
      else {
        if (document.getElementById("img" + frame) != null) document.getElementById("skew_img" + frame).removeChild(document.getElementById("img" + frame));
        document.getElementById("nocht" + frame).style.display = 'block';
      }

      nload++;
      if (ani == 0) var nimg = 1;
      else var nimg = document.getElementById("ani_frame").value;
      document.getElementById('loadingbar').style.minWidth = parseFloat(nload/nimg*100).toFixed(1) + "%";
      document.getElementById('loadingnum').innerText = "�ε� �����Ȳ(" + parseFloat(nload/nimg*100).toFixed(1) + "%)";
      if (nload == nimg) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    };
    xhr.ontimeout = function () {
      console.log('ajax timeout');
      nload++;
      if (ani == 0) var nimg = 1;
      else var nimg = document.getElementById("ani_frame").value;
      document.getElementById('loadingbar').style.minWidth = parseFloat(nload/nimg*100).toFixed(1) + "%";
      document.getElementById('loadingnum').innerText = "�ε� �����Ȳ(" + parseFloat(nload/nimg*100).toFixed(1) + "%)";
      if (nload == nimg) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.onerror = function () {
      console.log('ajax error');
      nload++;
      if (ani == 0) var nimg = 1;
      else var nimg = document.getElementById("ani_frame").value;
      document.getElementById('loadingbar').style.minWidth = parseFloat(nload/nimg*100).toFixed(1) + "%";
      document.getElementById('loadingnum').innerText = "�ε� �����Ȳ(" + parseFloat(nload/nimg*100).toFixed(1) + "%)";
      if (nload == nimg) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.send();
  }
}

// ******�ð� ó��
// �޷�(popupCalendar.js���� callback)
function calPress() {
  var tm = targetId.value;
  tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
  //console.log(targetId.name.toString().slice(2,targetId.name.length));

  var id = targetId.name.slice(targetId.name.indexOf("tm_")+3,targetId.name.length);
  console.log(targetId.name + ":" + tm);

  tm_ana = tm;
  if (ani == 1) fnTimeBar(0);
  doSubmit();
}

//  ��ǥ�ð� �Է� �� ����(type = ����)
function tm_input(type) {
  var tm = document.getElementById("tm_" + type).value;

  if (event.keyCode == 13) {
      if (tm.length != 16) {
          alert("�ð� �Է��� Ʋ�Ƚ��ϴ�. (��.��.��.��:��)");
          if (type == "ana") tm = tm_ana;
          else if (type == "fc")  tm = tm_fc;
          document.getElementById("tm_" + type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          return;
      }else if (tm.charAt(4) != "." || tm.charAt(7) != "." || tm.charAt(10) != "." || tm.charAt(13) != ":") {
          alert("�ð� �Է� ����� Ʋ�Ƚ��ϴ�. (��.��.��.��:��)");
          if (type == "ana") tm = tm_ana;
          else if (type == "fc")  tm = tm_fc;
          document.getElementById("tm_" + type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
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

            if (type == "ana") {
              tm = tm_ana;
              if (ani == 1) fnTimeBar(0);
            }
            else if (type == "fc")  tm = tm_fc;
            document.getElementById("tm_" + type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            doSubmit();
            return;
          }
      }

      tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
      document.getElementById("tm_"+type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      if (type == "ana") {
        tm_ana = tm;
        if (ani == 1) fnTimeBar(0);
      }
      else if (type == "fc")  tm_fc = tm;
      console.log("tm_" + type + ":" + tm);

      doSubmit();
  }else if (event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 58) {
      event.returnValue = true;
  }else if (event.keyCode >= 48 && event.keyCode <= 57) {
      event.returnValue = true;
  }else {
      event.returnValue = false;
  }
}

//  �ֱٽð�(mode = 0:ù �ε� �� / type = ����)
function tm_init(mode, type, callback) {
  if (type == "ana") {
    var now = new Date();
    now.setTime(now.getTime() - 20*60*1000);
    var MI = parseInt(now.getMinutes()/10)*10;
    var tm = addZeros(now.getFullYear(),4) + addZeros(now.getMonth()+1,2) + addZeros(now.getDate(),2) + addZeros(now.getHours(),2) + addZeros(MI,2);

    document.getElementById("tm_"+type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_ana = tm;
    console.log("tm_" + type + ":" + tm);
    if (ani == 1) fnTimeBar(0);
    if (mode != 0) doSubmit();
  }
  else if (type == "fc") {
    var url = host + "/gts/sat_skew_lib.php?mode=0";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      else {
        var line = xhr.responseText.split('\n');
        if (xhr.responseText.length <= 1 && line[0] == "") {
          return;
        }

        line.forEach(function(l) {
          if (l[0] == "#" || l.length <= 1) {
            return;
          }
          tm = l;
        });
      }

      document.getElementById("tm_"+type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_fc = tm;
      console.log("tm_" + type + ":" + tm);

      if (mode == 0) {
        tm_init(0, "ana");
      }
      fnTimeBar();
      doChtVal();
    };
    xhr.send();
  }
}

// �ð� �̵�(type)
function tm_move(moving, type) {
  var n = moving.length - 1;
  var mode = moving.charAt(n);
  var value = parseInt(moving);

  if (type == "fc") {
    var tm = document.getElementById("tm_fc").value;
    var YY = tm.substring(0,4);
    var MM = tm.substring(5,7);
    var DD = tm.substring(8,10);
    var HH = tm.substring(11,13);
    var MI = tm.substring(14,16);
    var date = new Date(YY, MM-1, DD, HH, MI);
    if (mode == "H") date.setTime(date.getTime() + value*60*60*1000);
    else if (mode == "m") date.setTime(date.getTime() + value*60*1000);
    var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
    document.getElementById("tm_fc").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_fc = tm;
    console.log("tm_fc" + ":" + tm);
    doSubmit();
  }
  else if (type == "ana") {
    var tm = document.getElementById("tm_ana").value;
    var YY = tm.substring(0,4);
    var MM = tm.substring(5,7);
    var DD = tm.substring(8,10);
    var HH = tm.substring(11,13);
    var MI = tm.substring(14,16);
    var date = new Date(YY, MM-1, DD, HH, MI);
    if (mode == "H") date.setTime(date.getTime() + value*60*60*1000);
    else if (mode == "m") date.setTime(date.getTime() + value*60*1000);
    var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
    document.getElementById("tm_ana").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_ana = tm;
    console.log("tm_ana" + ":" + tm);
    if (ani == 1) fnTimeBar(0);
    doSubmit();
  }
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

// Ű���带 ���� ��ȭ ����(opt- 0: keydown, 1: keyup)
function doKey(event, opt)
{
  if (opt == 0) {
    if (event.srcElement.attributes.class != undefined) {
      if (event.srcElement.attributes.class.value.indexOf("TimeBox") != -1) return -1;
      if (event.srcElement.attributes.class.value.indexOf("prevent-keydown") != -1) return -1;
    }

    if (document.getElementById("loading").style.display == "block") {
      return 0;
    }

    if (ani == 0) {
      var nimg = 1;
      return;
    }
    else var nimg = document.getElementById("ani_frame").value;

    if (nload == nimg) {
      if(event.keyCode == 37) {        // �� ȭ��ǥ
        tmbarLeft();
      }
      else if(event.keyCode == 39) {   // ���� ȭ��ǥ
        tmbarRight();
      }
    }

    if(event.keyCode == 116) {   // F5
      location.reload();
    }
  }

  return 0;
}

// ��ȭ ���
function fnAnimate() {
  if (ani == 0) {
    ani = 1;
    document.getElementById("ani").style.backgroundColor = "#aaffaa";
    document.getElementById("ani").value = " ��ȭ on ";
    document.getElementById("skew_ani").style.display = "block";
    fnBodyResize();
    fnTimeBar();
  }
  else {
    ani = 0;
    var frame = 1;
    document.getElementById("ani").style.backgroundColor = "#fff";
    document.getElementById("ani").value = " ��ȭ off ";
    document.getElementById("skew_ani").style.display = "none";
    fnBodyResize();
    tmbarClick("ani_tm" + frame);
  }
  doSubmit();
}

// Time Bar ����(mode - 0: doSubmit ���� X)
function fnTimeBar(mode)
{
  for (var i=0; i<nmax; i++) {
    if (i < document.getElementById("ani_frame").value) {
      document.getElementById("ani_tm" + parseInt(i+1)).style.display = "block";
      document.getElementById("space_tm" + parseInt(i+1)).style.display = "block";
    }
    else {
      document.getElementById("ani_tm" + parseInt(i+1)).style.display = "none";
      document.getElementById("space_tm" + parseInt(i+1)).style.display = "none";
    }
  }

  var nbar = document.getElementById("ani_frame").value;
  var itv  = document.getElementById("ani_itv").value;
  if (itv < 1) itv *= 100/60;

  var tm_value = tm_ana;
  var YY = tm_value.toString().substring(0,4);
  var MM = tm_value.toString().substring(4,6);
  var DD = tm_value.toString().substring(6,8);
  var HH = tm_value.toString().substring(8,10);
  var MI = tm_value.toString().substring(10,12);
  var date_ana = new Date(YY, MM-1, DD, HH, MI);
  var date  = new Date;
  var date2 = new Date;

  if (tm_st == 0) {
    date.setTime(date_ana.getTime() - itv*(nbar-1)*60*60*1000);
    tm_ana_st = date.getTime();
  }
  else {
    date.setTime(tm_ana_st);
  }

  if (date_ana.getTime() < date.getTime() || date_ana.getTime() >= date.getTime() + itv*nbar*60*60*1000)
  {
    date.setTime(date_ana.getTime() - itv*nbar*60*60*1000);
    tm_ana_st = date.getTime();
  }

  for (var i=0; i<document.getElementById("ani_frame").value; i++) {
    document.getElementById("ani_tm" + parseInt(i+1)).innerText = addZeros(date.getDate(),2) + "." + addZeros(date.getHours(),2) + ":" + addZeros(date.getMinutes(),2);
    //document.getElementById("ani_tm" + parseInt(i+1)).value = date.getTime();
    date2.setTime(date.getTime() - 9*60*60*1000);
    document.getElementById("ani_tm" + parseInt(i+1)).value = addZeros(date2.getFullYear(),4) + addZeros(date2.getMonth()+1,2) + addZeros(date2.getDate(),2) + addZeros(date2.getHours(),2) + addZeros(date2.getMinutes(),2);
    //console.log(document.getElementById("ani_tm" + parseInt(i+1)).value);

    if (date.getTime() == date_ana.getTime()) {
      document.getElementById("ani_tm" + parseInt(i+1)).style.backgroundColor = "#ffeeff";
    }
    else {
      document.getElementById("ani_tm" + parseInt(i+1)).style.backgroundColor = "#ffffff";
    }

    date.setTime(date.getTime() + itv*60*60*1000);
  }

  tmbarClick("ani_tm" + document.getElementById("ani_frame").value);
}

// ��ȭ Ÿ�ӹ� Ŭ��(mode - 1: ���� Ŭ��)
function tmbarClick(targetId, mode)
{
  if (targetId == 0) {
    for (var i=0; i<nmax; i++) {
      if (parseInt(i+1) == 1) {
        document.getElementById("skew_img" + parseInt(i+1)).style.display = "block";
        document.getElementById("ani_tm"  + parseInt(i+1)).style.backgroundColor = "#ffeeff";
      }
      else {
        document.getElementById("skew_img" + parseInt(i+1)).style.display = "none";
        document.getElementById("ani_tm"  + parseInt(i+1)).style.backgroundColor = "#ffffff";
      }
    }
  }
  else {
    var id = targetId.slice(targetId.indexOf("tm_ani")+"tm_ani".length+1,targetId.length);
    for (var i=0; i<nmax; i++) {
      if (parseInt(i+1) == id) {
        document.getElementById("skew_img" + parseInt(i+1)).style.display = "block";
        document.getElementById("ani_tm"  + parseInt(i+1)).style.backgroundColor = "#ffeeff";
        tm_ani = document.getElementById("ani_tm"  + parseInt(i+1)).value;
      }
      else {
        document.getElementById("skew_img" + parseInt(i+1)).style.display = "none";
        document.getElementById("ani_tm"  + parseInt(i+1)).style.backgroundColor = "#ffffff";
      }
    }
  }
  return 0;
}

// ��ȭ Ÿ�ӹ�(���� �ð� �̵�)
function tmbarLeft()
{
  for (var i=0; i<document.getElementById("ani_frame").value; i++) {
    if (document.getElementById("ani_tm" + parseInt(i+1)).value == tm_ani) {
      var frame = (i+1) - 1;
      if (frame < 1) frame = document.getElementById("ani_frame").value;
      break;
    }
  }

  tmbarClick("ani_tm" + frame);
}

// ��ȭ Ÿ�ӹ�(���� �ð� �̵�)
function tmbarRight()
{
  for (var i=0; i<document.getElementById("ani_frame").value; i++) {
    if (document.getElementById("ani_tm" + parseInt(i+1)).value == tm_ani) {
      var frame = (i+1) + 1;
      if (frame > document.getElementById("ani_frame").value) frame = 1;
      break;
    }
  }

  tmbarClick("ani_tm" + frame);
}

// �ð迭 ������ �ֿ����� �ɼ� ����
function fnInitStn() {
  var url = host + "/REF/INI/reg_sort.ini";
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        var d = l.split(',');
        for (var i=0; i<reg_arr.length; i++) {
          for (var j=0; j<reg_arr[i].reg_id.length; j++) {
            if (d[1].indexOf(reg_arr[i].reg_id[j]) != -1) {
              var n = reg_arr[i].stn.length;
              reg_arr[i].stn[n] = {};
              reg_arr[i].stn[n].stn_id = d[3];
              reg_arr[i].stn[n].stn_ko = d[2];
              break;
            }
          }
        }
      });
    }

    console.log(reg_arr);

    var select_element = document.createElement("select");
    select_element.setAttribute('onchange', 'fnStnList(this.value);');
    select_element.classList.add("text3");
    select_element.style.height = "20px";
    for (var i=0; i<reg_arr.length; i++) {
      var opt_element = document.createElement("option");
      opt_element.value = reg_arr[i].reg_name;
      opt_element.innerText = reg_arr[i].reg_name;
      select_element.appendChild(opt_element); 
    }
    document.getElementById("tms_stn1").appendChild(select_element); 

    var select_element = document.createElement("select");
    //select_element.setAttribute('onchange', 'stn_id = this.value; console.log(stn_id); doChtVal();');
    select_element.id = "select_stn";
    select_element.classList.add("text3");
    select_element.style.height = "20px";
    document.getElementById("tms_stn2").appendChild(select_element); 
    fnStnList(0);
  };
  xhr.send();
}

// �ð迭 ������ �ֿ����� �ɼ� ����2
function fnStnList(reg_name) {  
  var item = document.getElementById("select_stn");
  while (item.hasChildNodes()) {
    item.removeChild(item.childNodes[0]);
  }

  for (var i=0; i<reg_arr.length; i++) {
    if (reg_arr[i].reg_name == reg_name || (reg_name == 0 && i == 0)) {
      for (var j=0; j<reg_arr[i].stn.length; j++) {
        if (reg_arr[i].stn[j].stn_id == -999) continue;
        var opt_element = document.createElement("option");
        opt_element.value = reg_arr[i].stn[j].stn_id;
        opt_element.innerText = reg_arr[i].stn[j].stn_ko + "(" + reg_arr[i].stn[j].stn_id + ")";
        document.getElementById("select_stn").appendChild(opt_element); 
      }
      break;
    }
  }
}