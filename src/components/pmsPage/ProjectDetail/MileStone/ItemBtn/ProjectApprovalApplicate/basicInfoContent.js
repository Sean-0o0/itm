import React, { Fragment, useEffect, useState } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox
} from 'antd';
import moment from 'moment';
import { } from '../../../../../../services/pmsServices';

/**
 * 基本信息
 * @param {*} props
 * @returns
 */
const BasicInfoContent = (props) => {

  const { componentsObj, stateObj, dataObj, form } = props

  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;

  const { isUnfold, } = stateObj

  const { userBasicInfo, dictionary } = dataObj

  const { getTitle, getInputDisabled, getDatePicker, getRadio, getInput } = componentsObj

  const labelCol = 8;
  const wrapperCol = 16;

  const urgencyDegreeArr = [
    { title: '一般', value: 1 },
    { title: '紧急', value: 2 },
    { title: '加急', value: 3 },
  ]

  const projectTypeArr = [
    { title: '货物类(软硬件)', value: 2 },
    { title: '服务类(人力)', value: 3 },
    { title: '工程类', value: 1 },
  ]

  const isDirectTrialArr = [
    { title: '直接送审', value: 1 },
    { title: '发送至OA草稿箱', value: 2 },
  ]

  return (
    <>
      {getTitle('基本信息', isUnfold.basicInfo, 'basicInfo')}

      {isUnfold.basicInfo &&
        <div>
          <Row>
            {getInputDisabled('部门', userBasicInfo.orgname, labelCol, wrapperCol)}

            {getDatePicker('报告日期', 'bgrq', moment(new Date()), labelCol, wrapperCol)}
          </Row>

          <Row>
            {getInputDisabled('拟稿人', userBasicInfo.name, labelCol, wrapperCol)}

            {getRadio({
              label: '紧急程度',
              dataIndex: 'jjcd',
              initialValue: undefined,
              radioArr: urgencyDegreeArr,
              labelCol,
              wrapperCol
            })}
          </Row>

          <Row>
            {getRadio({
              label: '项目类型',
              dataIndex: 'xmlx',
              initialValue: undefined,
              radioArr: projectTypeArr,
              labelCol,
              wrapperCol,
              labelNode:
                <span>
                  <Tooltip
                    placement="bottomLeft"
                    title={
                      <p>
                        货物类:一般软硬件设备采购项目为货物类 <br />
                        服务类: 咨询服务、人力服务类项目为服务类 <br />
                        工程类: 办公场地装修、改造、维修等为工程类
                      </p>
                    }
                  >
                    <Icon type="question-circle"
                      style={{ marginLeft: '4px', marginRight: '2px', color: '#999', cursor: 'pointer' }}
                    />
                  </Tooltip>
                  项目类型
                </span>
            })}

            {/* 招采方式===2 隐藏 附件的“招标采购文件、招标采购文件模板” ，但入参好像没用到 招采方式，所以暂时不管*/}
            {getInputDisabled('招采方式', '公开招标', labelCol, wrapperCol)}
          </Row>

          <Row>
            {getRadio({
              label: '是否直接送审',
              dataIndex: 'sfzjss',
              initialValue: undefined,
              radioArr: isDirectTrialArr,
              labelCol,
              wrapperCol,
            })}

            {getInput('标题', 'bt', undefined, labelCol / 2, 24 - labelCol / 2)}
          </Row>

        </div>
      }
    </>
  )
}

export default BasicInfoContent
