/**
 * 合同签署流程发起弹窗页面
 */
import {
  Row,
  Col,
  Popconfirm,
  Modal,
  Form,
  Input,
  Table,
  DatePicker,
  message,
  Select,
  Spin,
} from 'antd';

const { Option } = Select;
import React from 'react';
import { connect } from 'dva';
import OperateTab from './OperateTab';
import moment from 'moment';
import { isArrayLike } from 'lodash';
import { QueryOafilerela } from '../../../../services/pmsServices';

class AssociatedFile extends React.Component {
  constructor(props) {
    super(props);
    // console.log('🚀 ~ file: index.js:36 ~ AssociatedFile ~ constructor ~ props:', props);
    this.state = {
      isSpinning: false,
      selectedRowKeys: props.list.map(x => x.id) || [],
      tableData: [], //初始查询数据
      tbFilterData: [], //筛选查询后数据 - 展示
    };
  }

  componentDidMount() {
    this.getTableData();
  }

  //查询表格数据
  getTableData() {
    this.setState({ isSpinning: true });
    QueryOafilerela({ projectCode: String(this.props.xmbh || '') })
      .then(res => {
        function uniqueFunc(arr, uniId) {
          const res = new Map();
          return arr.filter(
            item => !res.has(Number(item[uniId])) && res.set(Number(item[uniId]), 1),
          );
        }
        let arr = uniqueFunc(
          JSON.parse(res?.responseBody === '' ? '[]' : res?.responseBody).concat(
            JSON.parse(res?.flowInfo === '' ? '[]' : res?.flowInfo),
          ),
          'id',
        ).map(x => {
          return {
            ...x,
            id: Number(x.id),
          };
        });
        this.setState({
          tableData: [...arr],
          tbFilterData: [...arr],
          isSpinning: false,
        });
      })
      .catch(e => {
        console.error('查询表格数据', e);
        this.setState({
          isSpinning: false,
        });
      });
  }

  //查询
  handleTableFilter({ fileType = '', draftDate = [] }) {
    const fuzzySearch = (list, search) => {
      let data = [];
      if (list.length != 0 && search) {
        let str = `\S*${search}\S*`;
        let reg = new RegExp(str, 'i'); //不区分大小写
        list.map(item => {
          if (reg.test(item.objectname)) {
            data.push(item);
          }
        });
      }
      return data;
    };

    if (fileType === '' && draftDate.length === 0) {
      this.setState({
        tbFilterData: [...this.state.tableData],
      });
    } else if (fileType !== '' && draftDate.length !== 0) {
      let arr = [...this.state.tableData];
      let arr2 = [];
      fuzzySearch(arr, fileType).forEach(item => {
        if (moment(item.createdate).isBetween(moment(draftDate[0]), moment(draftDate[1]))) {
          arr2.push(item);
        }
      });
      this.setState({
        tbFilterData: [...arr2],
      });
    } else if (
      (fileType !== '' && draftDate.length === 0) ||
      (fileType !== '' && draftDate.length === 0)
    ) {
      let arr = [...this.state.tableData];
      this.setState({
        tbFilterData: fuzzySearch(arr, fileType),
      });
      console.log(fuzzySearch(arr, fileType));
    } else {
      let arr = [...this.state.tableData];
      let arr2 = [];
      arr.forEach(item => {
        if (moment(item.createdate).isBetween(moment(draftDate[0]), moment(draftDate[1]))) {
          arr2.push(item);
        }
      });
      this.setState({
        tbFilterData: [...arr2],
      });
    }
  }

  getDataSelected(keys = [], data = []) {
    let arr = [];
    data.forEach(item => {
      if (keys.includes(item.id)) {
        arr.push(item);
      }
    });
    // console.log("🚀 ~ file: index.js ~ line 152 ~ AssociatedFile ~ getDataSelected ~ [...arr]", keys, data, [...arr])
    return [...arr];
  }

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { isSpinning = false, selectedRowKeys, tableData, tbFilterData } = this.state;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      ,
      {
        title: '拟稿日期',
        dataIndex: 'createdate',
        key: 'createdate',
      },
      {
        title: '文件类别',
        dataIndex: 'objectname',
        key: 'objectname',
      },
    ];
    const {
      associatedFileVisible,
      dictionary: { LCJJCD = [], YZLX = [] },
    } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = this.props.form;
    const basicFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <>
        <Modal
          wrapClassName="editMessage-modify associated-file-modal"
          width={'810px'}
          title={null}
          zIndex={100}
          bodyStyle={{
            padding: '0',
          }}
          onOk={() => this.props.onConfirm(this.getDataSelected(selectedRowKeys, tableData))}
          onCancel={this.props.closeAssociatedFileModal}
          visible={associatedFileVisible}
          destroyOnClose
        >
          <div
            style={{
              height: '42px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#3361FF',
              color: 'white',
              marginBottom: '16px',
              padding: '024px',
              borderRadius: '8px 8px 0 0',
              fontSize: '16px',
            }}
          >
            <strong>关联文件搜索</strong>
          </div>
          <Spin spinning={isSpinning} tip="加载中" size="large" wrapperClassName="diy-style-spin">
            <div style={{ padding: '0 24px' }}>
              <div className="steps-content">
                <div>
                  <OperateTab handleTableFilter={item => this.handleTableFilter(item)} />
                </div>
                <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={tbFilterData}
                  rowKey={record => record.id}
                  pagination={{
                    pageSize: 5,
                    defaultCurrent: 1,
                    showSizeChanger: false,
                    hideOnSinglePage: false,
                    showQuickJumper: true,
                    showTotal: t => `共 ${tbFilterData.length} 条数据`,
                    total: tbFilterData.length,
                  }}
                />
              </div>
            </div>
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(AssociatedFile));
