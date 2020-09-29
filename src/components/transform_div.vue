<template>
  <div ref="changeDiv" @click="onchangeDiv" class="s-move-content-outer" tabIndex="1" >
    <div class="s-move-content-header" tabIndex="1" >
      <slot></slot>
      <div class="s-move-content-direction s-show s-move-content-direction-n"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-ne"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-e"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-se"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-s"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-sw"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-w"></div>
      <div class="s-move-content-direction s-show s-move-content-direction-nw"></div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "transform_div",
        data(){
          return {
            message: 'Hello Vue!',
            space : {
              move : {               // [移动]
                content : {           // [移动备注框]
                  width  : 200,         // 默认div的宽度
                  height : 200,         // 默认div的高度
                  top    : 0 ,          // 默认div的距离头部距离
                  right  : 0 ,          // 默认div的距离右侧距离
                  bottom : 0 ,          // 默认div的距离底部距离
                  left   : 0 ,          // 默认div的距离左侧距离
                  moveHeight : 30 ,     // 默认头部高度
                  min    : 100 ,        // div宽度高度不能小于min
                  buttomTarget : null,  // 鼠标按下之后的target
                  moveTarget : null     // 鼠标按下之后移动的target
                }
              }
            }
          }
        },
        mounted(){
        },
        methods: {
          onchangeDiv() {
            document.onmousemove = (e) => {
              this.addMoveContentControl(this.$refs['changeDiv'],e);
            }
          },
          addMoveContentSuper(divEle,e){
            // 缩小保护
            this.min = this.space.move.content.min;
            // 元素
            this.divEle    = divEle;
            // div的style
            this.divStyle  = this.divEle.style;
            this.divWidth  = this.divStyle.width;
            this.divHeight = this.divStyle.height;
            this.divTop    = this.divStyle.top;
            this.divRight  = this.divStyle.right;
            this.divBottom = this.divStyle.bottom;
            this.divLeft   = this.divStyle.left;
            // 头部移动高度
            this.hreadHeight = this.space.move.content.moveHeight;
            // 鼠标事件event
            this.e = e;
            this.x = e.movementX;
            this.y = e.movementY;
            this.moveTarget = this.space.move.content.moveTarget; // 正在移动的target
            // 修改属性的值
            // [这里以后就不用再if判断了,就连html里的标签都是js生成的直接用js赋值宽度就行]
            this.divWidth  = (this.divWidth   === "") ?
              this.space.move.content.width    : parseInt(this.divWidth.replace("px",""));

            this.divHeight = (this.divHeight  === "") ?
              this.space.move.content.height   : parseInt(this.divHeight.replace("px",""));

            this.divTop    = (this.divTop     === "") ?
              this.space.move.content.top      : parseInt(this.divTop.replace("px",""));

            this.divRight  = (this.divRight   === "") ?
              this.space.move.content.right    : parseInt(this.divRight.replace("px",""));

            this.divBottom = (this.divBottom  === "") ?
              this.space.move.content.bottom   : parseInt(this.divBottom.replace("px",""));

            this.divLeft   = (this.divLeft    === "") ?
              this.space.move.content.left     : parseInt(this.divLeft.replace("px",""));
          },
          addMoveContentControl(divEle,e){
            if(e.buttons !== 1){                               // 当鼠标没有按下则不走方法
              this.space.move.content.moveTarget = null;
              return;
            }else if(this.space.move.content.moveTarget === null){  // 当鼠标按下了,movetarget为空则赋值
              this.space.move.content.moveTarget = e.target;        // 这里利用了成员变量
            }
            var move = divEle;                                                 // 获取移动元素
            var direction = divEle.getElementsByClassName("s-move-content-direction");           // 获取所有拉伸的节点
            switch(this.space.move.content.moveTarget){
              case move         : this.addMoveContentMove(divEle,e,move);                break; // 头部移动
              case direction[0] : this.addMoveContentTop(divEle,e,direction[0]);         break; // 上拉伸
              case direction[1] : this.addMoveContentRightTop(divEle,e,direction[1]);    break; // 右上拉伸
              case direction[2] : this.addMoveContentRight(divEle,e,direction[2]);       break; // 右拉伸
              case direction[3] : this.addMoveContentRightButtom(divEle,e,direction[3]); break; // 右下拉伸
              case direction[4] : this.addMoveContentButtom(divEle,e,direction[4]);      break; // 下拉伸
              case direction[5] : this.addMoveContentLeftButtom(divEle,e,direction[5]);  break; // 左下拉伸
              case direction[6] : this.addMoveContentLeft(divEle,e,direction[6]);        break; // 左上拉伸
              case direction[7] : this.addMoveContentLeftTop(divEle,e,direction[7]);     break; // 左上拉伸
              default : this.addMoveContentMove(divEle,e,move);                          break;
            }
          },
          addMoveContentMove(divEle,e,thisEle){ // 移动
            this.addMoveContentSuper.apply(this,arguments);
            var top  = this.divTop + this.y;
            var left = this.divLeft + this.x;
            this.divStyle.top  = top + "px";
            this.divStyle.left = left + "px";
          },
          addMoveContentTop(divEle,e,thisEle){ // 向上拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var top    = this.divTop;
            var height = this.divHeight + (-this.y);
            if(height < this.min)
              height = this.min;
            else
              top = this.divTop + this.y;
            this.divStyle.top    = top + "px";
            this.divStyle.height = height + "px";
          },
          addMoveContentRightTop(divEle,e,thisEle){ // 右上拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var top    = this.divTop;
            var width  = this.divWidth + this.x;
            var height = this.divHeight + (-this.y);
            if(height < this.min)
              height = this.min;
            if(width < this.min)
              width = this.min;
            else
              top = this.divTop + this.y;
            this.divStyle.top    = top + "px";
            this.divStyle.width  = width + "px";
            this.divStyle.height = height + "px";
          },
          addMoveContentRight(divEle,e,thisEle){  // 右侧拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var width   = this.divWidth + this.x;
            if(width < this.min)
              width = this.min;
            this.divStyle.width   = width + "px";
          },
          addMoveContentRightButtom(divEle,e,thisEle){ // 右下拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var width  = this.divWidth + this.x;
            var height = this.divHeight + this.y;
            if(height < this.min)
              height = this.min;
            if(width < this.min)
              width = this.min;
            this.divStyle.width  = width + "px";
            this.divStyle.height = height + "px";
          },
          addMoveContentButtom(divEle,e,thisEle){ // 向下拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var height = this.divHeight + this.y;
            if(height < this.min)
              height = this.min;
            this.divStyle.height = height + "px";
          },
          addMoveContentLeftButtom(divEle,e,thisEle){ // 左下拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var left   = this.divLeft;
            var width  = this.divWidth + (-this.x);
            var height = this.divHeight + this.y;
            if(height < this.min)
              height = this.min;
            if(width < this.min)
              width = this.min;
            else
              left = this.divLeft + this.x;
            this.divStyle.width  = width + "px";
            this.divStyle.height = height + "px";
            this.divStyle.left = left + "px";
          },
          addMoveContentLeft(divEle,e,thisEle){ // 向左拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var left    = this.divLeft;
            var width   = this.divWidth + (-this.x);
            if(width < this.min)
              width = this.min;
            else
              left = this.divLeft + this.x;
            this.divStyle.left    = left + "px";
            this.divStyle.width   = width + "px";
          },
          addMoveContentLeftTop(divEle,e,thisEle){ // 左上拉伸
            this.addMoveContentSuper.apply(this,arguments);
            var top    = this.divTop;
            var left   = this.divLeft;
            var width  = this.divWidth + (-this.x);
            var height = this.divHeight + (-this.y);
            if(height < this.min)
              height = this.min;
            else
              top = this.divTop + this.y;
            if(width < this.min)
              width = this.min;
            else
              left = this.divLeft + this.x;
            this.divStyle.top    = top + "px";
            this.divStyle.left   = left + "px";
            this.divStyle.width  = width + "px";
            this.divStyle.height = height + "px";
          }
        }
    }
