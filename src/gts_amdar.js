/*
  AMDAR 조회 JS(vanilla, without jquery)
  작성자: 이창재(2022.01.29)
*/
var host = 'http://' + location.hostname + '/';
//document.addEventListener('load', onLoad(), false);

// 첫 시작(화면 로드 시)
function onLoad(opt) {
  doSubmit(opt);
}

// 자료 조회
function doSubmit(opt) {
  var tm       = opt.split(',')[0];
  var aircraft = opt.split(',')[1];
  var bufr     = opt.split(',')[2];

  // 지점정보 표출
  var YY = tm.substring(0,4);
  var MM = tm.substring(4,6);
  var DD = tm.substring(6,8);
  var HH = tm.substring(8,10);
  var MI = tm.substring(10,12);

  var date = new Date(YY, MM-1, DD, HH, MI);
  date.setTime(date.getTime() + 9*60*60*1000);
  YY = addZeros(date.getFullYear(),4);
  MM = addZeros(date.getMonth()+1,2);
  DD = addZeros(date.getDate(),2);
  HH = addZeros(date.getHours(),2);
  MI = addZeros(date.getMinutes(),2);

  document.getElementById('info').innerText = "- 항공기 " + aircraft + " / " + YY + "." + MM + "." + DD + "." + HH + "H(KST)";

  // 집계표 생성
  var url = host + "/cgi-bin/url/nph-amdar_bufr?tm=" + tm + "&aircraft=" + aircraft + "&fname=" + bufr + "&flag=1&disp=1";
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

      var data = [];
      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        var n = data.length;
        data[n] = {};
        data[n].tm = l.split(',')[0];
        data[n].lon = parseFloat(l.split(',')[2]);
        data[n].lat = parseFloat(l.split(',')[3]);
        data[n].hgt = parseFloat(l.split(',')[4]);
        data[n].ta  = parseFloat(l.split(',')[5]);
        data[n].td  = parseFloat(l.split(',')[6]);
        data[n].vec = parseFloat(l.split(',')[7]);
        data[n].wsd = parseFloat(l.split(',')[8]);
      });

      data.sort(function(a,b){
        return(a.tm<b.tm)?-1:(a.tm>b.tm)?1:0;
      });
      console.log(data);

      tableDisp(data);

      data.sort(function(a,b){
        return(a.hgt<b.hgt)?-1:(a.hgt>b.hgt)?1:0;
      });
      console.log(data);

      var skewt = new SkewT2('#image');
      skewt.plot(data);
    }
  };
  xhr.send();
}

// 테이블 표출
function tableDisp(data) {
  var item = document.getElementById("table");
  while (item.hasChildNodes()) {
    item.removeChild(item.childNodes[0]);
  }

  var table = document.createElement("table");
  document.getElementById("table").appendChild(table);
  table.classList.add("pop");

  var d_li = "<th>시각(KST)</th><th>위도(deg)</th><th>경도(deg)</th><th>고도(m)</th><th>기온(C)</th><th>노점온도(C)</th><th>풍향(deg)</th><th>풍속(m/s)</th>";
  var d_element = document.createElement("tr");
  d_element.innerHTML = d_li;
  table.appendChild(d_element);

  var tm, YY, MM, DD, HH, MI, date;
  for (var i=0; i<data.length; i++) {
    d_li = "";

    if (data[i].tm > -999) {
      tm = data[i].tm;
      YY = tm.substring(0,4);
      MM = tm.substring(4,6);
      DD = tm.substring(6,8);
      HH = tm.substring(8,10);
      MI = tm.substring(10,12);

      date = new Date(YY, MM-1, DD, HH, MI);
      date.setTime(date.getTime() + 9*60*60*1000);
      YY = addZeros(date.getFullYear(),4);
      MM = addZeros(date.getMonth()+1,2);
      DD = addZeros(date.getDate(),2);
      HH = addZeros(date.getHours(),2);
      MI = addZeros(date.getMinutes(),2);

      d_li += "<td>" + DD + "일 " + HH + ":" + MI + "</td>";
    }
    else d_li += "<td></td>";

    if (data[i].lat > -999) d_li += "<td>" + parseFloat(data[i].lat).toFixed(2) + "</td>";
    else d_li += "<td>-</td>";

    if (data[i].lon > -999) d_li += "<td>" + parseFloat(data[i].lon).toFixed(2) + "</td>";
    else d_li += "<td>-</td>";

    if (data[i].hgt > -999) d_li += "<td>" + data[i].hgt + "</td>";
    else d_li += "<td>-</td>";

    if (data[i].ta > -999) d_li += "<td>" + data[i].ta + "</td>";
    else d_li += "<td>-</td>";

    if (data[i].td > -999) d_li += "<td>" + data[i].td + "</td>";
    else d_li += "<td>-</td>";

    if (data[i].vec > -999) d_li += "<td>" + data[i].vec + "</td>";
    else d_li += "<td>-</td>";

    if (data[i].wsd > -999) d_li += "<td>" + data[i].wsd + "</td>";
    else d_li += "<td>-</td>";

    var d_element = document.createElement("tr");
    d_element.innerHTML = d_li;
    table.appendChild(d_element);
  }
}

// 숫자 자리수 맞춤
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