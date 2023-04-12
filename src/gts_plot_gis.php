<!DOCTYPE HTML>
<HTML>
<HEAD>
<title>GTS �ڷ���ȸ PLUS</title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR"/>
<meta http-equiv='X-UA-Compatible' content='IE=edge'/>

<link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>
<link rel="stylesheet" type="text/css" href="/fgd/htdocs/css/leaflet.css"/>
<link rel="stylesheet" type="text/css" href="./htdocs/css/styledLayerControl.css?<?=date('Ymdhis')?>"/>
<link rel="stylesheet" href="./style.css?<?=date('Ymdhis')?>">
<link rel="stylesheet" href="./typ_style.css?<?=date('Ymdhis')?>">
<link rel="stylesheet" type="text/css" href="/fgd/htdocs/css/L.Icon.Pulse.css"/>

<script type="text/javascript" src="/cht_new/htdocs/js/es6-promise.auto.min.js"></script>
<script type="text/javascript" src="./htdocs/js/dom-to-image.js"></script>

<!-- leaflet / proj4 -->
<script type="text/javascript" src="/fgd/htdocs/js/leaflet/leaflet-src.js"></script>
<script type="text/javascript" src="/fgd/htdocs/js/proj4/proj4.js"></script>
<script type="text/javascript" src="/cht_new/htdocs/js/proj4leaflet_modified.js?<?=date('Ymdhis')?>"></script>
<script type="text/javascript" src="./htdocs/js/styledLayerControl.js"></script>
<script type="text/javascript" src="./htdocs/js/L.Graticule.js"></script>

<!-- group collision -->
<script type="text/javascript" src="./htdocs/js/rbush.js"></script>
<script type="text/javascript" src="./htdocs/js/Leaflet.LayerGroup.Collision.js?<?=date('Ymdhis')?>"></script>

<script src="/fgd/htdocs/js/d3.v5.min.js"></script>
<!-- typhoon track end point icon svg -->
<script type="text/javascript" src="/fgd/typ/typ_cou_dgn_xicon.js"></script>

<!-- map common -->
<script type="text/javascript" src="/fgd/htdocs/js/mapConfig.js"></script>
<script type="text/javascript" src="/fgd/htdocs/js/mapCommon.js"></script>

<!-- typhoon track radius calculator -->
<script type="text/javascript" src="/fgd/htdocs/js/AfsMapTmsProviders/Leaflet.AfsMapTmsProviders.js"></script>
<script type="text/javascript" src="/fgd/typ/typ_cou_dgn_rad.js"></script>

<script type="text/javascript" src="/fgd/htdocs/js/leaflet-icon-pulse-master/L.Icon.Pulse.js"></script>
<script type="text/javascript" src="/fgd/htdocs/js/leaflet-typhoonArea/L.typhoonArea.js"></script>

<!--
<script type="text/javascript" src="/fgd/htdocs/js/leaflet-sidebar/leaflet-sidebar.js"></script>
<script type="text/javascript" src="/fgd/htdocs/js/leaflet-easyPrint-gh-pages/bundle.js"></script>
 -->

<script language="javascript" src="/sys/js/dateutil.js"></script>
<script language="javascript" src="/sys/js/popupCalendar.js"></script>
<script type="text/javascript" src="./gts_plot_gis.js?<?=date('Ymdhis')?>"></script>
<script type="text/javascript" src="./typ_cou_dgn_gis.js?<?=date('Ymdhis')?>"></script>
<!--<script type="text/javascript" src="./typ_cou_draw.js?<?=date('Ymdhis')?>"></script>-->

</HEAD>

