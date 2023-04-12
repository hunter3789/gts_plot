////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    + TYPHOON(TYP) PREDICTION COURSE(COU) DIAGNOSIS(DGN)
//    + 태풍 예측 경로 진단
//    + 2019 / sbpark
//    + 2022 / 이창재 수정 / GTS 자료조회 기능 추가
//
////////////////////////////////////////////////////////////////////////////////////////////////////

var typInit = 0;
var dataLayerCnt = 5;
var realAjaxNum = 0, expectAjaxNum = 0;
var layGrpNmList = [];
var typMdlInfoList = [];
var typTrLayerList = [];
var radLyrList = []; // 강풍반경 관련 배열
var addLyrList = []; // 추가 레이어 목록(상세경로 관련)
var typSameTimeLyrList = []; // 동일 예측시간 경로

// 검색 년도/월 설정
function fnSetSltDate() {
  var curr_year = parseInt(new Date().getFullYear());

  for(var i=curr_year; i>=2001; i--) {
    var li = document.createElement("option");
    li.value = i;
    li.innerText = i;

    if (curr_year-1 == i) {
      li.setAttribute('selected', 'selected');
    }
    document.getElementById("tm_st_yy1").appendChild(li.cloneNode(true));
    document.getElementById("tm_st_yy2").appendChild(li.cloneNode(true));
    document.getElementById("tm_st_yy3").appendChild(li.cloneNode(true));

    //li.removeAttribute('selected');
    var li = document.createElement("option");
    li.value = i;
    li.innerText = i;

    if (curr_year == i) {
      li.setAttribute('selected', 'selected');
    }
    document.getElementById("tm_ed_yy1").appendChild(li.cloneNode(true));
    document.getElementById("tm_ed_yy2").appendChild(li.cloneNode(true));
    document.getElementById("tm_ed_yy3").appendChild(li.cloneNode(true));
  }
}

// 검색 모드 변경
function fnSetSearchMode(eleObj) {

  if (eleObj.classList.contains("on")) {
    return;
  }
  else {
    var cur_mode = eleObj.getAttribute("data-val");
    var eleArr = eleObj.parentNode.querySelectorAll("a[name='search_mode']");
    for (var i=0; i<eleArr.length; i++) {
      eleArr[i].classList.remove("on");
    }
    eleObj.classList.add("on");

    eleObj.parentNode.querySelector("div.div-tm-text").classList.remove("active");
    eleObj.parentNode.querySelector("div.div-tm-year").classList.remove("active");
    eleObj.parentNode.querySelector("div.div-tm-" + cur_mode).classList.add("active");

    if (cur_mode == "text") {
      //eleObj.nextAll("div.div-tm-" + cur_mode).find("input[name='search_text']").focus();
    }
  }
}

// 태풍 이름으로 검색
function fnSearchTypByName(eleObj, e) {
  if (e.keyCode == 13) {
    var cur_id = eleObj.id;
    var cur_no = cur_id.substr(cur_id.length - 1);
    fnRetTypList(document.getElementById("typ_list_search" + cur_no.toString()), 1);
  }
  else {
    return;
  }
}

// 사이드바 토글
function toggleSidebar() {
  if (document.getElementById("sidebar-left").style.display == "none") {
    document.getElementById("sidebar-left").style.display = "block";
    //document.getElementById("sidebar-collapse").style.display = "none";

    if (typInit == 0) {
      fnGetMdlInfoList();
      fnSetSltDate();
      fnRetTypList(document.getElementById("typ_list_search1"), 0);
      fnRetTypList(document.getElementById("typ_list_search2"), 0);
      fnRetTypList(document.getElementById("typ_list_search3"), 0);
      //fnRetVirtualTrackList();
      typInit = 1;
    }
  }
  else {
    document.getElementById("sidebar-left").style.display = "none";
    //document.getElementById("sidebar-collapse").style.display = "block";
  }

  return;
}

// 태풍 리스트 조회 조건 토글
function toggleTypList(eleObj) {
  if (eleObj.parentNode.classList.contains("active")) {
    return;
  }
  var curId = eleObj.id.split("tab_")[1];

  var eleArr = document.querySelector(".sidebar-tabs").querySelectorAll("li");
  for (var i=0; i<eleArr.length; i++) {
    if (eleArr[i].classList.contains("active")) {
      eleArr[i].classList.remove("active");
    }
  }
  eleObj.parentNode.classList.add("active");

  var eleArr = document.querySelectorAll(".sidebar-pane");
  for (var i=0; i<eleArr.length; i++) {
    if (eleArr[i].id == curId) {
      eleArr[i].style.display = "block";
      eleArr[i].classList.add("active");
      continue;
    }

    eleArr[i].style.display = "none";
    if (eleArr[i].classList.contains("active")) {
      eleArr[i].classList.remove("active");
    }
  }

  return;
}

// 기관/모델 정보 조회
function fnGetMdlInfoList() {
  var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=0";
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

        var d = l.split(",");
        var t_obj = new Object();

        t_obj.group = d[0];       // 기관/모델명 (ex:기관 예보 or 예측 모델)
        t_obj.code = d[1];        // 모델코드 (ex:KMA)
        t_obj.codeNm = d[2];      // 모델코드 표출용 (ex:KMA)
        t_obj.name = d[3];        // 모델명 (ex:기상청)
        t_obj.insttYn = d[4];     // 기관예보 여부 (ex:Y or N) instt=institution=기관
        t_obj.mdlYn = d[5];       // 예측모델 여부 (ex:Y or N)
        t_obj.insttSort = d[6];   // 기관예보 표출순서 (해당 없으면 -9)
        t_obj.mdlSort = d[7];     // 예측모델 표출순서 (해당 없으면 -9)
        t_obj.note = d[8];        // 설명
        t_obj.color = d[9];       // 표출 색상 (ex:#FF00FF)

        typMdlInfoList.push(t_obj);
      });
    }
  };
  xhr.send();

  return;
}

// 태풍 목록 조회
function fnRetTypList(eleObj, arg1) {
  var cur_val = eleObj.getAttribute("data-val").toString();
  var tm_yy_st = ""
  var tm_yy_ed = "";
  var typ_text = "";
  var url_param = "";

  if (eleObj.parentNode.querySelector("div.div-tm-year").classList.contains("active")) {
    tm_yy_st = document.getElementById("tm_st_yy" + cur_val).value;
    tm_yy_ed = document.getElementById("tm_ed_yy" + cur_val).value;

    if (tm_yy_st > tm_yy_ed) {
      alert("검색 기간을 다시 선택해 주세요.");
      document.getElementById("tm_st_yy" + cur_val).focus();
      return;
    }
    else {
      url_param = "&tm_yy_st=" + tm_yy_st + "&tm_yy_ed=" + tm_yy_ed;
    }
  }
  else {
    typ_text = document.getElementById("search_text" + cur_val).value;
    typ_text = typ_text.replace(/ /gi, "");
    typ_text = typ_text.replace(/[\(\)\'\"\&\|\<>\?]/gi, "");

    if (typ_text.length < 1) {
      alert("태풍명을 입력해 주세요.");
      document.getElementById("search_text" + cur_val).value = typ_text;
      document.getElementById("search_text" + cur_val).focus();
      return;
    }
    else {
      if (typ_text.substring(0, 1) == ",") {
        typ_text = typ_text.substring(1);
      }

      if (typ_text.substring(typ_text.length-1) == ",") {
        typ_text = typ_text.slice(0, -1);
      }

      document.getElementById("search_text" + cur_val).value = typ_text;
      url_param = "&typ_txt=" + typ_text;
    }
  }

  var item = document.getElementById("typ_list" + cur_val);
  while (item.hasChildNodes()) {
    item.removeChild(item.childNodes[0]);
  }

  var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=1" + url_param;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        var li = document.createElement("li");
        li.classList.add("no_dt");
        li.innerText("조회된 태풍 목록이 없습니다.");
        document.getElementById("typ_list" + cur_val).appendChild(li);
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        var d = l.split(",");
        var d_li = "";
        var typ_year = d[0];
        var typ_seq = d[1];
        var typ_now = d[4];
        var typ_rem = d[8];
        var typ_info = d[9];
        var typ_eff2 = d[10];
        var typ_type = d[11];
        var typ_now_info = "";

        if (typ_now == "1") {
          typ_now_info = "<span class=\"spn_red\" title=\"한반도 영향 :" + typ_eff2 + "\">진행중</span>";
        }

        var li = document.createElement("li");
        li.setAttribute('data-typ-year', typ_year);
        li.setAttribute('data-typ-seq',  typ_seq);
        li.setAttribute('data-typ-type', typ_type);
        switch (cur_val)
        {
          case "1" : li.setAttribute('onclick', 'fnRetTypFctList(this);'); break;
          case "2" : li.setAttribute('onclick', 'fnRetTypMdlList(this);'); break;
          case "3" : li.setAttribute('onclick', 'fnRetTypRealList(this);'); break;
          case "4" : li.setAttribute('onclick', 'fnRetTypFctList(this);'); break;
        }
        d_li += " <i class=\"fas fa-circle\"></i>";
        d_li += " <span title=\"" + typ_rem + "\">" + typ_info + "</span>" + typ_now_info + "\n";
        li.innerHTML = d_li;
        document.getElementById("typ_list" + cur_val).appendChild(li);
      });
    }
  };
  xhr.send();

  return;
}

