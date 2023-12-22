//常用方法

//将父节点设置为不可选
function setParentSelectableFalse(node) {
  if (node.children && node.children.length > 0) {
    // 如果节点有子节点
    node.selectable = false; // 将该节点设置为不可选
    node.children.forEach(child => {
      // 遍历子节点
      setParentSelectableFalse(child); // 递归处理子节点
    });
  }
}

//获取字典note
const getNote = (data = [], ibm) =>
  ibm !== undefined ? data.find(x => String(x.ibm) === String(ibm))?.note || '' : '';

export { setParentSelectableFalse, getNote };
