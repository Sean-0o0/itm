import Lodash from 'lodash'
import moment from 'moment'
// import * as ddFrameUtils from './ddFrameUtils'  
// 此版本umi不支持命名空间导入导出，老掉牙的版本
// 本来 export default {ddFrameUtils,xxxxxx,xxxxxxxx, }的事情

/**
 * 默认js函数
 */

/**
 * 超出多少个文字省略号显示
 * @param {*} text  长内容文本
 * @param {*} sliceLen  截取长度
 * @param {*} htmlContent  是否保留换行符号  <br>
 * @returns 
 */
const textOverflowSlice = (text, sliceLen, htmlContent = false) => {
  const txtLen = text.length || 0
  if (Lodash.isEmpty(text)) {
    return ''
  }
  else if (txtLen < Number(sliceLen)) {
    return text
  }
  else {
    const res = `${text.slice(0, sliceLen)}...`
    return res
  }
}

/**
 * 用于下拉多选框，拼接ID数组并用指定符号隔开  ['1415', '2123', '2517'] ————> '1415;2123;2517'
 * @param {*} arr  ID数组
 * @param {*} symbol ';'  分隔符
 * @returns
 */
const concatSymbolHandle = (arr, symbol) => {
  if (Lodash.isEmpty(arr)) return '';
  return arr.join(';')
}

/**
 * 用于下拉多选框，根据指定符号还原ID数组    '1415;2123;2517'  ————> ['1415', '2123', '2517']
 * @param {*} text string 字符串  例如 ''  '12488'   '12488;12454'
 * @param {*} symbol ';'  分隔符
 * @returns
 */
const convertSymbolToArrHandle = (text, symbol) => {
  if (Lodash.isEmpty(text)) return [];
  return text.split(';')
}


/**
 * 把指定符号替换成另一个符号（用于多选框返回的数据替换符号）
 * @param {string} str  原字符串    "沈*春shenxiaochun;郑*航zhenghuihang;陈*晗chenxiaohan"
 * @param {string} prevSymbol  替换前的符号，例如 ';'
 * @param {string} newSymbol   替换后的符号，例如 ','
 * @returns {string} 替换后的字符串
 */
const replaceSymbolToSymbol = (str, prevSymbol, newSymbol) => {
  if (Lodash.isEmpty(str)) return ''
  return str.replace(new RegExp(prevSymbol, 'g'), newSymbol)
}

/**
 * 去除数组的空值  null  undefined {} ''
 * @param {*} arr 
 * @returns 
 */
const removeArrEmptyValue = (arr) => {
  if (Lodash.isEmpty(arr)) return []
  let formatArr = []
  for (const item of arr) {
    if (!Lodash.isEmpty(item)) {
      formatArr.push(item)
    }
  }
  return formatArr
}



export {
  textOverflowSlice,   //超出多少个文字省略号显示
  concatSymbolHandle,  //用于下拉多选框，拼接ID数组并用指定符号隔开 ['1415', '2123', '2517'] ————> 1415;2123;2517
  convertSymbolToArrHandle, //用于下拉多选框，根据指定符号还原ID数组    '1415;2123;2517'  ————> ['1415', '2123', '2517']
  replaceSymbolToSymbol, // 把 指定符号替换成另一个符号 （用于多选框返回的数据替换符号）
  removeArrEmptyValue,  // 去除数组的空值  null  undefined {} ''
}



