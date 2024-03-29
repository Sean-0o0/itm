import Lodash from 'lodash'
import moment from 'moment'

/**
 * 顶点框架相关工具
 */

/**
   * 字典搜索
   * @param {*Array} dicName  字典arr
   * @param {*Number} uniqueId  ID (通常后端返回number)
   * @returns 
   */
const dictionaryMatchHandle = (dicName, uniqueId) => {
  const findItem = dicName.find(item => item.ibm === String(uniqueId))
  return findItem?.note
}

export { dictionaryMatchHandle }