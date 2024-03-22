import React, { useState, useRef, useEffect, useContext, forwardRef, useImperativeHandle } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox,
} from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
// import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import moment from 'moment';
import { QueryProjectPayments } from '../../../../../services/pmsServices';
import Lodash from 'lodash'


/**
 * 操作栏
 * @param {*} props 
 * @returns 
 */
const OptionBar = forwardRef((props, ref) => {

  const { } = props

  useImperativeHandle(ref, () => ({

  }))

  return (
    <Form>
      <div className='OptionBar'>
        OptionBar
      </div>
    </Form>
  )
})
export default OptionBar