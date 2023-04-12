/*
  GTS 자료조회 PLUS JS(vanilla, without jquery)
  작성자: 이창재(2021.06.14.)
*/
var tm_ana, tm_fc, tm_arr = [];  // 관측(분석) 시각, 모델 발표 시각
var gts_old = "SFC", varname = "";
var zoom_level = 0;  // 줌 레벨
var zoom_x = zoom_y = "0000000";
//var host = "http://cht.kma.go.kr/";
var host = 'http://' + location.hostname + '/';
var layer = "";
var ajaxNum = [];
var ajaxStn = 0;
var stnInfo = [], cctvInfo = [];
var ani = 0, tm_st = 0, tm_ani = 0, size = 0, nload = 0, play = 0;
var nmax = 12;
var ext_mode = 0, click_count = 0, lat1, lat2, lon1, lon2;
var cht_area, map, map_size, gis_img, gis_center = [41.364544, 115.355385];
var canvas1, canvas2, canvas3, canvas4, canvas5, img_data = [], stop_flag = false;
var graticule1, graticule2, graticule3, gis_proj4, gis_resolution, world_lon;
var geojsonData, geojsonWorldData, lakeData, koreaData, koreaCityData;
var geojsonVectorTile, lakeVectorTile, koreaVectorTile, koreaCityVectorTile, geojsonWorldVectorTile;
var geojsonVectorFillTile, lakeVectorFillTile, koreaVectorFillTile, koreaCityVectorFillTile, geojsonWorldVectorFillTile;
var rulerLayer, rulerTextLayer, tempLayer, tempTextLayer, rulerNum = 0, r_obj = []
var stnLayer, nameLayer, wrnLayer, highwayLayer, typWrnLayer, cctvLayer;

var area_info = [
  {
    area: "EA_CHT", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [41.364544, 115.355385], center_origin: [41.364544, 115.355385], 
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 8382.5, 5588.3333, 3725.5555,
                     2483.7037, 1655.8025, 1103.8683,
                     735.9122, 490.6081, 327.0721, 218.0481],
      zoom: {
        min: 0,
        max: 7
      }
    }
  },
  {
    area: "TP", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [25.686878, 141.707687], center_origin: [25.686878, 141.707687],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 9740, 6493.3333, 4328.8889,
                     2885.9259, 1923.9506, 1282.6337,
                     855.0892, 570.0594, 380.0396, 253.3598],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "E10", zoom_x: '5400000', zoom_y: '5400000', zoom_level: 2, center: [37.069424, 124.848145], center_origin: [37.069424, 124.848145],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 4234.5, 2823, 1882,
                     1254.6667, 836.4444, 557.6296,
                     371.7531, 247.8354, 165.2236, 110.1491],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "NHEM", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [89.993668, 255.000000], center_origin: [89.993668, 255.000000],
    map_attrs: {
      crs: "EPSG:3031",
      proj4string: "+proj=Polar_Stereographic +lat_0=90 +lat_ts=90 +lon_0=120 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 23550, 15700, 10466.6667,
                     6977.7778, 4651.8519, 3101.2346,
                     2067.4897, 1378.3265],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "WORLD", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [0.0, 126.000000], center_origin: [0.0, 126.000000],
    map_attrs: {
      crs: "EPSG:32662",
      proj4string: "+proj=eqc +lat_0=0 +lat_ts=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 30830, 20553.3333, 13702.2222,
                     9134.8148, 6089.8765, 4059.9177,
                     2706.6118, 1804.4079, 1202.9386],
      zoom: {
          min: 0,
          max: 7
      }
    }
  }
];

var reg_arr = [
  {reg_name: "수도권", reg_id: ["11A0","11B1","11B2"], stn: []},
  {reg_name: "경남권", reg_id: ["11H2"], stn: []},
  {reg_name: "경북권", reg_id: ["11H1","11E0"], stn: []},
  {reg_name: "전남권", reg_id: ["11F2","21F2"], stn: []},
  {reg_name: "전북",  reg_id: ["11F1","21F1"], stn: []},
  {reg_name: "충남권", reg_id: ["11C2"], stn: []},
  {reg_name: "충북",  reg_id: ["11C1"], stn: []},
  {reg_name: "강원도",  reg_id: ["11D1","11D2"], stn: []},
  {reg_name: "제주도",  reg_id: ["11G0"], stn: []}
];

//document.addEventListener('load', onLoad(), false);

//IE에서 findIndex 함수 사용을 위한 polyfill
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, { kValue, k, O })).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}

// 로딩시 실행
function onLoad() {
  cht_area = document.getElementById("area").value;
  gis_proj4 = "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs";
  map_init(cht_area);
  for (var i=0; i<nmax; i++) {
    ajaxNum[i] = 0;
  }

  layer_select(0);
  tm_init(0, "ana");
  tm_init(0, "fc");
  chk_gts(0);
  fnScroll();
  fnGetStnInfo();
  initDragElement();
  fnInitAwsStn();

  window.addEventListener('resize', function() {
    fnBodyResize(0);
  });
}

// 실행
function doSubmit(mode) {
  nload = 0;
  play = 0;
  if (ani == 1 && mode != 0) {
    if (document.getElementById("ani_chk").checked == false) {
      fnAnimate();
      return;
    }
    //tmbarClick("ani_tm" + document.getElementById("ani_frame").value);
  }

  if (document.getElementById("varn").value == "") return;

  if (document.getElementById("gts").value == "SFC" && (document.getElementById("cont").value == "nwp_wind1" || document.getElementById("cont").value == "diff_temp")) {
      alert("지상에서는 제공되지 않는 일기도입니다.");
      document.getElementById("cont").value = 0;
  }

  if (layer.indexOf("S") == -1) {
    document.getElementById("nwp_info").style.visibility = "hidden";
    document.getElementById("bias_info").style.visibility = "hidden";
  }

  if (!(document.getElementById("sat").value.indexOf("rmwv") != -1 || document.getElementById("sat").value.indexOf("rmir") != -1)) {
    document.getElementById("nwp_info").style.visibility = "hidden";
    document.getElementById("bias_info").style.visibility = "hidden";
  }

  if (document.getElementById("varn").value.substr(0,4) != "bias") {
    document.getElementById("nwp_info").style.visibility = "hidden";
    document.getElementById("bias_info").style.visibility = "hidden";
  }

  if (document.getElementById("cont").value == "gts" || document.getElementById("cont").value == 0) {
    document.getElementById("nwp_info").style.visibility = "hidden";
    document.getElementById("bias_info").style.visibility = "hidden";
  }
  else {
    document.getElementById("nwp_info").style.visibility = "visible";
  }

  if (document.getElementById("varn").value.substr(0,4) == "bias") {
    document.getElementById("nwp_info").style.visibility = "visible";
    document.getElementById("bias_info").style.visibility = "visible";
  }

  if (layer.indexOf("S") != -1 && (document.getElementById("sat").value.indexOf("rmwv") != -1 || document.getElementById("sat").value.indexOf("rmir") != -1)) {
    document.getElementById("nwp_info").style.visibility = "visible";
    if (document.getElementById("nwp").value == "ECMWF") document.getElementById("border").checked = false;
  }

  for (var i=0; i<document.getElementById("varn").length; i++) {
    if (document.getElementById("varn")[i].selected == true) {
      varname = document.getElementById("varn")[i].text;
      break;
    }
  }

  var frame = 1;
  if (ani == 1) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("loadingStatus").style.display = "block";
    document.getElementById('loadingbar').style.minWidth = "0px";
    document.getElementById('loadingnum').innerText = "로딩 진행상황(0%)";
    frame = document.getElementById("ani_frame").value;
  }

  for (var i=0; i<frame; i++) {
    fnGetApiUrl(i+1);
  }
}

// API 주소 확인
function fnGetApiUrl(frame) {
  // 관측(분석)시각 KST -> UTC
  if (ani == 1) {
    var tm = document.getElementById("ani_tm"+frame).value;
    var YY = tm.substring(0,4);
    var MM = tm.substring(4,6);
    var DD = tm.substring(6,8);
    var HH = tm.substring(8,10);
    var MI = tm.substring(10,12);
    var date = new Date(YY, MM-1, DD, HH, MI);
  }
  else {
    var tm = tm_ana;
    var YY = tm.substring(0,4);
    var MM = tm.substring(4,6);
    var DD = tm.substring(6,8);
    var HH = tm.substring(8,10);
    var MI = tm.substring(10,12);
    var date = new Date(YY, MM-1, DD, HH, MI);
    date.setTime(date.getTime() - 9*60*60*1000);
    tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
  }
  if (tm_arr[frame-1] == undefined) {
    tm_arr[frame-1] = {};
  }
  tm_arr[frame-1].tm = tm;
  tm_arr[frame-1].date = date;

  if (cht_area == "EA_CHT") {
    var size = 1150;
  }
  else if (cht_area == "TP") {
    var size = 1150;
  }
  else if (cht_area == "E10") {
    var size = 850;
  }
  else if (cht_area == "NHEM") {
    var size = 850;
  }
  else if (cht_area == "WORLD") {
    var size = 1300;
  }

  var url = "/cgi-bin/url/nph-map_ana_img?curl=1&cht_mode=gts&gis=1&map=" + document.getElementById("area").value + "&layer=" + layer + "&tm=" + tm;
  url += "&obs=" + document.getElementById("varn").value + "&gts=" + document.getElementById("gts").value + "&size=" + size;
  url += "&zoom_x=" + zoom_x + "&zoom_y=" + zoom_y + "&pnts=" + document.getElementById("pnts").value + "&font_size=" + document.getElementById("font_size").value;
  if (layer.indexOf("S") != -1) url += "&sat=" + document.getElementById("sat").value;
  if (document.getElementById("wpf").checked == true) url += "&wpf=1"; 
  if (document.getElementById("amdar").checked == true) url += "&amdar=1"; 
  if (document.getElementById("border").checked == true) url += "&border=1"; 
  if (document.getElementById("color_wind").checked == true) url += "&color_wind=1"; 
  if (document.getElementById("nwp_info").style.visibility == "visible") {
    // 수치모델 발표 시각 KST -> UTC
    var tm2 = tm_fc.toString();
    var YY = tm2.substring(0,4);
    var MM = tm2.substring(4,6);
    var DD = tm2.substring(6,8);
    var HH = tm2.substring(8,10);
    var MI = tm2.substring(10,12);
    var date2 = new Date(YY, MM-1, DD, HH, MI);
    date2.setTime(date2.getTime() - 9*60*60*1000);
    if (date < date2) {
      date2.setTime(parseInt((date.getTime()+9*60*60*1000)/(12*60*60*1000))*(12*60*60*1000) - 9*60*60*1000);
    }
    tm2 = addZeros(date2.getFullYear(),4) + addZeros(date2.getMonth()+1,2) + addZeros(date2.getDate(),2) + addZeros(date2.getHours(),2) + addZeros(date2.getMinutes(),2);

    var url2 = host + "/gts/gts_plot_comp_lib.php?mode=1&mdl=" + document.getElementById("nwp").value + "&tm=" + tm2;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url2, true);
    xhr.timeout = 60000;
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      var tm_fc2 = tm_fc;
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
          tm_fc2 = l;
        });

        if (tm_fc2 != tm_fc) {
          if (ani == 0 || (ani == 1 && frame == document.getElementById("ani_frame").value)) {
            tm_fc = tm_fc2;
            document.getElementById("tm_fc").value = tm_fc.substring(0,4) + "." + tm_fc.substring(4,6) + "." + tm_fc.substring(6,8) + "." + tm_fc.substring(8,10) + ":" + tm_fc.substring(10,12);
          }
          // KST -> UTC
          tm2 = tm_fc2.toString();
          YY = tm2.substring(0,4);
          MM = tm2.substring(4,6);
          DD = tm2.substring(6,8);
          HH = tm2.substring(8,10);
          MI = tm2.substring(10,12);
          date2 = new Date(YY, MM-1, DD, HH, MI);
          date2.setTime(date2.getTime() - 9*60*60*1000);
          tm2 = addZeros(date2.getFullYear(),4) + addZeros(date2.getMonth()+1,2) + addZeros(date2.getDate(),2) + addZeros(date2.getHours(),2) + addZeros(date2.getMinutes(),2);
        }
        tm_arr[frame-1].tm_fc = tm2;
        tm_arr[frame-1].date_fc = date2;

        url += "&model=" + document.getElementById("nwp").value + "&tm_fc=" + tm2;
        if (document.getElementById("bias_info").style.visibility == "visible") url += "&bias_disp=" + document.getElementById("bias_disp").value;
        if (document.getElementById("cont").value != 0) url += "&cht_name=" + document.getElementById("cont").value;
        else if (layer.indexOf("G") != -1) url += "&color_adjust=1";
        url += "&save=1&flag=1";
        fnCallApi(frame, url, tm);
      }
    };
    xhr.ontimeout = function () {
      console.log('ajax timeout');
      nload++;
      if (ani == 0) var nimg = 1;
      else var nimg = document.getElementById("ani_frame").value;
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
      if (nload == nimg) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.send();
  }
  else {
    if (document.getElementById("cont").value != 0) url += "&cht_name=" + document.getElementById("cont").value;
    else if (layer.indexOf("G") != -1) url += "&color_adjust=1";
    url += "&save=1&flag=1";
    fnCallApi(frame, url, tm);
  }
}