// 발표시각 기준 검색 > 태풍 목록 선택
function fnRetTypFctList(eleObj) {
  if (eleObj.classList.contains("no_dt")) {
    return;
  }

  if (fnSetLiClass(eleObj) == false) {
    return;
  }

  var item = document.getElementById("typ_fct_list");
  while (item.hasChildNodes()) {
    item.removeChild(item.childNodes[0]);
  }

  var typ_year_seq = "";
  var typ_type = "";

  var eleArr = eleObj.parentNode.getElementsByTagName("li");
  for (var i=0; i<eleArr.length; i++) {
    if (eleArr[i].classList.contains("active")) {
      var curYear = eleArr[i].getAttribute("data-typ-year").toString();
      var curTypSeq = eleArr[i].getAttribute("data-typ-seq").toString();
      typ_type += eleArr[i].getAttribute("data-typ-type").toString() + "|";
      typ_year_seq += curYear + fnSetZeroLpad(curTypSeq, 2) + "|";
    }
  }

  typ_year_seq = typ_year_seq.slice(0, -1);
  typ_type = typ_type.slice(0, -1);
  var typ_year_seq_arr = typ_year_seq.split("|");
  var typ_type_arr = typ_type.split("|");

  var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=2&typ_year_seq=" + typ_year_seq + "&typ_type=" + typ_type;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        var li = document.createElement("li");
        li.classList.add("no_dt");
        li.innerText = "'태풍 목록' 에서 태풍을 선택하세요.";
        document.getElementById("typ_fct_list").appendChild(li);
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        var d = l.split(",");
        var d_li = "";
        var typ_year = d[0];
        var typ_seq = d[1];
        var typ_fct_tm = d[2];
        var typ_fct_tm_seq = d[3];
        var typ_fct_info = d[4];
        var tc_type = d[5];
        var li_cls = "";

        for(var i=0, len=typ_year_seq_arr.length; i<len; i++) {
          if (typ_year_seq_arr[i] + typ_type_arr[i] == (typ_year.toString() + fnSetZeroLpad(typ_seq.toString(), 2) + tc_type.toString())) {
            li_cls += "t" + i;
            var eleArr = document.getElementById("typ_list1").querySelectorAll("li.active");
            var classArr = eleArr[i].classList;
            for (var j=0; j<classArr.length; j++) {
              if (classArr[j] == "active") {
                continue;
              }

              eleArr[i].classList.remove(classArr[j]);
              j--;
            }
            eleArr[i].classList.add(li_cls);
            break;
          }
        }

        var li = document.createElement("li");
        li.classList.add(li_cls);
        li.setAttribute('data-typ-year', typ_year);
        li.setAttribute('data-typ-seq', typ_seq);
        li.setAttribute('data-typ-tm', typ_fct_tm);
        li.setAttribute('data-typ-tm-seq', typ_fct_tm_seq);
        li.setAttribute('data-typ-type', tc_type);
        li.setAttribute('onclick', 'fnRetTypTr(this);');

        d_li += " <i class=\"fas fa-circle\"></i>";
        d_li += " <span>";
        if (tc_type == "2") d_li += "태풍 ";  
        else d_li += "TD ";  
        d_li += typ_fct_info + "</span>\n";
        d_li += "&nbsp;<i class='fas fa-clock' title='해당 시각으로 이동' onclick='event.stopPropagation(); document.getElementById(\"tm_ana\").value = ";
        d_li += "\"" + typ_fct_tm.substring(0,4) + "." + typ_fct_tm.substring(4,6) + "." + typ_fct_tm.substring(6,8) + "." + typ_fct_tm.substring(8,10) + ":" + typ_fct_tm.substring(10,12) + "\"";
        d_li += "; tm_move(\"+0H\", \"ana\");'></i>\n";
        li.innerHTML = d_li;
        document.getElementById("typ_fct_list").appendChild(li);
      });
    }
  };
  xhr.send();

  return;
}

// 모델 기준 검색 > 태풍 목록 선택
function fnRetTypMdlList(eleObj) {
  if (eleObj.classList.contains("no_dt")) {
    return;
  }

  if (fnSetLiClass(eleObj) == false) {
    return;
  }

  var item = document.getElementById("typ_mdl_list");
  while (item.hasChildNodes()) {
    item.removeChild(item.childNodes[0]);
  }

  var typ_year_seq = "";
  var typ_type = "";

  var eleArr = eleObj.parentNode.getElementsByTagName("li");
  for (var i=0; i<eleArr.length; i++) {
    if (eleArr[i].classList.contains("active")) {
      typ_year_seq += eleArr[i].getAttribute("data-typ-year").toString() + eleArr[i].getAttribute("data-typ-seq").toString() + "|";
      typ_type += eleArr[i].getAttribute("data-typ-type").toString() + "|";
    }
  }

  typ_year_seq = typ_year_seq.slice(0, -1);
  typ_type = typ_type.slice(0, -1);
  var typ_year_seq_arr = typ_year_seq.split("|");
  var typ_type_arr = typ_type.split("|");

  var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=3&typ_year_seq=" + typ_year_seq + "&typ_type=" + typ_type;
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        var li = document.createElement("li");
        li.classList.add("no_dt");
        li.innerText = "'태풍 목록' 에서 태풍을 선택하세요.";
        document.getElementById("typ_mdl_list").appendChild(li);
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        var d = l.split(",");
        var d_li = "";
        var typ_src = d[0];
        var typ_year = d[1];
        var typ_seq = d[2];
        var typ_src_nm = d[3];
        var tc_type = d[4];
        var li_cls = "";

        for(var i=0, len=typ_year_seq_arr.length; i<len; i++) {
          if (typ_year_seq_arr[i] + typ_type_arr[i] == (typ_year.toString() + fnSetZeroLpad(typ_seq.toString(), 2) + tc_type.toString())) {
            li_cls += "t" + i;
            var eleArr = document.getElementById("typ_list2").querySelectorAll("li.active");
            var classArr = eleArr[i].classList;
            for (var j=0; j<classArr.length; j++) {
              if (classArr[j] == "active") {
                continue;
              }

              eleArr[i].classList.remove(classArr[j]);
              j--;
            }
            eleArr[i].classList.add(li_cls);
            break;
          }
        }

        var li = document.createElement("li");
        li.classList.add(li_cls);
        li.setAttribute('data-typ-year', typ_year);
        li.setAttribute('data-typ-seq', typ_seq);
        li.setAttribute('data-typ-src', typ_src);
        li.setAttribute('data-typ-type', tc_type);
        li.setAttribute('onclick', 'fnRetTypTr(this);');

        d_li += " <i class=\"fas fa-circle\"></i>";
        d_li += " <span>[" + typ_year + "년 ";
        if (tc_type == "2") d_li += "태풍 ";  
        else d_li += "TD ";  
        d_li += "제" + typ_seq + "호] " + typ_src_nm + "</span>\n";
        li.innerHTML = d_li;
        document.getElementById("typ_mdl_list").appendChild(li);
      });
    }
  };
  xhr.send();
}

// 태풍 실제경로 검색 > 태풍 목록 선택
function fnRetTypRealList(eleObj) {
  if (eleObj.classList.contains("no_dt")) {
    return;
  }

  if (fnSetLiClass(eleObj) == false) {
    return;
  }

  var trCnt = eleObj.parentNode.querySelectorAll("li.active").length;
  var sequentialScale = d3.scaleSequential().domain([0, trCnt]).interpolator(d3.interpolateRainbow);

  var eleArr = eleObj.parentNode.querySelectorAll("li");
  for (var i=0; i<eleArr.length; i++) {
    if (eleArr[i].classList.contains("active")) {
      eleArr[i].querySelector("i").style.display = "inline-block";
      eleArr[i].querySelector("i").style.color = "#FF0000";
    }
    else {
      eleArr[i].querySelector("i").style.display = "none";
    }
  }

  fnRetTypTr(eleObj);
}

// list li node class add or remove
function fnSetLiClass(eleObj) {
  if (eleObj.classList.contains("active")) {
    if (eleObj.parentNode.getAttribute("name") == "typ_list") {
      var classArr = eleObj.classList;
      for (var i=0; i<classArr.length; i++) {
        eleObj.classList.remove(classArr[i]);
        i--;
      }
    }
    else {
      eleObj.classList.remove("active");
    }
  }
  else {
    if (document.querySelector("div.sidebar-pane.active").classList.contains("real") == false ) {
      if (eleObj.parentNode.querySelectorAll("li.active").length >= 5) {
        alert("최대 5개 까지만 선택 가능합니다.");
        return false;
      }
    }

    if (eleObj.parentNode.getAttribute("name") == "typ_list") {
      var eleArr = eleObj.parentNode.querySelectorAll("li.active");
      for (var i=0; i<eleArr.length; i++) {
        eleArr[i].classList.add("active");
      }

      eleObj.classList.add("active");
    }
    else {
      if (eleObj.parentNode.id == "typ_fct_list") {
        var eleArr = document.getElementById("typ_mdl_list").querySelectorAll("li");
        for (var i=0; i<eleArr.length; i++) {
          eleArr[i].classList.remove("active");
        }
      }
      else if (eleObj.parentNode.id == "typ_mdl_list") {
        var eleArr = document.getElementById("typ_fct_list").querySelectorAll("li");
        for (var i=0; i<eleArr.length; i++) {
          eleArr[i].classList.remove("active");
        }
      }

      eleObj.classList.add("active");
    }
  }

  return true;
}

// 0 LPAD SET
function fnSetZeroLpad(arg1, arg2) {
  var num = arg1 + '';
  var wid = arg2;

  if (num.length >=  wid) {
    return num;
  }else {
    return new Array(wid - num.length + 1).join('0') + num;
  }
}

// 4방위 한글 치환
function fnGetCardinalpointFormat(arg1) {

  var arg_format = "";

  if (typeof(arg1) === "undefined") {
    return "";
  }

  if (arg1.length < 1) {
    return "";
  }

  arg_format = arg1.replace(/E/gi, "동");
  arg_format = arg_format.replace(/W/gi, "서");
  arg_format = arg_format.replace(/S/gi, "남");
  arg_format = arg_format.replace(/N/gi, "북");

  return arg_format;
}

