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
              initialValue: 5000000,
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
                  initialValue: '<p>各位领导：</p><p>为贯彻党中央、国务院全面实行股票发行注册制的决策部署，落实中国证监会总体工作安排，进一步健全资本市场基础交易制度，优化转融通机制，促进全市场多空平衡。为进一步做好转融资服务，提升业务市场化水平，增加市场供给、提升交易效率，满足参与方多样化需求。中国证券金融公司按照证监会统一部署 启动市场化转融资业务，市场化转融资业务通过调整前端交易方式实现“灵活期限、竞价费率”。证券公司可以在 1-182 天的期限范围内自主确定资金使用期限，并在证金公司公布的转融资费率下限基础上自行报价，在现有转融通平台上通过竞价方式达成转融资交易。</p><p>恒生已在转融通系统开发支持，市场化约定转融资业务为恒生柜台系统增值模块，申请指定采购方式向恒生公司采购。 本次改造恒生优惠报价720000元，后续将由公司招标办统一安排与恒生公司进行商务谈判，确定最终价格。 </p><p><strong>此项目属于信息技术事业部业务的优化内容，已列入2023年信息技术资本性预算的“新业务支持”的预算中。</strong><span style="font-size: 14px;"></span></p>',
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