// API 호출
function fnCallApi(frame, url, tm) {
  ajaxNum[frame-1]++;
  var curAjaxNum = ajaxNum[frame-1];
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 60000;
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == ajaxNum[frame-1]) {
      var json = tryParseJSON(xhr.responseText);

      if (json == false) {
        console.log('ajax error');
        nload++;
        if (ani == 0) var nimg = 1;
        else var nimg = document.getElementById("ani_frame").value;
        if (nload == nimg) {
          document.getElementById("loading").style.display = "none";
          document.getElementById("loadingStatus").style.display = "none";
        }

        return;
      }

      if (cht_area == "WORLD") {
        if (json.bounds[0][0] == 90) {
          json.bounds[0][0] -= 0.00001;
        }
      }

      img_data[frame-1] = json;
      nload++;

      if (ani == 0) var nimg = 1;
      else var nimg = document.getElementById("ani_frame").value;
      document.getElementById('loadingbar').style.minWidth = parseFloat(nload/nimg*100).toFixed(1) + "%";
      document.getElementById('loadingnum').innerText = "로딩 진행상황(" + parseFloat(nload/nimg*100).toFixed(1) + "%)";
      if (nload == nimg) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
        fnGetSameTimePoint(0, tm_ana);

        if (gis_img == undefined || gis_img._mapToAdd == null) {
          gis_img = L.Proj.imageOverlay(json.img + "?timestamp=" + new Date().getTime(), json.bounds, {pane: "image"});
          gis_img.addTo(map);
        }
        else {
          map.removeLayer(gis_img);
          gis_img = L.Proj.imageOverlay(json.img + "?timestamp=" + new Date().getTime(), json.bounds, {pane: "image"});
          gis_img.addTo(map);
          //gis_img.setUrl(json.img + "?timestamp=" + new Date().getTime()).setBounds(json.bounds);
        }
        //gis_center = json.center;
        //if (opt != undefined && opt == 1) {
        //  map.setView(gis_center, zoom_level, {animate:false});
        //}

        gis_img.once('load', function() {
          var rateX = parseFloat(gis_img._image.offsetWidth)/parseFloat(gis_img._image.naturalWidth);
          var rateY = parseFloat(gis_img._image.offsetHeight)/parseFloat(gis_img._image.naturalHeight);
          console.log(rateX, rateY);

          for (var k=0; k<nimg; k++) {
            var item = document.getElementById("tooltip"+parseInt(k+1));
            while (item.hasChildNodes()) {
              item.removeChild(item.childNodes[0]);
            }

            if (ani > 0) tm = document.getElementById("ani_tm"  + parseInt(k+1)).value;

            for (var i=0; i<img_data[k].data.length; i++) {
              var li = document.createElement("li");
              if (document.getElementById("varn").value.indexOf("bias") == -1) {
                if (document.getElementById("gts").value == "SFC") {
                  var d_li = "<a class=pop href=\"javascript:gts_stn_view('" + img_data[k].data[i].stn_tp + "', '" + tm + "', '" + img_data[k].data[i].stn_id + "');\"";
                  d_li += " style=\"width:15px; height:15px; top:" + parseFloat(parseFloat(img_data[k].data[i].y)*rateY - 6) + "px; left:" + parseFloat(parseFloat(img_data[k].data[i].x)*rateX - 6) + "px;\">";
                  d_li += "<span><b>";
                  if (img_data[k].data[i].stn_tp == "DK") var tp = "A";
                  else var tp = img_data[k].data[i].stn_tp;
                  var n = stnInfo.findIndex(function(x){return (x.stn_id == img_data[k].data[i].stn_id && x.stn_tp == tp)})
                  if (n != -1) {
                    d_li += stnInfo[n].stn_name;
                  }
                  else {
                    if (img_data[k].data[i].stn_tp == "H") d_li += "선박";
                    else if (img_data[k].data[i].stn_tp == "B") d_li += "부이";
                  }
                  d_li += "(" + img_data[k].data[i].stn_id + ")</b>";
                  if (img_data[k].data[i].stn_tp != "DC" && img_data[k].data[i].stn_tp != "DK" && img_data[k].data[i].ps > 0) d_li += "<br>해면기압: " + img_data[k].data[i].ps + "hPa";
                  if (img_data[k].data[i].stn_tp != "DC" && img_data[k].data[i].stn_tp != "DK" && img_data[k].data[i].ta > -90) d_li += "<br>기온: " + img_data[k].data[i].ta + "℃";
                  if (img_data[k].data[i].stn_tp != "DC" && img_data[k].data[i].stn_tp != "DK" && img_data[k].data[i].td > -90) d_li += "<br>노점온도: " + img_data[k].data[i].td + "℃";
                  if (img_data[k].data[i].stn_tp != "DC" && img_data[k].data[i].stn_tp != "DK" && img_data[k].data[i].ws >= 0)  d_li += "<br>바람: " + img_data[k].data[i].wd + "º/" + img_data[k].data[i].ws + "m/s";
                  if (img_data[k].data[i].pm10 > 0) d_li += "<br>PM10: " + img_data[k].data[i].pm10 + "㎍/㎥";
                  if (img_data[k].data[i].stn_tp == "K" && img_data[k].data[i].wh > -90)  d_li += "<br>유의파고: " + img_data[k].data[i].wh + "m";
                  d_li += "</span></a>"; 
                }
                else {
                  if (img_data[k].data[i].stn_tp == "W") var d_li = "<a class=pop href=\"javascript:gts_stn_view('" + img_data[k].data[i].stn_tp + "', '" + tm + "', '" + img_data[k].data[i].stn_id + "');\"";
                  else if (img_data[k].data[i].stn_tp == "A") var d_li = "<a class=pop href=\"javascript:gts_stn_view('AMDAR', '" + tm + "', '" + img_data[k].data[i].stn_id + "', '" + img_data[k].data[i].bufr + "');\"";
                  else var d_li = "<a class=pop href=\"javascript:gts_stn_view('" + document.getElementById("gts").value + "', '" + tm + "', '" + img_data[k].data[i].stn_id + "');\"";
                  d_li += " style=\"width:15px; height:15px; top:" + parseFloat(parseFloat(img_data[k].data[i].y)*rateY - 6) + "px; left:" + parseFloat(parseFloat(img_data[k].data[i].x)*rateX - 6) + "px;\">";
                  d_li += "<span><b>";
                  if (img_data[k].data[i].stn_tp == "W" || img_data[k].data[i].stn_tp == "A" || img_data[k].data[i].stn_tp == "K") var n = stnInfo.findIndex(function(x){return (x.stn_id == img_data[k].data[i].stn_id && x.stn_tp == img_data[k].data[i].stn_tp)})
                  else var n = stnInfo.findIndex(function(x){return (x.stn_id == img_data[k].data[i].stn_id)})
                  if (n != -1) {
                    d_li += stnInfo[n].stn_name;
                  }
                  d_li += "(" + img_data[k].data[i].stn_id + ")</b>";
                  if (img_data[k].data[i].gh > 0) d_li += "<br>고도: " + img_data[k].data[i].gh + "gpm";
                  if (img_data[k].data[i].ta > -90) d_li += "<br>기온: " + img_data[k].data[i].ta + "℃";
                  if (img_data[k].data[i].td > -90) d_li += "<br>노점온도: " + img_data[k].data[i].td + "℃";
                  if (img_data[k].data[i].ws >= 0)  d_li += "<br>바람: " + img_data[k].data[i].wd + "º/" + img_data[k].data[i].ws + "m/s";
                  d_li += "</span></a>"; 
                }
              }
              else {
                if (document.getElementById("gts").value == "SFC") {
                  var d_li = "<a class=pop href=\"javascript:gts_stn_view('" + img_data[k].data[i].stn_tp + "', '" + tm + "', '" + img_data[k].data[i].stn_id + "');\"";
                  d_li += " style=\"width:15px; height:15px; top:" + parseFloat(parseFloat(img_data[k].data[i].y)*rateY - 6) + "px; left:" + parseFloat(parseFloat(img_data[k].data[i].x)*rateX - 6) + "px;\">";
                  d_li += "<span><b>";
                  if (img_data[k].data[i].stn_tp == "DK") var tp = "A";
                  else var tp = img_data[k].data[i].stn_tp;
                  var n = stnInfo.findIndex(function(x){return (x.stn_id == img_data[k].data[i].stn_id && x.stn_tp == tp)})
                  if (n != -1) {
                    d_li += stnInfo[n].stn_name;
                  }
                  else {
                    if (img_data[k].data[i].stn_tp == "H") d_li += "선박";
                    else if (img_data[k].data[i].stn_tp == "B") d_li += "부이";
                  }
                  d_li += "(" + img_data[k].data[i].stn_id + ")</b>";
                  d_li += "<br>예측: " + parseFloat(img_data[k].data[i].fct).toFixed(1);
                  d_li += "<br>관측: " + parseFloat(img_data[k].data[i].obs).toFixed(1);
                  d_li += "<br>BIAS: " + parseFloat(img_data[k].data[i].bias).toFixed(1);
                  d_li += "</span></a>"; 
                }
                else {
                  if (img_data[k].data[i].stn_tp == "W") var d_li = "<a class=pop href=\"javascript:gts_stn_view('" + img_data[k].data[i].stn_tp + "', '" + tm + "', '" + img_data[k].data[i].stn_id + "');\"";
                  else var d_li = "<a class=pop href=\"javascript:gts_stn_view('" + document.getElementById("gts").value + "', '" + tm + "', '" + img_data[k].data[i].stn_id + "');\"";
                  d_li += " style=\"width:15px; height:15px; top:" + parseFloat(parseFloat(img_data[k].data[i].y)*rateY - 6) + "px; left:" + parseFloat(parseFloat(img_data[k].data[i].x)*rateX - 6) + "px;\">";
                  d_li += "<span><b>";
                  if (img_data[k].data[i].stn_tp == "W" || img_data[k].data[i].stn_tp == "A" || img_data[k].data[i].stn_tp == "K") var n = stnInfo.findIndex(function(x){return (x.stn_id == img_data[k].data[i].stn_id && x.stn_tp == img_data[k].data[i].stn_tp)})
                  else var n = stnInfo.findIndex(function(x){return (x.stn_id == img_data[k].data[i].stn_id)})
                  if (n != -1) {
                    d_li += stnInfo[n].stn_name;
                  }
                  d_li += "(" + img_data[k].data[i].stn_id + ")</b>";
                  d_li += "<br>예측: " + parseFloat(img_data[k].data[i].fct).toFixed(1);
                  d_li += "<br>관측: " + parseFloat(img_data[k].data[i].obs).toFixed(1);
                  d_li += "<br>BIAS: " + parseFloat(img_data[k].data[i].bias).toFixed(1);
                  if (document.getElementById("varn").value == "bias_ws") {
                    d_li += "<br>풍향(예측): " + parseFloat(img_data[k].data[i].wd1).toFixed(0);
                    d_li += "<br>풍향(관측): " + parseFloat(img_data[k].data[i].wd).toFixed(0);
                  }
                  d_li += "</span></a>"; 
                }
              }
              li.innerHTML = d_li;
              document.getElementById("tooltip"+parseInt(k+1)).appendChild(li);
            }
          }
          fnSetPosition();

          if (ani != 0) tmbarClick("ani_tm" + document.getElementById("ani_frame").value);
          else {
            titleMake(frame);
          }
        });

        // 범례 추가
        if (img_data[0].legend != undefined) {
          var legend = "";
          for (var i=0; i<img_data[0].legend.length; i++) {
            if (i != 0) legend += "<div style='height:2px;'></div>";
            legend += "<div style='display:flex;'>";
            legend += "<div style='width:4px;'></div>";
            legend += "<div style='font-weight:bold; width:100px; font-family:Tahoma; font-size:8pt; position:relative; top:2px;'>";
            if (img_data[0].legend[i].type == "sat") {
              legend += "위성";
            }
            else if (img_data[0].legend[i].type == "rdr") {
              legend += "레이더";
            }
            else if (img_data[0].legend[i].type == "bias") {
              legend += "bias";
            }
            legend += "(" + img_data[0].legend[i].unit + ")</div>";
            for (var j=0; j<img_data[0].legend[i].data.length; j++) {
              legend += "<div style='width:" + parseFloat(650/img_data[0].legend[i].data.length) + "px; height:20px; background-color:rgb(" + img_data[0].legend[i].data[j].R + "," + img_data[0].legend[i].data[j].G + "," + img_data[0].legend[i].data[j].B + ");'>";
              if (img_data[0].legend[i].data[j].value*10 % 10 != 0) {
                legend += "<div style='text-align:right; padding-right:2px; font-family:Tahoma; font-size:7pt; font-weight:bold; position:relative; top:2px;'>" + img_data[0].legend[i].data[j].value + "</div>";
              }
              else {
                legend += "<div style='text-align:right; padding-right:2px; font-family:Tahoma; font-size:7pt; font-weight:bold; position:relative; top:2px;'>" + parseFloat(img_data[0].legend[i].data[j].value).toFixed(0) + "</div>";
              }
              legend += "</div>";
             }
            legend += "</div>";
          }

          document.getElementById("legend").innerHTML = legend;
          document.getElementById("legend").style.display = "block";
        }
        else {
          document.getElementById("legend").style.display = "none";
        }
      }
    }
  };
  xhr.ontimeout = function () {
    console.log('ajax timeout');
    nload++;
    if (ani == 0) var nimg = 1;
    else var nimg = document.getElementById("ani_frame").value;
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
    if (nload == nimg) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("loadingStatus").style.display = "none";
    }
  }
  xhr.send();
}

// GTS 전문별 요소(mode - 0:첫 실행 시)
function chk_gts(mode) {
  if (document.getElementById("gts").value == "SFC") {
    document.getElementById("varn").options.length = 40;
    document.getElementById("varn").options[0].value  = "jun";      document.getElementById("varn").options[0].text  = "전문(종합)";
    document.getElementById("varn").options[1].value  = "wd";       document.getElementById("varn").options[1].text  = "바람";
    document.getElementById("varn").options[2].value  = "wa";       document.getElementById("varn").options[2].text  = "바람(화살표)";
    document.getElementById("varn").options[3].value  = "ca";       document.getElementById("varn").options[3].text  = "전운량";
    document.getElementById("varn").options[4].value  = "wc";       document.getElementById("varn").options[4].text  = "현재날씨(기호)";
    document.getElementById("varn").options[5].value  = "ctt";      document.getElementById("varn").options[5].text  = "상층운형(기호)";
    document.getElementById("varn").options[6].value  = "ctm";      document.getElementById("varn").options[6].text  = "중층운형(기호)";
    document.getElementById("varn").options[7].value  = "ctl";      document.getElementById("varn").options[7].text  = "하층운형(기호)";
    document.getElementById("varn").options[8].value  = "";         document.getElementById("varn").options[8].text  = "-----------------";
    document.getElementById("varn").options[9].value  = "ps";       document.getElementById("varn").options[9].text  = "해면기압(hPa)";
    document.getElementById("varn").options[10].value = "pa";       document.getElementById("varn").options[10].text = "현지기압(hPa)";
    document.getElementById("varn").options[11].value = "ta";       document.getElementById("varn").options[11].text = "기온(C)";
    document.getElementById("varn").options[12].value = "td";       document.getElementById("varn").options[12].text = "이슬점온도(C)";
    document.getElementById("varn").options[13].value = "wn";       document.getElementById("varn").options[13].text = "습수(C)";
    document.getElementById("varn").options[14].value = "hm";       document.getElementById("varn").options[14].text = "습도(%)";
    document.getElementById("varn").options[15].value = "ws";       document.getElementById("varn").options[15].text = "풍속(m/s)";
    document.getElementById("varn").options[16].value = "wcv";      document.getElementById("varn").options[16].text = "현재날씨(코드)";
    document.getElementById("varn").options[17].value = "cav";      document.getElementById("varn").options[17].text = "전운량(1/8)";
    document.getElementById("varn").options[18].value = "cdv";      document.getElementById("varn").options[18].text = "중하층운량(1/8)";
    document.getElementById("varn").options[19].value = "r06";      document.getElementById("varn").options[19].text = "06시간강수량(mm)";
    document.getElementById("varn").options[20].value = "r12";      document.getElementById("varn").options[20].text = "12시간강수량(mm)";
    document.getElementById("varn").options[21].value = "min";      document.getElementById("varn").options[21].text = "최저기온(C)";
    document.getElementById("varn").options[22].value = "max";      document.getElementById("varn").options[22].text = "최고기온(C)";
    document.getElementById("varn").options[23].value = "tw";       document.getElementById("varn").options[23].text = "수온(C)";
    document.getElementById("varn").options[24].value = "dust";     document.getElementById("varn").options[24].text = "황사(㎍/㎥,기호)";
    document.getElementById("varn").options[25].value = "ts";       document.getElementById("varn").options[25].text = "지표온도/수온(C)";
    document.getElementById("varn").options[26].value = "wh";       document.getElementById("varn").options[26].text = "유의파고(m)";
    document.getElementById("varn").options[27].value = "";         document.getElementById("varn").options[27].text = "-----------------";
    document.getElementById("varn").options[28].value = "id";       document.getElementById("varn").options[28].text = "지점번호";
    document.getElementById("varn").options[29].value = "nm";       document.getElementById("varn").options[29].text = "지점명(영문)";
    document.getElementById("varn").options[30].value = "";         document.getElementById("varn").options[30].text = "------진단------";
    document.getElementById("varn").options[31].value = "bias_ta";  document.getElementById("varn").options[31].text = "기온 bias";
    document.getElementById("varn").options[32].value = "bias_td";  document.getElementById("varn").options[32].text = "이슬점온도 bias";
    document.getElementById("varn").options[33].value = "bias_wn";  document.getElementById("varn").options[33].text = "습수 bias";
    document.getElementById("varn").options[34].value = "bias_hm";  document.getElementById("varn").options[34].text = "습도 bias";
    document.getElementById("varn").options[35].value = "bias_mr";  document.getElementById("varn").options[35].text = "혼합비 bias";
    document.getElementById("varn").options[36].value = "bias_tp";  document.getElementById("varn").options[36].text = "온위 bias";
    document.getElementById("varn").options[37].value = "bias_ws";  document.getElementById("varn").options[37].text = "풍속 bias";
    document.getElementById("varn").options[38].value = "bias_ps";  document.getElementById("varn").options[38].text = "해면기압 bias";
    document.getElementById("varn").options[39].value = "bias_wbt"; document.getElementById("varn").options[39].text = "습구온도 bias";
    document.getElementById("varn").options[0].selected=true;
    document.getElementById("cont").options[2].text = "- GTS 전문(등압선)";
    document.getElementById("cont").options[5].text = "-- 수치모델(등압선)";
    document.getElementById("cont").options[11].text = "--- 등압선 비교(모델/실황)";
  }
  else if (gts_old == "SFC") {
    document.getElementById("varn").options.length = 19;
    document.getElementById("varn").options[0].value  = "jun";      document.getElementById("varn").options[0].text  = "전문(종합)";
    document.getElementById("varn").options[1].value  = "gh";       document.getElementById("varn").options[1].text  = "고도(m)";
    document.getElementById("varn").options[2].value  = "ta";       document.getElementById("varn").options[2].text  = "기온(C)";
    document.getElementById("varn").options[3].value  = "td";       document.getElementById("varn").options[3].text  = "이슬점온도(C)";
    document.getElementById("varn").options[4].value  = "wn";       document.getElementById("varn").options[4].text  = "습수(C)";
    document.getElementById("varn").options[5].value  = "wd";       document.getElementById("varn").options[5].text  = "바람";
    document.getElementById("varn").options[6].value  = "ws";       document.getElementById("varn").options[6].text  = "풍속(m/s)";
    document.getElementById("varn").options[7].value  = "ept";      document.getElementById("varn").options[7].text  = "상당온위(K)";
    document.getElementById("varn").options[8].value  = "id";       document.getElementById("varn").options[8].text  = "지점번호";
    document.getElementById("varn").options[9].value  = "";         document.getElementById("varn").options[9].text  = "------진단------";
    document.getElementById("varn").options[10].value  = "bias_ta"; document.getElementById("varn").options[10].text = "기온 bias";
    document.getElementById("varn").options[11].value = "bias_td";  document.getElementById("varn").options[11].text = "이슬점온도 bias";
    document.getElementById("varn").options[12].value = "bias_wn";  document.getElementById("varn").options[12].text = "습수 bias";
    document.getElementById("varn").options[13].value = "bias_hm";  document.getElementById("varn").options[13].text = "습도 bias";
    document.getElementById("varn").options[14].value = "bias_mr";  document.getElementById("varn").options[14].text = "혼합비 bias";
    document.getElementById("varn").options[15].value = "bias_tp";  document.getElementById("varn").options[15].text = "온위 bias";
    document.getElementById("varn").options[16].value = "bias_ws";  document.getElementById("varn").options[16].text = "풍속 bias";
    document.getElementById("varn").options[17].value = "bias_gh";  document.getElementById("varn").options[17].text = "지위고도 bias";
    document.getElementById("varn").options[18].value = "bias_ept"; document.getElementById("varn").options[18].text = "상당온위 bias";
    document.getElementById("varn").options[0].selected=true;
    document.getElementById("cont").options[2].text = "- GTS 전문(등고선/등온선)";
    document.getElementById("cont").options[5].text = "-- 수치모델(등고선/등온선)";
    document.getElementById("cont").options[11].text = "--- 등고선 비교(모델/실황)";
  }
  gts_old = document.getElementById("gts").value;

  if (mode != 0) doVarn();
}

