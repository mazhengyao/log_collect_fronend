<template>
  <div id="app">
    <h1>{{ msg }}</h1>
    <!--<router-link to="/log_form">log_form</router-link>-->
    <!--<router-view></router-view>-->
    <div id="myChart">
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to big data.',
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
  }
</style>
