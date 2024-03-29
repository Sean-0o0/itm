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

export { textOverflowSlice, }