//  요소 선택
function doVarn() {
  //if (document.getElementById("varn").value == "jun") {
  //  document.getElementById("font_size").value = 1;
  //}
  //else {
  //  document.getElementById("font_size").value = 1.3;
  //}

  doSubmit();
}

//  레이어 선택
function layer_select(mode) {
  layer = "";
  var data = document.getElementsByName("layer_list");

  for(var i = 0; i < data.length; i++) {
    if (data[i].checked) {
      layer += data[i].value;
    }
  }
  if (document.getElementById("cont").value != 0 && layer.indexOf("A") == -1) {
    layer += "A";

  }

  //위성
  if (mode != 1) {
    if (layer.indexOf("S") != -1 || layer.indexOf("R") != -1) {
      document.getElementById("border").checked = true;
    }
    else {
      document.getElementById("border").checked = false;
    }
  }

  //WPF
  if (layer.indexOf("G") == -1) {
    document.getElementById("wpf").checked = false;
    document.getElementById("amdar").checked = false;
  }

  if(mode != 0) {
    doSubmit();
  }
}

//  등치선 표출
function doCont() {
  if (document.getElementById("gts").value == 'SFC' && document.getElementById("cont").value == "diff_pres" && document.getElementById("varn").value != "bias_ps") {
    alert("해면기압 bias를 함께 표출합니다.");
    document.getElementById("varn").value = "bias_ps";
  }
  if (document.getElementById("gts").value != 'SFC' && document.getElementById("cont").value == "diff_pres" && document.getElementById("varn").value != "bias_gh") {
    alert("지위고도 bias를 함께 표출합니다.");
    document.getElementById("varn").value = "bias_gh";
  }
  if (document.getElementById("gts").value != 'SFC' && document.getElementById("cont").value == "diff_temp" && document.getElementById("varn").value != "bias_ta") {
    alert("기온 bias를 함께 표출합니다.");
    document.getElementById("varn").value = "bias_ta";
  }
  if (document.getElementById("gts").value != '500' && document.getElementById("cont").value == "mT") {
    alert("500hPa 고도장으로 이동합니다.");
    document.getElementById("gts").value = "500";
  }

  layer_select(1);
}

//  지점정보 조회
function fnGetStnInfo() {
  var url = host + "/gts/gts_plot_comp_lib.php?mode=2&area=" + document.getElementById("area").value + "&tm=" + tm_ana;
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
        var n = stnInfo.length;
        stnInfo[n] = {};
        stnInfo[n].stn_tp   = d[0];
        stnInfo[n].stn_id   = d[1];
        stnInfo[n].stn_name = d[2];
        if (stnInfo[n].stn_tp == "A") {
          stnInfo[n].lat = d[3];
          stnInfo[n].lon = d[4];
        }
      });
      //console.log(stnInfo);

      for (var i=0; i<stnInfo.length; i++) {
        if (stnInfo[i].stn_tp == "A") {
          var marker = L.marker(L.latLng(stnInfo[i].lat, stnInfo[i].lon), {icon: L.divIcon({html: "<div class=marker_text>" + stnInfo[i].stn_name + "</div>", className: 'marker'}), interactive:false, pane:"marker"});
          stnLayer.addLayer(marker);
        }
      }

      doSubmit();
    }
  };
  xhr.send();

  // IE
  if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {
    return;
  }

  var url2 = host + "/gts/cctv_stn_info.php?mode=1";
  var xhr2 = new XMLHttpRequest();
  xhr2.open("GET", url2, true);
  xhr2.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr2.onreadystatechange = function () {
    if (xhr2.readyState != 4 || xhr2.status != 200) return;
    else {
      var line = xhr2.responseText.split('\n');
      if (xhr2.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }
        var d = l.split(',');
        var n = cctvInfo.length;
        cctvInfo[n] = {};
        cctvInfo[n].name     = d[0];
        cctvInfo[n].chnnl_no = d[1];
        cctvInfo[n].ip       = d[2];
        cctvInfo[n].port     = d[3];
        cctvInfo[n].lat      = parseFloat(d[4]);
        cctvInfo[n].lon      = parseFloat(d[5]);
        cctvInfo[n].agency   = d[6];
      });

      for (var i=0; i<cctvInfo.length; i++) {
        var tooltip = "<div>" + cctvInfo[i].name + "</div>";
        var marker = L.marker(L.latLng(cctvInfo[i].lat, cctvInfo[i].lon), {icon: L.divIcon({html: "<div class=cctv><i class='fas fa-video' style='font-size:1px; color:lightgray; text-shadow:0px 0px 1.5px black;'></i></div>", className: ''}), pane:"marker", chnnl_no: cctvInfo[i].chnnl_no, ip: cctvInfo[i].ip, port: cctvInfo[i].port}).bindTooltip(tooltip, {sticky:true}).on('click', cctv_view);
        cctvLayer.addLayer(marker);
      }
    }
  };
  xhr2.send();
}

// CCTV 영상 표출
function cctv_view(e) {
  url = host + "/gts/cctv_view.php?chnnl_no=" + this.options.chnnl_no + "&ip=" + this.options.ip + "&port=" + this.options.port;
  window.open(url,"","location=no,left=30,top=30,width=850,height=650,scrollbars=yes,resizable=yes");
}

//////////////////////////////////////////////////////////////////////////////////////////
//  시간제어
//////////////////////////////////////////////////////////////////////////////////////////
//  시간 입력
// ******시간 처리
// 달력(popupCalendar.js에서 callback)
function calPress() {
  var tm = targetId.value;
  tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
  //console.log(targetId.name.toString().slice(2,targetId.name.length));

  var id = targetId.name.slice(targetId.name.indexOf("tm_")+3,targetId.name.length);
  console.log(targetId.name + ":" + tm);

  // 분석시간 변경
  if (id == "ana") {
    tm_ana = tm;
    if (ani == 1) fnTimeBar(0);
  }
  // 수치모델 발표시간 변경
  else if (id == "fc") tm_fc = tm;

  doSubmit();
}