// 전체 해제 버튼
function fnCancelLiAll(eleObj) {

  var curTrgUl = eleObj.getAttribute("data-target");
  var curTrgLi = document.getElementById(curTrgUl).querySelectorAll("li");

  //if (curTrgLi.length < 1) {
  //  return;
  //}

  var removeLayerTrg = curTrgLi;

  if (curTrgUl.indexOf("typ_list") > -1) {
    var parNode = document.querySelector("div.sidebar-content");
    var midNode = parNode.querySelector("div.sidebar-pane.active");

    if (curTrgUl == "typ_list3") {
      var ulNode = document.getElementById(curTrgUl);
    }
    else {
      var ulNode = midNode.querySelector("div.typ_list.mgt27").querySelector("ul");
    }

    removeLayerTrg = ulNode.querySelectorAll("li");
  }

  removeLayerTrg.forEach(function(l) {

    if (l.classList.contains("active") == false) {
      return;
    }

    var curYear = l.getAttribute("data-typ-year");
    var curTyp = l.getAttribute("data-typ-seq");
    var curData = l.getAttribute("data-typ-tm-seq");

    if (typeof(curData) === "undefined") {
      curData = l.getAttribute("data-typ-src");

      if (typeof(curData) === "undefined") {
        curData = "";
      }
    }

    //var curLiData = curYear.toString() + curTyp.toString() + curData.toString();
  });

  for (var i=0; i<=dataLayerCnt; i++) {
    document.getElementById("data-control-"+i).style.display = "none";
  }
  clearTypLayer();

  if (curTrgUl.indexOf("typ_list") > -1) {

    for (var i=0; i<curTrgLi.length; i++) {
      if (curTrgLi[i].classList.contains("no_dt")) {
        continue;
      }

      var classArr = curTrgLi[i].classList;
      for (var j=0; j<classArr.length; j++) {
        curTrgLi[i].classList.remove(classArr[j]);
        j--;
      }
    }

    if (curTrgUl == "typ_list3") {
      for (var i=0; i<removeLayerTrg.length; i++) {
        removeLayerTrg[i].querySelector("i").style.display = "none";
      }
    }
    else {
      var curTrgPar = ulNode;
      while (curTrgPar.hasChildNodes()) {
        curTrgPar.removeChild(curTrgPar.childNodes[0]);
      }
      var li = document.createElement("li");
      li.classList.add("no_dt");
      li.innerText = "'태풍 목록' 에서 태풍을 선택하세요.";
      curTrgPar.appendChild(li);
    }
  }
  else {
    for (var i=0; i<removeLayerTrg.length; i++) {
      removeLayerTrg[i].classList.remove("active");
    }
  }

  //realTrColorList = [];
}

// 태풍 경로 조회
function fnRetTypTr(eleObj) {

  if (eleObj.classList.contains("no_dt")) {
    return;
  }

  for(var i=0; i<=dataLayerCnt; i++) {
    document.getElementById("data-control-"+i).style.display = "none";

    var item = document.getElementById("data-control-real-"+i);
    while (item.hasChildNodes()) {
      item.removeChild(item.childNodes[0]);
    }

    if (i==0) continue;

    document.getElementById("data-control-title-grp-"+i).style.display = "none";
    document.getElementById("data-control-grp-"+i).style.display = "none";
    document.getElementById("data-control-title-mdl-"+i).style.display = "none";
    document.getElementById("data-control-mdl-"+i).style.display = "none";

    var item = document.getElementById("data-control-grp-"+i);
    while (item.hasChildNodes()) {
      item.removeChild(item.childNodes[0]);
    }

    var item = document.getElementById("data-control-mdl-"+i);
    while (item.hasChildNodes()) {
      item.removeChild(item.childNodes[0]);
    }
  }

  clearTypLayer();

  var typ_year_seq = "";
  var typ_tm = "";
  var typ_src = "";
  var typ_tmSeq = "";
  var typ_type = "";
  activeLen = 0;

  var ret_type = eleObj.parentNode.id.split("_")[1];

  if (ret_type == "list3") {
    ret_type = "real";
  }
  else {
    if (fnSetLiClass(eleObj) == false) {
      return;
    }
  }

  var eleArr = eleObj.parentNode.getElementsByTagName("li");
  for (var i=0; i<eleArr.length; i++) {
    if (eleArr[i].classList.contains("active")) {
      typ_year_seq += (eleArr[i].getAttribute("data-typ-year")).toString() + fnSetZeroLpad((eleArr[i].getAttribute("data-typ-seq")).toString(), 2) + "|";

      if (ret_type == "fct") {
        typ_tm += (eleArr[i].getAttribute("data-typ-tm")).toString() + "|";
        typ_tmSeq += (eleArr[i].getAttribute("data-typ-tm-seq")).toString() + "|";
      }else if (ret_type == "mdl") {
        typ_src += (eleArr[i].getAttribute("data-typ-src")).toString() + "|";
      }
      typ_type += (eleArr[i].getAttribute("data-typ-type")).toString() + "|";

      activeLen++;
    }
  }

  if (ret_type == "real") {
    if (activeLen > 0) {
      document.getElementById("data-control-0").style.display = "block";
    }
  }
  else if (ret_type == "fct") {
    if (typ_tm.length == 0) {
      return;
    }
    typ_tm = typ_tm.slice(0, -1);
    typ_tmSeq = typ_tmSeq.slice(0, -1);

    for (var i=0; i<activeLen; i++) {
      document.getElementById("data-control-"+parseInt(i+1)).style.display = "block";
      document.getElementById("data-control-"+parseInt(i+1)).style.right = parseInt(i*255) + "px";

      var el = document.getElementById("data-control-eye-grp-"+parseInt(i+1));
      if (el.classList.contains("fa-eye")) {
        el.classList.remove("fa-eye");
        el.classList.add("fa-eye-slash");
      }

      var el = document.getElementById("data-control-eye-mdl-"+parseInt(i+1));
      if (el.classList.contains("fa-eye-slash")) {
        el.classList.remove("fa-eye-slash");
        el.classList.add("fa-eye");
      }
    }
  }
  else if (ret_type == "mdl") {
    if (typ_src.length == 0) {
      return;
    }
    typ_src = typ_src.slice(0, -1);

    for (var i=0; i<activeLen; i++) {
      document.getElementById("data-control-"+parseInt(i+1)).style.display = "block";
      document.getElementById("data-control-"+parseInt(i+1)).style.right = i*254 + "px";

      var el = document.getElementById("data-control-eye-grp-"+parseInt(i+1));
      if (el.classList.contains("fa-eye")) {
        el.classList.remove("fa-eye");
        el.classList.add("fa-eye-slash");
      }

      var el = document.getElementById("data-control-eye-mdl-"+parseInt(i+1));
      if (el.classList.contains("fa-eye")) {
        el.classList.remove("fa-eye");
        el.classList.add("fa-eye-slash");
      }
    }
  }

  typ_year_seq = typ_year_seq.slice(0, -1);
  typ_type = typ_type.slice(0, -1);

  layGrpNmList = [];
  radLyrList = []; // 강풍반경 관련 배열
  addLyrList = []; // 추가 레이어 목록(상세경로 관련)

  fnSetRealTr(ret_type, typ_year_seq, typ_tm, typ_src, typ_tmSeq, typ_type);  // 실제 경로 표출

  //if (ret_type == "real") {
  //  return;
  //}

  //fnSetExpectTr(ret_type, typ_year_seq, typ_tm, typ_src, typ_type);  // 예측 경로 표출

  return;
}

