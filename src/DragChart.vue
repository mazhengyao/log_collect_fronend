<template>
  <div id="dragChart">
    <!--左侧-->
    <div id="option">
      <div v-for="(item,index) in items" :key="item.name" :id="item.name" class="createItem"
           @click="createItem(item.name, item.type, item.show)">
        <p class="tips">{{item.tip}}.</p>
        <img class="clickImg" :src="item.src">
      </div>
    </div>
    <!--中间-->
    <div ref="board" id="board" class="board" :style="changeStyle">
      <transform_div v-for="(item,index) in style" :key="item.name" :id="item.comName" :com="item" :board="boardInfo"
                     @transformDivItem="transformDivItem"
                     @transformDivStyle="transformDivStyle">
        <div :id="item.conName" class="chart"></div>
      </transform_div>
    </div>
    <!--右侧-->
    <div id="tools">
      &nbsp;&nbsp;&nbsp;&nbsp;Top:<input class="setInput" type="text" v-model="setting.comTop" @input="inputTop($event)"/>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;Left:<input class="setInput" type="text" v-model="setting.comLeft" @input="inputLeft($event)"/>
      <br>
      Height:<input class="setInput" type="text" v-model="setting.comHeight" @input="inputHeight($event)"/>
      <br>
      &nbsp;&nbsp;Width:<input class="setInput" type="text" v-model="setting.comWidth"  @input="inputWidth($event)"/>
      <br>
      &nbsp;&nbsp;&nbsp;Index:<input class="setInput" type="text" v-model="setting.index"/>
      <br>
      <input id="save" type="submit" value="Save" @click=""/>
    </div>
  </div>
</template>

<script>
  import mammoth from 'mammoth'
  var elementResizeDetectorMaker = require("element-resize-detector")

  export default {
    name: 'Edit Chart',
    data() {
      return {
        logData: {
          debug: '',
          info: '',
          warn: '',
          error: '',
          fatal: '',
        },
        setting: {
          comTop: 0,
          comLeft: 0,
          comHeight: 200,
          comWidth: 200,
          index: 0,
        },
        boardInfo: {
          boardTop: 0,
          boardLeft: 0,
          boardBottom: 0,
          boardRight: 0,
          boardHeight: 800,
          boardWidth: 1400,
        },
        // transform div
        style: [],
        // 左侧
        items: [],
      }
    },
    computed: {
      changeStyle() {
        return `height: ${this.boardInfo.boardHeight}px; width: ${this.boardInfo.boardWidth}px`
      },
    },
    mounted() {
      // 画版的属性
      this.setBoardOffset();
      // 左侧点击div
      this.setItems();
    },
    methods: {
      setBoardOffset() {
        this.boardInfo.boardTop = this.$refs["board"].offsetTop
        this.boardInfo.boardLeft = this.$refs["board"].offsetLeft
        this.boardInfo.boardBottom = this.$refs["board"].offsetTop + this.$refs["board"].offsetHeight
        this.boardInfo.boardRight = this.$refs["board"].offsetLeft + this.$refs["board"].offsetWidth
        this.boardInfo.boardHeight = this.$refs["board"].offsetHeight
        this.boardInfo.boardWidth = this.$refs["board"].offsetWidth
      },
      transformDivItem(data) {
        this.setting = data
      },
      transformDivStyle(data) {
        this.setting.comHeight = data.height
        this.setting.comWidth = data.width
        this.setting.comTop = data.top
        this.setting.comLeft = data.left
      },
      async createBarItem() {
        const index = this.style.length + 1;
        // 添加新Transform div
        await this.style.push({
          comName: 'transform_div' + index,
          conName: 'chart' + index,
          conType: 'bar',
          comTop: 0,
          comLeft: 0,
          comHeight: 200,
          comWidth: 200,
          index: 0,
        })
        // 添加新图表
        const chart = await this.$echarts.init(document.getElementById('chart' + index));
        chart.setOption({
          title: {text: 'Vue&ECharts:Bar'},
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'bar',
            data: [this.random(1,100), this.random(1,100), this.random(1,100),
              this.random(1,100), this.random(1,100)]
          }]
        });
        window.addEventListener('resize', () => {
          chart.resize();
        });
        // 自适应大小
        await this.resizeChart(index)
      },
      async createLineItem() {
        const index = this.style.length + 1;
        // 添加新Transform div
        await this.style.push({
          comName: 'transform_div' + index,
          conName: 'chart' + index,
          conType: 'line',
          comTop: 0,
          comLeft: 0,
          comHeight: 200,
          comWidth: 200,
          index: 0,
        })
        // 添加新图表
        const chart = await this.$echarts.init(document.getElementById('chart' + index));
        chart.setOption({
          title: {text: 'Vue&ECharts:Line'},
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'line',
            data: [this.random(1,100), this.random(1,100), this.random(1,100),
              this.random(1,100), this.random(1,100)]
          }]
        });
        window.addEventListener('resize', () => {
          chart.resize();
        });
        await this.resizeChart(index)
      },
      async createPieItem() {
        const index = this.style.length + 1;
        // 添加新Transform div
        await this.style.push({
          comName: 'transform_div' + index,
          conName: 'chart' + index,
          conType: 'pie',
          comTop: 0,
          comLeft: 0,
          comHeight: 200,
          comWidth: 200,
          index: 0,
        })
        // 添加新图表
        const chart = await this.$echarts.init(document.getElementById('chart' + index));
        chart.setOption({
          title: {text: 'Vue&ECharts:Pie'},
          tooltip: {},
          series: [{
            name: '',
            type: 'pie',
            data: [
              {value: this.random(1,100), name: 'DEBUG'},
              {value: this.random(1,100), name: 'INFO'},
              {value: this.random(1,100), name: 'WARN'},
              {value: this.random(1,100), name: 'ERROR'},
              {value: this.random(1,100), name: 'FATAL'},
            ]
          }]
        });
        window.addEventListener('resize', () => {
          chart.resize();
        });
        // 图表自适应
        await this.resizeChart(index)
      },
      // 随机数
      random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
      },
      // 图表大小自适应
      resizeChart(index){
        // 图表自适应div大小变化
        let erd = elementResizeDetectorMaker()
        // 图表自适应div大小变化
        erd.listenTo(document.getElementById("transform_div" + index), (element) => {
          this.$nextTick(function () {
            // let width = element.offsetWidth
            // let height = element.offsetHeight
            //使echarts尺寸重置
            this.$echarts.init(document.getElementById("chart" + index)).resize()
          })
        })
      },
      inputTop(e){
        let value = e.target.value;
        if (value < 0){
          this.setting.comTop = 0
        }
        if (value > this.boardInfo.boardHeight - this.setting.comHeight){
          this.setting.comTop = this.boardInfo.boardHeight - this.setting.comHeight
        }
      },
      inputLeft(e){
        let val = e.target.value;
        if (val < 0){
          this.setting.comLeft = 0
        }
        if (val > this.boardInfo.boardWidth - this.setting.comWidth){
          this.setting.comLeft = this.boardInfo.boardWidth - this.setting.comWidth
        }
      },
      inputHeight(e){
        let val = e.target.value;
        if (val < 0){
          this.setting.comHeight = 100
        }
        if (val > this.boardInfo.boardHeight - this.setting.comTop){
          this.setting.comHeight = this.boardInfo.boardHeight - this.setting.comTop
        }
      },
      inputWidth(e){
        let val = e.target.value;
        if (val < 0){
          this.setting.comWidth = 100
        }
        if (val > this.boardInfo.boardWidth - this.setting.comLeft){
          this.setting.comWidth = this.boardInfo.boardWidth - this.setting.comLeft
        }
      },
      createItem(name, type, show){
        // is show
        if (show){
          return;
        }
        if (type === 'bar'){
          this.createBarItem()
        }else if(type === 'line'){
          this.createLineItem()
        }else if(type === 'pie'){
          this.createPieItem()
        }
        // which
        this.items[name.replace("item","") - 1].show = true
      },
      setItems(){
        // 源自其他数据
        this.items.push(
          {
            name: 'item1',
            tip: 'Create a new bar item',
            src: require('./image/chart3.png'),
            type: 'bar',
            show: false,
          },
          {
            name: 'item2',
            tip: 'Create a new line item',
            src: require('./image/chart1.png'),
            type: 'line',
            show: false,
          },
          {
            name: 'item3',
            tip: 'Create a new pie item',
            src: require('./image/chart2.png'),
            type: 'pie',
            show: false,
          })
      },
    }
  }