//  발표시간 입력 및 선택(type = 종류)
function tm_input(type) {
  var tm = document.getElementById("tm_" + type).value;

  if (event.keyCode == 13) {
      if (tm.length != 16) {
          alert("시간 입력이 틀렸습니다. (년.월.일.시:분)");
          if (type == "fc")  tm = tm_fc;
          else if (type == "ana") {
            tm = tm_ana;
            if (ani == 1) fnTimeBar(0);
          }
          document.getElementById("tm_" + type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          return;
      }else if (tm.charAt(4) != "." || tm.charAt(7) != "." || tm.charAt(10) != "." || tm.charAt(13) != ":") {
          alert("시간 입력 양식이 틀렸습니다. (년.월.일.시:분)");
          if (type == "fc")  tm = tm_fc;
          else if (type == "ana") {
            tm = tm_ana;
            if (ani == 1) fnTimeBar(0);
          }
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
            if      (err == 1) alert("년도가 틀렷습니다.(" + YY + ")");
            else if (err == 2) alert("월이 틀렸습니다.(" + MM + ")");
            else if (err == 3) alert("일이 틀렸습니다.(" + DD + ")");
            else if (err == 4) alert("시간이 틀렸습니다.(" + HH + ")");
            else if (err == 5) alert("분이 틀렸습니다.(" + MI + ")");

            if (type == "fc")  tm = tm_fc;
            else if (type == "ana") {
              tm = tm_ana;
              if (ani == 1) fnTimeBar(0);
            }
            document.getElementById("tm_" + type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            return;
          }
      }

      var HH = parseInt(tm.substring(11,13));
      tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + addZeros(HH,2) + tm.substring(14,16);
      document.getElementById("tm_"+type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      if (type == "fc")  tm_fc = tm;
      else if (type == "ana") {
        tm_ana = tm;
        if (ani == 1) fnTimeBar(0);
      }
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

//  최근시간(mode = 0:첫 로드 시 / type = 종류)
function tm_init(mode, type) {
  if (type == "ana") {
    var now = new Date();
    var HH = parseInt(now.getHours());
    var tm = addZeros(now.getFullYear(),4) + addZeros(now.getMonth()+1,2) + addZeros(now.getDate(),2) + addZeros(HH,2) + addZeros(0,2);

    document.getElementById("tm_"+type).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_ana = tm;
    if (ani == 1) fnTimeBar(0);
    console.log("tm_" + type + ":" + tm);
    if (mode != 0) doSubmit();
  }
  else if (type == "fc") {
    var url = host + "/gts/gts_plot_comp_lib.php?mode=0&mdl=" + document.getElementById("nwp").value;
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
      if (mode != 0) doSubmit();
    };
    xhr.send();
  }
}

// 시간 이동(type = 종류)
function tm_move(moving, type) {
  var n = moving.length - 1;
  var mode = moving.charAt(n);
  var value = parseInt(moving);

  if (type == 0 || type == "ana") {
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
    if (ani == 1) fnTimeBar(0);
    console.log("tm_ana" + ":" + tm);
  }

  if (type == 0 || type == "fc") {
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
  }

  doSubmit();
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

//////////////////////////////////////////////////////////////////////////////////////////
//  GIS 제어
//////////////////////////////////////////////////////////////////////////////////////////
//  지도 생성
function map_init(area) {
  var n = area_info.findIndex(function(x){return x.area == cht_area});
  area_info[n].zoom_x = zoom_x;
  area_info[n].zoom_y = zoom_y;
  area_info[n].zoom_level = zoom_level;
  area_info[n].center = gis_center;

  var map_attrs = {};
  var n = area_info.findIndex(function(x){return x.area == area});
  zoom_x = area_info[n].zoom_x;
  zoom_y = area_info[n].zoom_y;
  zoom_level = area_info[n].zoom_level;
  map_attrs = area_info[n].map_attrs;
  map_attrs.center = area_info[n].center;

  if (area == "E10") {
    zoom_x = '5400000';
    zoom_y = '5400000';
    zoom_level = 2;
    map_attrs.center = [37.069424, 124.848145];
  }

  cht_area = area;

  var map_crs = new L.Proj.CRS(map_attrs.crs, map_attrs.proj4string,
                      { resolutions: map_attrs.resolutions }
                );

  fnBodyResize();

  if (cht_area == "EA_CHT") {
    NX = 9640;  NY = 6760;
  }
  else if (cht_area == "TP") {
    NX = 11200;  NY = 6880;
  }
  else if (cht_area == "E10") {
    NX = 3600;  NY = 3600;
  }
  else if (cht_area == "NHEM") {
    NX = 1000;  NY = 1000;
  }
  else if (cht_area == "WORLD") {
    NX = 1000;  NY = 500;
  }
  document.getElementById('map').style.width = map_size + "px";
  document.getElementById('map').style.height = parseInt(map_size*NY/NX) + "px";

  if (map == null) {
    map = L.map('map', {
        maxZoom: map_attrs.zoom.max, //6,
        minZoom: map_attrs.zoom.min, //0,
        crs: map_crs,
        continuousWorld: false,
        worldCopyJump: false,
        inertia: false,
        keyboard: false,
        attributionControl: false
    }).setView(map_attrs.center, zoom_level, {animate:false});
    map.doubleClickZoom.disable();

    // pane 추가
    var mapPaneName1 = "world";
    var mapPaneName2 = "lake";
    var mapPaneName3 = "image";
    var mapPaneName4 = "borderline";
    var mapPaneName5 = "marker";
    var mapPaneName6 = "ruler";
    var mapPaneName7 = "realTr";
    var mapPaneName8 = "expectTr";

    // pane layer 생성
    map.createPane(mapPaneName1);
    map.createPane(mapPaneName2);
    map.createPane(mapPaneName3);
    map.createPane(mapPaneName4);
    map.createPane(mapPaneName5);
    map.createPane(mapPaneName6);
    map.createPane(mapPaneName7);
    map.createPane(mapPaneName8);

    // pane layer z-inex set
    map.getPane(mapPaneName1).style.zIndex = 0;
    map.getPane(mapPaneName2).style.zIndex = 10;
    map.getPane(mapPaneName3).style.zIndex = 50;
    map.getPane(mapPaneName4).style.zIndex = 100;
    map.getPane(mapPaneName5).style.zIndex = 150;
    map.getPane(mapPaneName6).style.zIndex = 200;
    map.getPane(mapPaneName7).style.zIndex = 170;
    map.getPane(mapPaneName8).style.zIndex = 160;

    // pane layer 마우스 및 클릭 이벤트
    map.getPane(mapPaneName1).style.pointerEvents = 'none';
    map.getPane(mapPaneName2).style.pointerEvents = 'none';
    map.getPane(mapPaneName3).style.pointerEvents = 'none';
    map.getPane(mapPaneName4).style.pointerEvents = 'none';
    map.getPane(mapPaneName5).style.pointerEvents = 'none';
    map.getPane(mapPaneName6).style.pointerEvents = 'none';
    map.getPane(mapPaneName7).style.pointerEvents = 'none';
    map.getPane(mapPaneName8).style.pointerEvents = 'none';

    canvas1 = L.canvas({pane: "world"});
    canvas2 = L.canvas({pane: "lake"});
    canvas3 = L.canvas({pane: "borderline", padding: 1.5});
    canvas4 = L.canvas({pane: "marker"});
    canvas5 = L.canvas({pane: "ruler"});

    if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {
    }
    else {
      var screenControl = L.Control.extend({
        options:{
          position:'topleft'
        },

        onAdd:function(map) {
          var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control leaflet-control-custom screencapture');

          container.title = "스크린샷";
          container.style.width = container.style.height = "34px";
          container.style.textAlign = "center";
          container.style.cursor = "pointer";

          container.onclick = function() {
            fnScreenshot();
          }

          var label = L.DomUtil.create("i", "fas fa-camera");
          container.appendChild(label);
          label.style.position = "relative";
          label.style.top = "5px";
          container.appendChild(label);
          return container;
        }

      });

      map.addControl(new screenControl())
    }

    // 범례 버튼
    var legendControl = L.Control.extend({
      options:{
        position:'topleft'
      },

      onAdd:function(map) {
        var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control leaflet-control-custom');

        container.title = "정보/범례";
        container.style.width = container.style.height = "34px";
        container.style.textAlign = "center";
        container.style.cursor = "pointer";

        container.onclick = function() {
          if (document.getElementById("legend_container").style.display == "none") {
            document.getElementById("legend_container").style.display = "block";
          }
          else {
            document.getElementById("legend_container").style.display = "none";
          }
        }

        var label = L.DomUtil.create("i", "fas fa-info");
        container.appendChild(label);
        label.style.position = "relative";
        label.style.top = "5px";
        container.appendChild(label);
        return container;
      }

    });

    map.addControl(new legendControl())

    var legendView = L.Control.extend({
      options:{
        position:'bottomleft'
      },

      onAdd:function(map) {
        var container = L.DomUtil.create('div');
        container.setAttribute('id', 'legend_container');

        var container2 = L.DomUtil.create('div', 'legend');
        container2.style.backgroundColor = "#eee";
        container2.style.padding = "2px";
        container2.setAttribute('id', 'legend_title1');
        container.appendChild(container2);

        var container3 = L.DomUtil.create('div', 'legend');
        container3.style.backgroundColor = "#eee";
        container3.style.padding = "2px";
        container3.setAttribute('id', 'legend_title2');
        container.appendChild(container3);

        var container4 = L.DomUtil.create('div', 'legend');
        container4.style.backgroundColor = "#eee";
        container4.style.padding = "2px";
        container4.setAttribute('id', 'legend');
        container.appendChild(container4);

        return container;
      }

    });

    map.addControl(new legendView())

    // 레이어 버튼
    stnLayer  = L.layerGroup.collision({margin:8});
    wrnLayer  = L.layerGroup();
    highwayLayer  = L.layerGroup();
    cctvLayer  = L.layerGroup.collision({margin:1});
    //nameLayer = L.layerGroup.collision({margin:1});

    rulerLayer = L.layerGroup().addTo(map);
    rulerTextLayer = L.layerGroup().addTo(map);
    tempLayer = L.layerGroup().addTo(map);
    tempTextLayer = L.layerGroup().addTo(map);

    fnGeoJson();

    graticule1 = L.graticule({ interval:20, style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3 });
    graticule2 = L.graticule({ interval:10, style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3 }).addTo(map);
    graticule3 = L.graticule({ interval:5,  style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3 });

    typWrnLayer = L.layerGroup([
      L.typarea({style:{dashArray:1, color:'#FF4F60', weight:3}, startLat:28, endLat:45, startLon:120, endLon:132, areaName:"비상구역", pmIgnore:true, snapIgnore:true, interactive:false}),
      L.marker([28, 132], {icon:L.divIcon({className:"typ-area", html:"<span style=\"font-size:20px; font-weight:bold; color:#FF4F60;\">비상구역</span>", iconSize:new L.Point(130, 50), iconAnchor:[90, 30]}), pmIgnore:true, snapIgnore:true, interactive:false}),
      L.marker([28, 120], {icon:L.divIcon({className:"typ-area", html:"<span style=\"font-size:15px; color:#FF4F60;\">28˚N</span>", iconSize:new L.Point(60, 30), iconAnchor:[50, 17]}), pmIgnore:true, snapIgnore:true, interactive:false}),
      L.marker([45, 132], {icon:L.divIcon({className:"typ-area", html:"<span style=\"font-size:15px; color:#FF4F60;\">132˚E</span>", iconSize:new L.Point(60, 30), iconAnchor:[25, 30]}), pmIgnore:true, snapIgnore:true, interactive:false}),
      L.typarea({style:{dashArray:1, color:'#FF8000', weight:3}, startLat:25, endLat:45, startLon:120, endLon:135, areaName:"경계구역", pmIgnore:true, snapIgnore:true, interactive:false}),
      L.marker([25, 135], {icon:L.divIcon({className:"typ-area", html:"<span style=\"font-size:20px; font-weight:bold; color:#FF8000;\">경계구역</span>", iconSize:new L.Point(130, 50), iconAnchor:[90, 30]}), pmIgnore:true, snapIgnore:true, interactive:false}),
      L.marker([25, 120], {icon:L.divIcon({className:"typ-area", html:"<span style=\"font-size:15px; color:#FF8000;\">25˚N</span>", iconSize:new L.Point(60, 30), iconAnchor:[50, 17]}), pmIgnore:true, snapIgnore:true, interactive:false}),
      L.marker([45, 135], {icon:L.divIcon({className:"typ-area", html:"<span style=\"font-size:15px; color:#FF8000;\">135˚E</span>", iconSize:new L.Point(60, 30), iconAnchor:[25, 30]}), pmIgnore:true, snapIgnore:true, interactive:false})
    ]);

    // IE
    if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {
      var subLayers = [{
        groupName:"GIS 레이어",
        expanded: true,
        layers: {
          //"국가명": nameLayer,
          "해상 특보구역": wrnLayer,
          "AWS 지점": stnLayer,
          "주요도로": highwayLayer,
          "태풍비상/경계구역": typWrnLayer
        }
      }];
    }
    else {
      var subLayers = [{
        groupName:"GIS 레이어",
        expanded: true,
        layers: {
          //"국가명": nameLayer,
          "해상 특보구역": wrnLayer,
          "AWS 지점": stnLayer,
          "주요도로": highwayLayer,
          "태풍비상/경계구역": typWrnLayer,
          "CCTV": cctvLayer
        }
      }];
    }

    var layerControl = L.Control.styledLayerControl(null, subLayers, {position:'topleft'}).addTo(map);

    map.on('zoomstart', removeImg);
    map.on('zoomend', calcZoomArea);
    map.on('dragend', calcZoomArea);
    map.on('moveend', fnSetPosition);
    map.on("mousemove", function(e) {
      var curLat = Number(e.latlng.lat);
      var curLon = Number(e.latlng.lng);

      document.getElementById('lat').value = (curLat).toFixed(2);
      document.getElementById('lon').value = (curLon).toFixed(2);
    })
    map.on('click', img_click);
  }
  else {
    removeImg();
    disableRuler();
    if (geojsonVectorTile != undefined && geojsonVectorTile._leaflet_id != undefined) {
      map.removeLayer(geojsonVectorTile);
    }
    if (geojsonVectorFillTile != undefined && geojsonVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(geojsonVectorFillTile);
    }
    if (lakeVectorTile != undefined && lakeVectorTile._leaflet_id != undefined) {
      map.removeLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined && lakeVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined && koreaVectorTile._leaflet_id != undefined) {
      map.removeLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined && koreaVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(koreaVectorFillTile);
    }
    if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
      map.removeLayer(koreaCityVectorTile);
    }
    if (geojsonWorldVectorTile != undefined && geojsonWorldVectorTile._leaflet_id != undefined) {
      map.removeLayer(geojsonWorldVectorTile);
    }
    if (geojsonWorldVectorFillTile != undefined && geojsonWorldVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(geojsonWorldVectorFillTile);
    }

    map.options.crs = map_crs;
    //map.fire('viewreset');
    //map.invalidateSize();

    n = area_info.findIndex(function(x){return x.area == area});
    if (gis_proj4 != area_info[n].map_attrs.proj4string) {
      gis_proj4 = area_info[n].map_attrs.proj4string;
      if (cht_area == "WORLD") {
        if (world_lon == undefined) {
          world_lon = 126.0;
          geojsonWorldData = sliceGeojson(geojsonData, world_lon);
        }

        fnGeoBounds(map, geojsonWorldData);
      }
      else {
        fnGeoBounds(map, geojsonData);
      }
      fnGeoBounds(map, lakeData);
      fnGeoBounds(map, koreaData);
      fnGeoBounds(map, koreaCityData);
    }

    map.fire('viewreset');
    map.invalidateSize();
    stop_flag = true;
    map.setView(map_attrs.center, zoom_level, {animate:false});

    //fnLayer();
    //doSubmit();
  }
}

//  스크린캡쳐 표출
function fnScreenshot() {
  var node = document.getElementById("map");

  function filter (node) {
    return (node.classList == undefined || (!node.classList.contains('leaflet-control-layers') && !node.classList.contains('leaflet-control-zoom')));
  }

  domtoimage.toPng(node, {width:node.offsetWidth, height:node.offsetHeight, filter: filter})
  .then(function (dataUrl) {
      document.getElementById("capture_img").src = dataUrl;
      var container = document.getElementById("screenshot");
      container.style.width = parseInt(node.offsetWidth) + 40 + "px";
      container.style.height = parseInt(node.offsetHeight) + 50 + "px";
      container.style.display = "block";
  })
  .catch(function (error) {
      console.error('oops, something went wrong!', error);
  });
}

// 스크린캡쳐 창 드래그 적용
function initDragElement() {
  var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
  var popups = document.getElementsByClassName("screen-pop");
  var elmnt = null;
  var currentZIndex = 3000; //TODO reset z index when a threshold is passed

  for (var i = 0; i < popups.length; i++) {
    var popup = popups[i];
    var header = getHeader(popup);

    popup.onmousedown = function() {
      this.style.zIndex = "" + ++currentZIndex;
    };

    if (header) {
      header.parentPopup = popup;
      header.onmousedown = dragMouseDown;
    }
  }

  function dragMouseDown(e) {
    elmnt = this.parentPopup;
    elmnt.style.zIndex = "" + ++currentZIndex;

    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    if (!elmnt) {
      return;
    }

    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (elmnt.offsetTop - pos2 > 10) {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      tms_top = elmnt.offsetTop - pos2;
    }
    else {
      elmnt.style.top = "10px";
      tms_top = 10;
    }
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    tms_left = elmnt.offsetLeft - pos1;
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function getHeader(element) {
    var headerItems = element.getElementsByClassName("screen-pop-header");

    if (headerItems.length === 1) {
      return headerItems[0];
    }

    return null;
  }
}

//  이미지 레이어 제거
function removeImg() {
  if (gis_img != undefined) {
    map.removeLayer(gis_img);

    if (geojsonVectorTile != undefined && geojsonVectorTile._leaflet_id != undefined) {
      map.removeLayer(geojsonVectorTile);
    }
    if (geojsonVectorFillTile != undefined && geojsonVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(geojsonVectorFillTile);
    }
    if (lakeVectorTile != undefined && lakeVectorTile._leaflet_id != undefined) {
      map.removeLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined && lakeVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined && koreaVectorTile._leaflet_id != undefined) {
      map.removeLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined && koreaVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(koreaVectorFillTile);
    }
    if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
      map.removeLayer(koreaCityVectorTile);
    }
    if (geojsonWorldVectorTile != undefined && geojsonWorldVectorTile._leaflet_id != undefined) {
      map.removeLayer(geojsonWorldVectorTile);
    }
    if (geojsonWorldVectorFillTile != undefined && geojsonWorldVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(geojsonWorldVectorFillTile);
    }

  }
}

//  이미지 레이어 추가
function addImg() {
  if (gis_img != undefined) {
    map.addLayer(gis_img);
  }
}

//  줌 위치 구하기
function calcZoomArea(e) {
  if (stop_flag) {
    stop_flag = false;
    fnLayer();
    return;
  }
  //removeImg();
  var zmlvl = map.getZoom();

  gis_center = map.getCenter();
  var n = area_info.findIndex(function(x){return x.area == cht_area});
  area_info[n].center = gis_center;

  var img = {};
  var NX, NY;
  var point = {};
  point.lon = gis_center.lng;
  point.lat = gis_center.lat;

  if (cht_area == "EA_CHT") {
    NX = 9640;  NY = 6760;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_lamc(img,point,-1);
  }
  else if (cht_area == "TP") {
    NX = 11200;  NY = 6880;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_lamc(img,point,-1);
  }
  else if (cht_area == "E10") {
    NX = 3600;  NY = 3600;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_lamc(img,point,-1);
  }
  else if (cht_area == "NHEM") {
    var PI = Math.asin(1.0)*2.0;
    var ea = 6378.138;              // 장반경 (km)
    NX = NY = ea*2*PI/2;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_ster(img,point,-1);
  }
  else if (cht_area == "WORLD") {
    var PI = Math.asin(1.0)*2.0;
    var ea = 6378.138;              // 장반경 (km)
    NX = ea*2*PI;
    NY = ea*PI;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_eqdc(img,point,-1);
  }
  offset.y = NY - offset.y;

  var zm = 1.0;
  var xx = yy = 0;

  for (k=0; k<zmlvl; k++) {
    var ii = parseInt((offset.x - NX/(3*zm)) / (NX/(24*zm)) + 0.5) + 1;
    if (ii < 1) ii = 1;
    else if (ii > 9) ii = 9;
    offset.x -= ((ii-1)*NX)/(24*zm);

    var jj = parseInt((offset.y - NY/(3*zm)) / (NY/(24*zm)) + 0.5) + 1;
    if (jj < 1) jj = 1;
    else if (jj > 9) jj = 9;
    offset.y -= ((jj-1)*NY)/(24*zm);

    xx += ii * Math.pow(10, (6 - k));
    yy += jj * Math.pow(10, (6 - k));

    zm *= 1.5;
  }

  if (zoom_level != zmlvl || parseInt(zoom_x) != xx || parseInt(zoom_y) != yy) {
    console.log(xx, yy);
    if (xx == 0 || yy == 0) {
      zoom_x = zoom_y = "0000000";
    }
    else {
      zoom_x = xx.toString();
      zoom_y = yy.toString();
    }
    zoom_level = zmlvl;

    doSubmit();
  }
  else {
    //addImg();
  }

  fnLayer();
}

function fnLayer() {
  if (cht_area == "WORLD") {
    if (geojsonWorldVectorTile == undefined) {
      geojsonWorldVectorTile = fnGeoTile(map, geojsonWorldData, "borderline", "geojsonworld", false, "#000");
      geojsonWorldVectorFillTile = fnGeoTile(map, geojsonWorldData, "world", "geojsonworldfill", true, "#ffffe5");
    }

    if (geojsonWorldVectorTile != undefined) {
      map.addLayer(geojsonWorldVectorTile);
    }
    if (geojsonWorldVectorFillTile != undefined) {
      map.addLayer(geojsonWorldVectorFillTile);
    }
    if (lakeVectorTile != undefined) {
      map.addLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined) {
      map.addLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined) {
      map.addLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined) {
      map.addLayer(koreaVectorFillTile);
    }
  }
  else {
    if (geojsonVectorTile != undefined) {
      map.addLayer(geojsonVectorTile);
    }
    if (geojsonVectorFillTile != undefined) {
      map.addLayer(geojsonVectorFillTile);
    }
    if (lakeVectorTile != undefined) {
      map.addLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined) {
      map.addLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined) {
      map.addLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined) {
      map.addLayer(koreaVectorFillTile);
    }
  }

  if (cht_area == "NHEM" || cht_area == "WORLD") {
    if (zoom_level >= 4) {
      map.removeLayer(graticule1);
      map.removeLayer(graticule2);
      map.addLayer(graticule3);

      if (koreaCityVectorTile != undefined) {
        koreaCityVectorTile.addTo(map);
      }
    }
    else if (zoom_level >= 2) {
      map.removeLayer(graticule1);
      map.removeLayer(graticule3);
      map.addLayer(graticule2);

      if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
        map.removeLayer(koreaCityVectorTile);
      }
    }
    else {
      map.removeLayer(graticule2);
      map.removeLayer(graticule3);
      map.addLayer(graticule1);

      if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
        map.removeLayer(koreaCityVectorTile);
      }
    }
  }
  else {
    if (zoom_level > 2 || (cht_area == "E10" && zoom_level >= 2)) {
      map.removeLayer(graticule1);
      map.removeLayer(graticule2);
      map.addLayer(graticule3);

      if (koreaCityVectorTile != undefined) {
        koreaCityVectorTile.addTo(map);
      }
    }
    else {
      map.removeLayer(graticule1);
      map.removeLayer(graticule3);
      map.addLayer(graticule2);

      if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
        map.removeLayer(koreaCityVectorTile);
      }
    }
  }
}

