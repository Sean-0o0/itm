import React, { Fragment, useEffect, useState } from 'react';
import {
  Button, Col, Form, message, Modal, Row, Spin, Select, DatePicker, Input, InputNumber,
  Radio, Upload, Tooltip, Icon, Popconfirm, Checkbox,
} from 'antd';
import RichTextEditor from '../../../../LifeCycleManagement/ContractSigning/RichTextEditor';
import moment from 'moment';
import { } from '../../../../../../services/pmsServices';

/**
 * 项目信息
 * @param {*} props 
 * @returns 
 */
const ProjectInfoContent = (props) => {

  const { componentsObj, stateObj, dataObj, form } = props

  const { getFieldDecorator, getFieldValue, validateFields, resetFields } = form;

  const { isUnfold, } = stateObj

  const { userBasicInfo, dictionary } = dataObj

  const { getTitle, getInputNumber, getRichTextArea } = componentsObj

  const labelCol = 8;
  const wrapperCol = 16;

  return (
    <>
      {getTitle('项目信息', isUnfold.projectInfo, 'projectInfo')}

      {isUnfold.projectInfo &&
        <div>
          <Row>
            {getInputNumber({
              label: '项目预算金额(元)',
              dataIndex: 'xmysje',
              initialValue: undefined,
              labelCol: labelCol,
              wrapperCol: wrapperCol,
              rules: [
                {
                  required: true,
                  message: '项目预算金额不允许空值',
                },
              ],
              max: 999999999,
            })}

            <Col span={24}>
              <Form.Item label="请示报告内容" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                {getFieldDecorator('qsbgnr', {
                  rules: [
                    {
                      required: true,
                      message: '请输入请示报告内容',
                    },
                  ],
                })(<RichTextEditor className="w-e-menu w-e-text-container w-e-toolbar" />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      }
    </>
  )
}

export default ProjectInfoContent