<BODY onload='onLoad();' onkeydown='var key = doKey(event,0); if (key == 0) return false;' onkeyup='var key = doKey(event,1); if (key == 0) return false;' bgcolor=#ffffff topmargin=5 leftmargin=5 marginwidth=5 marginheight=5 style='overflow:hidden;'>
<!-- �޴� -->
<div id=menu style='position:relative; overflow:hidden; z-index:200;'>
<table cellpadding=0 cellspacing=0 border=0 width=100% class=T02_Style01 style='z-index:200;'>
<tr>
  <td class=T02_List01>
    <table border=0 cellpadding=0 cellspacing=0 align=left>
    <!-- 1��° �� -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr class=T02_Title02>
          <td>&middot;&nbsp;��&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td> 
            <select id=gts onChange="chk_gts();" class="text3">
              <option value='SFC' selected>����
              <option value='1000'>1000hPa
              <option value='925'>925hPa
              <option value='850'>850hPa
              <option value='700'>700hPa
              <option value='500'>500hPa
              <option value='300'>300hPa
              <option value='200'>200hPa
              <option value='100'>100hPa
            </select>
          </td>

          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;���&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td> 
            <select id=varn onChange="doVarn();" class="text3" style="background-color:#ccffff;">
            </select>
          </td>
          <td>
            <select id=pnts onChange="doSubmit();" class="text3">
              <option value='0'>��üǥ��
              <option value='1' selected>�����ϱ�
            </select>
          </td>

          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;�����ð�(KST)&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onmouseup="tm_init(1, 'ana');" value=' NOW '></td>
          <td style='min-width:5px;'></td> 
          <td><input type=text name="tm_ana" id="tm_ana" class=TimeBox style='width:130px;' size=15 maxlength=17 onkeypress="tm_input('ana');" value=0></td>
          <td style="cursor:hand;" onclick="calendarPopup('tm_ana',calPress);"><img src="/images/calendar.gif" border=0></td>
          <td style='min-width:5px;'></td>
          <td class=TB09 style="background-color:#d4f3ff; min-width:30px;" onmouseup="tm_move('-24H', 'ana');">-1D</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#d4f3ff; min-width:30px;" onmouseup="tm_move('-12H', 'ana');">-12H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#e5f8ff; min-width:30px;" onmouseup="tm_move('-6H', 'ana');">-6H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#f3fcff; min-width:30px;" onmouseup="tm_move('-3H', 'ana');">-3H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#f3fcff; min-width:30px;" onmouseup="tm_move('-1H', 'ana');">-1H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#f3fcff; min-width:30px;" onmouseup="tm_move('-30m', 'ana');">-30m</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#f3fcff; min-width:30px;" onmouseup="tm_move('-10m', 'ana');">-10m</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#fff4f1; min-width:30px;" onmouseup="tm_move('+10m', 'ana');">+10m</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#fff4f1; min-width:30px;" onmouseup="tm_move('+30m', 'ana');">+30m</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#fff4f1; min-width:30px;" onmouseup="tm_move('+1H', 'ana');">+1H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#fff4f1; min-width:30px;" onmouseup="tm_move('+3H', 'ana');">+3H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#ffebe5; min-width:30px;" onmouseup="tm_move('+6H', 'ana');">+6H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#ffdfd5; min-width:30px;" onmouseup="tm_move('+12H', 'ana');">+12H</td>
          <td style='min-width:1px;'></td> 
          <td class=TB09 style="background-color:#ffdfd5; min-width:30px;" onmouseup="tm_move('+24H', 'ana');">+1D</td>
        </tr>
        </table>
      </td>
    </tr>

    <tr height=2>
    </tr>
    <!-- 2��° �� -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr class=T02_Title02>

          <td>&middot;&nbsp;ǥ��&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td><input type="checkbox" id="layer01" name="layer_list" onclick="layer_select();" value="G" checked><label for="layer01" class=text1>GTS</label></td>
          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="wpf" onclick="if (this.checked == true) {document.getElementById('layer01').checked = true; layer_select();} else doSubmit();" checked><label for="wpf" class=text1>W.P.F</label></td>
          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="amdar" onclick="if (this.checked == true) {document.getElementById('layer01').checked = true; layer_select();} else doSubmit();" checked><label for="amdar" class=text1>AMDAR</label></td>
          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="layer02" name="layer_list" onclick="layer_select();" value="S"><label for="layer02" class=text1>����</label></td>
          <td style='min-width:5px;'></td>
          <td>
            <select id=sat onChange="if (document.getElementById('layer02').checked == true) doSubmit();" class="text3">
              <option value='ir1'>����(10.5��)
              <option value='wv063'>���� ������(6.3��)
              <option value='wv069'>���� ������(6.9��)
              <option value='wv073'>���� ������(7.3��)
              <option value='rgb_daynight' selected>RGB �־߰�
              <option value='rgb_wv'>RGB ������
              <option value='rgb_dust'>RGB Ȳ��
              <option value='rgb_natural'>RGB �ڿ���
              <option value='ir1_enhc'>���� ����
              <option value='wv063_enhc'>���� ������ ����
              <option value='wv069_enhc'>���� ������ ����
              <option value='wv073_enhc'>���� ������ ����
              <option value='lst'>��ǥ�µ�/�ؼ���µ�
              <option value='ctt'>�����µ�
              <option value='cth'>������
              <option value='rmwv'>��������(������)
              <option value='rmir'>��������(����)
              <option value='rmwv_enhc'>��������(������ ����)
              <option value='rmir_enhc'>��������(���� ����)
            </select>
          </td>

          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="layer03" name="layer_list" onclick="layer_select();" value="E"><label for="layer03" class=text1>�ػ�ǳ</label></td>

          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="layer04" name="layer_list" onclick="layer_select();" value="R"><label for="layer04" class=text1>���̴�</label></td>

          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="layer05" name="layer_list" onclick="layer_select();" value="W"><label for="layer05" class=text1>WISSDOM</label></td>

          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="layer06" name="layer_list" onclick="layer_select();" value="L"><label for="layer06" class=text1>����</label></td>
<!--
          <td style='min-width:5px;'></td>
          <td><input type="checkbox" id="layer07" name="layer_list" onclick="layer_select();" value="T" checked><label for="layer07" class=text1>����</label></td>
-->
          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;����&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td> 
            <select id=font_size onChange="doSubmit();" class="text3" style="width:70px;">
              <option value='1.5'>�� ũ��
              <option value='1.3' selected>ũ��
              <option value='1.15'>����
              <option value='1'>����
            </select>
          </td>
          <td style='min-width:5px;'></td>
          <td><input type="checkbox" name="border" id="border" onclick="doSubmit();" value="1"><label for="border" class=text1>�׵θ�</label></td>

          <td style='min-width:5px;'></td>
          <td><input type="checkbox" name="color_wind" id="color_wind" onclick="doSubmit();" value="1" checked><label for="color_wind" class=text1>�ٶ��� ������</label></td>

          <td style='min-width:10px;'></td>
          <td><input type="button" class=TB10 value="(��)���� �̵�" onClick="old_view();" style="width:80px;"></td>
        </tr>
        </table>
      </td>
    </tr>

    <tr height=2>
    </tr>
    <!-- 3��° �� -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr class=T02_Title02>
<!--
          <td>&middot;&nbsp;ũ��&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td><input type="text" name="size_img" id="size" value="1200" size=4 class="text3 prevent-keydown">px</td>

          <td style='min-width:5px;'></td>
          <td><input type=button class=TB10 style="background-color:#aaffff;" onClick="doSize(0);" value="����"></td>

          <td style='min-width:10px;'></td>
          <td style='min-width:4px;'></td> 