function fnGeoJson() {
  var url = "/lsp/htdocs/data/custom.geo.50m.json";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 60000;
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      geojsonData = JSON.parse(xhr.responseText);
      geojsonWorldData = JSON.parse(xhr.responseText);

      fnGeoBounds(map, geojsonData);
      geojsonVectorTile = fnGeoTile(map, geojsonData, "borderline", "geojson", false, "#000");
      geojsonVectorTile.addTo(map);
      geojsonVectorFillTile = fnGeoTile(map, geojsonData, "world", "geojsonfill", true, "#ffffe5");
      geojsonVectorFillTile.addTo(map);
    }
  };
  xhr.send();

  var url2 = "/lsp/htdocs/data/lake.json";
  var xhr2 = new XMLHttpRequest();
  xhr2.open("GET", url2, true);
  xhr2.timeout = 60000;
  xhr2.onreadystatechange = function () {
    if (xhr2.readyState != 4 || xhr2.status != 200) return;
    else {
      lakeData = JSON.parse(xhr2.responseText);

      fnGeoBounds(map, lakeData);
      lakeVectorTile = fnGeoTile(map, lakeData, "borderline", "lake", false, "#000");
      lakeVectorTile.addTo(map);
      lakeVectorFillTile = fnGeoTile(map, lakeData, "lake", "lakefill", true, "#e5ffff");
      lakeVectorFillTile.addTo(map);
    }
  };
  xhr2.send();

  var url3 = "/lsp/htdocs/data/korea_metropolitan.json";
  var xhr3 = new XMLHttpRequest();
  xhr3.open("GET", url3, true);
  xhr3.timeout = 60000;
  xhr3.onreadystatechange = function () {
    if (xhr3.readyState != 4 || xhr3.status != 200) return;
    else {
      koreaData = JSON.parse(xhr3.responseText);

      fnGeoBounds(map, koreaData);
      koreaVectorTile = fnGeoTile(map, koreaData, "borderline", "korea", false, "#000");
      koreaVectorTile.addTo(map);
      koreaVectorFillTile = fnGeoTile(map, koreaData, "world", "koreafill", true, "#ffffe5");
      koreaVectorFillTile.addTo(map);
    }
  };
  xhr3.send();

  var url4 = "/lsp/htdocs/data/korea_city.json";
  var xhr4 = new XMLHttpRequest();
  xhr4.open("GET", url4, true);
  xhr4.timeout = 60000;
  xhr4.onreadystatechange = function () {
    if (xhr4.readyState != 4 || xhr4.status != 200) return;
    else {
      koreaCityData = JSON.parse(xhr4.responseText);

      fnGeoBounds(map, koreaCityData);
      koreaCityVectorTile = fnGeoTile(map, koreaCityData, "borderline", "koreacity", false, "gray");
    }
  };
  xhr4.send();

  var url5 = "/lsp/htdocs/data/giscoord.geojson";
  var xhr5 = new XMLHttpRequest();
  xhr5.open("GET", url5, true);
  xhr5.timeout = 60000;
  xhr5.onreadystatechange = function () {
    if (xhr5.readyState != 4 || xhr5.status != 200) return;
    else {
      var json5 = JSON.parse(xhr5.responseText);
    }

    for (var i=0; i<json5.features.length; i++) {
      if (json5.features[i].properties.ground == "sea") {
        var coordinates = [];
        for (var j=0; j<json5.features[i].geometry.coordinates.length; j++) {
          coordinates[j] = [];
          for (var k=0; k<json5.features[i].geometry.coordinates[j].length; k++) {
            coordinates[j][k] = L.latLng(json5.features[i].geometry.coordinates[j][k][1], json5.features[i].geometry.coordinates[j][k][0]);
          }
        }
        var polygon = L.polygon(coordinates, {color: "#0080ff", fillColor: "#ffffe5", weight: 1, fillOpacity: 0, interactive:false, renderer: canvas3});
        polygon.feature = json5.features[i];
        wrnLayer.addLayer(polygon);
      }
    }
  };
  xhr5.send();

  var url6 = "/lsp/htdocs/data/highway.geojson";
  var xhr6 = new XMLHttpRequest();
  xhr6.open("GET", url6, true);
  xhr6.timeout = 60000;
  xhr6.onreadystatechange = function () {
    if (xhr6.readyState != 4 || xhr6.status != 200) return;
    else {
      var json6 = JSON.parse(xhr6.responseText);
    }

    highwayLayer.addLayer(L.geoJSON(json6, {style: {color: "orange", fillColor: "#ffffe5", weight: 1, fillOpacity: 0, interactive:false}, pane: "borderline", renderer: canvas3}));
  };
  xhr6.send();
}

// GeoJson 범위값 구하기
function fnGeoBounds(map, geojson) {
  gis_resolution = 1/map.options.crs._scales[0];

  for (var i=0; i<geojson.features.length; i++) {
    var xmax = null;
    var ymax = null;
    var xmin = null;
    var ymin = null;

    if (geojson.features[i].geometry.type == "MultiPolygon") {
      for (var j=0; j<geojson.features[i].geometry.coordinates.length; j++) {
        for (var k=0; k<geojson.features[i].geometry.coordinates[j].length; k++) {
          for (var l=0; l<geojson.features[i].geometry.coordinates[j][k].length; l++) {
            if (geojson.features[i].geometry.coordinates[j][k][l][1] >= 90) {
              geojson.features[i].geometry.coordinates[j][k][l][1] = 89.999999;
            }

            if (geojson.features[i].geometry.coordinates[j][k][l][1] <= -90) {
              geojson.features[i].geometry.coordinates[j][k][l][1] = -89.999999;
            }

            var point = map.project(L.latLng([geojson.features[i].geometry.coordinates[j][k][l][1], geojson.features[i].geometry.coordinates[j][k][l][0]]), 0);

            if (xmax <= point.x || xmax === null) {
              xmax = point.x;
            }

            if (xmin >= point.x || xmin === null) {
              xmin = point.x;
            }

            if (ymax <= point.y || ymax === null) {
              ymax = point.y;
            }

            if (ymin >= point.y || ymin === null) {
              ymin = point.y;
            }
          }
        }
      }

      geojson.features[i].properties.xmax = xmax;
      geojson.features[i].properties.xmin = xmin;
      geojson.features[i].properties.ymax = ymax;
      geojson.features[i].properties.ymin = ymin;
    }
    else if (geojson.features[i].geometry.type == "Polygon") {
      for (var j=0; j<geojson.features[i].geometry.coordinates.length; j++) {
        for (var k=0; k<geojson.features[i].geometry.coordinates[j].length; k++) {
          if (geojson.features[i].geometry.coordinates[j][k][1] >= 90) {
            geojson.features[i].geometry.coordinates[j][k][1] = 89.999999;
          }

          if (geojson.features[i].geometry.coordinates[j][k][1] <= -90) {
            geojson.features[i].geometry.coordinates[j][k][1] = -89.999999;
          }

          var point = map.project(L.latLng([geojson.features[i].geometry.coordinates[j][k][1], geojson.features[i].geometry.coordinates[j][k][0]]), 0);

          if (xmax <= point.x || xmax === null) {
            xmax = point.x;
          }

          if (xmin >= point.x || xmin === null) {
            xmin = point.x;
          }

          if (ymax <= point.y || ymax === null) {
            ymax = point.y;
          }

          if (ymin >= point.y || ymin === null) {
            ymin = point.y;
          }
        }
      }

      geojson.features[i].properties.xmax = xmax;
      geojson.features[i].properties.xmin = xmin;
      geojson.features[i].properties.ymax = ymax;
      geojson.features[i].properties.ymin = ymin;
    }

  }

  return geojson;
}

function fnGeoTile(map, data, pane, tag, fill, color) {
  if (pane != null) {
    var tiles = new L.GridLayer({tileSize:1024, pane:pane});
  }
  else {
    var tiles = new L.GridLayer({tileSize:1024});
  }

  tiles.createTile = function(coords) {
    //console.log(tag, coords);
    var tile = L.DomUtil.create('canvas', 'leaflet-tile');
    var size = this.getTileSize();
    var ctx = tile.getContext('2d');
    tile.width = size.x;
    tile.height = size.y;
    //let offscreen = tile.transferControlToOffscreen();
  
    // calculate projection coordinates of top left tile pixel
    var nwPoint = coords.scaleBy(size)
    var ratio = gis_resolution*map.options.crs._scales[coords.z];

    for (var i=0; i<data.features.length; i++) {
      var xmin = data.features[i].properties.xmin*ratio;
      var ymin = data.features[i].properties.ymin*ratio;

      var xmax = data.features[i].properties.xmax*ratio;
      var ymax = data.features[i].properties.ymax*ratio;

      if (xmax < nwPoint.x || xmin > nwPoint.x + tile.width || ymax < nwPoint.y || ymin > nwPoint.y + tile.height) {
        continue;
      }

      if ((tag == "geojson" || tag == "geojsonworld") && data.features[i].properties.admin != undefined && data.features[i].properties.admin.indexOf("Korea") != -1) {
        continue;
      }
      else drawTile(tile, ctx, coords, i, nwPoint, fill, color);
    }

    return tile;
  }

  function drawTile(tile, ctx, coords, i, nwPoint, fill, color) {
    var tolerance = 0.5;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (color == "gray" || color == "#222") {
      ctx.lineWidth = 0.4;
    }
    else {
      ctx.lineWidth = 1.0;
    }
    if (cht_area == "NHEM" || cht_area == "WORLD") {
      ctx.lineWidth *= 0.5;
    }
    ctx.beginPath();

    if (data.features[i].geometry.type == "MultiPolygon") {
      for (var j=0; j<data.features[i].geometry.coordinates.length; j++) {
        for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
          var polygon = [];
          for (var l=0; l<data.features[i].geometry.coordinates[j][k].length; l++) {
            var point = map.project(L.latLng([data.features[i].geometry.coordinates[j][k][l][1], data.features[i].geometry.coordinates[j][k][l][0]]), coords.z);
            polygon.push(point);

            //if (l==0) {
            //  ctx.moveTo(point.x - nwPoint.x, point.y - nwPoint.y);
            //}
            //else {
            //  ctx.lineTo(point.x - nwPoint.x, point.y - nwPoint.y);
            //}
          }

          //if (data.features[i].properties.NAME_0 != undefined && data.features[i].properties.NAME_0 == "North Korea") {
            polygon = L.LineUtil.simplify(polygon, tolerance);
          //}

          for (var n = 0; n < polygon.length; n ++) {
            if (n==0) {
              ctx.moveTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
            }
            else {
              ctx.lineTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
            }
          }
        }
      }
    }
    else if (data.features[i].geometry.type == "Polygon") {
      for (var j=0; j<data.features[i].geometry.coordinates.length; j++) {
        var polygon = [];
        for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
          var point = map.project(L.latLng([data.features[i].geometry.coordinates[j][k][1], data.features[i].geometry.coordinates[j][k][0]]), coords.z);
          polygon.push(point);

          //if (k==0) {
          //  ctx.moveTo(point.x - nwPoint.x, point.y - nwPoint.y);
          //}
          //else {
          //  ctx.lineTo(point.x - nwPoint.x, point.y - nwPoint.y);
          //}
        }

        //if (data.features[i].properties.NAME_0 != undefined && data.features[i].properties.NAME_0 == "North Korea") {
          polygon = L.LineUtil.simplify(polygon, tolerance);
        //}

        for (var n = 0; n < polygon.length; n++) {
          if (n==0) {
            ctx.moveTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
          }
          else {
            ctx.lineTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
          }
        }
      }
    }

    ctx.closePath();
    if (fill == true) {
      ctx.fill();
    }
    else {
      ctx.stroke();
    }
  }

  return tiles;
}

