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
import { textOverflowSlice } from '../../../../utils/_selfDefinedMethod'

/**
 * 进展统计
 * @param {*} props
 */
const ProgressStatistics = (props) => {

  const { overdueData, riskData } = props

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
                  <Tooltip title={item.name} placement="topLeft">
                    <span className='title' title={item.name} style={{ cursor: 'default' }}>
                      {item.name}
                    </span>
                  </Tooltip>
                </div>

                <div className='listItemBox_top_rightBox'>
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
                  <Tooltip title={item.milestone} placement="topLeft">
                    <span className='title' title={item.milestone} style={{ cursor: 'default' }}>
                      {item.milestone}
                    </span>
                  </Tooltip>
                </div>

                <div className='listItemBox_top_rightBox'>
                  <Tooltip title={item.title} placement="topLeft">
                    <span style={{ cursor: 'default' }}>{item.title}</span>
                  </Tooltip>
                </div>
              </div>

              <Tooltip title={item.content} placement="topLeft">
                <div className='listItemBox_bottom' style={{ cursor: 'default' }}
                  dangerouslySetInnerHTML={{ __html: textOverflowSlice(item.content, 50).replace(/\n/g, '<br>') }}
                >
                </div>
              </Tooltip>

            </div>
          })}
        </div>
      }

    </div>
  )
}

export default ProgressStatistics
