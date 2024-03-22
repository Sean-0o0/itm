import React, { useState, useRef, useEffect, useContext, createContext } from 'react';
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

export const ProjectPlanContext = createContext()

/**
 * 项目计划
 * @param {*} props 
 * @returns 
 */
const ProjectPlan = (props) => {

  const { dictionary, userBasicInfo } = props


  const queryHandle = async () => {
    const queryParams = {
      "projectID": "1148",
      "year": "2024"
    };
    try {
      const res = await QueryProjectPayments(queryParams);
      if (res.code === 1) {

      }
    } catch (err) {
      console.log('查付款情况失败，', err)
      message.error(`查付款情况失败，${!err.success ? err.message : err.note}`, 3)
    }
  }


  return (
    <ProjectPlanContext.Provider
      value={{ dictionary, userBasicInfo }}
    >
      <div className='ProjectPlan'>
        项目计划项目计划项目计划项目计划
      </div>
    </ProjectPlanContext.Provider>

  )
}

export default ProjectPlan