// GeoJson 경도선 기준으로 자르기
function sliceGeojson(geojson, lon_0) {
  var data = JSON.parse(JSON.stringify(geojson));
  lon_0 -= 180.0;
  if (lon_0 < -180.0) {
    lon_0 += 360.0;
  }

  var ok;

  for (var i=0; i<data.features.length; i++) {
    for (var j=0; j<data.features[i].geometry.coordinates.length; j++) {
      for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
        if (data.features[i].geometry.type == "MultiPolygon") {
          ok = 0;
          for (var l=0; l<data.features[i].geometry.coordinates[j][k].length; l++) {
            if (l == 0) continue;
            else if (data.features[i].geometry.coordinates[j][k][l-1][0] >= lon_0 && data.features[i].geometry.coordinates[j][k][l][0] < lon_0) {
              ok = 1;
              break;
            }
          }

          if (ok == 1) {
            var n1 = data.features[i].geometry.coordinates[j].length;
            data.features[i].geometry.coordinates[j][n1] = [];
            for (var l=0; l<data.features[i].geometry.coordinates[j][k].length; l++) {
              if (data.features[i].geometry.coordinates[j][k][l][0] >= lon_0) {
                var n2 = data.features[i].geometry.coordinates[j][n1].length;
                data.features[i].geometry.coordinates[j][n1][n2] = data.features[i].geometry.coordinates[j][k][l];
                data.features[i].geometry.coordinates[j][k].splice(l,1);
                l--;
              }
            }
          }
        }
        else if (data.features[i].geometry.type == "Polygon") {
          if (k==0) continue;
          else if (data.features[i].geometry.coordinates[j][k-1][0] >= lon_0 && data.features[i].geometry.coordinates[j][k][0] < lon_0) {
           ok = 1;
           break;
          }
        }
      }


      if (ok == 1 && data.features[i].geometry.type == "Polygon") {
        var polygon1 = [];
        var polygon2 = [];

        for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
          var n1 = polygon1.length;
          var n2 = polygon2.length;
          if (data.features[i].geometry.coordinates[j][k][0] >= lon_0) {
            polygon1[n1] = data.features[i].geometry.coordinates[j][k];
          }
          else {
            polygon2[n2] = data.features[i].geometry.coordinates[j][k];
          }
          data.features[i].geometry.coordinates[j].splice(k,1)
          k--;
        }

        data.features[i].geometry.type = "MultiPolygon";
        data.features[i].geometry.coordinates[j][0] = polygon1;
        data.features[i].geometry.coordinates[j][1] = polygon2;
      }
    }
  }

  return data;
}

// 축소(w: 0 = 전체, 1 = 축소, -1 = 지도영역 변경)
function unzoom_area(w) {
  if (w == 0) {
    if (document.getElementById("area").value == "E10" && w == -1) {
      zoom_x = '5400000';
      zoom_y = '5400000';
      var zoom = 2;
    }
    else {
      zoom_x = '0000000';
      zoom_y = '0000000';
      var zoom = 0;
    }

    var n = area_info.findIndex(function(x){return x.area == cht_area});
    gis_center = area_info[n].center_origin;
    map.setView(gis_center, zoom, {animate:false});
    calcZoomArea();
  }
  else if (w == -1) {
    map_init(document.getElementById("area").value);

    if (document.getElementById("area").value == "NHEM" || document.getElementById("area").value == "WORLD") {
      document.getElementById("amdar").checked = false;
    }

    doSubmit();
    fnLayer();
  }
  else if (w == 1) {
    v = parseInt(zoom_level) - 1;
    if (v <= 0) {
      zoom_x = '0000000';
      zoom_y = '0000000';
      var zoom = 0;
    }
    else {
      v1 = zoom_x.substr(0,v) + '0' + zoom_x.substr(v+1,6);
      zoom_x = v1;
      v1 = zoom_y.substr(0,v) + '0' + zoom_y.substr(v+1,6);
      zoom_y = v1;
      var zoom = v;
    }

    if (zoom < 0) {
      zoom = 0;
    }
    map.setView(gis_center, zoom, {animate:false});
    calcZoomArea();
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
//  지점값 표출
//////////////////////////////////////////////////////////////////////////////////////////
function gts_stn_view(gts, tm, stn_id, bufr) {
  if (gts == 'S' || gts == 'H' || gts == 'B' || gts == 'K' || gts == 'A' || gts == 'J') {
    if (document.getElementById("popup").value == 'b') {
      url = "/gts/gts_sfc_txt.php?gts=" + gts + "&tm=" + tm + "&stn=" + stn_id;
      window.open(url,"","location=no,left=30,top=30,width=850,height=650,scrollbars=yes,resizable=yes");
    }
    else {
      url = "/gts/gts_stn.php?gts=" + gts + "&tm=" + tm + "&stn=" + stn_id;
      window.open(url,"","location=no,left=30,top=30,width=850,height=410,scrollbars=yes,resizable=yes");
    }
  }
  else if (gts == 'W') {
    var YY = tm.substring(0,4);
    var MM = tm.substring(4,6);
    var DD = tm.substring(6,8);
    var HH = tm.substring(8,10);
    var MI = tm.substring(10,12);
    var date = new Date(YY, MM-1, DD, HH, MI);
    date.setTime(date.getTime() + 9*60*60*1000);
    tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

    url = "/gts/gts_wpf.php?tm=" + tm + "&stn=" + stn_id;
    window.open(url,"","location=no,left=30,top=30,width=1400,height=900,scrollbars=yes,resizable=yes");
  }
  else if (gts == "AMDAR") {
    url = "/gts/gts_amdar.php?tm=" + tm + "&aircraft=" + stn_id + "&bufr=" + bufr;
    window.open(url,"","location=no,left=30,top=30,width=1400,height=900,scrollbars=yes,resizable=yes");
  }
  else {
    if (document.getElementById("popup").value == 't') {
      url = "/gts/gts_stn.php?gts=" + gts + "&tm=" + tm + "&stn=" + stn_id;
      window.open(url,"","location=no,left=30,top=30,width=850,height=410,scrollbars=yes,resizable=yes");
    }
    else if (document.getElementById("popup").value == 's') {
      url = "/gts/gts_skew.php?gts=" + gts + "&tm=" + tm + "&stn=" + stn_id + "&mode=1";
      window.open(url,"","location=no,left=30,top=30,width=780,height=700,scrollbars=yes,resizable=yes");
    }
    else if (document.getElementById("popup").value == 'w') {
      url = "/gts/gts_skew.php?gts=" + gts + "&tm=" + tm + "&stn=" + stn_id + "&mode=2";
      window.open(url,"","location=no,left=30,top=30,width=780,height=700,scrollbars=yes,resizable=yes");
    }
    else if (document.getElementById("popup").value == 'b') {
      url = "/gts/gts_upp_txt.php?gts=" + gts + "&tm=" + tm + "&stn=" + stn_id;
      window.open(url,"","location=no,left=30,top=30,width=780,height=700,scrollbars=yes,resizable=yes");
    }
  }
}

// 구 버전 이동
function old_view()
{
   url = host + "/gts/gts_plot.php";
   window.open(url,"/");
}

// ********부가기능
// 위.경도 변환
var PI = Math.asin(1.0)*2.0;
var DEGRAD = PI/180.0;
var RADDEG = 180.0/PI;

var ea = 6378.138;              // 장반경 (km)
var f  = 1.0/298.257223563;     // 편평도 : (장반경-단반경)/장반경
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

// 북반구
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

// 위경도 변환(lcc)
function pixel_to_LatLon_lamc(img,point,opt) {
  var map   = document.getElementById("area").value;
  var top   = 0;
  var bot   = 0;
  var left  = 0;
  var right = 0; //if (document.getElementById("varn").value.indexOf("bias") != -1) right = 70;
  var SX, SY, NX, NY;

  var RIGHT_pixel = parseFloat(right); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);
  if (map == "EA_CHT") {
    SX = 5680;  SY = 2960;  NX = 9640;  NY = 6760;
  }
  else if (map == "H4") {
    SX = 2800;  SY = 2800;  NX = 4800;  NY = 4800;
  }
  else if (map == "E10") {
    SX = 1800;  SY = 1800;  NX = 3600;  NY = 3600;
  }
  else if (map == "TP") {
    SX = 4000;  SY = 4640;  NX = 11200;  NY = 6880;
  }
  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;

  if (opt != -1) {
    for (var i = 0; i < 7; i++, zm *= 1.5) {
      zx = (parseInt)(zoom_x.charAt(i));
      zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
      xo += (parseFloat)(NX/24.0*(zx-1)/zm);
      yo += (parseFloat)(NY/24.0*(zy-1)/zm);
    }
  }
  grid /= zm;
  xo = (SX - xo)*zm;
  yo = (SY - yo)*zm;

  var re = ea/grid;
  var t0 = Math.tan(PI*0.25 - olat*0.5)/Math.pow((1.0-ep*Math.sin(olat))/(1.0+ep*Math.sin(olat)), ep*0.5);
  var ro = re*sf*Math.pow(t0, sn);

  var result = new Object();

  if (opt == 0 || opt == -1) {
    t0 = Math.tan(PI*0.25 - (point.lat)*DEGRAD*0.5)/Math.pow((1.0-ep*Math.sin((point.lat)*DEGRAD))/(1.0+ep*Math.sin((point.lat)*DEGRAD)), ep*0.5);
    var ra = re*sf*Math.pow(t0, sn);
    var theta = sn*((point.lon)*DEGRAD - olon);

    result.x = (ra*Math.sin(theta) + xo)/(NX/img_NI);
    result.y = (ro - ra*Math.cos(theta) + yo)/(NY/img_NJ);
    result.y = img_NJ - (result.y - img_OJ);
    //result.y += TOP_pixel;

    if (opt != -1) {
      if (result.y < img_OJ || result.y > (img_NJ+img_OJ)) return;    // 제목표시줄
      if (result.x > img_NI || result.x <= 0) return;    // 범례
      //console.log('x:' + result.x + ', y:' + result.y);
    }
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

// 위경도 변환(북반구)
function pixel_to_LatLon_ster(img,point,opt) {
  var map   = document.getElementById("area").value;
  var top   = 0;
  var bot   = 0;
  var left  = 0;
  var right = 0; //if (document.getElementById("varn").value.indexOf("bias") != -1) right = 70;
  var SX, SY, NX, NY;
  var ts, ce, chi, phi, dphi;

  var RIGHT_pixel = parseFloat(right); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);

  NX = NY = ea*2*PI/2;
  SX = SY = ea*PI/2;
  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;
  
  if (opt != -1) {
    for (var i = 0; i < 7; i++, zm *= 1.5) {
      zx = (parseInt)(zoom_x.charAt(i));
      zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
      xo += (parseFloat)(NX/24.0*(zx-1)/zm);
      yo += (parseFloat)(NY/24.0*(zy-1)/zm);
    }
  }
  grid /= zm;
  xo = (SX - xo)*zm;
  yo = (SY - yo)*zm;

  var re = ea/grid;
  var result = new Object();

  if (opt == 0 || opt == -1) {
    var alat = point.lat*DEGRAD;
    var alon = point.lon*DEGRAD - slon;

    if (Math.abs(Math.cos(slat)) <= EPSLN) {

      var ts = Math.tan(0.5*(PI/2 - alat*con)) / (Math.pow(((1-ep*con*Math.sin(alat))/(1+ep*con*Math.sin(alat))), 0.5*ep));
      var ra = 2 * ts / cons;

      result.x = re*ra*Math.sin(alon) + xo;
      result.y = -con*re*ra*Math.cos(alon) + yo;
    }
    else {
      x1 = 2*Math.atan(Math.tan(0.5*(PI/2 + alat) * Math.pow((1-Math.sin(alat)*ep)/(1+Math.sin(alat)*ep), ep*0.5))) - PI/2;

      if (Math.abs(Math.sin(slat)) <= EPSLN) {
        ak = 2 / (1 + Math.cos(x1)*Math.cos(alon));
        result.y = re*ak*Math.sin(x1);
      }
      else {
        ak = 2 * ms1 / (Math.cos(x0)*(1+Math.sin(x0)*Math.sin(x1) + Math.cos(x0)*Math.cos(x1)*Math.cos(alon)));
        result.y = re*ak*(Math.cos(x0)*Math.sin(x1) - Math.sin(x0)*Math.cos(x1)*Math.cos(alon)) + yo;
      }
      result.x = re*ak*Math.cos(x1)*Math.sin(alon) + xo;
    }

    result.x /= (NX/img_NI);
    result.y /= (NY/img_NJ);
    result.y = img_NJ - (result.y - img_OJ);
    //result.y += TOP_pixel;

    if (opt != -1) {
      if (result.y < img_OJ || result.y > (img_NJ+img_OJ)) return;    // 제목표시줄
      if (result.x > img_NI || result.x <= 0) return;    // 범례
      //console.log('x:' + result.x + ', y:' + result.y);
    }
  }
  else {
    var xn = X - xo;
    var yn = Y - yo;
    var ra = Math.sqrt(xn*xn + yn*yn);

    if (Math.abs(Math.cos(slat)) <= EPSLN) {
      if (ra <= EPSLN) {
        result.lon = slon*RADDEG;
        result.lat = slat*RADDEG;        
        return result;
      }
      xn *= con;
      yn *= con;
      ts = ra * cons / (2*re);
      phi = PI/2 - 2*Math.atan(ts);
      for (var i=0; i<=15; i++) {
        dphi = PI/2 - 2*Math.atan(ts*Math.pow((1-ep*Math.sin(phi))/(1+ep*Math.sin(phi)),0.5*ep)) - phi;
        phi += dphi;
        if (Math.abs(dphi) <= EPSLN) break;
      }

      var alat = con * phi;
      var alon = con * (con*slon + Math.atan2(xn,-yn));
    }
    else {
      ce = 2*Math.atan(ra*Math.cos(x0)/(2*re*ms1));
      var alon = slon;
      if (ra <= EPSLN) chi = x0;
      else {
        chi = Math.asin(Math.cos(ce)*Math.sin(x0) + yn*Math.sin(ce)*Math.cos(x0)/ra);
        var alon = slon + Math.atan2(xn*Math.sin(ce),ra*Math.cos(x0)*Math.cos(ce) - yn*Math.sin(x0)*Math.sin(ce)); 
      }

      ts = Math.tan(0.5*(PI/2 + chi));
      phi = PI/2 - 2*Math.atan(ts);
      for (var i=0; i<=15; i++) {
        dphi = PI/2 - 2*Math.atan(ts*Math.pow((1-ep*Math.sin(phi))/(1+ep*Math.sin(phi)),0.5*ep)) - phi;
        phi += dphi;
        if (Math.abs(dphi) <= EPSLN) break;
      }
      var alat = -1*phi;
    }
    
    result.lat = alat*RADDEG;
    result.lon = alon*RADDEG;
    if (result.lon > 180) result.lon -= 360;
    //console.log('lat:' + result.lat + ', lon:' + result.lon);
  }

  return result;
}

// 위경도 변환(직교좌표)
function pixel_to_LatLon_eqdc(img,point,opt) {
  var map   = document.getElementById("area").value;
  var top   = 0;
  var bot   = 0;
  var left  = 0;
  var right = 0; if (document.getElementById("varn").value.indexOf("bias") != -1) right = 70;
  var SX, SY, NX, NY;

  var RIGHT_pixel = parseFloat(right); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);

  NX = ea*2*PI;
  NY = ea*PI;
  SX = ea*PI;
  SY = ea*PI/2;

  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;

  if (opt != -1) {
    for (var i = 0; i < 7; i++, zm *= 1.5) {
      zx = (parseInt)(zoom_x.charAt(i));
      zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
      xo += (parseFloat)(NX/24.0*(zx-1)/zm);
      yo += (parseFloat)(NY/24.0*(zy-1)/zm);
    }
  }

  grid /= zm;
  xo = (SX - xo)*zm;
  yo = (SY - yo)*zm;

  var re = ea/grid;
  var slon = 126*DEGRAD;
  var slat = 0*DEGRAD;
  var olon = 126*DEGRAD;
  var olat = 0*DEGRAD;

  var xn = olon - slon;
  if (xn > PI)  xn -= 2.0*PI;
  if (xn < -PI) xn += 2.0*PI;
  xo = re*xn*Math.cos(slat) - xo;

  var result = new Object();

  if (opt == 0 || opt == -1) {
    xn = (point.lon)*DEGRAD - slon;
    if (xn > PI)  xn -= 2.0*PI;
    if (xn < -PI) xn += 2.0*PI;

    result.x = re*xn*Math.cos(slat) - xo;
    result.y = re*((point.lat)*DEGRAD - olat) + yo;

    result.x /= (NX/img_NI);
    result.y /= (NY/img_NJ);
    result.y = img_NJ - (result.y - img_OJ);
    //result.y += TOP_pixel;

    if (opt != -1) {
      if (result.y < img_OJ || result.y > (img_NJ+img_OJ)) return;    // 제목표시줄
      if (result.x > img_NI || result.x <= 0) return;    // 범례
      //console.log('x:' + result.x + ', y:' + result.y);
    }
  }
  else {
    result.lat = ((Y - yo)/re + olat)*RADDEG;
    result.lon = ((X + xo)/(re*Math.cos(slat)) + slon)*RADDEG;

    console.log('lat:' + result.lat + ', lon:' + result.lon + ', x:' + point.xx + ', y:' + point.yy);
  }

  return result;
}

// 이미지 마우스오버 이벤트(이미지 맵에서)
function imgmap_on(e, id) {
  if (id == null) {
    id = e.srcElement.nextSibling.parentNode.id.slice(e.srcElement.nextSibling.parentNode.id.indexOf("imgmap")+6,e.srcElement.nextSibling.parentNode.id.length);
  }
  var img = document.getElementById("img"+id);
  var xx  = e.pageX - img.getBoundingClientRect().left;
  var yy  = e.pageY - img.getBoundingClientRect().top;

  var point = new Object();
  point.xx = xx;
  point.yy = yy;
  if (document.getElementById("area").value == "WORLD") var latlon = pixel_to_LatLon_eqdc(img,point,1);
  else if (document.getElementById("area").value == "NHEM") var latlon = pixel_to_LatLon_ster(img,point,1);
  else var latlon = pixel_to_LatLon_lamc(img,point,1);
  if (latlon != undefined && !isNaN(latlon.lat)) {
    point.lat = latlon.lat;
    point.lon = latlon.lon;
    point.xx = xx;
    point.yy = yy;

    document.getElementById('lat').value = (latlon.lat).toFixed(2);
    document.getElementById('lon').value = (latlon.lon).toFixed(2);
  }
  else {
    document.getElementById('lat').value = parseFloat(0).toFixed(2);
    document.getElementById('lon').value = parseFloat(0).toFixed(2);
  }

  return;
}

// 창 크기 변경에 따른 일기도 표출단 크기 조정
function fnBodyResize(opt) {
  var width  = window.innerWidth - 10;
  var height = window.innerHeight - document.getElementById('menu').offsetHeight - document.getElementById('gts_ani').offsetHeight - 14;
  document.getElementById('gts_body').style.width = parseInt(width) + "px";
  document.getElementById('gts_body').style.height = parseInt(height) + "px";

  if (opt == 0) {
    return;
  }

  if (document.getElementById("area").value == "NHEM" || document.getElementById("area").value == "H4" || document.getElementById("area").value == "E10") {
    if (document.getElementById("gts_body").clientHeight >= 850) map_size = 850;
    else if (document.getElementById("gts_body").clientHeight >= 800) map_size = 800;
    else map_size = 750;
  }
  else if (document.getElementById("area").value == "WORLD") {
    map_size = 1300;
  }
  else if (document.getElementById("area").value == "EA_CHT") {
    if (document.getElementById("gts_body").clientHeight >= 835) map_size = 1150;
    else if (document.getElementById("gts_body").clientHeight >= 770) map_size = 1100;
    else map_size = 1050;
  }
  else {
    map_size = 1150;
  }
}

// 스크롤에 따른 popup 위치 조정
function fnScroll() {
  var gts_body = document.getElementById('gts_body');
  gts_body.addEventListener('scroll', function() {
    if (gis_img == undefined || gis_img.getElement().parentNode == undefined) return;

    var paneOffset = getComputedStyle(gis_img.getElement().parentNode.parentNode).transform.match(/matrix.*\((.+)\)/)[1].split(', ');
    var paneX = paneOffset[4];
    var paneY = paneOffset[5];

    var offsetX = parseFloat(paneX) + parseFloat(gis_img._image._leaflet_pos.x) + document.getElementById("gts_body").getBoundingClientRect().left;
    var offsetY = parseFloat(paneY) + parseFloat(gis_img._image._leaflet_pos.y) + document.getElementById("gts_body").getBoundingClientRect().top;

    var pop = document.getElementById("gts_body").querySelectorAll('.pop');
    for (var i=0; i<pop.length; i++) {
      pop[i].style.transform = "translate(" + parseInt(offsetX - gts_body.scrollLeft) + "px, " + parseInt(offsetY - gts_body.scrollTop) + "px)";
    }
  });
}

// 동화 기능
function fnAnimate() {
  if (ani == 0) {
    ani = 1;
    document.getElementById("gts_ani").style.display = "block";
    fnBodyResize();
    if (cht_area == "EA_CHT") {
      NX = 9640;  NY = 6760;
    }
    else if (cht_area == "TP") {
      NX = 11200;  NY = 6880;
    }
    else if (cht_area == "E10") {
      NX = 3600;  NY = 3600;
    }
    else if (cht_area == "NHEM") {
      NX = 1000;  NY = 1000;
    }
    document.getElementById('map').style.width = map_size + "px";
    document.getElementById('map').style.height = parseInt(map_size*NY/NX) + "px";

    fnTimeBar();
  }
  else {
    ani = 0;
    var frame = 1;
    document.getElementById("gts_ani").style.display = "none";
    fnBodyResize();
    if (cht_area == "EA_CHT") {
      NX = 9640;  NY = 6760;
    }
    else if (cht_area == "TP") {
      NX = 11200;  NY = 6880;
    }
    else if (cht_area == "E10") {
      NX = 3600;  NY = 3600;
    }
    else if (cht_area == "NHEM") {
      NX = 1000;  NY = 1000;
    }
    document.getElementById('map').style.width = map_size + "px";
    document.getElementById('map').style.height = parseInt(map_size*NY/NX) + "px";
    tmbarClick("ani_tm" + frame);
    doSubmit();
  }
}

// 동화 기능 체크박스
function fnAnimateChk() {
  if (document.getElementById("ani_chk").checked) {
    if (ani == 0) {
      fnAnimate();
    }
  }
  else {
    if (ani == 1) {
      fnAnimate();
    }
  }
}

// Time Bar 생성(mode - 0: doSubmit 수행 X)
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

    if (date.getTime() == date_ana.getTime()) {
      document.getElementById("ani_tm" + parseInt(i+1)).style.backgroundColor = "#c4e3ff";
    }
    else {
      document.getElementById("ani_tm" + parseInt(i+1)).style.backgroundColor = "#ffffff";
    }

    date.setTime(date.getTime() + itv*60*60*1000);
  }

  //tmbarClick("ani_tm" + document.getElementById("ani_frame").value);
  if (mode != 0) doSubmit(0);
}

