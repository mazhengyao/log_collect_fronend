<template>
  <div id="EditChart">
    <div id="clickArea">
      <div v-for="(item,index) in items" :key="item.name" :id="item.name" class="createChart"
           @click="createChart(item.type)">
        <img class="clickImg" :src="item.src">
      </div>
    </div>
    <div id="chartArea">
      <div id="chart"></div>
    </div>
    <div id="editArea">
      <!--数据绑定-->
      <p id="dataBinding">&nbsp;Data binding:</p>
      <div class="black"></div>
      <!--标题-->
      <p id="title">Title:</p>
      <input v-model="title" id="titleInput" type="text" @input="setTitle"/>
      <div class="black"></div>
      <!--数据-->
      <p id="data">Data:</p>
      <div>
        <select class="dataSelect" @change="setSelectIndex">
          <option v-for="(item,index) in selectSup" :key="index" :value="item.name">
            {{item.name}}
          </option>
        </select>
        <select class="dataSelect">
          <option v-for="(item,index) in selectSup[supIndex].selectSub" :key="item.name" :value="item.name">
            {{item.name}}
          </option>
        </select>
      </div>
      <div class="black"></div>
      <!--可选项-->
      <div id="bigDiv">
        <p id="optionalP">Optional:</p>
        <div id="optionalDiv">
          <draggable class="list-group" :list="listOptional" group="optional">
            <div class="list-group-item" v-for="(element, index) in listOptional" :key="element.name">
              {{ element.name }}
            </div>
          </draggable>
        </div>
      </div>
      <!--类别-->
      <div class="smallDiv">
        <p class="same3P">Category:</p>
        <div class="same3Div">
          <draggable class="list-group" :list="listCategory" group="optional">
            <div class="list-group-item" v-for="(element, index) in listCategory" :key="element.name">
              {{ element.name }}
            </div>
          </draggable>
        </div>
      </div>
      <!--X轴-->
      <div class="smallDiv">
        <p class="same3P">X axis:</p>
        <div class="same3Div">
          <draggable class="list-group" :list="listX" group="optional">
            <div class="list-group-item" v-for="(element, index) in listX" :key="element.name">
              {{ element.name }}
            </div>
          </draggable>
        </div>
      </div>
      <!--Y轴-->
      <div class="smallDiv">
        <p class="same3P">Y axis:</p>
        <div class="same3Div">
          <draggable class="list-group" :list="listY" group="optional">
            <div class="list-group-item" v-for="(element, index) in listY" :key="element.name">
              {{ element.name }}
            </div>
          </draggable>
        </div>
      </div>
      <div id="buttons">
        <!--保存-->
        <button class="button">Save</button>
        <!--重置-->
        <button class="button">Reset</button>
      </div>
    </div>
  </div>

</template>

<script>
  import draggable from "vuedraggable"

  export default {
    name: "EditChart",
    components: {
      draggable,
    },
    data() {
      return {
        items: [],
        supIndex: 0,
        title: '',
        selectSup: [],
        chart: '',


        listOptional: [
          { name: "Category4", id: 1 },
          { name: "X2", id: 3 },
          { name: "Category3", id: 7 },

        ],
        listCategory: [
          { name: "Category1", id: 5 },
          { name: "Category2", id: 6 },
        ],
        listX: [
          { name: "X1", id: 2 },
        ],
        listY: [
          { name: "Y1", id: 4 },
        ]

      }
    },
    mounted() {
      // 左侧点击div
      this.setItems();
      this.setSelect();
    },
    methods: {
      setItems() {
        this.items.push(
          {
            name: 'item1',
            src: require('./image/chart1.png'),
            type: 'line',
          },
          {
            name: 'item2',
            src: require('./image/chart2.png'),
            type: 'pie',
          },
          {
            name: 'item3',
            src: require('./image/chart3.png'),
            type: 'bar',
          },
          {
            name: 'item4',
            src: require('./image/chart4.png'),
            type: 'doughnut',
          })
      },
      setSelect() {
        this.selectSup.push(
          {
            name: 'Data Source 1',
            selectSub: [
              {
                name: 'Data Source 1-1',
              },
              {
                name: 'Data Source 1-2',
              },
              {
                name: 'Data Source 1-3',
              },
            ],
          },
          {
            name: 'Data Source 2',
            selectSub: [
              {
                name: 'Data Source 2-1',
              },
              {
                name: 'Data Source 2-2',
              },
              {
                name: 'Data Source 2-3',
              },
            ],
          },
          {
            name: 'Data Source 3',
            selectSub: [
              {
                name: 'Data Source 3-1',
              },
              {
                name: 'Data Source 3-2',
              },
              {
                name: 'Data Source 3-3',
              },
            ],
          },
        )
      },
      setSelectIndex(e) {
        this.supIndex = e.target.options.selectedIndex
      },
      setTitle() {
        let option = this.chart.getOption();
        option.title[0].text = this.title;
        this.chart.setOption(option);
      },
      // 随机数
      random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
      },
      createChart(type) {
        this.chart = this.$echarts.init(document.getElementById('chart'));
        if (type === 'line') {
          this.createLineChart()
        } else if (type === 'pie') {
          this.createPieChart()
        } else if (type === 'bar') {
          this.createBarChart()
        } else if (type === 'doughnut') {
          this.createDoughnutChart()
        }
      },
      createLineChart() {
        this.chart.clear();
        this.chart.setOption({
          title: {
            text: this.title
          },
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'line',
            data: [this.random(1, 100), this.random(1, 100), this.random(1, 100),
              this.random(1, 100), this.random(1, 100)]
          }]
        });
        window.addEventListener('resize', () => {
          this.chart.resize();
        });
      },
      createPieChart() {
        this.chart.clear();
        this.chart.setOption({
          title: {
            text: this.title
          },
          tooltip: {},
          series: [{
            name: '',
            type: 'pie',
            data: [
              {value: this.random(1, 100), name: 'DEBUG'},
              {value: this.random(1, 100), name: 'INFO'},
              {value: this.random(1, 100), name: 'WARN'},
              {value: this.random(1, 100), name: 'ERROR'},
              {value: this.random(1, 100), name: 'FATAL'},
            ]
          }]
        });
        window.addEventListener('resize', () => {
          this.chart.resize();
        });
      },
      createBarChart() {
        this.chart.clear();
        this.chart.setOption({
          title: {
            text: this.title
          },
          tooltip: {},
          xAxis: {
            data: ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"]
          },
          yAxis: {},
          series: [{
            name: '',
            type: 'bar',
            data: [this.random(1, 100), this.random(1, 100), this.random(1, 100),
              this.random(1, 100), this.random(1, 100)]
          }]
        });
        window.addEventListener('resize', () => {
          this.chart.resize();
        });
      },
      createDoughnutChart() {
        this.chart.clear();
        this.chart.setOption({
          title: {
            text: this.title
          },
          tooltip: {},
          series: [{
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            data: [
              {value: this.random(1, 100), name: 'DEBUG'},
              {value: this.random(1, 100), name: 'INFO'},
              {value: this.random(1, 100), name: 'WARN'},
              {value: this.random(1, 100), name: 'ERROR'},
              {value: this.random(1, 100), name: 'FATAL'},
            ]
          }]
        });
        window.addEventListener('resize', () => {
          this.chart.resize();
        });
      },
    },

  }
