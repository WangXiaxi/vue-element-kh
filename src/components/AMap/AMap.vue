<template>
  <div class="a-map">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <input type="" class="el-input__inner" autocomplete="off" placeholder="请搜索或拖拽地图选择地址" id="tipinput">
      </el-form-item>
      <el-form-item label="当前地址" class="spec-width">
        <el-input v-model="formInline.location" disabled></el-input>
      </el-form-item>
      <el-form-item style="float: right; margin-right:0;">
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
    <div id="container" class="container mymap"></div>
  </div>
</template>


<script type="es6">
  import AMap from 'AMap'
  import { localMarry, deleMarry } from '@/config/localMarry'

  export default {
    props: {
      lngLat: {
        type: Array,
        default: function () {
          return [116.397428, 39.90923]
        }
      },
      inputName: {
        type: String,
        default: ''
      },
      location: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        address: [],
        num: 0, // 用于第一次进入地址不改变
        formInline: {
          location: ''
        },
        lanl: []
      }
    },
    mounted() {
      this.initMap();
    },
    created () {
    },
    computed: {
      setLngLat () {
        return this.lngLat
      }
    },
    methods: {
      initMap() {
        let that = this;
        let map = new AMap.Map("container", { // new 地图
          center: [this.setLngLat[0], this.setLngLat[1]],
          resizeEnable: true,
          zoom: 15
        })
        AMap.service(["AMap.PlaceSearch"], function() {
          var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
              pageSize: 5,
              pageIndex: 1,
              city: "010", //城市
              map: map,
              panel: "panel"
          });
        });

        AMapUI.loadUI(['misc/PositionPicker'], (PositionPicker) => {

          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
          });

          AMap.plugin(['AMap.ToolBar'], () => {
            map.addControl(new AMap.ToolBar({
              map: map
            }))
          })

          let positionPicker = new PositionPicker({
            mode: 'dragMap',
            map: map
          })
          /******** 查询 *********/
          var autoOptions = {
              input: "tipinput"
          };
          var auto = new AMap.Autocomplete(autoOptions);
          var placeSearch = new AMap.PlaceSearch({
              map: map
          });  //构造地点查询类

          let select = (e) => {
              placeSearch.setCity(e.poi.adcode);
              placeSearch.search(e.poi.name);  //关键字查询
          }
          AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发

          /******** 查询 *********/
          positionPicker.on('success', (positionResult) => {
            if (this.num !== 0 || this.location === '') {
              let loca = positionResult.regeocode.addressComponent
              this.formInline.location = deleMarry(`${positionResult.address}`)
            } else if (this.num === 0) {
              this.formInline.location = this.location
              this.num = 1
            }
            this.lanl = [positionResult.position.lng , positionResult.position.lat]
            this.address = localMarry(positionResult.regeocode.addressComponent.adcode) // 省市区 数组 [110000, 110000, 101111]
          })

          positionPicker.start()
        })    
      },
      onSubmit () {
        if (this.address.length <= 0) {
          this.$message.info({message: '当前位置暂不支持！'});
          return;
        }
        if (!this.formInline.location) {
          this.$message.info({message: '请搜索或在地图拖拽选择地址！'});
          return;
        }
        this.$emit('setFilter', this.formInline.location, this.address, this.lanl, this.inputName)
      }
    }
  }
</script>
<style lang="stylus">
  .amap-sug-result
    position: absolute
    z-index: 10000024
    background-color: #fefefe
    border: 1px solid #d1d1d1
    bottom: auto
  .mymap
    width: 100%
    height: 500px
    margin: 0 auto
  .a-map
    .spec-width
      .el-input
        width:414px
        .el-input__inner
          border: none
    #tipinput
      width: 200px 
    .container
      min-height: auto;
      padding: 0
</style>