-->

          <td>&middot;&nbsp;����&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td> 
            <select id=popup class="text3">
              <option value='t'>������
              <option value='b' selected>����ǥ
              <option value='s'>�ܿ�����1
              <option value='w'>�ܿ�����2
            </select>
          </td>

          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;��ġ��&nbsp;</td>
          <td> 
            <select id=cont class="text3" onChange="doCont();">
              <option value='0' selected>ǥ�� ����
              <option value=''>-----------------------------
              <option value='gts'>- GTS ����(��м�)
              <option value=''>-----------------------------
              <option value='nwp_syn'>-- ��ġ��(����)
              <option value='nwp'>-- ��ġ��(��м�/��¼�)
              <option value='nwp_wind1'>-- ��ġ��(����)
              <option value='nwp_wind2'>-- ��ġ��(�ٶ���)
              <option value='nwp_ept'>-- ��ġ��(������)
              <option value='nwp_dewp'>-- ��ġ��(�̽����µ�)
              <option value=''>-----------------------------
              <option value='diff_pres'>--- ��м� ��(��/��Ȳ)
              <option value='diff_temp'>--- ��¼� ��(��/��Ȳ)
              <option value=''>-----------------------------
              <option value='mT'>--- mT ����͸�(500hPa)
            </select>
          </td>

          <td> 
            <table border=0 cellpadding=0 cellspacing=0 align=left id=nwp_info style='visibility:hidden;'>
              <tr class=T02_Title02>
                <td style='min-width:10px;'></td>
                <td>&middot;&nbsp;��ġ��&nbsp;</td>
                <td style='min-width:4px;'></td> 
                <td> 
                  <select id=nwp class="text3" onChange="doSubmit();">
                    <option value='UM' selected>UM
                    <option value='ECMWF'>ECMWF
                    <option value='KIMG'>KIM
                  </select>
                </td>

                <td style='min-width:5px;'></td>
                <td>&nbsp;��ǥ�ð�(KST)&nbsp;</td>
                <td style='min-width:4px;'></td> 
                <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onmouseup="tm_init(1, 'fc');" value=' NOW '></td>
                <td style='min-width:5px;'></td> 
                <td><input type=text name="tm_fc" id="tm_fc" class=TimeBox style='width:130px;' size=15 maxlength=17 onkeypress="tm_input('fc');" value=0></td>
                <td style="cursor:hand;" onclick="calendarPopup('tm_fc',calPress);"><img src="/images/calendar.gif" border=0></td>
                <td style='min-width:5px;'></td>
                <td class=TB09 style="background-color:#d4f3ff; min-width:30px;" onmouseup="tm_move('-24H', 'fc');">-1D</td>
                <td style='min-width:1px;'></td> 
                <td class=TB09 style="background-color:#d4f3ff; min-width:30px;" onmouseup="tm_move('-12H', 'fc');">-12H</td>
                <td style='min-width:1px;'></td> 
                <td class=TB09 style="background-color:#ffdfd5; min-width:30px;" onmouseup="tm_move('+12H', 'fc');">+12H</td>
                <td style='min-width:1px;'></td> 
                <td class=TB09 style="background-color:#ffdfd5; min-width:30px;" onmouseup="tm_move('+24H', 'fc');">+1D</td>
              </tr>
            </table>
          </td>

          <td> 
            <table border=0 cellpadding=0 cellspacing=0 align=left id=bias_info style='visibility:hidden;'>
              <tr class=T02_Title02>
                <td style='min-width:10px;'></td>
                <td>&middot;&nbsp;bias ǥ�� ���&nbsp;</td>
                <td style='min-width:4px;'></td> 
                <td> 
                  <select id=bias_disp class="text3" onChange="doSubmit();">
                    <option value=0 selected>�⺻ ǥ��
                    <option value=1>bias �� ǥ��
                    <option value=2>bias �� ǥ��(�� X)
                  </select>
                </td>
              </tr>
            </table>
          </td>

        </tr>
        </table>
      </td>
    </tr>

    <tr height=2>
    </tr>
    <!-- 4��° �� -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr class=T02_Title02>

          <td>
            <label for=lat>&middot; ����: </label><input type=text class=TextBox style='height:19px; width:50px;' id=lat value='0.00' readonly=readonly title='����'>
            <label for=lon>&middot; �浵: </label><input type=text class=TextBox style='height:19px; width:50px;' id=lon value='0.00' readonly=readonly title='�浵'>
          </td>

          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;����&nbsp;</td>
          <td style='min-width:4px;'></td> 
          <td> 
            <select id=area onChange="unzoom_area(-1,1);" class="text3">
              <option value="EA_CHT" selected>���ƽþ�
              <option value="E10">�ѹݵ�
              <!--<option value="H4">�ص��ƽþ�-->
              <option value="TP">��ǳ����
              <option value="NHEM">�Ϲݱ�
              <option value="WORLD">������
            </select>
          </td>

          <td style='min-width:5px;'></td>
          <td><input type=button class=TB10 style="background-color:#ffffff;" onfocus=blur() name=total onmouseup='unzoom_area(0);' value='��ü'></td>
          <td width=2></td>
          <td><input type=button class=TB10 style="background-color:#ffffff;" onfocus=blur() name=reduce onmouseup='unzoom_area(1);' value='���'></td>
          <td width=2></td>
          <td><input type=button class=TB10 style="background-color:#ffffff;" onfocus=blur() name=ctrl onmouseup='fn_btnClick();' value='����'></td>

          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;�ΰ����(���콺 Ŭ��)&nbsp;</td>
          <td style='min-width:5px;'></td>
          <td><input type=button class=TB10 style="background-color:#aaffaa; width:55px;" onfocus=blur() id=zoom onmouseup="ext_sel('zoom');" value='��� ����'></td>
          <td width=2></td>
          <td><input type=button class=TB10 style="background-color:#ffffff; width:90px;" onfocus=blur() id=r3d onmouseup="ext_sel('r3d');" value='���̴� �����ܸ�'></td>
          <td width=2></td>
          <td><input type=button class=TB10 style="background-color:#ffffff; width:80px;" onfocus=blur() id=sat_skew onmouseup="ext_sel('sat_skew');" value='���� �ܿ�����'></td>
          <td width=2></td>
          <td><input type=button class=TB10 style="background-color:#ffffff; width:80px;" onfocus=blur() id=ruler onmouseup="ext_sel('ruler');" value='�Ÿ���� ����'></td>

          <td style='min-width:10px;'></td>
          <td>&middot;&nbsp;</td>
          <td><input type="checkbox" id="ani_chk" onclick="fnAnimateChk();"></td>
          <td style='min-width:2px;'></td>
          <td><input type="button" id=ani class=TB10 value="��ȭ" onClick="fnAnimate();" style="width:40px; background-color:#f0f0f0;"></td>

        </tr>
        </table>
      </td>
    </tr>
    </table>

  </td>
