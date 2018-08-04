<template>
  <div>
    
    <div id="container" class="container mymap"></div>
  </div>
</template>


<script type="es6">
  import AMap from 'AMap'
  export default {
    props: {
      inputName: {
        type: String,
        default: ''
      },
      lngLat: {
        type: Array,
        default: []
      }
    },
    created () {
      console.log(this.lngLat)
    },
    mounted() {
      this.initMap();
    },
    methods: {
      initMap() {
        let that = this;
        let map = new AMap.Map("container", {
          center: [that.lngLat[0], that.lngLat[1]],
          resizeEnable: true,
          zoom: 15
        });
        console.log(that.lngLat[0],that.lngLat[1])
        let marker = new AMap.Marker({
          map: map,
          position: new AMap.LngLat(that.lngLat[0], that.lngLat[1]),
          draggable: true,
          cursor: 'move',
          raiseOnDrag: true,
          zIndex: 101,
          doubleClickZoom: false,
          keyboardEnable: false
        });

        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
          map.addControl(new AMap.ToolBar())
          map.addControl(new AMap.Scale())
        })

        marker.setLabel({
          offset: new AMap.Pixel(-180, -200),//修改label相对于maker的位置
          content: `
            <div style="width: 360px;  padding: 10px; position:relative;">
              <p style="height: 34px;line-height: 34px;font-size: 16px;font-weight: bold;" id="address"></p>
              <div>
                <p style="margin: 6px 0; color: red;">（您可以拖动图标选中位置）</p>
                <p style="height: 40px;line-height: 40px;">
                  <span style="display: inline-block; width: 60px;">详细地址：</span>
                  <input type="text" id="input"  onkeydown="event.stopPropagation()" style="width: 260px; padding: 0 10px; border-radius: 4px; outline: none; height: 26px; line-height: 26px;" placeholder="具体的街道门牌号">
                </p>
                <p style="text-align: center; margin-top: 6px;"><input type="button" value="确认" onclick="" style="height: 32px;line-height: 32px;width: 80px; background: #027cff; color: #ffffff; border: none; cursor: pointer;border-radius: 4px;"></p>
              </div>
              <span style="display: inline-block; z-index=100; position: absolute; bottom: -35px; left: 169px; width:0;height: 0; border: 16px solid transparent; border-top-color: blue;">
              <i style="display: inline-block; position: absolute; bottom: -15px; left: -16px;  width:0;height: 0; border: 16px solid transparent; border-top-color: #fff;"></i>
              </span>
            </div>
          `
        });
        marker.setMap(map);

        var infoChange = function () {
          let lnglat = [marker.getPosition().lng, marker.getPosition().lat];
          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });
          geocoder.getAddress(lnglat, function (status, result) {
            lnglat = [marker.getPosition().lng, marker.getPosition().lat];
            if (status === 'complete' && result.info === 'OK') {
              let address = result.regeocode.addressComponent.province + '—' + result.regeocode.addressComponent.city + '—' + result.regeocode.addressComponent.district;
              // let details = result.regeocode.addressComponent.township + result.regeocode.addressComponent.streetNumber;
              let details = result.regeocode.formattedAddress;//formattedAddress
              // console.log(area);
              document.getElementById('address').innerText = address;
              document.getElementById('input').value = details;

            }
          });
        }
        AMap.event.addListener(marker, "dragend", function () {
          infoChange();
        });
        infoChange();
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .mymap
    width: 100%
    height: 500px
    margin: 0 auto
</style>
