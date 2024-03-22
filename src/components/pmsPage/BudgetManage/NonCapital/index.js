import React, { useState, useRef, useEffect, useContext, } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox,
} from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
// import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import moment from 'moment';
import { QueryProjectPayments } from '../../../../services/pmsServices';
import Lodash from 'lodash'
import FilterBar from './FilterBar'
import TableBox from './TableBox';
import OptionBar from './OptionBar'

/**
 * 非资本预算
 * @param {*} props 
 * @returns 
 */
const NonCapital = (props) => {

  const { } = props

  const filterBarRef = useRef({})
  const tableBoxRef = useRef({})
  const optionBarRef = useRef({})


  return (
    <div className='NonCapital whiteBackgroundPane'>

      <FilterBar
        wrappedComponentRef={filterBarRef}
      />

      <OptionBar
        ref={optionBarRef}
      />

      <TableBox
        ref={tableBoxRef}
        filterBarRef={filterBarRef}
      />

    </div>
  )
}

export default NonCapital