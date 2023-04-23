let result = null
function getTree(root,id) {
  if (!!root) {
    let type = Object.prototype.toString.call(root).slice(8, -1)
    if (type === 'Object') {
      if (root.id && root.id === id) {
        result = root
      } else {
        let node = root.children || null
        getTree(node, id)
      }
    } else if (type === 'Array') {
      let needNode = root.find(x => !!x === true && x.id === id)
      if (!!needNode) {
        result = needNode
      } else {
        root && root.forEach(item => {
          if (item && item.children && item.children.length) {
            getTree(item.children, id)
          }
        })
      }
    }
  }
  return result
}

export default getTree;