</tr>
</table>
</div>

<div style='position:relative; height:10px; z-index:200;'></div>

<!-- ��ȭ -->
<div id='gts_ani' style='height:29px; display:none;'>
  <div style='display:flex;'>
    <div style='min-width:4px;'></div>
    <div class='text1' style='font-weight:bold; min-width:48px; white-space:nowrap;'>�����Ӽ�</div>
    <div style='min-width:4px;'></div>
    <div>
      <select id=ani_frame onChange="fnTimeBar();" class="text3">
        <option value=4 selected>4��
        <option value=6>6��
        <option value=8>8��
        <option value=10>10��
        <option value=12>12��
      </select>
    </div>
    <div style='min-width:6px;'></div>
    <div class='text1' style='font-weight:bold; white-space:nowrap;'>/</div>
    <div style='min-width:4px;'></div>
    <div class='text1' style='font-weight:bold; min-width:48px; white-space:nowrap;'>�ð�����</div>
    <div style='min-width:4px;'></div>
    <div>
      <select id=ani_itv onChange="fnTimeBar();" class="text3">
        <option value=0.1>10��
        <option value=0.3>30��
        <option value=1 selected>1�ð�
        <option value=3>3�ð�
        <option value=6>6�ð�
        <option value=12>12�ð�
        <option value=24>24�ð�
      </select>
    </div>

    <div style='min-width:20px;'></div>
    <div id=ani_tm1 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm1 style='min-width:4px;'></div>
    <div id=ani_tm2 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm2 style='min-width:4px;'></div>
    <div id=ani_tm3 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm3 style='min-width:4px;'></div>
    <div id=ani_tm4 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm4 style='min-width:4px;'></div>
    <div id=ani_tm5 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm5 style='min-width:4px;'></div>
    <div id=ani_tm6 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm6 style='min-width:4px;'></div>
    <div id=ani_tm7 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm7 style='min-width:4px;'></div>
    <div id=ani_tm8 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm8 style='min-width:4px;'></div>
    <div id=ani_tm9 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm9 style='min-width:4px;'></div>
    <div id=ani_tm10 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm10 style='min-width:4px;'></div>
    <div id=ani_tm11 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm11 style='min-width:4px;'></div>
    <div id=ani_tm12 class=TB10 style='border:1px solid #888888; background-color:white; min-width:55px;' onclick='tmbarClick(this.id, 1);'></div>
    <div id=space_tm12 style='min-width:4px;'></div>

    <div style='min-width:10px;'></div>
    <div><i class='fas fa-step-backward' id=ani_back style='cursor:pointer; position:relative; top:3px;' onclick="tmbarLeft();"></i></div>
    <div style='min-width:8px;'></div>
    <div><i class='fas fa-play' id=ani_play style='cursor:pointer; position:relative; top:3px;' onclick="tmbarPlay();"></i></div>
    <div style='min-width:8px;'></div>
    <div><i class='fas fa-stop' id=ani_stop style='cursor:pointer; position:relative; top:3px;' onclick="tmbarStop();"></i></div>
    <div style='min-width:8px;'></div>
    <div><i class='fas fa-step-forward' id=ani_forward style='cursor:pointer; position:relative; top:3px;' onclick="tmbarRight();"></i></div>
  </div>
</div>
<!-- ��ȭ �� -->

<!-- �ٵ� -->
<div id='gts_body' style='overflow:auto;'>
  <div id="map"></div>
  <ul id='tooltip1' class='map'></ul>
  <ul id='tooltip2' class='map'></ul>
  <ul id='tooltip3' class='map'></ul>
  <ul id='tooltip4' class='map'></ul>
  <ul id='tooltip5' class='map'></ul>
  <ul id='tooltip6' class='map'></ul>
  <ul id='tooltip7' class='map'></ul>
  <ul id='tooltip8' class='map'></ul>
  <ul id='tooltip9' class='map'></ul>
  <ul id='tooltip10' class='map'></ul>
  <ul id='tooltip11' class='map'></ul>
  <ul id='tooltip12' class='map'></ul>

  <div id="screenshot" class=screen-pop style="position:absolute; top:100px; left:100px; z-index:3000; background:lightgray; display:none; text-align:center; overflow:auto;">
    <div style="height:8px;"></div>
    <div class=screen-pop-header style="display:flex;">
      <div style="width:20px;"></div>
      <div class=text2 style="color:black; position:relative; top:2px;">��ũ���� ��� �̹���(�巡�׷� â �̵�)</div>
      <button style="margin-left:auto; height:20px; width:70px; cursor:pointer;" onclick="document.getElementById('screenshot').style.display='none';">�ݱ�(ESC)</button>
      <div style="width:20px;"></div>
    </div>
    <div style="height:8px;"></div>
    <div><img id="capture_img"></div>
  </div>
</div>
<!-- �ٵ� �� -->

