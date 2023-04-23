function handleTree(data,id,parentId,level,edit) {
  let list = data.map(data => data[id])
  let parents = data.filter(value => {
    if(value[parentId] == 'undefined' || value[parentId] == null || !list.includes(value[parentId])){
      value[level]=0
      value[edit]=false
      return value
    }
  })
  let children = data.filter(value => {
    if(value[parentId] !== 'undefined' && value[parentId] != null && list.includes(value[parentId])){
      value[level]=0
      value[edit]=false
      return value
    }
  })
  let translator = (parents, children) => {
    parents.forEach((parent) => {
      children.forEach((current, index) => {
        if (current[parentId] === parent[id]) {
          current[level]=parent[level]+1
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      })
    })
  }
  translator(parents, children)
  return parents
}
export default handleTree;
