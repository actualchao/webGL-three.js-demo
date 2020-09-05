<script>
export default {
  props: {
    menu: Array,
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    subMenu () {
      return this.menu
    }
  },
  watch: {
    menu: {
      immediate: true,
      handler () {
        this.menuCache = {}
      }
    }
  },
  methods: {
    handleMenuClick (path) {
      // console.log('handleMenuClick:::', index, this.menuCache[index])
      this.$emit('menuChange', path)
    },
    handleMenuToggle () {
      this.$emit('collapseChange', !this.isCollapse)
    },
    r (h, subMenu) {
      const { path, fullPath } = subMenu
      const children = Object.prototype.toString.call(subMenu.children) === '[object Array]' ? subMenu.children.filter(item => { return item.nodeType !== 3 }) : []

      if (children && children.length) {
        return (
          <el-submenu index={ path } on-click={ this.handleMenuClick.bind(this, fullPath) }>

            <template slot="title">
              <i class={'iconfont ' + subMenu.icon}></i>
              <span>
                { subMenu.path }
              </span>
            </template>
            {
              children.map(item => {
                return this.r(h, item)
              })
            }
          </el-submenu>
        )
      } else if (path) {
        if (!children) {
          return (
            <el-menu-item index={ fullPath } key={fullPath} class="submenu-title-noDropdown">
              { subMenu.path }
            </el-menu-item>
          )
        }
        return (
          <el-menu-item index={ fullPath } key={fullPath} class="submenu-title-noDropdown">
            {
              subMenu.icon ? <i class={'iconfont ' + subMenu.icon}></i> : null
            }
            <span slot="title">{ subMenu.path }</span>
          </el-menu-item>
        )
      } else {
        return (
          <el-menu-item index={ fullPath } key={fullPath} class="submenu-title-noDropdown">
            { subMenu.text }
          </el-menu-item>
        )
      }
    }
  },
  // eslint-disable-next-line
  render(h){
    return (
      <div class="layout-sidebar">
        <el-menu mode="vertical" unique-opened
          default-active={ this.$route.meta.id }
          collapse={ this.isCollapse }
          on-select={ this.handleMenuClick }
          class={{ 'menu-collapse': this.isCollapse }}
        >
          {
            this._l(this.subMenu, item => {
              return this.r(h, item)
            })
          }
        </el-menu>

      </div>
    )
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

.layout-sidebar{
  width: 200px;
  height: 100vh;
  text-align: left;
  overflow: none;
  position: relative;
  .el-menu{
    width: 200px;
  }
}
</style>
