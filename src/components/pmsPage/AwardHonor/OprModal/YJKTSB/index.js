import React, { useEffect, Fragment, useState } from 'react';
import { Row, Collapse, Icon, Spin } from 'antd';
import { QueryAwardAndHonorList, } from '../../../../../services/pmsServices';

export default function YJKTSB(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const {
    rowData = {},
    upldData = [],
    isTurnRed,
    sltData = {},
    userBasicInfo = {},
    KTZT = [],
    fromPrjDetail = false,
    parentRow = {},
    isGLY,
  } = dataProps;

  const { setUpldData, setIsTurnRed, getFieldValue, } = funcProps;

  const [collapseInfo, setCollapseInfo] = useState({})

  // 使用父组件的setIsSpinning会被状态重置
  const [isLoading, setIsLoading] = useState(false)

  const {
    getInput,
    getSingleSelector,
    getMultipleUpload,
    getSingleTreeSelector,
    getDatePicker,
    getTextArea,
    getInputDisabled,
    getGrayDiv,
    getDownloadBox
  } = components;
  const labelCol = 6;
  const wrapperCol = 18;
  const rowGutter = 32

  const customPanelStyle = {
    background: '#fff',
    borderRadius: 4,
    marginBottom: 24,
    border: 0,
    overflow: 'hidden',
  };

  const dateFormater = (date) => {
    const val = String(date)
    const formatDate = val.slice(0, 4) + '-' + val.slice(4, 6) + '-' + val.slice(6, 8)
    return formatDate
  }

  const searchSollapseInfo = async () => {
    const params = {
      "awardName": parentRow.JXMC,
      "tab": "YJKT",
      "current": 1,
      "pageSize": 20,
      "paging": 1,
      "queryType": "LB",
      "sort": "",
      "total": -1
    }
    setIsLoading(true)
    const res = await QueryAwardAndHonorList(params)
    if (res.code === 1) {
      const { result } = res
      const obj = JSON.parse(result)
      setCollapseInfo(obj[0])
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!parentRow.JXJB || !parentRow.FQDW || !parentRow.SBJZRQ || !parentRow.FQDW | !parentRow.SBJZRQ) {
      searchSollapseInfo().catch((err) => {
        message.error(`查询研究课题详情信息失败${err}`, 2)
        setIsLoading(false)
      })
    }
  }, [])


  return (
    <Spin spinning={isLoading} tip='加载中'>
      <Collapse
        className='AwardHonor-Collapse'
        bordered={false}
        defaultActiveKey={['szsbjx', 'txsbnr']}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        expandIconPosition='left'
      >
        <Collapse.Panel
          header={<div className='collapseTitle'>选择申报课题</div>}
          key="szsbjx"
          style={customPanelStyle}
        >
          <Row gutter={rowGutter}>
            {fromPrjDetail !== false
              ? getSingleSelector({
                label: '选择课题',
                dataIndex: 'awardId',
                initialValue: parentRow.ID,
                labelCol,
                wrapperCol,
                sltArr: sltData.tableData,
                onChange: () => { },
                valueField: 'ID',
                titleField: 'KTMC',
              })
              : getInputDisabled({
                label: '选择课题',
                dataIndex: 'awardId',
                initialValue: Number(parentRow.ID),
                value: parentRow.KTMC,
                labelCol,
                wrapperCol,
              })}

            {/* parentRow是只读属性，无法修改 */}
            {parentRow.FQDW
              ? getGrayDiv(12, '发起单位', labelCol, wrapperCol, parentRow.FQDW)
              : collapseInfo.FQDW && getGrayDiv(12, '发起单位', labelCol, wrapperCol, collapseInfo.FQDW)}

            {parentRow.SBJZRQ
              ? getGrayDiv(12, '申报截止日期', labelCol, wrapperCol, dateFormater(parentRow.SBJZRQ), true)
              : collapseInfo.SBJZRQ && getGrayDiv(12, '申报截止日期', labelCol, wrapperCol, dateFormater(collapseInfo.SBJZRQ), true)}

            {getDownloadBox(24, '示例材料', 3, 21, '-11px')}
          </Row>



        </Collapse.Panel>






        <Collapse.Panel
          header={<div className='collapseTitle'>填写申报内容</div>}
          key="txsbnr"
          style={{ ...customPanelStyle, marginTop: '-30px' }}
        >
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

            {getInput('申报项目', 'sbxm', rowData.SBXM, labelCol, wrapperCol, 50)}
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

            {getTextArea({
              label: '申报说明',
              dataIndex: 'sbsm',
              initialValue: rowData.SBSM,
              labelCol: labelCol / 2,
              wrapperCol: 24 - labelCol / 2,
              maxLength: 600,
            })}
          </Row>

          <Row gutter={rowGutter}>
            {getSingleSelector({
              label: '课题状态',
              dataIndex: 'ktzt',
              initialValue: rowData.KTZT,
              labelCol,
              wrapperCol,
              sltArr: KTZT,
              onChange: () => { },
              valueField: 'ibm',
              titleField: 'note',
            })}

            {getFieldValue('ktzt') === '3' &&
              getDatePicker({
                label: '结题日期',
                dataIndex: 'hjrq',
                initialValue: rowData.JTSJ,
                labelCol,
                wrapperCol,
              })}
          </Row>

          <Row gutter={rowGutter}>
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

        </Collapse.Panel>
      </Collapse>

    </Spin >
  );
}