</script>

<style scoped>
  html {
    background-color: whitesmoke;
  }

  #dragChart {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
    -webkit-touch-callout: none; /*系统默认菜单被禁用*/
    -webkit-user-select: none; /*webkit浏览器*/
    /*-khtml-user-select:none; !*早期浏览器*!*/
    -moz-user-select: none; /*火狐*/
    -ms-user-select: none; /*IE10*/
    user-select: none;
  }

  input {
    -webkit-user-select: auto; /*webkit浏览器*/
  }

  textarea {
    -webkit-user-select: auto; /*webkit浏览器*/
  }

  .chart {
    position: relative;
    width: 95%;
    height: 95%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    word-break: break-all;
  }

  .board {
    position: relative;
    float: left;
    background-color: whitesmoke;
    border: 3px dashed darkslategrey;
    display: block;
  }

  #tools {
    width: 150px;
    height: 806px;
    display: block;
    /*background-color: cornflowerblue;*/
    float: left;
    border: 3px solid darkslategrey;
    /*position: absolute;*/
    margin-left: 10px;
  }

  #option {
    width: 206px;
    height: 806px;
    display: block;
    border: 3px solid darkslategrey;
    /*background-color: cornflowerblue;*/
    float: left;
    margin-right: 15px;
    /*margin-left: 230px;*/
    /*position: absolute;*/
  }

  h1 {
    margin: 0 0 10px 0;
  }

  .setInput {
    width: 100px;
    margin-bottom: 10px;
  }

  #save {
    border-radius: 10px;
    background-color: #E1E1E1;
    font-weight: bold;
  }

  .createItem {
    width: 100%;
    height: 33.33%;
  }

  .clickImg {
    margin: 0;
    width: 100%;
    height: 65%;
  }

  .tips {
    margin: 0;
    width: 100%;
    height: 35%;
    color: darkslategrey;
    font-weight: bold;
    line-height: 100px;
  }

  /*#item1 {*/
  /*  background-color: darkcyan;*/
  /*}*/

  /*#item2 {*/
  /*  background-color: darkgreen;*/
  /*}*/

  /*#item3 {*/
  /*  background-color: darkslateblue;*/
  /*}*/

</style>
