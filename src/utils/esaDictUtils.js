// 字典别名的map(别名: 对应字典名称)
const dictionaryMap = {
  SYDQ: 'AREA', // 适用大区
  BMLB: 'DEP_CLASS', // 部门类别
  ZBLX: 'EXAM_TYPE', // 指标类型
};

// livebos对象别名的map(别名: 对应对象名称)
const objectMap = {
  // YYB: 'LBORGANIZATION', // 营业部
  // RYLB: 'TEMP_CLASS_DEF', // 人员类别
  KHRY: 'TEMPLOYEE', // 考核人员
  KHND: 'TYR_INFO', // 考核年度
};

export function getDictKey(name) {
  return dictionaryMap[name] || name;
}

export function getObjKey(name) {
  return objectMap[name] || name;
}
