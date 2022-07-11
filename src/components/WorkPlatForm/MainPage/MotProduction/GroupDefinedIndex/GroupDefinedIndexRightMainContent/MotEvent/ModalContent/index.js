/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
import React, { Fragment } from 'react';

import { Row, Input, message, Form, Select, Table } from 'antd';
import { FetchqueryScheduleGroupOptionalEvent } from '../../../../../../../../services/motProduction';

/**
 * 分组定义---mot事件
 */
const { Search } = Input;
class ModalContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // 表格数据
      keyword: '', // 关键字
      selectedRows: [], // 勾选的数据
      selectAll: false, // 是否全选
      selectedRowKeys: [], // 表格选中记录
      uuid: '',
    };
  }

  componentDidMount() {
    this.props.onRef(this);
    this.fetchData();
  }


    fetchColumns = () => {
      const columns = [
        {
          title: '事件名称',
          dataIndex: 'evntNm',
          key: 'evntNm',
        },
        {
          title: '所属阶段',
          dataIndex: 'sbrdStg',
          key: 'sbrdStg',

        },
        {
          title: '重要程度',
          dataIndex: 'impt',
          key: 'impt',

        },
        {
          title: '计算方式',
          dataIndex: 'cmptMode',
          key: 'cmptMode',

        },

      ];

      return columns;
    }


    fetchData = () => {
      const { selectedItem = {}, tgtTp } = this.props;
      const { keyword } = this.state;
      const { grpId = '' } = selectedItem;
      const payload = {
        grpId: Number(grpId),
        keyword,
        tgtTp: Number(tgtTp),
      };
      FetchqueryScheduleGroupOptionalEvent(payload).then((res) => {
        const { code = 0, records = [], note } = res;
        if (code > 0) {
          this.setState({
            data: records,
            uuid: note,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }


    // 表格搜索
    handleSearch = (value) => {
      this.setState({
        keyword: value,
      }, () => {
        this.fetchData();
      });
    }


    // 全选
    selectAll = (selected) => {
      const { data = [] } = this.state;
      const selectedRowKeys = [];
      let selectedRows = [];
      if (selected) {
        selectedRows = data;
        data.forEach((item) => {
          selectedRowKeys.push(item.evntId);
        });
      }
      this.setState({
        selectAll: selected,
        selectedRows,
        selectedRowKeys,
      });
    }

    // 表格勾选
    onSelectChange = (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys, selectedRows });
    };


    render() {
      const { data = [], selectedRowKeys = [] } = this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
        onSelectAll: this.selectAll,
      };


      return (
        <Fragment>
          <Row style={{ padding: ' 2rem' }}>

            <Row >
              <Search onSearch={(value) => { this.handleSearch(value); }} style={{ paddingLeft: '1rem ', width: '40%', marginBottom: '1rem' }} className="mot-prod-search-input" />
              <Row style={{ overflow: 'auto', height: '40rem' }}>
                <Table

                  rowKey={record => record.evntId}
                  rowSelection={rowSelection}
                  dataSource={data}
                  columns={this.fetchColumns()}
                  className="mot-page"
                />
              </Row>

            </Row>
          </Row>

        </Fragment>
      );
    }
}
// export default GroupDefinedIndexRightMainContent;
export default Form.create()(ModalContent);

