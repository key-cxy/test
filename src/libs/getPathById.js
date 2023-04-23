function getPathById(array,id){
  let parentArray = [];

  if (array.length === 0) {
    return parentArray;
  }

  function recursion(arrayNew,id){
    for (let i = 0; i < arrayNew.length; i++) {
      let node = arrayNew[i];
      if(node.id === id){
        parentArray.unshift(id);
        recursion(array,node.parentId);
        break;
      }else{
        if (!!node.children) {
          recursion(node.children,id);
        }
      }
    }
    return parentArray;
  }
  let arrayNew = array;
  parentArray = recursion(arrayNew, id);
  return parentArray;
}

export default getPathById;