<!-- Ȯ�� ���� ���� ���̾�  -->
<div id='zoomLayer' style='position:fixed; top:95px; left:242px; display:block; border:1px solid black; background-color:#ffffff; padding:10px; z-index:500; display:none;'>
  <div class='filter_point' style='margin:0 0 5px 0; display:flex;'>
    �� Ȯ�� ���� ����
    <div style='width:20px;'></div>
    <div style='position:relative; top:-1px; display:flex;'>
      <input type=button onclick='fnZoomReset()' class='zoom' style="background-color:#ffffff;width:50px;" value=" �ʱ�ȭ ">
      <div style='width:2px;'></div>
      <input type=button onclick='fn_CtrlSubmit()' class='zoom' style="background-color:#aaffaa;width:40px;" value=" ���� ">
      <div style='width:2px;'></div>
      <input type=button onclick='fn_btnClick()' class='zoom' style="background-color:#ffffff;width:40px;" value=" �ݱ� ">
    </div>
  </div>

  <div style='height:5px;'></div>
  <div style='display:flex;'>�ܷ����� �߽� ���浵�� �Է��Ͽ� ��ġ�� �������ּ���.</div>
  <div style='height:10px;'></div>
  <div style='display:flex;'>
    - �ܷ���:
    <div style='width:8px;'></div>
    <div onclick='fnZoomCtrl(-1);' style='cursor:pointer;'><i class="fas fa-minus"></i></div>
    <div style='width:4px;'></div>
    <div style='position:relative; top:-1px;'><input type=text class=TextBox style='height:19px; width:25px; text-align:center;' id=map_zoom value='0' readonly=readonly></div>
    <div style='width:4px;'></div>
    <div onclick='fnZoomCtrl(1);' style='cursor:pointer;'><i class="fas fa-plus"></i></div>

    <div style='width:10px;'></div>
    /<div style='width:8px;'></div>�߽�����:
    <div style='width:8px;'></div>
    <div style='position:relative; top:-1px;'><input type=text class='TextBox prevent-keydown' style='height:19px; width:50px;' id=center_lat value='0.00' title='����'></div>
    <div style='width:10px;'></div>
    /<div style='width:8px;'></div>�߽ɰ浵:
    <div style='width:8px;'></div>
    <div style='position:relative; top:-1px;'><input type=text class='TextBox prevent-keydown' style='height:19px; width:50px;' id=center_lon value='0.00' title='�浵'></div>
  </div>
  <div style='height:6px;'></div>
  <div style='display:flex;'>
    - AWS ���� ���� �߽���ġ ����
  </div>
  <div style='height:4px;'></div>
  <div style='display:flex;'>
    <div style='width:4px;'></div>
    <div id=zoom_stn1 class='select-style'></div>
    <div style='width:4px;'></div>
    <div id=zoom_stn2 class='select-style'></div>
    <div style='width:4px;'></div>
    <div onclick="fnStnLatLon();"><button>����</button></div>
  </div>
</div>

<!-- �ε� �� -->
<div id=loading style='position:absolute; top:0px; left:0px; z-index:1100; width:100%; height:100%; background-color:#eeeeee; opacity:0.5; text-align:center; vertical-align:middle; display:none;'>
  <div class=_ku_LoadingBar></div>
</div>

<div id=loadingStatus style='position:absolute; top:65%; left:25%; width:50%; text-align:center; vertical-align:middle; display:none; opacity:1.0; z-index:1100;'>
  <div id=loadingnum style='position:relative; left:50px; font-size:10pt;' class=filter_point></div>
  <div id=loadingbar style='position:relative; left:50px; background-color:lightblue; height:25px; width:0%; border:1px solid black;'></div>
</div>

<!-- ��ǳ ��� -->
<div id="sidebar-collapse" onclick="toggleSidebar();" class="collapse_button" title="��ǳ �������">
  <a></a>
</div>

