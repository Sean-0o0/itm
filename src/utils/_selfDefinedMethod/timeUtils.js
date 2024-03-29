import Lodash from 'lodash'
import moment from 'moment'

/**
 * 时间工具
 */

/**
 * 20230101 <= 20230206 的限制（用于拆开的区间选择器），满足条件返回true，不满足条件返回false
 * @param {*} val1 日期1
 * @param {*} val2 日期2
 */
const YYYYMMDDLowerLimit = (val1, val2) => {
  let time1 = String(val1)
  let time2 = String(val2)

  if (moment.isMoment(val1)) {
    time1 = val1.format('YYYYMMDD')
  }
  if (moment.isMoment(val2)) {
    time2 = val2.format('YYYYMMDD')
  }
  // 将时间字符串转换为数值，然后进行比较
  const num1 = parseInt(time1, 10)
  const num2 = parseInt(time2, 10)
  return num1 <= num2
}


export { YYYYMMDDLowerLimit }