// 동화 타임바 클릭(mode - 1: 직접 클릭)
function tmbarClick(targetId, mode)
{
  if (mode == 1) play = 0;
  if (targetId == 0) {
    var id = 1;
  }
  else {
    var id = targetId.slice(targetId.indexOf("tm_ani")+"tm_ani".length+1,targetId.length);
  }

  for (var i=0; i<nmax; i++) {
    if (parseInt(i+1) == id) {
      //document.getElementById("gts_img" + parseInt(i+1)).style.display = "block";
      gis_img.setUrl(img_data[i].img + "?timestamp=" + new Date().getTime());
      document.getElementById("tooltip" + parseInt(i+1)).style.display = "block";
      document.getElementById("ani_tm"  + parseInt(i+1)).style.backgroundColor = "#c4e3ff";
      tm_ani = document.getElementById("ani_tm"  + parseInt(i+1)).value;
      titleMake(id);

      var tm = tm_ani;
      var YY = tm.substring(0,4);
      var MM = tm.substring(4,6);
      var DD = tm.substring(6,8);
      var HH = tm.substring(8,10);
      var MI = tm.substring(10,12);
      var date = new Date(YY, MM-1, DD, HH, MI);
      date.setTime(date.getTime() + 9*60*60*1000);
      tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
      fnGetSameTimePoint(0, tm);
    }
    else {
      //document.getElementById("gts_img" + parseInt(i+1)).style.display = "none";
      document.getElementById("tooltip" + parseInt(i+1)).style.display = "none";
      document.getElementById("ani_tm"  + parseInt(i+1)).style.backgroundColor = "#ffffff";
    }
  }

  return 0;
}

// 동화 타임바(이전 시간 이동)
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

// 동화 타임바(이후 시간 이동)
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

// 동화 타임바(재생)
function tmbarPlay()
{
  if (play == 0) {
    play = 1;
    tmbarAnimate();
  }
}

// 동화 타임바(멈춤)
function tmbarStop()
{
  play = 0;
}

// 동화 재생
function tmbarAnimate()
{
  if (play == 1) {
    tmbarRight();
    setTimeout(tmbarAnimate, 500);
  }
}

// 범례 정보 생성
function titleMake(targetId)
{
  var legend = "";
  legend += "<div style='display:flex;'>";
  legend += "<div style='width:4px;'></div>";
  legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>";
  legend += tm_arr[targetId-1].tm.toString().substring(0,4) + "." + tm_arr[targetId-1].tm.toString().substring(4,6) + "." + tm_arr[targetId-1].tm.toString().substring(6,8);
  legend += "." + tm_arr[targetId-1].tm.toString().substring(8,10) + ":" + tm_arr[targetId-1].tm.toString().substring(10,12) + "UTC / ";
  if (document.getElementById("gts").value == "SFC") {
    legend += "SFC";
  }
  else {
    legend += document.getElementById("gts").value + "hPa";
  }
  legend += " / " + varname;
  legend += "</div>";
  legend += "<div style='width:4px;'></div>";

  if (document.getElementById("color_wind").checked == true) {
    legend += "<div style='width:20px;'></div>";
    legend += "<div style='display:flex;'>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>바람깃 색상 : </div>";
    legend += "<div style='width:8px;'></div>";
    if (document.getElementById("gts").value == "SFC" && document.getElementById("varn").value != "wa") {
      legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:black;'></div>";
    }
    else {
      legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:red;'></div>";
    }
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>GTS</div>";
    legend += "<div style='width:8px;'></div>";
    legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:blue;'></div>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>AMDAR</div>";
    legend += "<div style='width:8px;'></div>";
    legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:RGB(139,0,255);'></div>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>W.P.F</div>";
    legend += "<div style='width:8px;'></div>";
    legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:green;'></div>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>수치모델</div>";
    legend += "<div style='width:8px;'></div>";
    legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:RGB(255,127,39);'></div>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>ASCAT</div>";
    legend += "<div style='width:8px;'></div>";
    legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:RGB(255,0,255);'></div>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>ASCAT(>=15m/s)</div>";
    legend += "<div style='width:8px;'></div>";
    legend += "<div style='position:relative; top:3px; width:10px; height:10px; background-color:RGB(30,30,30);'></div>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>WISSDOM</div>";
    legend += "</div>";
    legend += "<div style='width:4px;'></div>";
  }

  legend += "</div>";

  document.getElementById("legend_title1").innerHTML = legend;

  if (document.getElementById("nwp_info").style.visibility == "visible") {
    var legend = "";
    legend += "<div style='display:flex;'>";
    legend += "<div style='width:4px;'></div>";
    legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>";
    legend += "수치모델(" + document.getElementById("nwp").value + ") / ";

    legend += tm_arr[targetId-1].tm_fc.toString().substring(0,4) + "." + tm_arr[targetId-1].tm_fc.toString().substring(4,6) + "." + tm_arr[targetId-1].tm_fc.toString().substring(6,8);
    legend += "." + tm_arr[targetId-1].tm_fc.toString().substring(8,10) + ":" + tm_arr[targetId-1].tm_fc.toString().substring(10,12) + "UTC 발표 / ";
    if (cht_area != "E10") {
      legend += "VALID: +" + parseInt((tm_arr[targetId-1].date - tm_arr[targetId-1].date_fc)/(60*60*1000)/3)*3 + "h";
    }
    else {
      legend += "VALID: +" + parseInt((tm_arr[targetId-1].date - tm_arr[targetId-1].date_fc)/(60*60*1000)) + "h";
    }
    legend += "</div>";
    legend += "<div style='width:4px;'></div>";

    if (document.getElementById("cont").value.indexOf("diff") != -1) {
      legend += "<div style='width:20px;'></div>";
      legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>등치선 : GTS 관측전문 내외삽(실선) / 수치모델(점선)</div>";
      legend += "<div style='width:4px;'></div>";
    }

    legend += "</div>";

    document.getElementById("legend_title2").innerHTML = legend;
    document.getElementById("legend_title2").style.display = "block";
  }
  else {
    document.getElementById("legend_title2").style.display = "none";
  }
}

// 키보드를 통한 동화 조작(opt- 0: keydown, 1: keyup)
function doKey(event, opt)
{
  if (event.srcElement.attributes.class != undefined) {
    if (event.srcElement.attributes.class.value.indexOf("TimeBox") != -1) return -1;
    if (event.srcElement.attributes.class.value.indexOf("prevent-keydown") != -1) return -1;
  }

  if (event.keyCode == 122) {   // F11
    return -1;
  }

  if (opt == 0) {
    if(event.keyCode == 27) {   // ESC
      document.getElementById("screenshot").style.display = "none";
      for (var i = 0; i < typSameTimeLyrList.length; i++) {
        map.removeLayer(typSameTimeLyrList[i]);
        typSameTimeLyrList.splice(i, 1);
        i--;
      }

      if (ext_mode != 0) {
        ext_sel("zoom");
      }
    }
    else if(event.keyCode == 116) {   // F5
      location.reload();
    }
    else if(event.keyCode == 65) {   // A
      if (event.ctrlKey) {
        if (document.getElementById("ani_chk").checked) {
          document.getElementById("ani_chk").checked = false;
        }
        else {
          document.getElementById("ani_chk").checked = true;
        }
        fnAnimateChk();
      }
      else fnAnimate();
    }

    if (ani == 0) {
      var nimg = 1;
      return 0;
    }
    else var nimg = document.getElementById("ani_frame").value;

    if (nload == parseInt(nimg)) {
      if(event.keyCode == 37) {        // 왼 화살표
        tmbarLeft();
      }
      else if(event.keyCode == 39) {   // 오른 화살표
        tmbarRight();
      }
      else if(event.keyCode == 32) {   // SPACE
        if (play == 0) tmbarPlay();
        else tmbarStop();
      }
    }
  }

  return 0;
}

// 툴팁 위치 조정
function fnSetPosition()
{
/*
  if (ani == 0) var img_frame = 1;
  else var img_frame = document.getElementById("ani_frame").value;
  var img = document.getElementById("img" + img_frame);
  var top = img.getBoundingClientRect().top;
  var left = img.getBoundingClientRect().left;
*/
  if (gis_img == undefined || gis_img.getElement().parentNode == undefined) return;

  var paneOffset = getComputedStyle(gis_img.getElement().parentNode.parentNode).transform.match(/matrix.*\((.+)\)/)[1].split(', ');
  var paneX = paneOffset[4];
  var paneY = paneOffset[5];

  var offsetX = parseFloat(paneX) + parseFloat(gis_img._image._leaflet_pos.x) + document.getElementById("gts_body").getBoundingClientRect().left;
  var offsetY = parseFloat(paneY) + parseFloat(gis_img._image._leaflet_pos.y) + document.getElementById("gts_body").getBoundingClientRect().top;

  var pop = document.getElementById("gts_body").querySelectorAll('.pop');
  //console.log(pop);
  for (var i=0; i<pop.length; i++) {
    pop[i].style.transform = "translate(" + parseInt(offsetX) + "px, " + parseInt(offsetY) + "px)";
  }

  var center = map.getCenter();
  document.getElementById("center_lon").value = center.lng.toFixed(2);
  document.getElementById("center_lat").value = center.lat.toFixed(2);
  document.getElementById("map_zoom").value = map.getZoom();
}