<div id="sidebar-left" class="sidebar sidebar-left" style="display:none;">
  <!-- Nav tabs -->
  <div class="sidebar-tabs">
    <ul role="tablist">
      <li class="active">
        <a onclick="toggleTypList(this);" role="tab" id="tab_list_tm" title="��ǥ�ð� ���� ��ǳ �˻�" class="leftclock"></a>
      </li>
      <li>
        <a onclick="toggleTypList(this);" role="tab" id="tab_list_mdl" title="���/�� ���� ��ǳ �˻�" class="lefdata"></a>
      </li>
      <li>
        <a onclick="toggleTypList(this);" role="tab" id="tab_list_real" title="������� �˻�" class="leftyp"></a>
      </li>
	  <!--
      <li>
        <a onclick="toggleTypList(this);" role="tab" id="tab_list_virtual" title="������ ����" class="lefvirtual"></a>
      </li>
	  -->
    </ul>
  </div>

  <!-- Tab panes -->
  <div class="sidebar-content">
    <!-- [s] ��ǥ�ð� ���� �˻�-->
    <div class="sidebar-pane active" id="list_tm">
      <h1 class="sidebar-header">
        <span onclick="toggleSidebar();" class="sidebar-close" title="�ݱ�"><i class="fas fa-chevron-left"></i></span>
        ��ǥ�ð� ���� �˻�
      </h1>

      <div class="div-tm" id="typ_tm1">
        <a onclick="fnSetSearchMode(this);" class="ico_cald on" name="search_mode" title="�Ⱓ �˻�" data-val="year">��¥�˻�</a>
        <a onclick="fnSetSearchMode(this);" class="ico_keyw" name="search_mode" title="��ǳ�� �˻�" data-val="text">��ǳ��˻�</a>
        <a onclick="fnRetTypList(this, 1);" class="a-search" name="typ_list_search" id="typ_list_search1" data-val="1" style="float:right"><i class="fas fa-search"></i>�˻�</a>

        <!-- [s] �Ⱓ(�⵵) �˻� -->
        <div class="div-tm-year active">
          <div class="select-style">
            <label for="tm_st_yy1"></label>
            <select class="slt-yy" name="tm_st_yy" id="tm_st_yy1"></select>
          </div>
          <span>&nbsp;~&nbsp;</span>
          <div class="select-style mgl3">
            <label for="tm_ed_yy1"></label>
            <select class="slt-yy" name="tm_ed_yy" id="tm_ed_yy1"></select>
          </div>
          <span>&nbsp;��</span>
        </div>
        <!-- [e] �Ⱓ(�⵵) �˻� -->

        <!-- [s] ��ǳ�� �˻� -->
        <div class="div-tm-text">
          <div class="w140">
            <label for="search_text1"></label>
            <input onkeydown="fnSearchTypByName(this, event);" type="text" name="search_text" id="search_text1" placeholder="��ǳ���� �Է��ϼ���." maxlength="15" value=""/>
          </div>
        </div>
        <!-- [e] ��ǳ�� �˻� -->
      </div>

      <!-- [s] ��ǳ��� -->
      <div class="typ_list">
        <p class="p-list" name="typ_list_title" id="typ_list_title1">��ǳ ���</p>
        <a onclick="fnCancelLiAll(this);" class="reset" name="reset_list" data-target="typ_list1" title="��ü ����">
          <i class="fas fa-times-circle"></i>
          ��ü����
        </a>
        <div class="content_box div-list" id="div_typ_list1">
          <ul name="typ_list" id="typ_list1"></ul>
        </div>
      </div>
      <!-- [e] ��ǳ��� -->
            
      <!-- [s] ��ǳ���� -->
      <div class="typ_list mgt27">
        <p class="p-fct" id="typ_fct_title">��ǳ ����</p>
        <a onclick="fnCancelLiAll(this);" class="reset" name="reset_list" id="reset_list_fct" data-target="typ_fct_list" title="��ü ����">
          <i class="fas fa-times-circle"></i>
          ��ü����
        </a>
        <div class="content_box div-list" id="div_typ_fct">
          <ul name="typ_fct_list" id="typ_fct_list">
            <li class="no_dt">&#39;��ǳ ���&#39; ���� ��ǳ�� �����ϼ���.</li>
          </ul>
        </div>
      </div>
      <!-- [e] ��ǳ���� -->
    </div>
    <!-- [e] ��ǥ�ð� ���� �˻�-->

    <!-- [s] ���/�� ���� �˻�-->
    <div class="sidebar-pane" id="list_mdl">
      <h1 class="sidebar-header">
        ���/�� ���� �˻�
        <span onclick="toggleSidebar();" class="sidebar-close" title="�ݱ�"><i class="fas fa-chevron-left"></i></span>
      </h1>
      <div class="div-tm" id="typ_tm2">
        <a onclick="fnSetSearchMode(this);" class="ico_cald on" name="search_mode" title="�Ⱓ �˻�" data-val="year">��¥�˻�</a>
        <a onclick="fnSetSearchMode(this);" class="ico_keyw" name="search_mode" title="��ǳ�� �˻�" data-val="text">��ǳ��˻�</a>
        <a onclick="fnRetTypList(this, 1);" class="a-search" name="typ_list_search" id="typ_list_search2" data-val="2" style="float:right"><i class="fas fa-search"></i>�˻�</a>
        <!-- [s] �Ⱓ(�⵵) �˻� -->
        <div class="div-tm-year active">
          <div class="select-style">
            <label for="tm_st_yy2"></label>
            <select class="slt-yy" name="tm_st_yy" id="tm_st_yy2"></select>
          </div>
          <span>&nbsp;~&nbsp;</span>
          <div class="select-style mgl3">
            <label for="tm_ed_yy2"></label>
            <select class="slt-yy" name="tm_ed_yy" id="tm_ed_yy2"></select>
          </div>
          <span>&nbsp;��</span>
        </div>
        <!-- [e] �Ⱓ(�⵵) �˻� -->

        <!-- [s] ��ǳ�� �˻� -->
        <div class="div-tm-text">
          <div class="w140">
            <label for="search_text2"></label>
            <input onkeydown="fnSearchTypByName(this, event);" type="text" name="search_text" id="search_text2" placeholder="��ǳ���� �Է��ϼ���." maxlength="15" value=""/>
          </div>
        </div>
        <!-- [e] ��ǳ�� �˻� -->
      </div>

      <!-- [s] ��ǳ ��� -->
      <div class="typ_list">
        <p class="p-list" name="typ_list_title" id="typ_list_title2">��ǳ ���</p>
        <a onclick="fnCancelLiAll(this);" class="reset" name="reset_list" data-target="typ_list2" title="��ü ����">
          <i class="fas fa-times-circle"></i>
            ��ü����
        </a>
        <div class="content_box div-list" id="div_typ_list2">
          <ul name="typ_list" id="typ_list2"></ul>
        </div>
      </div>
      <!-- [e] ��ǳ ��� -->

      <!-- [s] ���/�� ��� -->
      <div class="typ_list mgt27">
        <p class="p-fct" id="typ_mdl_title">���/�� ���</p>
        <a onclick="fnCancelLiAll(this);" class="reset" name="reset_list" id="reset_list_mdl" data-target="typ_mdl_list" title="��ü ����">
          <i class="fas fa-times-circle"></i>
            ��ü����
        </a>
        <div class="content_box div-list" id="div_typ_mdl">
          <ul name="typ_mdl_list" id="typ_mdl_list">
            <li class="no_dt">&#39;��ǳ ���&#39; ���� ��ǳ�� �����ϼ���.</li>
          </ul>
        </div>
      </div>
      <!-- [e] ���/�� ��� -->
    </div>
    <!-- [e] ���/�� ���� �˻�-->

    <!-- [s] ��ǳ ������� �˻�-->
    <div class="sidebar-pane real" id="list_real">
      <h1 class="sidebar-header">
        ��ǳ ������� �˻�
        <span onclick="toggleSidebar();" class="sidebar-close" title="�ݱ�"><i class="fas fa-chevron-left"></i></span>
      </h1>

      <div class="div-tm" id="typ_tm3">
        <a onclick="fnSetSearchMode(this);" class="ico_cald on" name="search_mode" title="�Ⱓ �˻�" data-val="year">��¥�˻�</a>
        <a onclick="fnSetSearchMode(this);" class="ico_keyw" name="search_mode" title="��ǳ�� �˻�" data-val="text">��ǳ��˻�</a>
        <a onclick="fnRetTypList(this, 1);" class="a-search" name="typ_list_search" id="typ_list_search3" data-val="3" style="float:right"><i class="fas fa-search"></i>�˻�</a>

        <!-- [s] �Ⱓ(�⵵) �˻� -->
        <div class="div-tm-year active">
          <div class="select-style">
            <label for="tm_st_yy3"></label>
            <select class="slt-yy" name="tm_st_yy" id="tm_st_yy3"></select>
          </div>
          <span>&nbsp;~&nbsp;</span>
          <div class="select-style mgl3">
            <label for="tm_ed_yy3"></label>
            <select class="slt-yy" name="tm_ed_yy" id="tm_ed_yy3"></select>
          </div>
          <span>&nbsp;��</span>
        </div>
        <!-- [e] �Ⱓ(�⵵) �˻� -->

        <!-- [s] ��ǳ�� �˻� -->
        <div class="div-tm-text">
          <div class="w140">
            <label for="search_text3"></label>
            <input onkeydown="fnSearchTypByName(this, event);" type="text" name="search_text" id="search_text3" placeholder="��ǳ���� �Է��ϼ���." maxlength="15" value=""/>
          </div>
        </div>
        <!-- [e] ��ǳ�� �˻� -->
      </div>

      <!-- [s] ��ǳ ���-->
      <div class="typ_list" style="height:675px;">
        <p class="p-list" name="typ_list_title" id="typ_list_title3">��ǳ ���</p>
        <a onclick="fnCancelLiAll(this);" class="reset" name="reset_list" data-target="typ_list3" title="��ü ����">
          <i class="fas fa-times-circle"></i>
            ��ü����
        </a>
        <div class="content_box div-list real" id="div_typ_list3">
          <ul name="typ_list" id="typ_list3"></ul>
        </div>
      </div>
      <!-- [e] ��ǳ ���-->
    </div>
    <!-- [e] ��ǳ ������� �˻�-->

    <!-- [s] ���� ��� ���� -->
    <div class="sidebar-pane" id="list_virtual">
      <h1 class="sidebar-header">
        ���� ��� ����
        <span onclick="toggleSidebar();" class="sidebar-close" title="�ݱ�"><i class="fas fa-chevron-left"></i></span>
      </h1>

      <!-- [s] ���� ��� ��� -->
      <div class="typ_list">
        <p class="p-list" name="typ_list_title" id="typ_list_title4">���� ��� ���</p>
        <a href="javascript:void(0);" class="file new-file" name="new_list" data-target="virtual_list" title="�ʱ�ȭ">
          <!--<i class="fas fa-file"></i>-->�ʱ�ȭ
        </a>
        <a href="javascript:void(0);" class="file save-file" name="save_list" data-target="virtual_list" title="����">
          <!--<i class="fas fa-save"></i>-->����
        </a>
        <a href="javascript:void(0);" class="file delete-file" name="delete_list" data-target="virtual_list" title="����">
          <!--<i class="far fa-trash"></i>-->����
        </a>
        <div class="content_box div-list" id="div_typ_list4">
          <ul name="virtual_list" id="virtual_list"></ul>
        </div>
      </div>
      <!-- [e] ���� ��� ��� -->

      <!-- [s] �� ���� -->
      <div class="typ_list mgt27 virtual">
        <p class="p-fct" id="typ_virtual_title">�� ����</p>
        <div class="content_box div-list" id="div_virtual_info">
          <ul name="virtual_info_list" id="virtual_info_list">
            <li class="no_dt">&#39;���� ��� ���&#39; �� ���� �Ǵ� �߰��ϼ���.</li>
          </ul>
        </div>
      </div>
      <!-- [e] �� ���� -->
    </div>
    <!-- [e] ���� ��� ���� -->
  </div>
