<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link v-for="route in Object.keys(modules)" :key="Math.random()+route" :to="`/${route}`"> {{route}}</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import { modules } from '@/router'
export default {
  data () {
    return {
      modules
    }
  },
  mounted () {

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
