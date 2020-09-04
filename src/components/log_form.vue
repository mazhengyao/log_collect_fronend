<template>
  <table>
    <tr>
      <td>序号</td>
      <td>级别</td>
      <td>日期</td>
      <td>类</td>
      <td>方法</td>
    </tr>
    <tr v-for="item in items">
      <td>{{item.serial}}</td>
      <td>{{item.level}}</td>
      <td>{{item.date}}</td>
      <td>{{item.class}}</td>
      <td>{{item.func}}</td>
    </tr>
  </table>
</template>

<script>
    export default {
        name: "log_form",
        data(){
          return{
            msg:'Hello log',
            items:[
              {
                serial: '',
                level:'',
                date:'',
                class:'',
                func:'',
              }
            ]
          }
        },
      created() {
        const _this = this;
        this.$axios.get('http://127.0.0.1:8181/log/queryLog').then(
          function(res){
            _this.items=res.data
          }
        )
      }
    }
</script>

<style scoped>

</style>