// 실제 경로 표출
function fnSetRealTr(ret_type, typ_year_seq, typ_tm, typ_src, typ_tmSeq, typ_type) {
  realAjaxNum++;
  var curAjaxNum = realAjaxNum;

  var tmpTypYearSeqList = typ_year_seq.split("|");
  var tmpTypTypeList = typ_type.split("|");

  for (var i=0; i<tmpTypYearSeqList.length; i++) {
    for (var j=0; j<i; j++) {
      if (tmpTypYearSeqList[i]+tmpTypTypeList[i] == tmpTypYearSeqList[j]+tmpTypTypeList[j]) {
        tmpTypYearSeqList.splice(i, 1);
        tmpTypTypeList.splice(i, 1);
        i--;
        break;
      }
    }
  }

  var typ_year_seq2 = "";
  var typ_type2 = "";
  for (var i=0; i<tmpTypYearSeqList.length; i++) {
    if (typ_year_seq2.length > 0) {
      typ_year_seq2 += "|";
      typ_type2 += "|";
    }
    typ_year_seq2 += tmpTypYearSeqList[i];
    typ_type2 += tmpTypTypeList[i];
  }

  var typYearSeqList = typ_year_seq.split("|");
  var typTypeList = typ_type.split("|");
  var typTm = typ_tm.split("|");
  var typSrc = typ_src.split("|");
  var typTmSeq = typ_tmSeq.split("|");
  var beforeStdYyTyp = "";

  var realTrList = [];

  if (ret_type == "real") {
    var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=4b&typ_year_seq=" + typ_year_seq2 + "&typ_type=" + typ_type2;
  }
  else {
    var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=4a&typ_year_seq=" + typ_year_seq2 + "&typ_type=" + typ_type2;
  }
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == realAjaxNum) {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      var trColor = "#FF0000";
      var nowCnt = 0;
      var trCnt = typYearSeqList.length;
      var sequentialScale = d3.scaleSequential().domain([0, trCnt]).interpolator(d3.interpolateRainbow);
      var typTrLayerId;

      typYearSeqList.forEach(function(l_t, idx_t, arr_t) {

        var stdTm = typTm[idx_t];
        var stdSrc = typSrc[idx_t];
        var stdTmSeq = fnSetZeroLpad(typTmSeq[idx_t], 2);
        var stdYyTyp = arr_t[idx_t] + typTypeList[idx_t];
        var stdYy = stdYyTyp.substring(0, 4);
        var stdTyp = fnSetZeroLpad(stdYyTyp.substring(4,stdYyTyp.length-1), 2);

        var preLayGrpNm = "";
        var curLayGrpNm = "";
        var layGrpNm = "";
        var preYyTyp = "";
        var curYyTyp = "";
        var preSrc = "";
        var curSrc = "";
        var preTypNm = "";
        var curTypNm = "";
        var preSeq = "";
        var curSeq = "";
        var preTm = "";
        var curTm = "";
        var curTyp = "";
        var preTcType = "";
        var curTcType = "";
        var curNotiHtml1 = "";
        var curNotiHtml2 = "";
        var fctTit = "";
        var preTypInfoName = "";

        var features = [];
        var pointsTxt_ftTm = [];
        var pointsTxt_ps = [];
        var pointsTxt_ws = [];
        var curPointList = [];
        var points = [];
        var typTrLayer;

        line.some(function(l, idx, arr) {

          if (l[0] == "#") {
            return;
          }

          var d = l.split(",");

          var ft = d[0];
          var yy = d[1];
          var typ = d[2];
          var seq = d[3];
          var tm = d[4];
          var ft_tm = d[5];
          var tmd = d[6];
          var typ_name = d[7];
          var src = d[8];
          var lat = d[9];
          var lon = d[10];
          var ps = d[11];
          var ws = d[12];
          var gr = d[13];
          var ws_ins = d[14];
          var sp = d[15];
          var dir = d[16];
          var rad = d[17];
          var t15 = d[18];
          var ed15 = d[19];
          var er15 = d[20];
          var t25 = d[21];
          var ed25 = d[22];
          var er25 = d[23];
          var typ_group = d[24];
          var tc_group = d[25];
          var status = d[26];
          var typ_group_name = d[27];
          var tc_type = d[28];

          if (typeof(yy) === "undefined") {
            yy = "-9"
          }

          if (typeof(typ) === "undefined") {
            typ = "-9"
          }

          var curYyTyp = yy.toString() + typ_group + tc_type;

          //curSrc = typSrc[idx_t];
          curSrc = src;
          curTypNm = typ_group_name;
          curTcType = tc_type;
          if (tc_type == 1) {
            var curTypNm0 = curTypNm;
            curTypNm = "TD";
          }
          curSeq = seq;
          curTm = tm;
          curTyp = typ;

          var layerChk = false;
          var lastIdx = false;

          if (ret_type == "fct" || ret_type == "real") {
            layGrpNm = stdYy + "|" + stdTyp + "|" + stdTmSeq + "|" + stdTm + "|" + typTypeList[idx_t];
          }
          else if (ret_type == "mdl") {
            layGrpNm = stdYy + "|" + stdTyp + "|" + stdSrc + "|" + typTypeList[idx_t];
          }
          //else {
          //  layGrpNm = "realtracklist";
          //}

          curLayGrpNm = layGrpNm;

          if (idx == arr.length-1) {
            layerChk = true;
            lastIdx = true;
          }

          if (stdYyTyp != curYyTyp && lastIdx != true) {
            return false;
          }

          //if (stdYyTyp != curYyTyp && stdYyTyp == preYyTyp && preYyTyp != "") {
          //  layerChk = true;
          //}

          if (preLayGrpNm + preSrc != curLayGrpNm + curSrc) {
            layerChk = true;
          }

          if (ret_type == "real" && trColor == "#FF0000") {
            trColor = sequentialScale(nowCnt);
          }

          if (curSrc != undefined && curSrc != preSrc) {
            var n = typMdlInfoList.findIndex(function(x){return (x.code == curSrc)});
            if (n != -1) {
              var v = typMdlInfoList[n];
            }
            else {
              return;
            }

            curTypInfoGrp = v.group;
            curTypInfoCode = v.code;
            curTypInfoCodeNm = v.codeNm;
            curTypInfoName = v.name;
            curTypInfoInsttYn = v.insttYn;
            curTypInfoMdlYn = v.mdlYn;
            curTypInfoInsttSort = v.insttSort;
            curTypInfoMdlSort = v.mdlSort;
            curTypInfoNote = v.note;
          }

          if (layerChk && preLayGrpNm != "" && preSrc != "") {
            var layGrpNmS = layGrpNm.split("|");

            var layGrpNmS0 = layGrpNmS[0];
            var layGrpNmS1 = layGrpNmS[1];
            var layGrpNmS2 = layGrpNmS[2];
            var layGrpNmS3 = layGrpNmS[3];

            var realLayGrpNm = layGrpNm + "|real";

            fctTit = layGrpNmS0 + "년 제" + layGrpNmS1 + "-" + preSeq + "호";

            if (ret_type == "fct") {
              var tmFormatSet = stdTm.substr(0, 4) + "." + stdTm.substr(4, 2) + "." + stdTm.substr(6, 2) + "." + stdTm.substr(8, 2) + ":" + stdTm.substr(10, 2);
              overlayTitle = layGrpNmS0 + "년 제" + layGrpNmS1 + "-" + layGrpNmS2 + "호 " + preTypNm + "<br/>(" + tmFormatSet + ")";
             
            }
            else if (ret_type == "mdl") {
              overlayTitle = layGrpNmS0 + "년 제" + layGrpNmS1 + "호 " + preTypNm + "<br/>(" + typSrc[idx_t] +")";
              stdTm = preTm;
            }
            else if (ret_type == "real") {
              overlayTitle = "과거 태풍 목록"
              stdTm = preTm;
              realLayGrpNm += "|" + preTyp;
              fctTit = preYyTyp.substr(0, 4) + "년 제" + preYyTyp.substring(4,preYyTyp.length-1) + "호";
            }

            if (layGrpNmList.indexOf(layGrpNm) < 0) {
              layGrpNmList.push(layGrpNm);
            }

            var curTit = "분석 경로";
            var objIdx = layGrpNmList.indexOf(layGrpNm);

            var realTrInfo = layGrpNmS0 + "|" + layGrpNmS1 + "|" + preTcType + "|" + preSrc;
            if (realTrList.indexOf(realTrInfo) == -1) {
              if (preSrc == "KMA") {
                var paneName = "realTr";
              }
              else {
                var paneName = "expectTr";
              }

              realTrList.push(realTrInfo);
              curNotiHtml1 = fnGetTrNoti("linetooltip", "real", trColor, preTypNm, stdTm, "", preTypInfoName, "분석경로", "분석경로", fctTit);
              var polyLine = L.polyline(points, {color:trColor, opacity:1, className:"typKmaRealTr", pane:paneName, weight:2, pmIgnore:true, snapIgnore:true}).bindTooltip(curNotiHtml1, {sticky:true});
              //curPolyLineList.push(polyLine);
              features.unshift(polyLine);

              typTrLayer = L.featureGroup(features, {pane:paneName});
              //  .on("add", function(e) { fnFilterTextLayer(1); })
              //  .on("remove", function(e) { fnFilterTextLayer(1); });
              typTrLayer.properties = {layGrpNm :realLayGrpNm};
              if (preSrc == "KMA") {
                typTrLayer.addTo(map);
              }
              typTrLayerId = typTrLayer._leaflet_id;
              typTrLayerList.push(typTrLayer);
            }
            else{
              typTrLayerId = typTrLayerList[realTrList.indexOf(realTrInfo)]._leaflet_id;
            }

            if (ret_type != "real") {
              var src_nm = "";
              switch (preSrc) {
                case "KMA"  : src_nm = "태풍센터";   break;
                case "WRC"  : src_nm = "레이더센터";  break;
                case "NMSC" : src_nm = "위성센터";   break;
                default     : src_nm = "";        break;
              }

              if (preSrc == "KMA") {
                document.getElementById("data-control-label-"+parseInt(objIdx+1)).innerHTML = overlayTitle;
              }

              var li = document.createElement("li");
              var d_li = "";
              li.setAttribute('data-id', typTrLayerId);
              li.setAttribute('data-type', 'real');
              li.setAttribute('onclick', 'toggleTypLayer(this);');
              if (preSrc == "KMA") {
                d_li += " <label><input class=\"panel-layers-selector real\" data-id=\"" + typTrLayerId + "\"type=\"checkbox\" checked>";
              }
              else {
                d_li += " <label><input class=\"panel-layers-selector real\" data-id=\"" + typTrLayerId + "\"type=\"checkbox\">";
              }
              d_li += " <i class=\"fas fa-circle\" style=\"color:" + trColor + ";\"></i>";
              d_li += " <span>" + curTit + "</span></label>" + "\n";

              d_li += " <span class=\"country\">" + src_nm + "</span>";

              li.innerHTML = d_li;

              document.getElementById("data-control-real-"+parseInt(objIdx+1)).appendChild(li);
            }
            else {
              document.getElementById("data-control-label-0").innerHTML = overlayTitle;

              fctTit += " " + preTypNm;

              var li = document.createElement("li");
              var d_li = "";
              li.setAttribute('data-id', typTrLayerId);
              li.setAttribute('data-type', 'real');
              li.setAttribute('onclick', 'toggleTypLayer(this);');
              d_li += " <label><input class=\"panel-layers-selector real\" data-id=\"" + typTrLayerId + "\"type=\"checkbox\" checked>";
              d_li += " <i class=\"fas fa-circle\" style=\"color:" + trColor + ";\"></i>";
              d_li += " <span>" + fctTit + "</span></label>" + "\n";
              li.innerHTML = d_li;

              document.getElementById("data-control-real-0").appendChild(li);
            }

            features = [];
            pointsTxt_ftTm = [];
            pointsTxt_ps = [];
            pointsTxt_ws = [];
            curPointList = [];
            points = [];
            typTrLayer = null;
            typTrTxt = null;

            ++nowCnt;

            if (ret_type == "real") {
              trColor = sequentialScale(nowCnt);
              return true;
            }
            else {
              switch (curSrc) {
                case "KMA"  : trColor = "#FF0000";  break;
                case "WRC"  : trColor = "#00FF00";  break;
                case "NMSC" : trColor = "#0000FF";  break;
                default     : trColor = "#FF0000";  break;
              }
            }
          }

          if (lastIdx) {
            return;
          }

          var latLng = new L.LatLng(lat, lon);

          if (stdYyTyp == curYyTyp) {

            var t_obj = new Object();
            t_obj.yyTyp = curYyTyp;
            t_obj.tm = tm;
            t_obj.latLon = latLng;
          }

          fctTit = stdYy + "년 제" + typ + "-" + curSeq + "호";

          var curTit = curTypNm;
          if (tc_type == 1) {
            var curTit = curTypNm0;
          }

          if (tc_group == "TD") {
            if (gr == "LOW") {
              curTit = "온대저기압";
            }
            else {
              curTit = "열대저압부";
            }

            fctTit = stdYy + "년 제" + typ + "-" + curSeq + "호";
          }

          //curNotiHtml1 = fnGetTrNoti("popup", "real", trColor, curTit, tm, "", "KMA", "실제경로", "기상청 실제경로", fctTit, lat, lon, ws, ps, er15, ed15, dir, sp);
          curNotiHtml2 = fnGetTrNoti("circletooltip", "real", trColor, curTit, tm, "", curTypInfoName, "분석경로", "분석경로", fctTit, lat, lon, ws, ps);

          var curPoint;
          var nextArr = arr[idx+1].split(",");
          var nextYy = nextArr[1];
          var nextTypGrp = nextArr[24];

          if (typeof(nextYy) === "undefined") { nextYy = ""; }
          if (typeof(nextTypGrp) === "undefined") { nextTypGrp = ""; }

          var curTmp1 = yy.toString() + typ_group.toString();
          var curTmp2 = nextYy.toString() + nextTypGrp.toString();

          if ((curTmp1 != curTmp2 || idx == arr.length-2) && parseInt(status) == 2) {
            if (curSrc == "KMA") {
              var paneName = "realTr";
            }
            else {
              var paneName = "expectTr";
            }

            curPoint = L.marker([lat, lon], 
              {icon:L.divIcon({
                    className:"typ-end-point",
                    html:x_icon.replace('trColor', trColor),
                    iconSize:new L.Point(18, 18),
                    pane:paneName
                  }), pane:paneName, pmIgnore:true, snapIgnore:true});

          }
          else {
            if (curSrc == "KMA") {
              var paneName = "realTr";
            }
            else {
              var paneName = "expectTr";
            }

            var curFillColor = trColor;

            // 열대저압부, 온대저기압은 동그라미 흰색으로 채우기
            if (tc_group == "TD") {
              curFillColor = "#FFFFFF";
            }

            curPoint = L.circleMarker(latLng, {radius:2.5, color:trColor, fill:true, fillColor:curFillColor, fillOpacity:1, opacity:1, weight:1.5, pane:paneName, pmIgnore:true, snapIgnore:true});
          }

          curPoint.options.fttm = ft_tm;
          curPoint
          .bindTooltip(curNotiHtml2)
          .on("click", function() {
            var cur_control_idx = layGrpNmList.indexOf(layGrpNm);
            var cur_fttm = ft_tm;

            if (cur_control_idx < 0) {
              cur_control_idx = 0;
            }

            fnGetSameTimePoint(cur_control_idx, cur_fttm);
          });

          features.push(curPoint);
          points.push(latLng);

          preLayGrpNm = curLayGrpNm;
          preTypInfoName = curTypInfoName;
          preYyTyp = curYyTyp;
          preSrc = curSrc;
          preTypNm = curTypNm;
          preTcType = curTcType;
          preSeq = curSeq;
          preTm = curTm;
          preTyp = curTyp;
        });

        beforeStdYyTyp = stdYyTyp;
      });

      if (ret_type == "real") {
        return;
      }

      fnSetExpectTr(ret_type, typ_year_seq, typ_tm, typ_src, typ_type);  // 예측 경로 표출
    }
  };
  xhr.send();

  return;
}

