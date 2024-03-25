import Lodash from 'lodash'

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


export { textOverflowSlice }