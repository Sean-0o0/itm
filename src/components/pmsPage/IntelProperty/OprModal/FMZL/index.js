import React, { useEffect, Fragment } from 'react';
import { Row } from 'antd';

export default function FMZL(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const {
    rowData = {},
    upldData = [],
    isTurnRed,
    sltData = {},
    userBasicInfo = {},
    DQZT = [],
    ZLLX = [],
    fromPrjDetail = false,
    isGLY,
  } = dataProps;
  const { setUpldData, setIsTurnRed } = funcProps;
  const {
    getInput,
    getSingleSelector,
    getMultipleUpload,
    getSingleTreeSelector,
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
            })}
        {getInput('专利名称', 'name', rowData.NAME, labelCol, wrapperCol, 50)}
      </Row>
      <Row>
        {getSingleSelector({
          label: '专利类型',
          dataIndex: 'zllx',
          initialValue: rowData.ZLLX,
          labelCol,
          wrapperCol,
          sltArr: ZLLX,
          onChange: () => {},
          valueField: 'ibm',
          titleField: 'note',
        })}
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
        {getSingleSelector({
          label: '当前状态',
          dataIndex: 'dqzt',
          initialValue: rowData.DQZT,
          labelCol,
          wrapperCol,
          sltArr: DQZT,
          onChange: () => {},
          valueField: 'ibm',
          titleField: 'note',
        })}
        {getInput('证书号', 'zsh', rowData.ZSH, labelCol, wrapperCol, 20)}
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
