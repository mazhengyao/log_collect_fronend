<template>
  <div ref="transformDiv" @mousedown="mousedownDiv($event)" class="move-content-outer" :style="changeStyle"
       tabIndex="1" @focus="transformFocus" @blur="transformBlur">
    <slot></slot>
    <div class="move-content-direction move-content-direction-n" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-ne" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-e" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-se" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-s" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-sw" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-w" v-show="showPoint"></div>
    <div class="move-content-direction move-content-direction-nw" v-show="showPoint"></div>
    <!--设置框-->
    <div class="move-content-setting" v-show="showPoint">
      <span class="move-content-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Top:</span>
      <input class="move-content-input" type="text" v-model="style.top"
             @focus="settingFocus" @blur="settingBlur" @input="inputTop($event)"/>
      <br>
      <span class="move-content-text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Left:</span>
      <input class="move-content-input" type="text" v-model="style.left"
             @focus="settingFocus" @blur="settingBlur" @input="inputLeft($event)"/>
      <span class="move-content-text">Height:</span>
      <input class="move-content-input" type="text" v-model="style.height"
             @focus="settingFocus" @blur="settingBlur" @input="inputHeight($event)"/>
      <span class="move-content-text">&nbsp;Width:</span>
      <input class="move-content-input" type="text" v-model="style.width"
             @focus="settingFocus" @blur="settingBlur" @input="inputWidth($event)"/>
      <span class="move-content-text">&nbsp;&nbsp;Index:</span>
      <input class="move-content-input" type="text" @focus="settingFocus" v-model="style.index" @blur="settingBlur"/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "transform_div",
    props: {
      com: {
        type: Object
      },
      board: {
        type: Object
      },
    },
    computed: {
      changeStyle() {
        let result = `height: ${this.style.height}px; width: ${this.style.width}px;
                top: ${this.style.top}px; left: ${this.style.left}px; z-index: ${this.style.index};`
        if(this.showPoint){
          result += 'outline: 2px #2c3e50 solid;'
        }
        // else{
        //   result += 'border: 2px whitesmoke solid;'
        // }
        return result
      }
    },
    data() {
      return {
        space: {
          style: '', // 样式
          x: 0, // 鼠标x
          y: 0, // 鼠标y
          width: this.com.comWidth, // 默认div的宽度
          height: this.com.comHeight, // 默认div的高度
          top: this.com.comTop, // 默认div的距离头部距离
          right: 0, // 默认div的距离右侧距离
          bottom: 0, // 默认div的距离底部距离
          left: this.com.comLeft, // 默认div的距离左侧距离
          moveHeight: 30, // 默认头部高度
          min: 100, // div宽度高度不能小于min
          moveTarget: null, // 鼠标按下之后移动的target
        },
        style: {
          top: this.com.comTop,
          left: this.com.comLeft,
          height: this.com.comHeight,
          width: this.com.comWidth,
          index: this.com.index,
        },
        showPoint: false,
        showSetting: false,
      }
    },
    watch: {
      com: {
        handler(newValue, oldValue) {
          this.style.top = parseInt(newValue.comTop)
          this.style.left = parseInt(newValue.comLeft)
          this.style.height = parseInt(newValue.comHeight)
          this.style.width = parseInt(newValue.comWidth)
          this.style.index = parseInt(newValue.index)
        },
        deep: true
      }
    },
    mounted() {
    },
    methods: {
      mousedownDiv(event) {
        this.$emit('transformDivItem',this.com)
        document.onmousemove = (e) => {
          this.addMoveContentControl(this.$refs['transformDiv'], e);
        }
      },
      addMoveContentSuper(divEle, e) {
        // div的style
        this.space.style = divEle.style;
        this.space.width = this.space.style.width ? this.space.style.width : this.com.comHeight;
        this.space.height = this.space.style.height ? this.space.style.height : this.com.comWidth;
        this.space.top = this.space.style.top ? this.space.style.top : 0;
        this.space.left = this.space.style.left ? this.space.style.left : 0;
        this.space.right = this.space.style.right ? this.space.style.right : 0;
        this.space.bottom = this.space.style.bottom ? this.space.style.bottom : 0;
        this.space.x = e.movementX;
        this.space.y = e.movementY;
        // 修改属性的值
        this.space.width = parseInt(this.space.width.toString().replace("px", ""));
        this.space.height = parseInt(this.space.height.toString().replace("px", ""));
        this.space.top = parseInt(this.space.top.toString().replace("px", ""));
        this.space.right = parseInt(this.space.right.toString().replace("px", ""))
        this.space.bottom = parseInt(this.space.bottom.toString().replace("px", ""))
        this.space.left = parseInt(this.space.left.toString().replace("px", ""))
      },
      addMoveContentControl(divEle, e) {
        // 当鼠标没有按下则不走方法、超过限制范围不走方法
        // if (e.buttons !== 1 || e.clientX >= this.board.boardRight || e.clientX <= this.board.boardLeft
        //   || e.clientY <= this.board.boardTop || e.clientY >= this.board.boardBottom)
        if (e.buttons !== 1) {
          this.space.moveTarget = null;
          return;
        } else if (this.space.moveTarget === null) {  // 当鼠标按下了,movetarget为空则赋值
          this.space.moveTarget = e.target;
        }
        // 获取所有拉伸的节点
        let direction = divEle.getElementsByClassName("move-content-direction");

        // 缩放
        if (this.space.moveTarget === direction[0]) {
          // 上缩放
          this.addMoveContentTop(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[1]) {
          // 右上缩放
          this.addMoveContentRightTop(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[2]) {
          // 右缩放
          this.addMoveContentRight(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[3]) {
          // 右下缩放
          this.addMoveContentRightButtom(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[4]) {
          // 下缩放
          this.addMoveContentButtom(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[5]) {
          // 左下缩放
          this.addMoveContentLeftButtom(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[6]) {
          // 左缩放
          this.addMoveContentLeft(divEle, e);
          return;
        } else if (this.space.moveTarget === direction[7]) {
          // 左上缩放
          this.addMoveContentLeftTop(divEle, e);
          return;
        }
        // 移动
        if (this.space.moveTarget.ownerDocument.activeElement === divEle || this.space.moveTarget === divEle) {
          this.addMoveContentMove(divEle, e);
        }
      },
      // 移动
      addMoveContentMove(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top + this.space.y;
        let left = this.space.left + this.space.x;
        let width = this.space.width;
        let height = this.space.height;

        // 限制 top
        if (top <= 0) {
          top = 0
        }
        // 限制 bottom
        if ((top + height) >= this.board.boardHeight) {
          top = this.board.boardHeight - height
        }
        // 限制 left
        if (left <= 0) {
          left = 0
        }
        // 限制 right
        if ((left + width) >= this.board.boardWidth) {
          left = this.board.boardWidth - width
        }

        this.space.style.top = top + "px";
        this.space.style.left = left + "px";

        this.transformDivStyle()
      },
      // 向上拉伸
      addMoveContentTop(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top;
        let height = this.space.height + (-this.space.y);

        // 缩小保护
        if (height < this.space.min) {
          height = this.space.min;
        } else {
          top = this.space.top + this.space.y;
        }
        // 限制 top
        if (top <= 0) {
          top = 0
          height = this.space.height
        }

        this.space.style.top = top + "px";
        this.space.style.height = height + "px";

        this.transformDivStyle()
      },
      // 右上拉伸
      addMoveContentRightTop(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top;
        let left = this.space.left + this.space.x;
        let width = this.space.width + this.space.x;
        let height = this.space.height + (-this.space.y);

        // 缩小保护
        if (height < this.space.min) {
          height = this.space.min;
        }
        if (width < this.space.min) {
          width = this.space.min;
        }else{
          top = this.space.top + this.space.y;
        }
        // 限制 top
        if (top <= 0) {
          top = 0;
          height = this.space.height;
        }
        // 限制 right
        if ((left + width) >= this.board.boardWidth) {
          width = this.space.width;
        }
        // 限制 bottom
        if ((top + height) >= this.board.boardHeight) {
          top = this.board.boardHeight - height;
        }

        this.space.style.top = top + "px";
        this.space.style.width = width + "px";
        this.space.style.height = height + "px";

        this.transformDivStyle()
      },
      // 右侧拉伸
      addMoveContentRight(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let width = this.space.width + this.space.x;
        let left = this.space.left + this.space.x;

        // 缩小保护
        if (width < this.space.min) {
          width = this.space.min;
        }
        // 限制 right
        if ((left + width) >= this.board.boardWidth) {
          width = this.space.width
        }

        this.space.style.width = width + "px";

        this.transformDivStyle()
      },
      // 右下拉伸
      addMoveContentRightButtom(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top + this.space.y;
        let left = this.space.left + this.space.x;
        let width = this.space.width + this.space.x;
        let height = this.space.height + this.space.y;

        // 缩小保护
        if (height < this.space.min) {
          height = this.space.min;
        }
        if (width < this.space.min) {
          width = this.space.min;
        }
        // 限制 right
        if ((left + width) >= this.board.boardWidth) {
          width = this.space.width
        }
        // 限制 bottom
        if ((top + height) >= this.board.boardHeight) {
          height = this.space.height
        }

        this.space.style.width = width + "px";
        this.space.style.height = height + "px";

        this.transformDivStyle()
      },
      // 向下拉伸
      addMoveContentButtom(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top + this.space.y;
        let height = this.space.height + this.space.y;

        // 缩小保护
        if (height < this.space.min) {
          height = this.space.min;
        }
        // 限制 bottom
        if ((top + height) >= this.board.boardHeight) {
          height = this.space.height
        }

        this.space.style.height = height + "px";

        this.transformDivStyle()
      },
      // 左下拉伸
      addMoveContentLeftButtom(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top + this.space.y;
        let left = this.space.left;
        let width = this.space.width + (-this.space.x);
        let height = this.space.height + this.space.y;

        // 缩小保护
        if (height < this.space.min) {
          height = this.space.min;
        }
        if (width < this.space.min) {
          width = this.space.min;
        } else {
          left = this.space.left + this.space.x;
        }
        // 限制 left
        if (left <= 0) {
          left = 0
          width = this.space.width
        }
        // 限制 bottom
        if ((top + height) >= this.board.boardHeight) {
          height = this.space.height
        }

        this.space.style.width = width + "px";
        this.space.style.height = height + "px";
        this.space.style.left = left + "px";

        this.transformDivStyle()
      },
      // 向左拉伸
      addMoveContentLeft(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let left = this.space.left;
        let width = this.space.width + (-this.space.x);

        // 缩小保护
        if (width < this.space.min) {
          width = this.space.min;
        } else {
          left = this.space.left + this.space.x;
        }
        // 限制 left
        if (left <= 0) {
          left = 0
          width = this.space.width
        }

        this.space.style.left = left + "px";
        this.space.style.width = width + "px";

        this.transformDivStyle()
      },
      // 左上拉伸
      addMoveContentLeftTop(divEle, e) {
        this.addMoveContentSuper(divEle, e);
        let top = this.space.top;
        let left = this.space.left;
        let width = this.space.width + (-this.space.x);
        let height = this.space.height + (-this.space.y);

        // 缩小保护
        if (height < this.space.min) {
          height = this.space.min;
        } else {
          top = this.space.top + this.space.y;
        }
        if (width < this.space.min) {
          width = this.space.min;
        } else {
          left = this.space.left + this.space.x;
        }
        // 限制 left
        if (left <= 0) {
          left = 0
          width = this.space.width
        }
        // 限制 top
        if (top <= 0) {
          top = 0
          height = this.space.height
        }

        this.space.style.top = top + "px";
        this.space.style.left = left + "px";
        this.space.style.width = width + "px";
        this.space.style.height = height + "px";

        this.transformDivStyle()
      },
      // 父组件传递数据
      transformDivStyle() {
        this.$emit('transformDivStyle', {
          top: parseInt(this.space.style.top.toString().replace('px', '')),
          left: parseInt(this.space.style.left.toString().replace('px', '')),
          height: parseInt(this.space.style.height.toString().replace('px', '')),
          width: parseInt(this.space.style.width.toString().replace('px', ''))
        })
      },
      transformFocus(event) {
        this.showPoint = true
      },
      transformBlur(event) {
        // 当setting获取焦点后保持transform的焦点
        setTimeout(()=>{
          if (!this.showSetting) {
            this.showPoint = false
          }
        }, 10)
      },
      settingFocus(event) {
        this.showSetting = true
      },
      settingBlur(event) {
        // 点击外侧时，重新获取对transform的焦点
        if(!event.relatedTarget){
          event.target.offsetParent.offsetParent.focus();
        }
        this.showSetting = false
      },
      inputTop(event){
        let value = event.target.value;
        if (value < 0){
          this.style.top = 0
        }
        if (value > this.board.boardHeight - this.style.height){
          this.style.top = this.board.boardHeight - this.style.height
        }
      },
      inputLeft(event){
        let val = event.target.value;
        if (val < 0){
          this.style.left = 0
        }
        if (val > this.board.boardWidth - this.style.width){
          this.style.left = this.board.boardWidth - this.style.width
        }
      },
      inputHeight(event){
        let val = event.target.value;
        if (val < 0){
          this.style.height = 100
        }
        if (val > this.board.boardHeight - this.style.top){
          this.style.height = this.board.boardHeight - this.style.top
        }
      },
      inputWidth(event){
        let val = event.target.value;
        if (val < 0){
          this.style.width = 100
        }
        if (val > this.board.boardWidth - this.style.left){
          this.style.width = this.board.boardWidth - this.style.left
        }
      },
    }
  }
</script>

<style scoped>
  /*移动*/
  .move-content-outer {
    /*background-color: lightgoldenrodyellow;*/
    background-color: whitesmoke;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100%;
    position: absolute;
  }

  /*.move-content-outer:focus .show {*/
  /*  display: block;*/
  /*}*/

  .move-content-outer:focus{
    /*选中时的外边框*/
    outline: none;
  }

  /* 八个方位的div控制 */
  .move-content-direction {
    width: 5px;
    height: 5px;
    border: 1px #2c3e50 solid;
    background-color: #E1E1E1;
    position: absolute;
    padding: 2px;
    border-radius: 10px;
  }

  /* 八个方位的div各自的div */
  .move-content-direction-n {
    cursor: n-resize;
    left: 50%;
    top: -7px;
    margin-left: -4px;
  }

  .move-content-direction-ne {
    cursor: ne-resize;
    top: -7px;
    right: -7px;
  }

  .move-content-direction-e {
    cursor: e-resize;
    top: 50%;
    right: -7px;
    margin-top: -4px;
  }

  .move-content-direction-se {
    cursor: se-resize;
    bottom: -7px;
    right: -7px;
  }

  .move-content-direction-s {
    cursor: s-resize;
    bottom: -7px;
    left: 50%;
    margin-left: -4px;
  }

  .move-content-direction-sw {
    cursor: sw-resize;
    left: -7px;
    bottom: -7px;
  }

  .move-content-direction-w {
    cursor: w-resize;
    left: -7px;
    top: 50%;
    margin-top: -4px;
  }

  .move-content-direction-nw {
    cursor: nw-resize;
    left: -7px;
    top: -7px;
  }

  /* 设置框 */
  .move-content-setting {
    width: 150px;
    height: 135px;
    border: 3px darkslategrey dotted;
    background-color: whitesmoke;
    position: absolute;
    border-radius: 3px;
    bottom: -150px;
    left: 50%;
    margin-left: -80px;
  }

  .move-content-text{
    color: darkslategrey;
    font-weight: 600;
    font-size: 18px;
    font-family: Candara;
  }

  .move-content-input{
    width: 72px;
    margin: 3px;
  }

</style>
