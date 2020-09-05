<template>
  <div id="app">
    <sidebar class="sidebar" :menu="levelMenu" @menuChange="handleMenuChange('sidebar',$event)"></sidebar>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { levelMenu } from '@/router'

export default {
  data () {
    return {
      levelMenu
    }
  },
  components: {
    sidebar: () => import('@/components/Sidebar.vue')
  },
  methods: {
    handleMenuChange (key, path) {
      this.$router.push('/' + path)
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-flow: row nowrap;
  .sidebar{
    width: 200px;
  }
  .main-container{
    flex: 1;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
