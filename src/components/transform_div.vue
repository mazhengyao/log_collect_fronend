<template>
  <div ref="transformDiv" @mousedown="mousedownDiv($event)" class="move-content-outer" :style="changeStyle"
       tabIndex="1">
    <slot></slot>
    <div class="move-content-direction show move-content-direction-n"></div>
    <div class="move-content-direction show move-content-direction-ne"></div>
    <div class="move-content-direction show move-content-direction-e"></div>
    <div class="move-content-direction show move-content-direction-se"></div>
    <div class="move-content-direction show move-content-direction-s"></div>
    <div class="move-content-direction show move-content-direction-sw"></div>
    <div class="move-content-direction show move-content-direction-w"></div>
    <div class="move-content-direction show move-content-direction-nw"></div>
  </div>
</template>

<script>
  export default {
    name: "transform_div",
    props: {
      myStyle: {
        type: Object
      }
    },
    computed: {
      changeStyle() {
        return `height: ${this.style.height}px; width: ${this.style.width}px`
      }
    },
    data() {
      return {
        space: {
          style: '', // 样式
          x: 0, // 鼠标x
          y: 0, // 鼠标y
          width: this.myStyle.comWidth, // 默认div的宽度
          height: this.myStyle.comHeight, // 默认div的高度
          top: 0, // 默认div的距离头部距离
          right: 0, // 默认div的距离右侧距离
          bottom: 0, // 默认div的距离底部距离
          left: 0, // 默认div的距离左侧距离
          moveHeight: 30, // 默认头部高度
          min: 100, // div宽度高度不能小于min
          moveTarget: null, // 鼠标按下之后移动的target
        },
        style: {
          height: this.myStyle.comHeight,
          width: this.myStyle.comWidth,
        }
      }
    },
    watch: {
      myStyle: {
        handler(newValue, oldValue) {
          this.style.height = newValue.comHeight
          this.style.width = newValue.comWidth
        },
        deep: true
      }
    },
    mounted() {
    },
    methods: {
      mousedownDiv(event) {
        document.onmousemove = (e) => {
          this.addMoveContentControl(this.$refs['transformDiv'], e);
        }
      },
      addMoveContentSuper(divEle, e) {
        // div的style
        this.space.style = divEle.style;
        this.space.width = this.space.style.width ? this.space.style.width : this.myStyle.comHeight;
        this.space.height = this.space.style.height ? this.space.style.height : this.myStyle.comWidth;
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
        // if (e.buttons !== 1 || e.clientX >= this.myStyle.boardRight || e.clientX <= this.myStyle.boardLeft
        //   || e.clientY <= this.myStyle.boardTop || e.clientY >= this.myStyle.boardBottom) {
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
        if ((top + height) >= this.myStyle.boardHeight) {
          top = this.myStyle.boardHeight - height
        }
        // 限制 left
        if (left <= 0) {
          left = 0
        }
        // 限制 right
        if ((left + width) >= this.myStyle.boardWidth) {
          left = this.myStyle.boardWidth - width
        }

        this.space.style.top = top + "px";
        this.space.style.left = left + "px";
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
        if ((left + width) >= this.myStyle.boardWidth) {
          width = this.space.width;
        }
        // 限制 bottom
        if ((top + height) >= this.myStyle.boardHeight) {
          top = this.myStyle.boardHeight - height;
        }

        this.space.style.top = top + "px";
        this.space.style.width = width + "px";
        this.space.style.height = height + "px";
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
        if ((left + width) >= this.myStyle.boardWidth) {
          width = this.space.width
        }

        this.space.style.width = width + "px";
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
        if ((left + width) >= this.myStyle.boardWidth) {
          width = this.space.width
        }
        // 限制 bottom
        if ((top + height) >= this.myStyle.boardHeight) {
          height = this.space.height
        }

        this.space.style.width = width + "px";
        this.space.style.height = height + "px";
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
        if ((top + height) >= this.myStyle.boardHeight) {
          height = this.space.height
        }

        this.space.style.height = height + "px";
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
        if ((top + height) >= this.myStyle.boardHeight) {
          height = this.space.height
        }

        this.space.style.width = width + "px";
        this.space.style.height = height + "px";
        this.space.style.left = left + "px";
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
      }
    }
  }
</script>

<style scoped>
  /*移动*/
  .move-content-outer {
    background-color: lightgoldenrodyellow;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100%;
    position: absolute;
  }

  .move-content-outer:focus .show {
    display: block;
  }

  /* 八个方位的div控制 */
  .move-content-direction {
    width: 5px;
    height: 5px;
    border: 1px #2c3e50 solid;
    background-color: #E1E1E1;
    position: absolute;
    display: none;
    padding: 2px;
    border-radius: 10px;
  }

  /* 八个方位的小手各自的div */
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

</style>
