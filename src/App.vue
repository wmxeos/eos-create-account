<template>
  <div>
    <div id="app">
      <keep-alive>
        <router-view class="child-view" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view class="child-view" v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>

</template>

<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: 'app',
  components: {
  },
  mounted() {

  },
  data(){
    return {

    }
  },
  methods:{
  }
}
</script>

<style>
body{
  font-size: 14px!important;
}
.child-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all .5s cubic-bezier(.55,0,.1,1);
}
body{background-color: #f7f7f7;}
</style>
