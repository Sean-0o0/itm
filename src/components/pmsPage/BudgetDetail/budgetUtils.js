import * as Lodash from 'lodash'

/**
 * 计算百分比并向下取整 
 * @param {*} num1 部分
 * @param {*} num2 全部
 * @returns 
 */
export function calculatePercentage(num1, num2) {
  // console.log("🚀 ~ calculatePercentage ~ num1, num2:", num1, num2)
  if (isNaN(num1) || isNaN(num2)) return '-';
  const part = Number(num1);
  const total = Number(num2);
  if(total === 0) return '-';
  const percentage = Math.floor((part / total) * 100);
  if(isNaN(percentage)) return '-';
  return percentage + '%';
}


/**
 * 把 1000000000 转化成 1,000,000,000
 * @param {*} money 
 */
export function momneyFormatter(money) {
  const res = String(money).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return res
}


/**
 * 项目立项时间（去除感叹号）
 * @param {*} yearTag 2023 2023！
 * @returns 
 */
export const approvalTimeFormater = (yearTag) => {
  if (Lodash.isEmpty(yearTag)) return;
  const year = yearTag.slice(0, 4);
  const formattedTime = `预计${year}年`;
  return formattedTime;
}


/**
 * 删除字符串的感叹号
 * @param {*} str 
 * @returns 
 */
export const removeMarkHandle = (str) => {
  const reg = new RegExp("!", "g"); // 加'g'，删除字符串里所有的"!"
  const formatTag = str.replace(reg, "");
  return formatTag
}


/**
 * 字典搜索
 * @param {*} dictionary 具体的某个小字典
 * @param {*} dictionaryId 
 * @returns 
 */
export const dictionarySearchHandle = (dictionary, dictionaryId) => {
  if (Lodash.isEmpty(dictionary) || Lodash.isEmpty(dictionaryId)) return;
  const findItem = dictionary.find((item) => {
    return String(item.ibm) === String(dictionaryId)
  }) || {};
  return findItem.note
}


/**
 * 生成标签数组
 * @param {*} stringTagArr  
 * @param {*} dictionaryTagArr 
 * @returns 
 */
export const tagGenerator = (stringTagArr, dictionaryTagArr, boolTagArr) => {

  let res = []

  stringTagArr.forEach((str) => {
    if (!Lodash.isEmpty(str) && str.includes('!')) {
      res.push(removeMarkHandle(str))
    }
  })

  if (!Lodash.isEmpty(dictionaryTagArr)) {
    dictionaryTagArr.map((item) => {
      const dictionary = item[0]
      const dictionaryId = item[1]
      const dictionaryName = item[2]
      // console.log('dictionaryName', dictionaryName, dictionaryId)
      if (!Lodash.isEmpty(dictionaryId) && dictionaryId.includes('!')) {
        const formatDictionaryId = removeMarkHandle(dictionaryId)

        if (dictionary.length !== 0 && formatDictionaryId !== undefined) {
          if (dictionaryName === 'YSLB') {
            res.push(dictionarySearchHandle(dictionary, _dictionaryId) + '项目')
          }
          else {
            res.push(dictionarySearchHandle(dictionary, _dictionaryId))
          }
        }

        else if (dictionaryName === 'isInitialApproval' && String(formatDictionaryId) === '1') {
          res.push('首次立项')
        }
        else if (dictionaryName === 'Tag_softwareDevelopmentOrSystemDocking' && String(formatDictionaryId) === '1') {
          res.push('涉及软件开发或系统对接')
        }
        else if (dictionaryName === 'Tag_addOrCarryforward' && String(formatDictionaryId) === '1') {
          res.push('新增')
        }
        else if (dictionaryName === 'Tag_addOrCarryforward' && String(formatDictionaryId) === '2') {
          res.push('结转')
        }
      }
    })

  }

  return res
}


