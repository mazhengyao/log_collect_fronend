<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <!--<router-link to="/log_form">log_form</router-link>-->
    <!--<router-view></router-view>-->
    <transform_div>
        <div style="position: relative; margin: 0; overflow: hidden; word-break: break-all; width: 100%; height: 100%; color:#2c3e50;">
          {{joydivision}}
        </div>
    </transform_div>
<!--    <router-link to="/transform_div">transform_div</router-link>-->
<!--    <router-view></router-view>-->
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
              v-on:click="showDoc">show</button>
    </div>
  </div>
</template>

<script>
import mammoth from 'mammoth'
export default {
  name: 'app',
  data () {
    return {
      msg: 'Knocking on heaven’s door.',
      joydivision: 'When routine bites hard and ambitions are low.And resentment rides high but emotions won\'t grow.' +
        'And we\'re changing our ways, taking different roads.Love, love will tear us apart again.',
      logData: {
        debug:'',
        info:'',
        warn:'',
        error:'',
        fatal:'',
      }
    }
  },
  mounted(){
    this.queryLogData();
  },
  methods: {
    drawLine(){
      const myChart = this.$echarts.init(document.getElementById('myChart'));
      myChart.setOption({
        title: { text: 'Vue&ECharts' },
        tooltip: {},
        xAxis: {
          data: ["DEBUG","INFO","WARN","ERROR","FATAL"]
        },
        yAxis: {},
        series: [{
          name: '',
          type: 'bar',
          data: [this.logData.debug, this.logData.info, this.logData.warn, this.logData.error, this.logData.fatal]
        }]
      });
    },
    async queryLogData(){
      try {
        // 异步转同步
        // axios 采用then和非箭头函数时,this指向存在问题
        let res = await this.$axios.get('http://127.0.0.1:8181/log/queryLog');
        this.logData = res.data;
        this.drawLine();
        // 实时拉取数据
        setTimeout(() =>{
          this.queryLogData();
        },1000)
      }catch (err) {
        console.log(err)
      }
    },
    readFileInputEventAsArrayBuffer(event) {
    var file = event.target.files[0];
    console.log(file)
    var reader = new FileReader();

    reader.onload = function (loadEvent) {
      var arrayBuffer = loadEvent.target.result;//arrayBuffer
      mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then((result) =>
          document.getElementById("output").innerHTML = result.value
          )
        .done();
    };

    reader.readAsArrayBuffer(file);
  },
    async showDoc(){
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

    }

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
    margin-top: 60px;
  }
  #myChart{
    text-align: center;
    margin-left: 42%;
    width: 600px;
    height: 350px;
    display: none;
  }
  #output{
    text-align: left;
    width: 60%;
  }
</style>
