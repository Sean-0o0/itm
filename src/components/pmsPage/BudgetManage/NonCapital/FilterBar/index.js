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
 * 筛选栏
 * @param {*} props 
 * @returns 
 */
const FilterBar = forwardRef((props, ref) => {

  const { form } = props

  const { getFieldDecorator, getFieldsValue, setFieldsValue, resetFields } = form

  useImperativeHandle(ref, () => ({

  }))

  return (
    <Form>
      <div className='FilterBar'>
        FilterBar
      </div>
    </Form>
  )
})
export default Form.create()(FilterBar)