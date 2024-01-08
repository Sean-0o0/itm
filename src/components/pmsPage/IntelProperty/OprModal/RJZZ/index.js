import React, { Fragment, useEffect } from 'react';
import moment from 'moment';
import { Row, Input } from 'antd';

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
    docTemplateList
  } = dataProps;
  const { setUpldData, setIsTurnRed, getFieldValue } = funcProps;
  const {
    getInput,
    getSingleSelector,
    getMultipleUpload,
    getSingleTreeSelector,
    getInputDisabled,
    getDatePicker,
    getDownloadBox,
    getGrayDiv,
    getTextArea
  } = components;
  const labelCol = 6;
  const wrapperCol = 18;
  const rowGutter = 32

  return (
    <Fragment>
      <Row gutter={rowGutter}>
        <div className="IntelProperty-newAddPane" style={{ marginLeft: '-3px', marginBottom: '-7px' }}>
          {getGrayDiv(24, '申报说明', 3, 21, props.dictionary.ZSCQSBSM[0].note, '', '6px')}

          {docTemplateList.length !== 0 && getDownloadBox(24, '参考材料', 3, 21, '14px')}
        </div>
      </Row>

      <Row gutter={rowGutter}>
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
            onChange: () => { },
            valueField: 'XMID',
            titleField: 'XMMC',
            required: false,
          })}

        {getInput('软件名称', 'name', rowData.NAME, labelCol, wrapperCol, 50)}
      </Row>

      <Row gutter={rowGutter}>
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
      </Row>

      <Row gutter={rowGutter}>
        {isGLY &&
          getSingleTreeSelector({
            label: '联系人',
            dataIndex: 'lxr',
            initialValue: rowData.LXRID || userBasicInfo.id,
            labelCol,
            wrapperCol,
            sltArr: sltData.contact,
            onChange: () => { },
            treeDefaultExpandedKeys: ['357', '11168'],
          })}

        {getSingleSelector({
          label: '当前状态',
          dataIndex: 'dqzt',
          initialValue: rowData.DQZT,
          labelCol,
          wrapperCol,
          sltArr: DQZT,
          onChange: () => { },
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
      </Row>


      <Row gutter={rowGutter} style={{ marginTop: 6 }}>
        <div className='RJZZOprModalGetTextArea'>
          {getTextArea({
            label:
              <div style={{ display: 'inline-block', lineHeight: '22px' }}>
                <span>软件用途和</span>
                <br />
                <span>技术特点</span>
              </div>,
            placeholder: '请输入软件用途和技术特点',
            dataIndex: 'useAndFeatures',
            initialValue: rowData.RJYTHJSTD,
            labelCol: 3,
            wrapperCol: 21,
            maxLength: 500,
            rules: [
              {
                required: true,
                message: '软件用途和技术特点不允许为空',
              },
            ],
          })}
        </div>
      </Row>


      <Row gutter={rowGutter} >
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

    </Fragment >
  );
}
