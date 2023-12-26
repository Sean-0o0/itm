import React, { useEffect, Fragment } from 'react';
import { Row } from 'antd';

export default function KJJX(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const { rowData = {}, upldData = [], isTurnRed, JXJB = [] } = dataProps;
  const { setUpldData, setIsTurnRed } = funcProps;
  const { getInput, getSingleSelector, getMultipleUpload, getDatePicker } = components;
  const labelCol = 6;
  const wrapperCol = 18;
  const labelStyle = { display: 'inline-block', lineHeight: '17px' };
  return (
    <Fragment>
      <Row>
        {getInput('奖项名称', 'name', rowData.JXMC, labelCol, wrapperCol, 50)}
        {getSingleSelector({
          label: '奖项级别',
          dataIndex: 'jxjb',
          initialValue: rowData.JXJB,
          labelCol,
          wrapperCol,
          sltArr: JXJB,
          onChange: () => { },
          valueField: 'ibm',
          titleField: 'note',
        })}
      </Row>
      <Row>
        {getInput('发起单位', 'fqdw', rowData.FQDW, labelCol, wrapperCol, 30)}
        {getDatePicker({
          label: '申报截止日期',
          labelNode: (
            <div style={labelStyle}>
              申报截止
              <div>日期</div>
            </div>
          ),
          dataIndex: 'sbjzrq',
          initialValue: rowData.SBJZRQ,
          labelCol,
          wrapperCol,
        })}
      </Row>
      <Row>
        {getMultipleUpload({
          label: '参考材料',
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