// 예측 경로 표출
function fnSetExpectTr(ret_type, typ_year_seq, typ_tm, typ_src, typ_type) {

  expectAjaxNum++;
  var curAjaxNum = expectAjaxNum;

  var url = host + "/fgd/typ/typ_cou_dgn_lib.php?mode=5&typ_year_seq=" + typ_year_seq + "&typ_tm=" + typ_tm + "&typ_src=" + typ_src + "&typ_type=" + typ_type;
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == expectAjaxNum) {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      var preLayGrpNm = "";
      var curLayGrpNm = "";
      var preSrc = "";
      var curSrc = "";
      var preSeq = "";
      var curSeq = "";
      var preTm = "";
      var curTm = "";
      var preFttm = "";
      var curFttm = "";
      var preTypNm = "";
      var curTypNm = "";
      var overlayTitle = "";
      var overlaySubTitle = "";
      var overlayTxt = "";
      var fctTit = "";
      var curNotiHtml1 = "";
      var curNotiHtml2 = "";
      var preTypInfoGrp = "";
      var curTypInfoGrp = "";
      var preTypInfoCode = "";
      var curTypInfoCode = "";
      var preTypInfoCodeNm = "";
      var curTypInfoCodeNm = "";
      var preTypInfoName = "";
      var curTypInfoName = "";
      var preTypInfoInsttYn = "";
      var curTypInfoInsttYn = "";
      var preTypInfoMdlYn = "";
      var curTypInfoMdlYn = "";
      var preTypInfoInsttSort = "";
      var curTypInfoInsttSort = "";
      var preTypInfoMdlSort = "";
      var curTypInfoMdlSort = "";
      var preTypInfoNote = "";
      var curTypInfoNote = "";

      var features = [];
      var pointsTxt_ftTm = [];
      var pointsTxt_ps = [];
      var pointsTxt_ws = [];
      var curPointList = [];
      var kmaTrRadArr = [];
      var kmaTrRadDetArr = [];
      var kmaTrRad, kmaTrRadDet;
      var kmaTrDetArr = [];
      var kmaTrDet;

      var points = [];
      var points1 = [];
      var points2 = [];
      var typTrLayer;
      var typTrTxt;
      var trCnt = 0;
      var nowCnt = 0;

      var lastStr = line[line.length-2];

      if (lastStr.indexOf("trCnt") > -1) {
        trCnt = (lastStr.split(":"))[1];
      }

      var sequentialScale = d3.scaleSequential().domain([0, trCnt]).interpolator(d3.interpolateRainbow);

      line.forEach(function(l, idx, arr) {
        if (l[0] == "#") {
          return;
        }

        var d = l.split(",");

        var ft = d[0];
        var yy = d[1];
        var typ = d[2];
        var seq = d[3];
        var tm = d[4];
        var ft_tm = d[5];
        var tmd = d[6];
        var typ_name = d[7];
        var src = d[8];
        var lat = d[9];
        var lon = d[10];
        var ps = d[11];
        var ws = d[12];
        var gr = d[13];
        var ws_ins = d[14];
        var sp = d[15];
        var dir = d[16];
        var rad_15 = d[17];
        var er_15 = d[18];
        var ed_15 = d[19];
        var rad_25 = d[20];
        var er_25 = d[21];
        var ed_25 = d[22];
        var rad_pr = d[23];
        var intensity = d[24];
        var scale = d[25];
        var tc_type = d[38];

        if (typ_src != "" && ft == 2) {
          return;
        }

        if (ret_type == "fct") {
          curLayGrpNm = yy + "|" + typ + "|" + seq + "|" + tm + "|" + tc_type;
        }
        else if (ret_type == "mdl") {
          curLayGrpNm = yy + "|" + typ + "|" + src + "|" + tc_type;
        }

        curSrc = src;
        curSeq = seq;
        curTm = tm;
        curFttm = ft_tm;
        curTypNm = typ_name;

        var layerChk = false;
        var lastIdx = false;

        if (ret_type == "fct") {
          if (preLayGrpNm + preSrc != curLayGrpNm + curSrc) {
            layerChk = true;
          }
        }
        else if (ret_type == "mdl") {
          if (preLayGrpNm + preTm != curLayGrpNm + curTm) {
            layerChk = true;
          }
        }

        if (idx == arr.length-1) {
          layerChk = true;
          lastIdx = true;
        }

        if (curSrc != undefined && curSrc != preSrc) {
          var n = typMdlInfoList.findIndex(function(x){return (x.code == curSrc)});
          if (n != -1) {
            var v = typMdlInfoList[n];
          }
          else {
            return;
          }

          curTypInfoGrp = v.group;
          curTypInfoCode = v.code;
          curTypInfoCodeNm = v.codeNm;
          curTypInfoName = v.name;
          curTypInfoInsttYn = v.insttYn;
          curTypInfoMdlYn = v.mdlYn;
          curTypInfoInsttSort = v.insttSort;
          curTypInfoMdlSort = v.mdlSort;
          curTypInfoNote = v.note;
        }

        var trColor = sequentialScale(nowCnt);

        if (layerChk && preLayGrpNm != "" && preSrc != "") {

          var preLayGrpNmS = preLayGrpNm.split("|");

          var preLayGrpNmS0 = preLayGrpNmS[0];
          var preLayGrpNmS1 = preLayGrpNmS[1];
          var preLayGrpNmS2 = preLayGrpNmS[2];

          var tmFormatSet = preTm.substr(0, 4) + "." + preTm.substr(4, 2) + "." + preTm.substr(6, 2) + "." + preTm.substr(8, 2) + ":" + preTm.substr(10, 2);

          if (ret_type == "fct") {
            overlayTxt = preTypInfoCodeNm;
            overlayTitle = preLayGrpNmS0 + "년 제" + preLayGrpNmS1 + "-" + preLayGrpNmS2 + "호 " + preTypNm + "<br/>(" + tmFormatSet + ")";
          }
          else if (ret_type == "mdl") {
            overlayTxt = "제" + preLayGrpNmS1 + "-" + preSeq + "호 (" + tmFormatSet + ")";
            overlayTitle = preLayGrpNmS0 + "년 제" + preLayGrpNmS1 + "호 " + preTypNm + "<br/>(" + preTypInfoCodeNm +")";
          }

          fctTit = preLayGrpNmS0 + "년 제" + preLayGrpNmS1 + "-" + preSeq + "호";

          curNotiHtml1 = fnGetTrNoti("linetooltip", "expect", trColor, preTypNm, preTm, preFttm, preTypInfoCodeNm, preTypInfoName, preTypInfoNote, fctTit);

          var polyLine = L.polyline(points, {color:trColor, opacity:1, weight:2, className:"typMdlTr", dashArray:"5,5", pane:"expectTr", pmIgnore:true, snapIgnore:true}).bindTooltip(curNotiHtml1, {sticky:true});            
          // 분석경로
          var polyLine1 = L.polyline(points1, {color:trColor, opacity:1, weight:2, className:"typMdlTr", pane:"expectTr", pmIgnore:true, snapIgnore:true}).bindTooltip(curNotiHtml1, {sticky:true});
          // KMA 상세경로(3시간)
          if (preSrc == "KMA" && typ_src == "") {
            var polyLine2 = L.polyline(points2, {color:trColor, opacity:1, weight:2, className:"typMdlTr", dashArray:"5,5", pane:"expectTr", pmIgnore:true, snapIgnore:true}).bindTooltip(curNotiHtml1, {sticky:true});
          }

          var expectLayGrpNm = preLayGrpNm + "|expect";

          if (ret_type == "fct") {
            expectLayGrpNm += "|" + preSrc;
          }
          else if (ret_type == "mdl") {
            expectLayGrpNm += "|" + preTm;
          }

                      
          if (preSrc == "KMA" && typ_src == "") {
            //강풍반경
            kmaTrRad = L.featureGroup(kmaTrRadArr);
            kmaTrRad.options.color = trColor;
            //features.unshift(kmaTrRad);
            var radLyrId = kmaTrRad._leaflet_id;
            radLyrList.push(kmaTrRad);

            kmaTrRadDet = L.featureGroup(kmaTrRadDetArr);
            //features.unshift(kmaTrRadDet);
            var radDetLyrId = kmaTrRadDet._leaflet_id;
            radLyrList.push(kmaTrRadDet);

            kmaTrDet = L.featureGroup(kmaTrDetArr);
            //features.unshift(kmaTrDet);
            var detLyrId = kmaTrDet._leaflet_id;
            addLyrList.push(kmaTrDet);

            //점선 : 모델별위경도(예측+분석)
            //curPolyLineList.push(polyLine);
            var kmaLine = [];
            kmaLine.push(polyLine);
            var kmaLineGr = L.featureGroup(kmaLine);
            features.unshift(kmaLineGr);
            var kmaLineId = kmaLineGr._leaflet_id;
            addLyrList.push(kmaLineGr);

            //curPolyLineList.push(polyLine1);
            features.unshift(polyLine1);

            //curPolyLineList.push(polyLine2);
            var kmaDetLine = [];
            kmaDetLine.push(polyLine2);
            var kmaDetLineGr = L.featureGroup(kmaDetLine);
            //features.unshift(kmaDetLineGr);
            var kmaDetLineId = kmaDetLineGr._leaflet_id;
            addLyrList.push(kmaDetLineGr);
          }
          else {
            radLyrId = "";
            detLyrId = "";
            kmaLineId = "";
            radDetLyrId = "";
            kmaDetLineId = "";
            //점선 : 모델별위경도(예측+분석)
            //curPolyLineList.push(polyLine);
            //curPolyLineList.push(polyLine1);
            features.unshift(polyLine);
            features.unshift(polyLine1);
          }

          typTrLayer = L.featureGroup(features, {pane:"expectTr"});
          typTrLayer.properties = {layGrpNm :expectLayGrpNm};

          var objIdx = layGrpNmList.indexOf(preLayGrpNm);
          var li = document.createElement("li");
          var d_li = "";
          li.setAttribute('data-id', typTrLayer._leaflet_id);
          li.setAttribute('data-idx', parseInt(objIdx+1));
          if (ret_type == "fct" && preTypInfoInsttYn == "Y") {
            li.setAttribute('data-src', preTypInfoCodeNm);
          }
          li.setAttribute('onclick', 'toggleTypLayer(this);');
          if ((ret_type == "fct" && preTypInfoInsttYn == "Y") || ret_type == "mdl") {
            d_li += " <label><input class=\"panel-layers-selector\" type=\"checkbox\" checked>";
          }
          else {
            d_li += " <label><input class=\"panel-layers-selector\" type=\"checkbox\">";
          }
          d_li += " <i class=\"fas fa-circle\" style=\"color:" + trColor + ";\"></i>";
          if (ret_type == "fct") {
            d_li += " <span>" + preTypInfoCodeNm + "</span>";

            if (preTypInfoInsttYn == "Y") {
              var country_nm = "";

              switch (preTypInfoCodeNm) {
                case "KMA"  : country_nm = "대한민국"; break;
                case "JTWC" : country_nm = "미국";    break;
                case "RSMC" : country_nm = "일본";    break;
                case "BABJ" : country_nm = "중국";    break;
                default     : country_nm = "";       break;
              }

              if (preTypInfoCodeNm == "KMA") {
                d_li += "<i class=\"fas fa-wind plus-icon\" style=\"margin-left:10px;\" id=\"rad-grp-" + parseInt(objIdx+1) + "\" data-idx=\"" + parseInt(objIdx+1) + "\" rad-id=\"" + radLyrId + "\" rad-det-id=\"" + radDetLyrId + "\" det-id=\"" + detLyrId + "\" kma-line-id=\"" + kmaLineId + "\" kma-det-line-id=\"" + kmaDetLineId + "\" onclick=\"toggleRadLayer(this); return false;\" title=\"강풍반경\"></i>";
                d_li += "<i class=\"fas fa-ellipsis-h plus-icon\" id=\"det-grp-" + parseInt(objIdx+1) + "\" data-idx=\"" + parseInt(objIdx+1) + "\" rad-id=\"" + radLyrId + "\" rad-det-id=\"" + radDetLyrId + "\" det-id=\"" + detLyrId + "\" kma-line-id=\"" + kmaLineId + "\" kma-det-line-id=\"" + kmaDetLineId + "\" onclick=\"toggleDetLayer(this); return false;\" title=\"상세예보(3HR)\"></i>";
              }
              d_li += " <span class=\"country\">" + country_nm + "</span>";
            }

            d_li += " </label>" + "\n";
          }
          else if (ret_type == "mdl") {
            d_li += " <span>" + overlayTxt + "</span></label>" + "\n";
          }
          li.innerHTML = d_li;

          if (preTypInfoInsttYn == "Y") {
            document.getElementById("data-control-title-grp-"+parseInt(objIdx+1)).style.display = "block";
            document.getElementById("data-control-grp-"+parseInt(objIdx+1)).style.display = "block";
            document.getElementById("data-control-grp-"+parseInt(objIdx+1)).appendChild(li);
          }
          else {
            document.getElementById("data-control-title-mdl-"+parseInt(objIdx+1)).style.display = "block";
            document.getElementById("data-control-mdl-"+parseInt(objIdx+1)).style.display = "block";
            document.getElementById("data-control-mdl-"+parseInt(objIdx+1)).appendChild(li);
          }

          if ((ret_type == "fct" && preTypInfoInsttYn == "Y") || ret_type == "mdl") {
            typTrLayer.addTo(map);
          }
          typTrLayerList.push(typTrLayer);

          features= [];
          points = [];
          points1 = [];
          points2 = [];
          pointsTxt_ftTm = [];
          pointsTxt_ps = [];
          pointsTxt_ws = [];
          curPointList = [];
          kmaTrRadArr = [];
          kmaTrRadDetArr = [];
          kmaTrDetArr = [];
          typTrLayer = null;
          typTrTxt = null;

          ++nowCnt;
          trColor = sequentialScale(nowCnt);
        }

        if (lastIdx) {
          return;
        }

        var latLng = new L.LatLng(lat, lon);

        fctTit = yy + "년 제" + typ + "-" + seq + "호";

        //curNotiHtml1 = fnGetTrNoti("popup", "expect", trColor, typ_name, tm, ft_tm, curTypInfoCodeNm, curTypInfoName, curTypInfoNote, fctTit, lat, lon, ws, ps, er_15, ed_15, dir, sp);
        curNotiHtml2 = fnGetTrNoti("circletooltip", "expect", trColor, typ_name, tm, ft_tm, curTypInfoCodeNm, curTypInfoName, curTypInfoNote, fctTit, lat, lon, ws, ps);

        var nextArr = arr[idx+1].split(",");

        var nextLayGrpNm;
        var tmpLayGrpNm;
        var curPoint;

        if (nextArr.length <= 1) {
          nextLayGrpNm = "1";
          tmpLayGrpNm = "0";
        }
        else {
          var nextYy = nextArr[1];
          var nextTyp = nextArr[2];
          var nextSeq = nextArr[3];
          var nextTm = nextArr[4];
          var nextSrc = nextArr[8];
          var nextType = nextArr[26];

          if (ret_type == "fct") {
            nextLayGrpNm = nextYy + "|" + nextTyp + "|" + nextSeq + "|" + nextTm + "|" + nextType + "|" + nextSrc;
            tmpLayGrpNm = curLayGrpNm + "|" + src;
          }
          else if (ret_type == "mdl") {
            nextLayGrpNm = nextYy + "|" + nextTyp + "|" + nextSrc + "|" + nextType + "|" + nextTm;
            tmpLayGrpNm = curLayGrpNm + "|" + tm;
          }
        }

        if ((Number(ws) < 0 || (intensity == "-" && scale == "-")) && curSrc == "KMA" && tmpLayGrpNm != nextLayGrpNm && nextYy >= 2010) {

          curPoint = L.marker([lat, lon], 
            {icon:L.divIcon({
                  className:"typ-end-point",
                  html:x_icon.replace('trColor', trColor),
                  iconSize:new L.Point(15, 15),
                  iconAnchor:[8, 8],
                  pane:"expectTr"
                }), pane:"expectTr", pmIgnore:true, snapIgnore:true});
        }
        else {
          var curFillColor = trColor;

          // 열대저압부, 온대저기압은 동그라미 흰색으로 채우기
          if (gr == "TD" || gr == "LOW") {
            curFillColor = "#FFFFFF";
          }

          curPoint = L.circleMarker(latLng, {radius:3, color:trColor, fill:true, fillColor:curFillColor, fillOpacity:1, opacity:1, weight:2, pane:"expectTr", pmIgnore:true, snapIgnore:true});
        }

        curPoint.options.fttm = ft_tm;
        curPoint
        .bindTooltip(curNotiHtml2)
        .on("click", function() {
          var cur_control_idx = layGrpNmList.indexOf(curLayGrpNm);
          var cur_fttm = ft_tm;

          if (cur_control_idx < 0) {
            cur_control_idx = 0;
          }

          fnGetSameTimePoint(cur_control_idx, cur_fttm);
        });
/*
        curPoint
        .bindPopup(curNotiHtml1)
        .bindTooltip(curNotiHtml2)
          .on("click", function() {
            var cur_control_idx = layGrpNmList.indexOf(curLayGrpNm);
            var cur_fttm = ft_tm;

            if (cur_control_idx < 0) {
              cur_control_idx = 0;
            }

            fnGetSameTitmePoint(cur_control_idx, cur_fttm);
          });

          var pointTxt_tm = fnSetZeroLpad(ft_tm.substr(4, 2),2) + "." + fnSetZeroLpad(ft_tm.substr(6, 2),2) + "." + fnSetZeroLpad(ft_tm.substr(8, 2),2) + ":00";
          var pointTxt_ps = (ps >= 0) ? ps + " hPa" :"&nbsp;";
          var pointTxt_ws = (ws >= 0) ? ws + " m/s" :"&nbsp;";
*/
        if (src == "KMA" && ft == 2) {
          kmaTrDetArr.push(curPoint);
          points2.push(latLng);
        }
        else if (ft != 2) {
          features.push(curPoint);
          curPointList.push(curPoint);
          points.push(latLng); //points  => 점선 : 모델별위경도(예측+분석)
          points2.push(latLng); //points2 => 상세경로

          //points1 => 실선 : 모델별위경도(분석)
          if (tm >= ft_tm) {
            points1.push(latLng);
          }         
        }          


        // KMA Track 예외 반경
        if (tm <= ft_tm && src == "KMA") {                
          var kmaTrRadGr = [];
          // 15m/s 예외 반경
          var kma15msRad = trRad(lat, lon, "15", rad_15, er_15, ed_15);
          
          kmaTr15Rad = L.polygon(kma15msRad, {color:'#4c4cef', opacity:0.3, fillOpacity:0.1, className:"typMdlTr15Rad", dashArray:"5,10", weight:"2", pane:"expectTr", pmIgnore:true, snapIgnore:true, focus:false, hover:false});
          kmaTrRadGr.push(kmaTr15Rad);
          
          // 25m/s 예외 반경
          var kma25msRad = trRad(lat, lon, "25", rad_25, er_25, ed_25);
        
          if (kma25msRad != false) {
            kmaTr25Rad = L.polygon(kma25msRad, {color:'#0012ff', opacity:1, fillOpacity:0.1, className:"typMdlTr25Rad", dashArray:"5,10", weight:"2", pane:"expectTr", pmIgnore:true, snapIgnore:true, focus:false, hover:false});
            kmaTrRadGr.push(kmaTr25Rad);
          }

          var kmaTrRadGrArr = L.featureGroup(kmaTrRadGr)
          .bindTooltip(curNotiHtml2, {sticky:true})
          //.bindPopup(curNotiHtml1)
          .on("mouseover", function(e) {
            e.target.eachLayer(function(layer){
              if (layer.options.className == 'typMdlTr15Rad') {
                layer.setStyle({color:'#EE0000', weight:5, dashArray:""});
              }
              else if (layer.options.className == 'typMdlTr25Rad') {
                layer.setStyle({color:'#FF0000', weight:5, dashArray:""});
              }
            })
          })
          .on("mouseout", function(e) {
            e.target.eachLayer(function(layer){
              if (!layer.options.hover) {
                if (layer.options.className == 'typMdlTr15Rad') {
                  layer.setStyle({color:'#4c4cef', weight:2, dashArray:"5,10"});
                }
                else if (layer.options.className == 'typMdlTr25Rad') {
                  layer.setStyle({color:'#0012ff', weight:2, dashArray:"5,10"});
                }
              }
            })
          }); 

          if (ft != 2) {
            kmaTrRadArr.push(kmaTrRadGrArr);
          }
          kmaTrRadDetArr.push(kmaTrRadGrArr);
          kmaTrRadGr = [];
        }

        preLayGrpNm = curLayGrpNm;
        preSrc = curSrc;
        preSeq = curSeq;
        preTm = curTm;
        preFttm = curFttm;
        preTypNm = curTypNm;
        preTypInfoGrp = curTypInfoGrp;
        preTypInfoCode = curTypInfoCode;
        preTypInfoCodeNm = curTypInfoCodeNm;
        preTypInfoName = curTypInfoName;
        preTypInfoInsttYn = curTypInfoInsttYn;
        preTypInfoMdlYn = curTypInfoMdlYn;
        preTypInfoInsttSort = curTypInfoInsttSort;
        preTypInfoMdlSort = curTypInfoMdlSort;
        preTypInfoNote = curTypInfoNote;
      });
    }
  };
  xhr.send();

  return;
}

