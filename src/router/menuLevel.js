

/**
 * 路径字符转树形结构
 * for examples
 * ['aa/bb/cc','aa/bb/dd','bb/cc']
 *

 * @param {Array} pathArr 路径字符串数组
 */
export default function buildLevelMenu (pathArr) {
  console.log(pathArr)
  pathArr = pathArr.map(path => path.replace(/^\.\/(.*)\.\w+$/, '$1'))

  /** 根据层级菜单path 递归生成层级树 */
  const buildMenu = (menu, levelPathArr, fullPath) => {
    const length = levelPathArr.length
    if (length) {
      const levelPath = levelPathArr.shift(1)
      const levelMenu = { path: levelPath, children: [] }
      if (levelPathArr[0]) {
        levelMenu.children = buildMenu([], levelPathArr)
      } else {
        levelMenu.fullPath = fullPath
      }
      menu.push(levelMenu)
    }
    return menu.length ? menu : []
  }

  const levelMenu = []

  // 递归查找匹配的层级目录
  const fn = (levelMenu, levelPathArr, fullPath) => {
    const levelPath = levelPathArr.shift(1)
    const level = levelMenu.find(item => item.path === levelPath)
    if (level) {
      fn(level.children, levelPathArr, fullPath)
    } else {
      const buildLevel = { path: levelPath, children: buildMenu([], levelPathArr, fullPath) }
      if (!buildLevel.children.length) {
        buildLevel.fullPath = fullPath
      }
      levelMenu.push(buildLevel)
    }
  }
  pathArr.forEach(path => {
    fn(levelMenu, path.split('/'), path)
  })


  console.log(levelMenu)
  return levelMenu
}
