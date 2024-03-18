import React, { useEffect, useState, useContext } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { } from '../../../../services/pmsServices';
import Lodash from 'lodash'

/**
 * 进展统计
 * @param {*} props 
 */
const ProgressStatistics = (props) => {

  const { } = props


  return (
    <div className='ProjectDetail_ProgressStatistics'>
      进展统计
    </div>
  )
}

export default ProgressStatistics