// 태풍 레이어 토글
function toggleTypLayer(node) {
  if (node.querySelector("input").checked) {
    for (var i = 0; i < typTrLayerList.length; i++) {
      if (typTrLayerList[i]._leaflet_id == node.getAttribute("data-id")) {
        map.addLayer(typTrLayerList[i]);
        break;
      }
    }

    if (node.getAttribute("data-type") != undefined && node.getAttribute("data-type") == "real") {
      var eleArr = document.querySelectorAll(".panel-layers-selector.real");
      for (var i=0; i<eleArr.length; i++) {
        if (eleArr[i].getAttribute("data-id") != node.getAttribute("data-id")) {
          continue;
        }
        eleArr[i].checked = true;
      }
    }

    if (node.getAttribute("data-src") != undefined && node.getAttribute("data-src") == "KMA") {
      var idx = node.getAttribute("data-idx");
      var el = document.getElementById("det-grp-" + idx);

      if (el.classList.contains("active")) {
        if (document.getElementById("rad-grp-" + idx).classList.contains("active")) {
          showRadLyr(el.getAttribute("rad-det-id"));
        }
        showAddLyr(el.getAttribute("det-id"));
        showAddLyr(el.getAttribute("kma-det-line-id"));
        hideAddLyr(el.getAttribute("kma-line-id"));
      }
      else {
        if (document.getElementById("rad-grp-" + idx).classList.contains("active")) {
          showRadLyr(el.getAttribute("rad-id"));
        }
      }
    }

    for (var i = 0; i < typSameTimeLyrList.length; i++) {
      if (typSameTimeLyrList[i].options.layerid == node.getAttribute("data-id")) {
        map.addLayer(typSameTimeLyrList[i]);
        break;
      }
    }
  }
  else {
    for (var i = 0; i < typTrLayerList.length; i++) {
      if (typTrLayerList[i]._leaflet_id == node.getAttribute("data-id")) {
        map.removeLayer(typTrLayerList[i]);
        break;
      }
    }

    if (node.getAttribute("data-type") != undefined && node.getAttribute("data-type") == "real") {
      var eleArr = document.querySelectorAll(".panel-layers-selector.real");
      for (var i=0; i<eleArr.length; i++) {
        if (eleArr[i].getAttribute("data-id") != node.getAttribute("data-id")) {
          continue;
        }
        eleArr[i].checked = false;
      }
    }

    if (node.getAttribute("data-src") != undefined && node.getAttribute("data-src") == "KMA") {
      var idx = node.getAttribute("data-idx");
      var el = document.getElementById("det-grp-" + idx);

      if (el.classList.contains("active")) {
        if (document.getElementById("rad-grp-" + idx).classList.contains("active")) {
          hideRadLyr(el.getAttribute("rad-det-id"));
        }

        hideAddLyr(el.getAttribute("det-id"));
        hideAddLyr(el.getAttribute("kma-det-line-id"));
      }
      else {
        if (document.getElementById("rad-grp-" + idx).classList.contains("active")) {
          hideRadLyr(el.getAttribute("rad-id"));
        }
      }
    }

    for (var i = 0; i < typSameTimeLyrList.length; i++) {
      if (typSameTimeLyrList[i].options.layerid == node.getAttribute("data-id")) {
        map.removeLayer(typSameTimeLyrList[i]);
        break;
      }
    }
  }

  return;
}