</div>
<!-- ��ǳ ��� �� -->

<!-- ��ǳ ��Ʈ�� -->
<div id="data-control-0" class="data-control">
  <!-- ���� -->
  <div class="data-control-title top">
    <span id="data-control-label-0">���� ��ǳ ���</span>

    <div onclick="collapseControl(this);" data-objIdx="0" class="data-control-topdiv">
      <a class="data-controls-topselector" title="���̾� �ּ�ȭ"><i class="data-control-icon fas fa-chevron-up"></i></a>
    </div>
  </div>
  <!-- ���� -->

  <!-- ��Ʈ�� -->
  <div id="data-control-list-0" class="data-control-list on">
    <div class="">
      <ul class="panelList" id="data-control-real-0"></ul>
    </div>
  </div>
  <!-- ��Ʈ�� -->
</div>

<div id="data-control-1" class="data-control">
  <!-- ���� -->
  <div class="data-control-title top">
    <span id="data-control-label-1">
    </span>

    <div onclick="collapseControl(this);" data-objIdx="1" class="data-control-topdiv">
      <a class="data-controls-topselector" title="���̾� �ּ�ȭ"><i class="data-control-icon fas fa-chevron-up"></i></a>
    </div>
  </div>
  <!-- ���� -->

  <!-- ��Ʈ�� -->
  <div id="data-control-list-1" class="data-control-list on">
    <div class="">
      <ul class="panelList" id="data-control-real-1"></ul>
    </div>

    <div class="typ-list">
      <p class="panel-layers-grouplabel" id="data-control-title-grp-1">
        ��� ����
        <a onclick="toggleControlList(this);" data-objIdx="1" data-type="grp" class="eye">
          <i id="data-control-eye-grp-1" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-grp-1"></ul>
      </div>
    </div>
            
    <div class="">
      <p class="panel-layers-grouplabel" id="data-control-title-mdl-1">
        ���� ��
        <a onclick="toggleControlList(this);" data-objIdx="1" data-type="mdl" class="eye">
          <i id="data-control-eye-mdl-1" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-mdl-1"></ul>
      </div>
    </div>
  </div>
  <!-- ��Ʈ�� -->
