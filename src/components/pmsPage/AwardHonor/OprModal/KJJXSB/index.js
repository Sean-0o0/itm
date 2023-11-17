import React, { useEffect, Fragment } from 'react';
import { Row } from 'antd';

export default function KJJXSB(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const {
    rowData = {},
    upldData = [],
    isTurnRed,
    sltData = {},
    userBasicInfo = {},
    HJQK = [],
    fromPrjDetail = false,
    parentRow = {},
    isGLY,
  } = dataProps;
  const { setUpldData, setIsTurnRed, getFieldValue } = funcProps;
  const {
    getInput,
    getSingleSelector,
    getMultipleUpload,
    getSingleTreeSelector,
    getDatePicker,
    getTextArea,
    getInputDisabled,
  } = components;
  const labelCol = 6;
  const wrapperCol = 18;

  return (
    <Fragment>
      <Row>
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
              label: '项目名称',
              dataIndex: 'xmmc',
              initialValue: rowData.GLXMID,
              labelCol,
              wrapperCol,
              sltArr: sltData.prjName,
              onChange: () => {},
              valueField: 'XMID',
              titleField: 'XMMC',
              required: false,
            })}
        {fromPrjDetail !== false
          ? getSingleSelector({
              label: '选择奖项',
              dataIndex: 'awardId',
              initialValue: parentRow.ID,
              labelCol,
              wrapperCol,
              sltArr: sltData.tableData,
              onChange: () => {},
              valueField: 'ID',
              titleField: 'JXMC',
            })
          : getInputDisabled({
              label: '选择奖项',
              dataIndex: 'awardId',
              initialValue: Number(parentRow.ID),
              value: parentRow.JXMC,
              labelCol,
              wrapperCol,
            })}
      </Row>
      <Row>
        {getInput('申报项目', 'sbxm', rowData.SBXM, labelCol, wrapperCol, 50)}
        {isGLY &&
          getSingleTreeSelector({
            label: '联系人',
            dataIndex: 'lxr',
            initialValue: rowData.LXRID || userBasicInfo.id,
            labelCol,
            wrapperCol,
            sltArr: sltData.contact,
            onChange: () => {},
            treeDefaultExpandedKeys: ['357', '11168'],
          })}
      </Row>
      <Row>
        {getTextArea({
          label: '申报说明',
          dataIndex: 'sbsm',
          initialValue: rowData.SBSM,
          labelCol: labelCol / 2,
          wrapperCol: 24 - labelCol / 2,
          maxLength: 600,
        })}
      </Row>
      <Row>
        {getSingleSelector({
          label: '获奖状态',
          dataIndex: 'hjzt',
          initialValue: rowData.HJQK,
          labelCol,
          wrapperCol,
          sltArr: HJQK,
          onChange: () => {},
          valueField: 'ibm',
          titleField: 'note',
        })}
        {getFieldValue('hjzt') === '1' &&
          getDatePicker({
            label: '获奖日期',
            dataIndex: 'hjrq',
            initialValue: rowData.HJSJ,
            labelCol,
            wrapperCol,
          })}
      </Row>
      <Row>
        {getMultipleUpload({
          label: '附件',
          labelCol: labelCol,
          wrapperCol: wrapperCol,
          fileList: upldData,
          setFileList: setUpldData,
          isTurnRed,
          setIsTurnRed,
        })}
      </Row>
    </Fragment>
  );
}