// 태풍 레이어 초기화
function clearTypLayer() {
  for (var i = 0; i < typTrLayerList.length; i++) {
    typTrLayerList[i].clearLayers();
    typTrLayerList.splice(i, 1);
    i--;
  }

  for (var i = 0; i < radLyrList.length; i++) {
    radLyrList[i].clearLayers();
    radLyrList.splice(i, 1);
    i--;
  }

  for (var i = 0; i < addLyrList.length; i++) {
    addLyrList[i].clearLayers();
    addLyrList.splice(i, 1);
    i--;
  }

  for (var i = 0; i < typSameTimeLyrList.length; i++) {
    map.removeLayer(typSameTimeLyrList[i]);
    typSameTimeLyrList.splice(i, 1);
    i--;
  }

  return;
}

// 컨트롤 목록 토글
function toggleControlList(node) {
  var objIdx = node.getAttribute("data-objIdx");
  var retType = node.getAttribute("data-type");

  var eleArr = document.getElementById("data-control-" + retType + "-" + objIdx).getElementsByTagName("li");
  for (var i=0; i<eleArr.length; i++) {
    if (node.querySelector("i").classList.contains("fa-eye")) {
      if (eleArr[i].querySelector("input").checked == false) {
        eleArr[i].querySelector("input").checked = true;
        toggleTypLayer(eleArr[i]);
      }
    }
    else {
      if (eleArr[i].querySelector("input").checked) {
        eleArr[i].querySelector("input").checked = false;
        toggleTypLayer(eleArr[i]);
      }
    }
  }

  if (node.querySelector("i").classList.contains("fa-eye")) {
    node.querySelector("i").classList.remove("fa-eye");
    node.querySelector("i").classList.add("fa-eye-slash");
  }
  else {
    node.querySelector("i").classList.remove("fa-eye-slash");
    node.querySelector("i").classList.add("fa-eye");
  }

  return;
}

// 데이터 컨트롤 접기/펼치기
function collapseControl(node) {
  var objIdx = node.getAttribute("data-objIdx");

  var el = document.getElementById("data-control-list-" + objIdx);

  if (el.classList.contains("on")) {
    el.classList.remove("on");
    node.querySelector("i").classList.remove("fa-chevron-up");
    node.querySelector("i").classList.add("fa-chevron-down");
  }
  else {
    el.classList.add("on");
    node.querySelector("i").classList.remove("fa-chevron-down");
    node.querySelector("i").classList.add("fa-chevron-up");
  }

  return;
}

