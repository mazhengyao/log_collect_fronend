<template>
  <div id="logCollect">
    <h1>{{ msg }}</h1>
    <!--    todo log collect  -->
    <router-link to="/transform_div">transform_div</router-link>
    <router-view></router-view>
    <router-link to="/log_form">log_form</router-link>
    <router-view></router-view>
    <div id="myChart">
    </div>
    <div class="container">
      <input id="document" type="file" v-on:change="readFileInputEventAsArrayBuffer"/>
      <div class="row" style="width: 100%;">
        <div class="span8">
          <div id="output" class="well"></div>
        </div>
      </div>
      <button type="button" id="show" style="width: 50px;height: 30px;"
              v-on:click="showDoc">show
      </button>
    </div>
  </div>
</template>

<script>
  import mammoth from 'mammoth'
  export default {
    name: 'LogCollect',
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
      }
    },
    computed: {
    },
    mounted() {
      this.queryLogData();
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
    }
  }
</script>

<style>
  html {
    background-color: whitesmoke;
  }

  #logCollect {
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

  #myChart {
    text-align: center;
    margin-left: 42%;
    width: 600px;
    height: 350px;
    display: none;
  }


  #output {
    text-align: left;
    width: 60%;
  }

</style>

