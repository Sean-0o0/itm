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
const ListItem = (props) => {

  const { } = props


  return (
    <div className='ProjectDetail_PaymentStatus'>


    </div>
  )
}

export default ListItem