// tooltip 및 popup 표출 처리
function fnGetTrNoti(mode, trTp, trColor, typNm, tm, fttm, src, srcNm, srcNote, fcttit, lat, lon, ws, ps, er15, ed15, dir, sp) {
  /*
    mode    모드 ex) linetooltip-라인툴팁 / circletooltip-포인트툴팁 / popup-포인트팝업
    trTp    트랙종류 ex) real-실제경로 / expect-예측경로
    trColor 색상 ex) FF0000
    typNm   태풍명 ex) 차바
    tm      발표시각 ex) 201912312359
    fttm    예상시각 ex) 201912312359
    src     모델코드 ex) KMA
    srcNm   모델명 ex) 기상청
    fcttit  통보문 타이틀 ex) 2016년제18-24호
    lat     위도
    lon     경도
    ws      최대풍속
    ps      중심기압
    er15    15m/s 예외반경
    ed15    15m/s 예외방향
    dir     진행방향
    sp      이동속도
  */

  if (typeof(arguments[0]) === "undefined") {
    return "";
  }

  for(var i=0, len=arguments.length; i<len; i++) {
    if (arguments[i] == "-9" || arguments[i] == "") {
      arguments[i] = "-";
    }
  }

  var adcls = "";
  var wsNm = "";
  var er15Nm = "";
  var tmFormatSet = "";
  var fttmFormatSet = "";
  var dirNm = fnGetCardinalpointFormat(dir);
  var ed15Nm = fnGetCardinalpointFormat(ed15);

  if (mode.indexOf("tooltip") > -1) {
    adcls = "tooltip";
  }
 
  //20200903 발표시간이전(분석)값인경우       
  if(tm < fttm) {
    if (tm.length >= 10) {
      tmFormatSet = tm.substr(0, 4) + "년 " + tm.substr(4, 2) + "월 " + tm.substr(6, 2) + "일 " + tm.substr(8, 2) + "시";
      if (trTp == "expect") {
        tmFormatSet += " 발표";
      }
    }
        
    if (fttm.length >= 10) {
      if (trTp == "expect") {
        fttmFormatSet = fttm.substr(6, 2) + "일 " + fttm.substr(8, 2) + "시 예상";
      }
    }  
  }
  else {
    if (tm.length >= 10) {
      if (trTp == "expect") {
        tmFormatSet = fttm.substr(0, 4) + "년 " + fttm.substr(4, 2) + "월 " + fttm.substr(6, 2) + "일 " + fttm.substr(8, 2) + "시";
        if (tm == fttm) tmFormatSet += " 발표";
        else tmFormatSet += " 분석";
      }
      else tmFormatSet = tm.substr(0, 4) + "년 " + tm.substr(4, 2) + "월 " + tm.substr(6, 2) + "일 " + tm.substr(8, 2) + "시";
    }
        
    if (fttm.length >= 10) {
      if (trTp == "expect" && tm == fttm) {
        fttmFormatSet = fttm.substr(6, 2) + "일 " + fttm.substr(8, 2) + "시 분석";
      }
    }
  }
    //------------

  if (!isNaN(ws)) {
    if (ws >= 25 && ws < 33) {
      wsNm = "(중)";
    }
    else if (ws >= 33 && ws < 44) {
      wsNm = "(강)";
    }
    else if (ws >= 44 && ws < 54) {
      wsNm = "(매우강)";
    }
    else if (ws >= 54) {
      wsNm = "(초강력)";
    }

    if (ws < 1) {
        ws = "-";
    }
  }

  if (!isNaN(er15)) {
    if (er15 >= 1 && er15 <= 299) {
      er15Nm = "소형";
    }
    else if (er15 >= 300 && er15 <= 499) {
      er15Nm = "중형";
    }
    else if (er15 >= 500 && er15 <= 799) {
      er15Nm = "대형";
    }
    else if (er15 >= 800) {
      er15Nm = "초대형";
    }

    if (er15 < 1) {
      er15 = "-";
    }
  }

  var trPointNoti = "";

  trPointNoti += "<div class=\"lineLpop " + adcls + "\" style=\"border-top:6px solid " + trColor + ";\">";
  trPointNoti += "<div class=\"Lpopcont\">";
  trPointNoti += "<h3 class=\"ttitle01\">" + typNm;
  trPointNoti += "<span class=\"Ltext01\">";
  trPointNoti += "<span>" + tmFormatSet + "</span>";

  if (mode != "linetooltip" && trTp == "expect") {
    trPointNoti += "<br/><span>(KST) " + fttmFormatSet + "</span>";
  }
  else {
    trPointNoti += "<br/><span>(KST)</span>";
  }

  trPointNoti += "</span>";
  trPointNoti += "<span class=\"Ltext02\" title=\"" + srcNote + "\">" + src;
  trPointNoti += "<span class=\"Ltext03\">" + srcNm;
    
  if (src == "KMA") {
    trPointNoti += " (" + fcttit + ")";
  }

  trPointNoti += "</span>";

  trPointNoti += "</span>";
  trPointNoti += "</h3>";

  if (mode == "linetooltip") {
    trPointNoti += "</div></div>";
    return trPointNoti;
  }

  trPointNoti += "<div class=\"Lpopcontarea\">";
  trPointNoti += "<dl>";
  trPointNoti += "<dt>중심위치</dt>";
  trPointNoti += "<dd>" + lat + "˚N&nbsp;&nbsp;" + lon + "˚E</dd>";

  trPointNoti += "<dt>최대풍속</dt>";

  if (ws == "-") {
    trPointNoti += "<dd>-</dd>";
  }
  else {
    trPointNoti += "<dd>" + ws + " m/s " + wsNm + "</dd>";
  }

  trPointNoti += "<dt>중심기압</dt>";

  if (ps == "-") {
    trPointNoti += "<dd>-</dd>";
  }
  else {
    trPointNoti += "<dd>" + ps + " hPa</dd>";
  }

  if (mode == "circletooltip") {
    trPointNoti += "</dl></div></div></div>";
    return trPointNoti;
  }
/*
    if (typNm.indexOf("열대") < 0 && typNm.indexOf("온대") < 0) {
      trPointNoti += "<dt title=\"15m/s 예외반경\">예외반경</dt>";

      if (er15 == "-") {
        trPointNoti += "<dd>-</dd>";
      }else {
        trPointNoti += "<dd>" + ed15Nm + " 약 " + er15 + " km (" + er15Nm + ")</dd>";
      }
    }
*/
  trPointNoti += "<dt>진행방향</dt>";

  if (dirNm == "-") {
    trPointNoti += "<dd>-</dd>";
  }
  else {
    trPointNoti += "<dd>" + dirNm + "</dd>";
  }

  trPointNoti += "<dt>이동속도</dt>";

  if (sp == "-") {
    trPointNoti += "<dd>-</dd>";
  }
  else {
    trPointNoti += "<dd>" + sp + " km/h</dd>";
  }

  trPointNoti += "</dl>";
  trPointNoti += "</div>";
   
  trPointNoti += "</div>";
  trPointNoti += "<a class=\"Lpopclose\" name=\"popupclose\">";
  trPointNoti += "<i class=\"fas fa-times\"></i>닫기";
  trPointNoti += "</a>";
  trPointNoti += "</div>";

  return trPointNoti;
}

// 강풍반경 표출
function showRadLyr(id) {
  for (var i = 0; i < radLyrList.length; i++) {
    if (radLyrList[i]._leaflet_id == id) {
      map.addLayer(radLyrList[i]);
    }
  }
}

// 강풍반경 표출 해제
function hideRadLyr(id) {
  for (var i = 0; i < radLyrList.length; i++) {
    if (radLyrList[i]._leaflet_id == id) {
      map.removeLayer(radLyrList[i]);
    }
  }
}

// 부가 레이어 표출
function showAddLyr(id) {
  for (var i = 0; i < addLyrList.length; i++) {
    if (addLyrList[i]._leaflet_id == id) {
      map.addLayer(addLyrList[i]);
    }
  }
}

// 부가 레이어 표출 해제
function hideAddLyr(id) {
  for (var i = 0; i < addLyrList.length; i++) {
    if (addLyrList[i]._leaflet_id == id) {
      map.removeLayer(addLyrList[i]);
    }
  }
}

// 강풍반경 토글
function toggleRadLayer(node) {
  if (node.parentNode.getElementsByTagName("input")[0].checked == false) {
    return;
  }

  var idx = node.getAttribute("data-idx");

  if (node.classList.contains("active")) {
    if (document.getElementById("det-grp-" + idx).classList.contains("active")) {
      hideRadLyr(node.getAttribute("rad-det-id"));
    }
    else {
      hideRadLyr(node.getAttribute("rad-id"));
    }
    node.classList.remove("active");
  }
  else {
    if (document.getElementById("det-grp-" + idx).classList.contains("active")) {
      showRadLyr(node.getAttribute("rad-det-id"));
    }
    else {
      showRadLyr(node.getAttribute("rad-id"));
    }
    node.classList.add("active");
  }
}

// 상세경로 토글
function toggleDetLayer(node) {
  if (node.parentNode.getElementsByTagName("input")[0].checked == false) {
    return;
  }

  var idx = node.getAttribute("data-idx");

  if (node.classList.contains("active")) {
    if (document.getElementById("rad-grp-" + idx).classList.contains("active")) {
      hideRadLyr(node.getAttribute("rad-det-id"));
      showRadLyr(node.getAttribute("rad-id"));
    }
    hideAddLyr(node.getAttribute("det-id"));
    hideAddLyr(node.getAttribute("kma-det-line-id"));
    showAddLyr(node.getAttribute("kma-line-id"));
    node.classList.remove("active");
  }
  else {
    if (document.getElementById("rad-grp-" + idx).classList.contains("active")) {
      hideRadLyr(node.getAttribute("rad-id"));
      showRadLyr(node.getAttribute("rad-det-id"));
    }
    showAddLyr(node.getAttribute("det-id"));
    showAddLyr(node.getAttribute("kma-det-line-id"));
    hideAddLyr(node.getAttribute("kma-line-id"));
    node.classList.add("active");
  }
}

// 동일시간 예측경로
function fnGetSameTimePoint(arg1, arg2) {

  var cur_control_idx = arg1;
  var cur_fttm = arg2

  for (var i = 0; i < typSameTimeLyrList.length; i++) {
    map.removeLayer(typSameTimeLyrList[i]);
    typSameTimeLyrList.splice(i, 1);
    i--;
  }

  for (var i = 0; i < typTrLayerList.length; i++) {
    typTrLayerList[i].eachLayer(function(e) {

      var fttm_target = e.options.fttm;

      if (cur_fttm == fttm_target) {

        //if (map.hasLayer(e) == false) {
        //  return;
        //}

        var curLat = e._latlng.lat;
        var curLng = e._latlng.lng;

        var pulsingIcon = L.icon.pulse({iconSize:[15,15], color:"#FF0000", pane:"marker"});
        var pulsingMarker = L.marker([curLat, curLng],{icon:pulsingIcon, pane:"marker", layerid:typTrLayerList[i]._leaflet_id, fttm:cur_fttm});

        if (map.hasLayer(e)) {
          pulsingMarker.addTo(map);
        }
        typSameTimeLyrList.push(pulsingMarker);
      }
    });
  }

  for (var i = 0; i < addLyrList.length; i++) {
    addLyrList[i].eachLayer(function(e) {

      var fttm_target = e.options.fttm;

      if (cur_fttm == fttm_target) {

        //if (map.hasLayer(e) == false) {
        //  return;
        //}

        var curLat = e._latlng.lat;
        var curLng = e._latlng.lng;

        var pulsingIcon = L.icon.pulse({iconSize:[15,15], color:"#FF0000", pane:"marker"});
        var pulsingMarker = L.marker([curLat, curLng],{icon:pulsingIcon, pane:"marker", layerid:typTrLayerList[i]._leaflet_id, fttm:cur_fttm});

        if (map.hasLayer(e)) {
          pulsingMarker.addTo(map);
        }
        typSameTimeLyrList.push(pulsingMarker);
      }
    });
  }  
}