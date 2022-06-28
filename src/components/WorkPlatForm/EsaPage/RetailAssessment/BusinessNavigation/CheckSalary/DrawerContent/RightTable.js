/* eslint-disable jsx-a11y/iframe-has-title */
import React from 'react';
import { message, Row, Col, Table } from 'antd';
import { FetchstaffSalaryFormCodeInfo, FetchqueryEmpPayCalcFmla } from '../../../../../../../services/EsaServices/navigation';

import { Fragment } from 'react';

/**
 *  核对薪酬抽屉组件
 */

class RightTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      columns: [],
      fmlaDef: '',
      calcResult: '',
    };
  }
  componentDidMount() {
    const { selectedRecord = {} } = this.props;
    const { type, qryProc } = selectedRecord || {};
    if ((type === '1' || type === '2') && qryProc !== '') {
      this.fetchData(this.props);
    } else if (qryProc === '') {
      this.fetchqueryEmpPayCalcFmla(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedRecord = {} } = nextProps;
    if (JSON.stringify(selectedRecord) !== JSON.stringify(this.props.selectedRecord)) {
      const { type, qryProc } = selectedRecord || {};
      if ((type === '1' || type === '2') && qryProc !== '') {
        this.fetchData(nextProps);
      } else if (qryProc === '') {
        this.fetchqueryEmpPayCalcFmla(nextProps);
      }
    }
  }

  fetchData = (props) => { // eslint-disable-line
    const { chosenRowData, payload: { mon = '' }, selectedRecord: { code = '', qryProc = '' } } = props;
    FetchstaffSalaryFormCodeInfo({
      bmlb: '',
      cxgc: qryProc,
      ry: chosenRowData.人员编号 ? chosenRowData.人员编号 : '',
      yf: mon,
      zbdm: code,
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        this.assembleDataAndColumns(records);
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  fetchqueryEmpPayCalcFmla = (props) => { // eslint-disable-line
    const { chosenRowData, payload: { mon = '' }, selectedRecord: { code = '' } } = props;
    FetchqueryEmpPayCalcFmla({
      empNo: chosenRowData.人员编号 ? chosenRowData.人员编号 : '',
      mon,
      payCode: code,
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        const { fmlaDef = '', calcResult = '' } = records[0];
        this.setState({ fmlaDef, calcResult });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  assembleDataAndColumns = (records) => {
    const dataSource = [];
    const columns = [];
    const len = dataSource.length;
    records.forEach((item, index) => {
      const tmplData = {};
      item.forEach((m) => {
        const { key = '', value = '', name = '' } = m;
        tmplData[key] = value;
        if (index === 0 && key !== 'ID') {
          columns.push({
            dataIndex: key,
            title: name,
            render: (text) => {
              // 判断text是不是json字符串
              const isJson = this.isJsonStr(text);
              if (!text) {
                return '--';
              } else if (isJson) {
                return JSON.parse(text).value;
              }
              return text;
            },
          });
        }
      });
      dataSource.push(tmplData);
    });
    this.setState({ dataSource, columns });
  }

  // 是否是json字符串
  isJsonStr = (str) => {
    if (typeof str === 'string') {
      try {
        const obj = JSON.parse(str);
        if (typeof obj === 'object' && obj) {
          return true;
        }
        return false;
      } catch (e) {
        return false;
      }
    }
  }

  render() {
    const { selectedRecord = {} } = this.props;
    // const livebosPrefix = localStorage.getItem('livebos');
    // const url = `${livebosPrefix}/UIProcessor?Table=cxJJCLXSQK`;
    const { dataSource = [], columns = [], fmlaDef = '', calcResult = '' } = this.state;

    return (
      <Fragment>
        {!selectedRecord.qryProc && <Row>
          <Col span={24}>
            <div style={{ borderLeft: '6px solid', margin: '16px 0 16px 20px', height: '18px', lineHeight: '18px' }} className='fwb m-color'>
              <span style={{ color: '#333', paddingLeft: '13px' }}>公式定义</span>
            </div>
            <div style={{ marginLeft: '16px' }}>
              {fmlaDef}
            </div>

          </Col>
          <Col span={24} style={{ marginTop: '18px' }}>
            <div style={{ borderLeft: '6px solid', margin: '16px 0 16px 20px', height: '18px', lineHeight: '18px' }} className='fwb m-color'>
              <span style={{ color: '#333', paddingLeft: '13px' }}>计算结果</span>
            </div>
            <div style={{ marginLeft: '16px' }}>
              {calcResult}
            </div>
          </Col>
        </Row>}
        {/* <iframe width="100%" style={{ height: '42rem' }} frameBorder="0" src={url} /> */}
        {selectedRecord.qryProc && <Table
          bordered
          className="m-table-customer"
          rowKey="ID"
          dataSource={dataSource}
          columns={columns}
          pagination={{
            className: 'm-paging',
            hideOnSinglePage: true,
          }}
        />}
      </Fragment>
    );
  }
}

export default RightTable;
