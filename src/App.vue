<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <div ref="board" id="board" class="board" :style="changeStyle">
      <transform_div id="transform_div1" :myStyle="style">
        <div id="barChart"></div>
      </transform_div>
      <transform_div id="transform_div2" :myStyle="style">
        <div id="pieChart"></div>
      </transform_div>
      <transform_div id="transform_div3" :myStyle="style">
        <div id="lineChart"></div>
      </transform_div>
    </div>
    <div id="tools">
      Height: <input class="setInput" type="text" v-model="style.comHeight" />
      &nbsp;&nbsp;Width: <input class="setInput" type="text" v-model="style.comWidth"/>
<!--      <input type="submit" value="Submit" />-->
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
        msg: 'Wake me up when september ends.',
        logData: {
          debug: '',
          info: '',
          warn: '',
          error: '',
          fatal: '',
        },
        style: {
          comHeight: 200,
          comWidth: 200,
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
          return `height: ${this.style.boardHeight}px; width: ${this.style.boardWidth}px`
      }
    },
    mounted() {
      // 图表自适应div大小变化
      let erd = elementResizeDetectorMaker()
      erd.listenTo(document.getElementById("transform_div1"), (element) => {
        // let width = element.offsetWidth
        // let height = element.offsetHeight
        this.$nextTick(function () {
          //使echarts尺寸重置
          this.$echarts.init(document.getElementById("barChart")).resize()
        })
      })
      // 图表自适应div大小变化
      erd.listenTo(document.getElementById("transform_div2"), (element) => {
        this.$nextTick(function () {
          //使echarts尺寸重置
          this.$echarts.init(document.getElementById("pieChart")).resize()
        })
      })
      // 图表自适应div大小变化
      erd.listenTo(document.getElementById("transform_div3"), (element) => {
        this.$nextTick(function () {
          //使echarts尺寸重置
          this.$echarts.init(document.getElementById("lineChart")).resize()
        })
      })

      this.setBoardOffset();
      this.drawBarChart();
      this.drawPieChart();
      this.drawLineChart();
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
      drawBarChart() {
        const barChart = this.$echarts.init(document.getElementById('barChart'));
        barChart.setOption({
          title: {text: 'Vue&ECharts:Bar'},
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'bar',
            data: ['13', '23', '53', '43', '23']
          }]
        });
        window.addEventListener('resize', () => {
          barChart.resize();
        });
      },
      drawLineChart() {
        const lineChart = this.$echarts.init(document.getElementById('lineChart'));
        lineChart.setOption({
          title: {text: 'Vue&ECharts:Line'},
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'line',
            data: ['13', '23', '53', '43', '23']
          }]
        });
        window.addEventListener('resize', () => {
          lineChart.resize();
        });
      },
      drawPieChart() {
        const pieChart = this.$echarts.init(document.getElementById('pieChart'));
        pieChart.setOption({
          title: {text: 'Vue&ECharts:Pie'},
          tooltip: {},
          series: [{
            name: '',
            type: 'pie',
            data: [
              {value: 13, name: 'DEBUG'},
              {value: 23, name: 'INFO'},
              {value: 53, name: 'WARN'},
              {value: 43, name: 'ERROR'},
              {value: 23, name: 'FATAL'},
            ]
          }]
        });
        window.addEventListener('resize', () => {
          pieChart.resize();
        });
      },
      setBoardOffset() {
        this.style.boardTop = this.$refs["board"].offsetTop
        this.style.boardLeft = this.$refs["board"].offsetLeft
        this.style.boardBottom = this.$refs["board"].offsetTop + this.$refs["board"].offsetHeight
        this.style.boardRight = this.$refs["board"].offsetLeft + this.$refs["board"].offsetWidth
        this.style.boardHeight = this.$refs["board"].offsetHeight
        this.style.boardWidth = this.$refs["board"].offsetWidth
      },
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*margin-top: 60px;*/
    -webkit-touch-callout:none;  /*系统默认菜单被禁用*/
    -webkit-user-select:none; /*webkit浏览器*/
    /*-khtml-user-select:none; !*早期浏览器*!*/
    -moz-user-select:none;/*火狐*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
  }

  input{
    -webkit-user-select:auto; /*webkit浏览器*/
  }
  
  textarea{
    -webkit-user-select:auto; /*webkit浏览器*/
  }

  #myChart {
    text-align: center;
    margin-left: 42%;
    width: 600px;
    height: 350px;
    display: none;
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
    background-color: #2c3e50;
    display: inline-block;
  }

  #tools{
    width: 200px;
    height: 800px;
    display: inline-block;
    background-color: cornflowerblue;
    float: right;
    position: absolute;
  }

  h1 {
    margin: 0 0 10px 0;
  }

  .setInput{
    width: 100px;
    margin-bottom: 10px;
  }
</style>
