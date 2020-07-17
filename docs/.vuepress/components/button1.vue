<template>
  <div class="demo">我是一个示例demo
      <button @click="isShow">显示/隐藏</button>
      <div v-show="show">
          显示
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false
    };
  },
  methods:{
      isShow:function(){
          this.show=!this.show
      }
  }
};
</script>

<style lang="less">
.demo {
  width: 500px;
  height: 500px;
  background: red;
}
</style>