// 확대 영역 조정 이벤트
function fn_btnClick() {
  if (zoomLayer.style.display == 'block') {
    zoomLayer.style.display = 'none';
  }
  else {
    zoomLayer.style.opacity = 1;
    zoomLayer.style.display = 'block';
  }
}

function fn_CtrlSubmit() {
  var v = parseInt(document.getElementById("map_zoom").value);
  zoom_level = v;
  var center = {};
  center.lng = parseFloat(document.getElementById("center_lon").value);
  center.lat = parseFloat(document.getElementById("center_lat").value);
  map.setView(center, zoom_level, {animate:false});
  calcZoomArea();
  //doSubmit();
}

// zoom 초기화
function fnZoomReset()
{
  var center = map.getCenter();
  document.getElementById("center_lon").value = center.lng.toFixed(2);
  document.getElementById("center_lat").value = center.lat.toFixed(2);
  document.getElementById("map_zoom").value = map.getZoom();
}

// zoom 변경
function fnZoomCtrl(i)
{
  var v = parseInt(document.getElementById("map_zoom").value);
  v += i;
  if (v > 7) v = 7;
  else if (v < 0) v = 0;
  document.getElementById("map_zoom").value = v;
}

// 주요지점 옵션 생성
function fnInitAwsStn() {
  var url = host + "/fgd/nwp_new/nwp_stn_lib.php?mode=1";
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

    var select_element = document.createElement("select");
    select_element.setAttribute('onchange', 'fnStnList(this.value);');
    select_element.style.height = "20px";
    for (var i=0; i<reg_arr.length; i++) {
      var opt_element = document.createElement("option");
      opt_element.value = reg_arr[i].reg_name;
      opt_element.innerText = reg_arr[i].reg_name;
      select_element.appendChild(opt_element); 
    }
    document.getElementById("zoom_stn1").appendChild(select_element); 

    var select_element = document.createElement("select");
    select_element.id = "select_stn";
    select_element.style.height = "20px";
    document.getElementById("zoom_stn2").appendChild(select_element); 
    fnStnList(0);
    //select_element.classList.add("checkbox-style");
  };
  xhr.send();
}

// 주요지점 옵션 생성2
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

  if (reg_name == 0) tm_init(0);
}

// 지점 위경도 가져오기
function fnStnLatLon() {
  ajaxStn++;
  var curAjaxNum = ajaxStn;
  var url = host + "/cht_new/cht_skew_lib.php?mode=2&stn_id=" + document.getElementById("select_stn").value;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == ajaxStn) {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        document.getElementById('center_lat').value = parseFloat(l.split(',')[0]).toFixed(2);
        document.getElementById('center_lon').value = parseFloat(l.split(',')[1]).toFixed(2);
      });
    }

    fn_CtrlSubmit();
  };
  xhr.send();
}

// 부가기능 선택
function ext_sel(mode)
{
  if (ext_mode != 0) {
    mode = "zoom";
  }

  if (mode == "zoom") {
    ext_mode = 0;
    click_count = 0;
    document.getElementById("zoom").style.backgroundColor = "#aaffaa";
    document.getElementById("r3d").style.backgroundColor = "#ffffff";
    document.getElementById("sat_skew").style.backgroundColor = "#ffffff";
    document.getElementById("ruler").style.backgroundColor = "#ffffff";
    document.getElementById("map").style.cursor = "grab";
  }
  else if (mode == "r3d") {
    ext_mode = "r3d";
    document.getElementById("zoom").style.backgroundColor = "#ffffff";
    document.getElementById("r3d").style.backgroundColor = "#aaffaa";
    document.getElementById("sat_skew").style.backgroundColor = "#ffffff";
    document.getElementById("ruler").style.backgroundColor = "#ffffff";
    document.getElementById("map").style.cursor = "pointer";
  }
  else if (mode == "sat_skew") {
    ext_mode = "sat_skew";
    document.getElementById("zoom").style.backgroundColor = "#ffffff";
    document.getElementById("r3d").style.backgroundColor = "#ffffff";
    document.getElementById("sat_skew").style.backgroundColor = "#aaffaa";
    document.getElementById("ruler").style.backgroundColor = "#ffffff";
    document.getElementById("map").style.cursor = "pointer";
  }
  else if (mode == "ruler") {
    ext_mode = "ruler";
    document.getElementById("zoom").style.backgroundColor = "#ffffff";
    document.getElementById("r3d").style.backgroundColor = "#ffffff";
    document.getElementById("sat_skew").style.backgroundColor = "#ffffff";
    document.getElementById("ruler").style.backgroundColor = "#aaffaa";
    document.getElementById("map").style.cursor = "pointer";
    map.on('mousemove', rulerMoving);
    map.on('zoomend', rulerZoom);
  }

  if (mode != "ruler") {
    disableRuler();
  }
/*
  var frame = 1;
  if (ani == 1) {
    frame = document.getElementById("ani_frame").value;
  }

  for (var i=0; i<frame; i++) {
    var img = document.getElementById("img"+parseInt(i+1));
    if (ext_mode == 0) {
      img.setAttribute('usemap', '#imgmap'+parseInt(i+1));
      img.removeAttribute('onmousedown');
      img.removeAttribute('onmousemove');
    }
    else {
      img.removeAttribute('usemap');
      img.setAttribute('onmousedown', 'img_click(' + parseInt(i+1) + ',event);');
      img.setAttribute('onmousemove', 'imgmap_on(event, ' + parseInt(i+1) + ');');
    }
  }
*/
}

// 이미지 클릭 이벤트
function img_click(e) {
  if (e.originalEvent.srcElement.attributes.class == undefined || e.originalEvent.srcElement.attributes.class.value.indexOf("leaflet-control-layers") != -1) {
    return;
  }
  else {
    if (e.originalEvent.srcElement.parentNode != undefined) {
      if (e.originalEvent.srcElement.parentNode.attributes.class != undefined) {
        if (e.originalEvent.srcElement.parentNode.attributes.class.value.indexOf("leaflet-control-layers") != -1) {
          return;
        }
      }
    }
  }

  if (e.originalEvent.srcElement.attributes.class.value.indexOf("leaflet-interactive") == -1) {
    for (var i = 0; i < typSameTimeLyrList.length; i++) {
      map.removeLayer(typSameTimeLyrList[i]);
      typSameTimeLyrList.splice(i, 1);
      i--;
    }
  }
  //var img = document.getElementById("img"+id);
  //var xx  = e.pageX - img.getBoundingClientRect().left;
  //var yy  = e.pageY - img.getBoundingClientRect().top;

  //var point = new Object();
  //point.xx = xx;
  //point.yy = yy;
  //if (document.getElementById("area").value == "WORLD") var latlon = pixel_to_LatLon_eqdc(img,point,1);
  //else if (document.getElementById("area").value == "NHEM") var latlon = pixel_to_LatLon_ster(img,point,1);
  //else var latlon = pixel_to_LatLon_lamc(img,point,1);
  //if (latlon != undefined && !isNaN(latlon.lat)) {
    //point.lat = latlon.lat;
    //point.lon = latlon.lon;
    //point.xx = xx;
    //point.yy = yy;
    if (ext_mode == 0) {
      //alert("확대는 마우스 휠로, 이동은 드래그로 사용해주시기 바랍니다.");
      return;
    }
    else if (ext_mode == "sat_skew") {
      click_count = 1;
    }

    if (click_count == 0) {
      click_count++;
      lat1 = e.latlng.lat;
      lon1 = e.latlng.lng;
    }
    else {
      click_count = 0;
      lat2 = e.latlng.lat;
      lon2 = e.latlng.lng;
    }

    if (ext_mode == "ruler") {
      tempLayer.clearLayers();
      tempTextLayer.clearLayers();

      circle = L.circleMarker(e.latlng, {color: 'red', radius: 2, pane:"ruler"});
      rulerLayer.addLayer(circle).addTo(map);
    }

    if (click_count == 0) {
      if (ext_mode == "ruler") {
        rulerClicked();
        return;
      }

      if (ani == 1) {
        var k = 0;
        if (play == 0) {
          for (var i=0; i<document.getElementById("ani_frame").value; i++) {
            if (document.getElementById("tooltip" + parseInt(i+1)).style.display == "block") {
              k = i;
              break;
            }
          }

          var tm = document.getElementById("ani_tm" + parseInt(k+1)).value;
          var YY = tm.toString().substring(0,4);
          var MM = tm.toString().substring(4,6);
          var DD = tm.toString().substring(6,8);
          var HH = tm.toString().substring(8,10);
          var MI = tm.toString().substring(10,12);
          var date = new Date(YY, MM-1, DD, HH, MI);
          date.setTime(date.getTime() + 9*60*60*1000);

          tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
        }
        else {
          tm = tm_ana;
        }
      }
      else var tm = tm_ana;

      if (ext_mode == "sat_skew") {
        window.open("/gts/sat_skew.php?tm="+tm+"&lat="+lat2+"&lon="+lon2, 
                "", "location=yes,left=30,top=30,width=1500,height=800,scrollbars=yes,resizable=yes");
      }
      else if (ext_mode == "r3d") {
        window.open("/gts/rdr_r3d.php?tm="+tm+"&lat1="+lat1+"&lon1="+lon1+"&lat2="+lat2+"&lon2="+lon2, 
                "", "location=yes,left=30,top=30,width=1500,height=2000,scrollbars=yes,resizable=yes");
      }
    }
  //}

  return;
}

// 거리재기 기능 추가 2020.09.04. 이창재
function disableRuler() {
  rulerNum = 0;
  map.off('mousemove', rulerMoving);
  map.off('zoomend', rulerZoom);
  rulerLayer.clearLayers();
  rulerTextLayer.clearLayers();
  tempLayer.clearLayers();
  tempTextLayer.clearLayers();
}

function rulerClicked() {
  var clickedPoints = [];
  clickedPoints[0] = L.latLng(lat1,lon1);
  clickedPoints[1] = L.latLng(lat2,lon2);

  var line = L.polyline([clickedPoints[0], clickedPoints[1]], {color: 'red', dashArray: '1,6', pane:"ruler"});
  rulerLayer.addLayer(line);
  var distance = map.distance(clickedPoints[0], clickedPoints[1])/1000.;  
  var bearing = fnGetBearingTr(parseFloat(clickedPoints[0].lat), parseFloat(clickedPoints[0].lng),
                                 parseFloat(clickedPoints[1].lat), parseFloat(clickedPoints[1].lng));

  var point = map.latLngToContainerPoint(clickedPoints[1]);
  var newPoint = L.point([point.x-20, point.y-30]);
  var text = L.marker(map.containerPointToLatLng(newPoint), {icon: L.divIcon({html: parseInt(distance) + "km " + parseInt(bearing) + "º", className: 'ruler'}), pane:"ruler"});
  rulerTextLayer.addLayer(text);

  r_obj[rulerNum] = new Object();
  r_obj[rulerNum].lat = clickedPoints[1].lat;
  r_obj[rulerNum].lon = clickedPoints[1].lng;
  r_obj[rulerNum].distance = distance;
  r_obj[rulerNum].bearing = bearing;
  rulerNum++;
}

function rulerMoving(e) {
  if (click_count > 0){
    var clickedLatLong = L.latLng(lat1,lon1);
    var movingLatLong = e.latlng;
    tempLayer.clearLayers();
    tempTextLayer.clearLayers();

    var distance = map.distance(clickedLatLong, movingLatLong)/1000.;  
    var bearing = fnGetBearingTr(parseFloat(lat1), parseFloat(lon1),
                                 parseFloat(movingLatLong.lat), parseFloat(movingLatLong.lng));

    var line = L.polyline([clickedLatLong, movingLatLong], {color: 'gray', dashArray: '1,6', pane:"ruler"});
    tempLayer.addLayer(line);
    var circle = L.circleMarker(movingLatLong, {color: 'red', radius: 2, pane:"ruler"});
    tempLayer.addLayer(circle);

    var point = map.latLngToContainerPoint(movingLatLong);
    var newPoint = map.containerPointToLatLng(L.point([point.x-20, point.y-30]));
    var text = L.marker(newPoint, {icon: L.divIcon({html: parseInt(distance) + "km " + parseInt(bearing) + "º", className: 'ruler'}), pane:"ruler"});
    tempTextLayer.addLayer(text);
  }
}

function rulerZoom() {
  rulerTextLayer.clearLayers();
  for (var num = 0; num < rulerNum; num++) {
    var point = map.latLngToContainerPoint([r_obj[num].lat, r_obj[num].lon]);
    var newPoint = L.point([point.x-20, point.y-30]);
    var text = L.marker(map.containerPointToLatLng(newPoint), {icon: L.divIcon({html: parseInt(r_obj[num].distance) + "km " + parseInt(r_obj[num].bearing) + "º", className: 'ruler'}), 
                    pane:"ruler"}).addTo(rulerTextLayer);
    rulerTextLayer.addLayer(text);
  }
}

// 두 지점 사이 각도 재기
function fnGetBearingTr(real_lat, real_lon, exp_lat, exp_lon) {

  // 현재 위치 :위도나 경도는 지구 중심을 기반으로 하는 각도이기 때문에 라디안 각도로 변환한다.
  var cur_lat_radian = parseFloat(real_lat * (3.141592 / 180));
  var cur_lon_radian = parseFloat(real_lon * (3.141592 / 180));

  // 목표 위치 :위도나 경도는 지구 중심을 기반으로 하는 각도이기 때문에 라디안 각도로 변환한다.
  var dest_lat_radian = parseFloat(exp_lat * (3.141592 / 180));
  var dest_lon_radian = parseFloat(exp_lon * (3.141592 / 180));

  // radian distance
  var radian_distance = parseFloat(Math.acos(Math.sin(cur_lat_radian) * Math.sin(dest_lat_radian) + Math.cos(cur_lat_radian) * Math.cos(dest_lat_radian) * Math.cos(cur_lon_radian - dest_lon_radian)));

  // 목적지 이동 방향을 구한다.(현재 좌표에서 다음 좌표로 이동하기 위해서는 방향을 설정해야 한다. 라디안값이다. // acos의 인수로 주어지는 x는 360분법의 각도가 아닌 radian 값이다.
  var radian_bearing = parseFloat(Math.acos((Math.sin(dest_lat_radian) - Math.sin(cur_lat_radian) * Math.cos(radian_distance)) / (Math.cos(cur_lat_radian) * Math.sin(radian_distance))));

  var true_bearing = 0;
  var sub_bearing = parseFloat(Math.sin(dest_lon_radian - cur_lon_radian));

  if (sub_bearing < 0) {
    true_bearing = parseFloat(radian_bearing * (180 / 3.141592));
    true_bearing = parseFloat(360 - true_bearing);
  }else {
    true_bearing = parseFloat(radian_bearing * (180 / 3.141592));
  }

  return Math.round(true_bearing);
}

// JSON 유효성 검사
function tryParseJSON (jsonString) {
  try {
    var o = JSON.parse(jsonString);

    if (o && typeof o === "object") {
      return o;
    }
  }
  catch (e) {
  }

  return false;
}