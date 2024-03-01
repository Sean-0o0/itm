import React, { Fragment } from 'react';
import moment from 'moment';
import { Select, Tooltip } from 'antd';

export default function HYBZ(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const {
    rowData = {},
    upldData = [],
    isTurnRed,
    sltData = {},
    userBasicInfo = {},
    DQZT = [],
    CYXZ = [],
    fromPrjDetail = false,
    isGLY,
    HYBZLX = [],
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
      {getInput('标准名称', 'name', rowData.NAME, labelCol, wrapperCol, 50)}
      {getSingleSelector({
        label: '参与性质',
        dataIndex: 'cyxz',
        initialValue: rowData.CYXZ,
        labelCol,
        wrapperCol,
        sltArr: CYXZ,
        onChange: () => {},
        valueField: 'ibm',
        titleField: 'note',
      })}
      {getSingleSelector({
        label: '标准类型',
        dataIndex: 'bzlx',
        initialValue: rowData.HYBZLX,
        labelCol,
        wrapperCol,
        sltArr: HYBZLX,
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
      {getInput(
        '证书号',
        'zsh',
        rowData.ZSH,
        labelCol,
        wrapperCol,
        20,
        String(getFieldValue('dqzt')) !== '1',
      )}
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
