import React, { useState, useRef, useEffect, useContext, } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox,
} from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
// import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import moment from 'moment';
import { QueryProjectPayments } from '../../../services/auditSysServices';
import Lodash from 'lodash'


/**
 * 组件名称
 * @param {*} props 
 * @returns 
 */
const CompnentsName = (props) => {

  const { } = props


  return (
    <div className='CompnentsName'>
      组件名称
    </div>
  )
}

export default CompnentsName