import React, { useEffect, useState, useContext } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { QueryProjectProgressStatistics } from '../../../../services/pmsServices';
import Lodash from 'lodash'
import BlueFlagIcon from '../../../../assets/projectDetail/icon_blueFlag.png'

/**
 * 进展统计
 * @param {*} props 
 */
const ProgressStatistics = (props) => {

  const { xmid: projectID } = props

  /** 逾期里程碑数据 */
  const [overdueData, setOverdueData] = useState([])

  /** 风险数据 */
  const [riskData, setRiskData] = useState([])

  /** 计算逾期天数 */
  const computedOverdueNum = (endDate) => {
    const parsedEndDate = new Date(
      endDate.substring(0, 4), // 年份
      parseInt(endDate.substring(4, 6)) - 1, // 月份，注意要减去1
      endDate.substring(6, 8) // 日期
    )
    const nowDate = new Date() // 当前日期
    // 计算时间差，以天为单位
    const timeDiff = Math.floor((nowDate - parsedEndDate) / (1000 * 60 * 60 * 24))
    return timeDiff
  }

  /** “、”拼接数组每一项，最后一个不要“、”号 */
  const mattersFormatter = (arr) => {
    if (Lodash.isEmpty(arr)) return ''
    const formattedArr = arr.map((item) => item.name)
    const formattedString = formattedArr.join("、")
    return formattedString
  };


  const queryHandle = async () => {

    const queryParams = {
      projectID
    }
    try {
      const res = await QueryProjectProgressStatistics(queryParams)
      if (res.code === 1) {
        const arr = JSON.parse(res.result)
        const { milestone, risk } = arr
        // console.log('xxxxxxxxxxxxxxxxxxxx', milestone, risk)
        setOverdueData(milestone)
        setRiskData(risk)
      }
    }
    catch (err) {
      message.error(`查询项目逾期情况和风险情况失败，${!err.success ? err.message : err.note}`, 3)
    }
  }

  useEffect(() => {
    queryHandle()
  }, [])

  return (
    <div className='ProjectDetail_ProgressStatistics'>

      {!Lodash.isEmpty(overdueData) &&
        <div className='group'>
          <div className='groupTitle'>逾期情况</div>

          {overdueData.map((item) => {
            return <div className='listItemBox'>
              <div className='listItemBox_top'>
                <div className='listItemBox_top_leftBox'>
                  <img src={BlueFlagIcon} className='img'></img>
                  <span className='title' title={item.name}>
                    {item.name}
                  </span>
                </div>

                <div className='listItemBox_top_rightBox' title={`逾期${computedOverdueNum(item.endDate)}天`}>
                  逾期{computedOverdueNum(item.endDate)}天
                </div>
              </div>

              <div className='listItemBox_bottom'>
                逾期：{mattersFormatter(item.matters)}
              </div>
            </div>
          })}
        </div>
      }

      {!Lodash.isEmpty(riskData) &&
        <div className='group'>
          <div className='groupTitle'>风险情况</div>

          {riskData.map((item) => {
            return <div className='listItemBox'>
              <div className='listItemBox_top'>
                <div className='listItemBox_top_leftBox'>
                  <img src={BlueFlagIcon} className='img'></img>
                  <span className='title' title={item.milestone}>
                    {item.milestone}
                  </span>
                </div>

                <div className='listItemBox_top_rightBox' title={item.title}>
                  {item.title}
                </div>
              </div>

              <div className='listItemBox_bottom'>
                {item.content}
              </div>
            </div>
          })}
        </div>
      }

    </div>
  )
}

export default ProgressStatistics