</script>

<style scoped>
  #clickArea {
    width: 14%;
    height: 800px;
    float: left;
    border: 3px solid darkslategrey;
    margin-right: 1%;
  }

  #chartArea {
    width: 30%;
    height: 800px;
    float: left;
    border: 3px solid darkslategrey;
    margin-right: 1%;
  }

  #editArea {
    /*background-color: darkcyan;*/
    width: 53%;
    height: 800px;
    float: left;
    border: 3px solid darkslategrey;
  }

  .createChart {
    width: 100%;
    height: 25%;
  }

  .clickImg {
    margin: 0;
    width: 80%;
    height: 100%;
  }

  #chart {
    background-color: whitesmoke;
    width: 100%;
    height: 60%;
    margin: 33% auto 0 auto;
  }

  #editArea p {
    color: darkslategrey;
    font-weight: 600;
    font-size: 22px;
    font-family: Candara;
    margin: 0;
    /*display: inline-block;*/
  }

  #dataBinding {
    float: left;
  }

  #title {
    float: left;
    margin-left: 8% !important;
    margin-right: 3% !important;
  }

  #titleInput {
    float: left;
    width: 70%;
    margin: 0.4% 0 0 0;
    color: darkslategrey;
    font-weight: 600;
    font-size: 18px;
  }

  .black {
    height: 5%;
    width: 100%;
    display: block;
  }

  .dataSelect {
    width: 35%;
    margin: 0.4% 0.6% 0 0;
    float: left;
    /*text-align:center;*/
    text-align-last: center;
    color: darkslategrey;
    font-weight: 600;
    font-size: 18px;
    font-family: Candara;
  }

  #data {
    float: left;
    margin-left: 8% !important;
    margin-right: 3% !important;
    display: inline-block;
  }

  #bigDiv {
    height: 81%;
    width: 50%;
    /*background-color: darkslateblue;*/
    float: left;
  }

  .smallDiv {
    height: 27%;
    width: 50%;
    /*background-color: darkgoldenrod;*/
    float: left;
  }

  #optionalP {
    float: left;
    margin-left: 8% !important;
    margin-bottom: 1% !important;
  }

  #optionalDiv {
    width: 96%;
    height: 94%;
    float: left;
    margin-left: 1%;
    /*background-color: deeppink;*/
    border: 3px solid darkslategrey;
  }

  .same3P {
    float: left;
    /*margin-left: 8% !important;*/
    margin-bottom: 1% !important;
  }

  .same3Div {
    width: 96%;
    height: 82%;
    float: left;
    margin-left: 1%;
    /*background-color: darkmagenta;*/
    border: 3px solid darkslategrey;
  }

  .button {
    background-color: darkslategrey;
    border-radius: 10px;
    color: whitesmoke;
    float: right;
    margin-right: 10px;
    height: 30px;
    width: 60px;
  }

  #buttons {
    float: left;
    /*margin-right: 10%;*/
    width: 100%;
  }

  .list-group{
  }

  .list-group-item{
    background-color: darkslategrey;
    color: whitesmoke;
    font-weight: 500;
    font-size: 18px;
    font-family: Candara;
    /*border: 1px solid whitesmoke;*/
    width: 100px;
    display: inline-block;
    margin: 10px;
    border-radius: 10px;
  }
</style>
