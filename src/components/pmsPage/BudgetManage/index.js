import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox, Tabs,
} from 'antd';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
// import { DecryptBase64, EncryptBase64 } from '../../Common/Encrypt';
import moment from 'moment';
import { QueryProjectPayments } from '../../../services/pmsServices';
import Lodash from 'lodash'
import NonCapital from './NonCapital';

const { TabPane } = Tabs;

export const BudgetManageContext = createContext()

/**
 * 预算管理
 * @param {*} props 
 * @returns 
 */
const BudgetManage = (props) => {

  const { dictionary, userBasicInfo } = props

  const [curTabKey, setCurTabKey] = useState('FZB')

  const [isLoading, setIsLoading] = useState(false)


  return (
    <BudgetManageContext.Provider
      value={{
        dictionary, userBasicInfo,
        isLoading, setIsLoading,
        curTabKey
      }}
    >
      <div className='BudgetManage'>

        <div className='common_top-console'>
          <Tabs
            activeKey={curTabKey}
            onChange={val => setCurTabKey(val)}
            size={'large'}
          >
            <TabPane tab="资本性预算" key="ZB">

            </TabPane>

            <TabPane tab="非资本性预算" key="FZB">
              <NonCapital
              />
            </TabPane>

            <TabPane tab="科研预算" key="KY">

            </TabPane>
          </Tabs>
        </div>


      </div>
    </BudgetManageContext.Provider>

  )
}

export default BudgetManage