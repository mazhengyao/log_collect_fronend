<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <!--左侧-->
    <div id="option">
      <div id="createBarItem" class="createItem" @click="createBarItem">
        <p class="tips">Create a new bar item.</p>
        <img class="clickImg" src="./image/bar.png">
      </div>
      <div id="createLineItem" class="createItem" @click="createLineItem">
        <p class="tips">Create a new line item.</p>
        <img class="clickImg" src="./image/line.png">
      </div>
      <div id="createPieItem" class="createItem" @click="createPieItem">
        <p class="tips">Create a new pie item.</p>
        <img class="clickImg" src="./image/pie.png">
      </div>
    </div>
    <!--中间-->
    <div ref="  " id="board" class="board" :style="changeStyle">
      <transform_div v-for="(item,index) in style" :id="item.comName" :com="item" :board="boardInfo"
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

    <!--    todo log collect  -->
    <!--    <router-link to="/transform_div">transform_div</router-link>-->
    <!--    <router-view></router-view>-->
    <!--    <router-link to="/log_form">log_form</router-link>-->
    <!--    <router-view></router-view>-->
    <!--    <div id="myChart">-->
    <!--    </div>-->
    <!--    <div class="container">-->
    <!--      <input id="document" type="file" v-on:change="readFileInputEventAsArrayBuffer"/>-->
    <!--      <div class="row" style="width: 100%;">-->
    <!--        <div class="span8">-->
    <!--          <div id="output" class="well"></div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <button type="button" id="show" style="width: 50px;height: 30px;"-->
    <!--              v-on:click="showDoc">show-->
    <!--      </button>-->
    <!--    </div>-->
  </div>
</template>

<script>
  import mammoth from 'mammoth'
  var elementResizeDetectorMaker = require("element-resize-detector")

  export default {
    name: 'app',
    data() {
      return {
        msg: 'Transform Div',
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
        style: [],
        boardInfo: {
          boardTop: 0,
          boardLeft: 0,
          boardBottom: 0,
          boardRight: 0,
          boardHeight: 800,
          boardWidth: 1000,
        },
      }
    },
    computed: {
      changeStyle() {
        return `height: ${this.boardInfo.boardHeight}px; width: ${this.boardInfo.boardWidth}px`
      },
    },
    mounted() {
      this.setBoardOffset();
      // this.queryLogData();
    },
    methods: {
      drawLine() {
        const myChart = this.$echarts.init(document.getElementById('myChart'));
        myChart.setOption({
          title: {text: 'Vue&ECharts'},
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'bar',
            data: [this.logData.debug, this.logData.info, this.logData.warn, this.logData.error, this.logData.fatal]
          }]
        });
      },
      async queryLogData() {
        try {
          // 异步转同步
          // axios 采用then和非箭头函数时,this指向存在问题
          let res = await this.$axios.get('http://127.0.0.1:8181/log/queryLog');
          this.logData = res.data;
          this.drawLine();
          // 实时拉取数据
          setTimeout(() => {
            this.queryLogData();
          }, 1000)
        } catch (err) {
          console.log(err)
        }
      },
      readFileInputEventAsArrayBuffer(event) {
        var file = event.target.files[0];
        console.log(file)
        var reader = new FileReader();

        reader.onload = function (loadEvent) {
          var arrayBuffer = loadEvent.target.result;//arrayBuffer
          mammoth.convertToHtml({arrayBuffer: arrayBuffer})
            .then((result) =>
              document.getElementById("output").innerHTML = result.value
            )
            .done();
        };

        reader.readAsArrayBuffer(file);
      },
      async showDoc() {
        let res = await this.$axios.get('http://127.0.0.1:8181/mammoth/queryHtml');
        let html = res.data;
        document.getElementById("output").innerHTML = html;

        // var mammoth = require("mammoth");
        // mammoth.convertToHtml({path: "./demo.docx"})
        //   .then(result => {
        //     var html = result.value; // The generated HTML
        //     console.log(html)
        //     var messages = result.messages; // Any messages, such as warnings during conversion
        //   })
        //   .done();

      },
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
    }
  }
</script>

<style>
  html {
    background-color: whitesmoke;
  }

  #app {
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

  #myChart {
    text-align: center;
    margin-left: 42%;
    width: 600px;
    height: 350px;
    display: none;
  }

  .chart {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    word-break: break-all;
  }

  #barChart {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    word-break: break-all;
  }

  #lineChart {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    word-break: break-all;
  }

  #pieChart {
    position: relative;
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    overflow: hidden;
    word-break: break-all;
  }

  #output {
    text-align: left;
    width: 60%;
  }

  .board {
    position: relative;
    float: left;
    background-color: #2c3e50;
    display: block;
  }

  #tools {
    width: 200px;
    height: 800px;
    display: block;
    background-color: cornflowerblue;
    float: left;
    /*position: absolute;*/
  }

  #option {
    width: 200px;
    height: 800px;
    display: block;
    background-color: cornflowerblue;
    float: left;
    margin-left: 230px;
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
    margin-top: 600px;
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
    color: #E1E1E1;
    font-weight: bold;
    line-height: 100px;
  }

  #createBarItem {
    background-color: darkcyan;
  }

  #createLineItem {
    background-color: darkgreen;
  }

  #createPieItem {
    background-color: darkslateblue;
  }

</style>
