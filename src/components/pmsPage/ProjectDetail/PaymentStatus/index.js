import React, { useEffect, useState, useContext } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { } from '../../../../services/pmsServices';
import Lodash from 'lodash'
import BlueFlagIcon from '../../../../assets/projectDetail/icon_blueFlag.png'

/**
 * 付款情况
 * @param {*} props 
 */
const PaymentStatus = (props) => {

  const { } = props


  return (
    <div className='ProjectDetail_PaymentStatus'>

      {/* 逾期情况 */}
      <div className='group'>
        <div className='groupTitle'>逾期情况</div>

        <div className='listItemBox'>
          <div className='listItemBox_top'>
            <div className='listItemBox_top_leftBox'>
              <img src={BlueFlagIcon} className='img'></img>
              <span className='title'>阿萨德事阿萨德事实上阿萨德事实上实上</span>
            </div>
            <div className='listItemBox_top_rightBox' title=''>萨法法师萨法法师萨法法师萨法法师萨法法师萨法法师</div>
          </div>

          <div className='listItemBox_bottom'>

          </div>
        </div>
      </div>

      {/* 风险情况 */}
      {/* <div className='riskSituation group'>
        <div className='groupTitle'>风险情况</div>
      </div> */}

    </div>
  )
}

export default PaymentStatus