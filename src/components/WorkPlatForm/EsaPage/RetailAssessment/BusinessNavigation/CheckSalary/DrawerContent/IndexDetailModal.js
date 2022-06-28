import React from 'react';
import { Table, message } from 'antd';
import { FetchstaffSalaryFormCodeInfo } from '../../../../../../../services/EsaServices/navigation';
import DrillContent from './DrillContent';

class IndexDetailModal extends React.Component {
  state = {
    dataSource: [],
    columns: [],
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => { // eslint-disable-line
    const { chosenRowData, payload: { mon = '' }, selectedRecord: { code = '', qryProc = '' } } = this.props;
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

  assembleDataAndColumns = (records) => {
    const dataSource = [];
    const columns = [];
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
                return <DrillContent text={text} isJsonStr={this.isJsonStr} />;
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
    const { dataSource = [], columns = [] } = this.state;
    return (
      <Table
        className="m-table-customer"
        rowKey="ID"
        dataSource={dataSource}
        columns={columns}
        pagination={{
          className: 'm-paging',
          hideOnSinglePage: true,
        }}
      />
    );
  }
}

export default IndexDetailModal;