</div>

<div id="data-control-2" class="data-control">
  <!-- ���� -->
  <div class="data-control-title top">
    <span id="data-control-label-2">
    </span>

    <div onclick="collapseControl(this);" data-objIdx="2" class="data-control-topdiv">
      <a class="data-controls-topselector" title="���̾� �ּ�ȭ"><i class="data-control-icon fas fa-chevron-up"></i></a>
    </div>
  </div>
  <!-- ���� -->

  <!-- ��Ʈ�� -->
  <div id="data-control-list-2" class="data-control-list on">
    <div class="">
      <ul class="panelList" id="data-control-real-2"></ul>
    </div>

    <div class="typ-list">
      <p class="panel-layers-grouplabel" id="data-control-title-grp-2">
        ��� ����
        <a onclick="toggleControlList(this);" data-objIdx="2" data-type="grp" class="eye">
          <i id="data-control-eye-grp-2" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-grp-2"></ul>
      </div>
    </div>
            
    <div class="">
      <p class="panel-layers-grouplabel" id="data-control-title-mdl-2">
        ���� ��
        <a onclick="toggleControlList(this);" data-objIdx="2" data-type="mdl" class="eye">
          <i id="data-control-eye-mdl-2" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-mdl-2"></ul>
      </div>
    </div>
  </div>
  <!-- ��Ʈ�� -->
</div>

<div id="data-control-3" class="data-control">
  <!-- ���� -->
  <div class="data-control-title top">
    <span id="data-control-label-3">
    </span>

    <div onclick="collapseControl(this);" data-objIdx="3" class="data-control-topdiv">
      <a class="data-controls-topselector" title="���̾� �ּ�ȭ"><i class="data-control-icon fas fa-chevron-up"></i></a>
    </div>
  </div>
  <!-- ���� -->

  <!-- ��Ʈ�� -->
  <div id="data-control-list-3" class="data-control-list on">
    <div class="">
      <ul class="panelList" id="data-control-real-3"></ul>
    </div>

    <div class="typ-list">
      <p class="panel-layers-grouplabel" id="data-control-title-grp-3">
        ��� ����
        <a onclick="toggleControlList(this);" data-objIdx="3" data-type="grp" class="eye">
          <i id="data-control-eye-grp-3" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-grp-3"></ul>
      </div>
    </div>
            
    <div class="">
      <p class="panel-layers-grouplabel" id="data-control-title-mdl-3">
        ���� ��
        <a onclick="toggleControlList(this);" data-objIdx="3" data-type="mdl" class="eye">
          <i id="data-control-eye-mdl-3" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-mdl-3"></ul>
      </div>
    </div>
  </div>
  <!-- ��Ʈ�� -->
</div>

<div id="data-control-4" class="data-control">
  <!-- ���� -->
  <div class="data-control-title top">
    <span id="data-control-label-4">
    </span>

    <div onclick="collapseControl(this);" data-objIdx="4" class="data-control-topdiv">
      <a class="data-controls-topselector" title="���̾� �ּ�ȭ"><i class="data-control-icon fas fa-chevron-up"></i></a>
    </div>
  </div>
  <!-- ���� -->

  <!-- ��Ʈ�� -->
  <div id="data-control-list-4" class="data-control-list on">
    <div class="">
      <ul class="panelList" id="data-control-real-4"></ul>
    </div>

    <div class="typ-list">
      <p class="panel-layers-grouplabel" id="data-control-title-grp-4">
        ��� ����
        <a onclick="toggleControlList(this);" data-objIdx="4" data-type="grp" class="eye">
          <i id="data-control-eye-grp-4" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-grp-4"></ul>
      </div>
    </div>
            
    <div class="">
      <p class="panel-layers-grouplabel" id="data-control-title-mdl-4">
        ���� ��
        <a onclick="toggleControlList(this);" data-objIdx="4" data-type="mdl" class="eye">
          <i id="data-control-eye-mdl-4" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-mdl-4"></ul>
      </div>
    </div>
  </div>
  <!-- ��Ʈ�� -->
</div>

<div id="data-control-5" class="data-control">
  <!-- ���� -->
  <div class="data-control-title top">
    <span id="data-control-label-5">
    </span>

    <div onclick="collapseControl(this);" data-objIdx="5" class="data-control-topdiv">
      <a class="data-controls-topselector" title="���̾� �ּ�ȭ"><i class="data-control-icon fas fa-chevron-up"></i></a>
    </div>
  </div>
  <!-- ���� -->

  <!-- ��Ʈ�� -->
  <div id="data-control-list-5" class="data-control-list on">
    <div class="">
      <ul class="panelList" id="data-control-real-5"></ul>
    </div>

    <div class="typ-list">
      <p class="panel-layers-grouplabel" id="data-control-title-grp-5">
        ��� ����
        <a onclick="toggleControlList(this);" data-objIdx="5" data-type="grp" class="eye">
          <i id="data-control-eye-grp-5" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-grp-5"></ul>
      </div>
    </div>
            
    <div class="">
      <p class="panel-layers-grouplabel" id="data-control-title-mdl-5">
        ���� ��
        <a onclick="toggleControlList(this);" data-objIdx="5" data-type="mdl" class="eye">
          <i id="data-control-eye-mdl-5" class="fas fa-eye-slash"></i>
        </a>
      </p>
      <div class="">
        <ul class="panelList" id="data-control-mdl-5"></ul>
      </div>
    </div>
  </div>
  <!-- ��Ʈ�� -->
</div>
<!-- ��ǳ ��Ʈ�� �� -->

</BODY>
</HTML>