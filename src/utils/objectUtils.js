/**
 * Object对象相关的自定义处理函数
 */

const ObjectUtils = {
  omit(srcObj, fields) { // 返回一个对象,其为将原对象中指定的属性删除后的一个新的对象(其它属性为浅层拷贝)
    // 浅层复制对象
    const shallowCopy = {
      ...srcObj,
    };
    // 然后将fields指定的属性删除
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      delete shallowCopy[key];
    }
    return shallowCopy;
  },
  shallowEqual(aObj, bObj) { // 浅比较两个对象是否相等
    if (aObj === bObj) {
      return true;
    }
    if (typeof aObj !== 'object' || aObj === null || typeof bObj !== 'object' || bObj === null) {
      return false;
    }
    const aKeys = Object.keys(aObj);
    const bKeys = Object.keys(bObj);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    let isEqual = true;
    isEqual = aKeys.every((key) => {
      const aValue = aObj[key];
      const bValue = bObj[key];
      if (aValue === bValue) {
        // 正负零不相等,通过除1后是正负无穷来区分正负零
        isEqual = aValue !== 0 || bValue !== 0 || 1 / aValue === 1 / bValue;
      } else {
        // 数组
        if (Array.isArray(aValue) && Array.isArray(bValue)) {
          if (aValue.length !== bValue.length) {
            return false;
          }
          if (JSON.stringify(aValue).toString() === JSON.stringify(bValue).toString()) {
            return true;
          }
          return false;
        }
        //
        const aValueTemp = aValue;
        const bValueTemp = bValue;
        // 如果两者都是NaN时,应该看作相等
        isEqual = aValue !== aValueTemp && bValue !== bValueTemp;
      }
      return isEqual;
    });
    return isEqual;
  },
};

export default ObjectUtils;
