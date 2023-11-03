import React, { useEffect, Fragment } from 'react';
import { Row } from 'antd';

export default function YJKT(props) {
  const { components = {}, dataProps = {}, funcProps = {} } = props;
  const { rowData = {}, upldData = [], isTurnRed } = dataProps;
  const { setUpldData, setIsTurnRed } = funcProps;
  const { getInput, getDatePicker, getMultipleUpload } = components;
  const labelCol = 6;
  const wrapperCol = 18;
  const labelStyle = { display: 'inline-block', lineHeight: '17px' };
  return (
    <Fragment>
      <Row>
        {getInput('课题名称', 'name', rowData.KTMC, labelCol, wrapperCol, 50)}
        {getInput('发起单位', 'fqdw', rowData.FQDW, labelCol, wrapperCol, 30)}
      </Row>
      <Row>
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
