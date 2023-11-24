import React, { Fragment } from 'react';
import moment from 'moment';

export default function RJZZ(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const {
    rowData = {},
    upldData = [],
    isTurnRed,
    sltData = {},
    userBasicInfo = {},
    DQZT,
    fromPrjDetail = false,
    isGLY,
  } = dataProps;
  const { setUpldData, setIsTurnRed, getFieldValue } = funcProps;
  const {
    getInput,
    getSingleSelector,
    getMultipleUpload,
    getSingleTreeSelector,
    getInputDisabled,
    getDatePicker,
  } = components;
  const labelCol = 6;
  const wrapperCol = 18;

  return (
    <Fragment>
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
      {getInput('软件名称', 'name', rowData.NAME, labelCol, wrapperCol, 50)}
      {getInput('版本号', 'bbh', rowData.BBH, labelCol, wrapperCol, 10)}
      {getInput(
        '证书号',
        'zsh',
        rowData.ZSH,
        labelCol,
        wrapperCol,
        20,
        String(getFieldValue('dqzt')) !== '1',
      )}
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
      {getDatePicker(
        '登记时间',
        'djsj',
        (rowData.DJSJ ? moment(String(rowData.DJSJ)) : null) || moment(),
        labelCol,
        wrapperCol,
      )}
      {getMultipleUpload({
        label: '附件',
        labelCol: labelCol,
        wrapperCol: wrapperCol,
        fileList: upldData,
        setFileList: setUpldData,
        isTurnRed,
        setIsTurnRed,
      })}
    </Fragment>
  );
}
