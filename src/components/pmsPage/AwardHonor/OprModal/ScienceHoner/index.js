import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Row, message, Col, Form, Select, Spin, Tooltip } from 'antd';
import debounce from 'lodash/debounce';
import {
  FetchQueryOwnerProjectList,
  QueryProjectListInfo,
} from '../../../../../services/pmsServices';

/**
 * 科技荣誉——弹窗 - 编辑新建权限跟知识产权类似
 * @param {*} props
 * @returns
 */
export default function ScienceHoner(props) {
  //——————————————————————————————属性解析————————————————————————
  const { components = {}, dataProps = {}, funcProps = {} } = props;

  // 使用到的封装的组件
  const {
    getInput,
    getSingleSelector,
    getSingleTreeSelector,
    getDatePicker,
    getMultipleUpload,
    getInputDisabled,
  } = components;

  // 使用到的数据
  const {
    rowData = {},
    upldData = [],
    isTurnRed,
    userBasicInfo,
    sltData, //  项目数据  联系人树形数据
    isGLY, // 是否管理员
    visible,
    fromPrjDetail = false,
  } = dataProps;

  // 使用到的函数
  const { setUpldData, setIsTurnRed, setIsSpinning, getContactData, getFieldDecorator } = funcProps;

  //固定常量
  const labelCol = 6;
  const wrapperCol = 18;
  const labelStyle = { display: 'inline-block', lineHeight: '17px' };

  return (
    <>
      <Row>
        {getInput('荣誉名称', 'sbxm', rowData.RYMC, labelCol, wrapperCol, 50)}
        {fromPrjDetail !== false //便是入口为项目详情，这时值为{xmmc,xmid}
          ? getInputDisabled({
              label: '项目名称',
              dataIndex: 'xmmc',
              initialValue: Number(fromPrjDetail.xmid),
              value: fromPrjDetail.xmmc,
              labelCol,
              wrapperCol,
            })
          : getSingleSelector({
              label: '关联项目',
              dataIndex: 'xmmc',
              initialValue: rowData.GLXMID === undefined ? undefined : String(rowData.GLXMID),
              labelCol,
              wrapperCol,
              sltArr: sltData.prjName,
              onChange: () => {},
              valueField: 'XMID',
              titleField: 'XMMC',
              required: false,
              optionNode: x => (
                <Select.Option key={x.XMID} value={x.XMID} title={x.XMMC}>
                  <Tooltip title={x.XMMC} placement="topLeft">
                    {x.XMMC}
                    <div style={{ fontSize: '12px', color: '#bfbfbf' }}>{x.XMNF}</div>
                  </Tooltip>
                </Select.Option>
              ),
              optionLabelProp: 'title',
              optionFilterProp: 'title',
            })}
      </Row>
      {/* unit:fqdw   */}
      {getInput('颁发单位', 'fqdw', rowData.BFDW, labelCol, wrapperCol, 50)}

      {/* 管理员 */}
      {isGLY &&
        getSingleTreeSelector({
          label: '联系人',
          dataIndex: 'lxr',
          // initialValue: rowData.LXRID || userBasicInfo.id,
          initialValue: rowData.LXRID,
          labelCol,
          wrapperCol,
          sltArr: sltData.contact,
          onChange: () => {},
          treeDefaultExpandedKeys: ['357', '11168'],
        })}

      {getDatePicker({
        label: '获奖日期',
        dataIndex: 'hjrq',
        initialValue: rowData.HJSJ,
        labelCol,
        wrapperCol,
      })}

      {getMultipleUpload({
        label: '附件',
        labelCol: labelCol,
        wrapperCol: wrapperCol,
        fileList: upldData,
        setFileList: setUpldData,
        isTurnRed,
        setIsTurnRed,
      })}
    </>
  );
}