</script>

<style scoped>
  .s-move-content-outer{
    border:1px #E1E1E1 solid;
    width:200px;
    height:200px;
    position:relative;
    outline:none;
    user-select:none;
  }

  .s-move-content-outer:focus .s-show{
    display:block;
  }

  /* 移动 */
  .s-move-content-header{
    background-color: lightgoldenrodyellow;
    width:100%;
    height:100%;
    text-align:center;
    line-height: 100%;

  }

  .s-move-content-header:focus .s-show{
    display:block;
  }

  /* 八个方位的div控制 */
  .s-move-content-direction{
    width:5px;
    height:5px;
    border:1px black solid;
    background-color: #E1E1E1;
    position:absolute;
    display:none;
  }

  /* 八个方位的小手各自的div */
  .s-move-content-direction-n{
    cursor:n-resize;
    left:50%;
    top:-7px;
    margin-left:-4px;}

  .s-move-content-direction-ne{
    cursor:ne-resize;
    top:-7px;
    right:-7px;
  }

  .s-move-content-direction-e{
    cursor:e-resize;
    top:50%;
    right:-7px;
    margin-top:-4px;
  }

  .s-move-content-direction-se{
    cursor:se-resize;
    bottom:-7px;
    right:-7px;
  }

  .s-move-content-direction-s{
    cursor:s-resize;
    bottom:-7px;
    left:50%;
    margin-left:-4px;
  }

  .s-move-content-direction-sw{
    cursor:sw-resize;
    left:-7px;
    bottom:-7px;
  }

  .s-move-content-direction-w{
    cursor:w-resize;
    left:-7px;
    top:50%;
    margin-top:-4px;
  }

  .s-move-content-direction-nw{
    cursor:nw-resize;
    left:-7px;
    top:-7px;
  }

</style>
