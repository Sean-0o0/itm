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
import { connect } from "dva";
import OperateTab from "./OperateTab";
import moment from 'moment';
import { isArrayLike } from 'lodash';
import { QueryOafilerela } from '../../../../services/pmsServices';

// const data = [];
// for (let i = 0; i < 21; i++) {
//   data.push({
//     key: i,
//     BT: `标题${i}`,
//     WH: i,
//     NGRQ: '2017-02-15',
//     WJLB: `文件类别${i}`,
//   });
// }

class AssociatedFile extends React.Component {
  state = {
    isSpinning: false,
    selectedRowKeys: [],
    tableData: [],
    tbFilterData: [], //查询后数据
  }

  componentDidMount() {
    this.getTableData();
  }

  //查询表格数据
  getTableData() {
    // let data = {
    //   code: "0",
    //   message: "",
    //   result: [
    //     {
    //       objectname: "666项目立项申请流程",
    //       createdate: "20221215",
    //       id: 1739778,
    //       title: "测试1"
    //     }, {
    //       objectname: "555项目立项申请流程",
    //       createdate: "20221214",
    //       id: 1739777,
    //       title: "测试2"
    //     }, {
    //       objectname: "444项目立项申请流程",
    //       createdate: "20221213",
    //       id: 1739776,
    //       title: "测试3"
    //     }, {
    //       objectname: "333项目立项申请流程",
    //       createdate: "20221212",
    //       id: 1739775,
    //       title: "测试4"
    //     }, {
    //       objectname: "222项目立项申请流程",
    //       createdate: "20221211",
    //       id: 1739774,
    //       title: "测试5"
    //     }, {
    //       objectname: "111项目立项申请流程",
    //       createdate: "20221210",
    //       id: 1739773,
    //       title: "测试6"
    //     },
    //     {
    //       objectname: "666项目立项申请流程",
    //       createdate: "20221215",
    //       id: 1739778,
    //       title: "测试1"
    //     }, {
    //       objectname: "555项目立项申请流程",
    //       createdate: "20221214",
    //       id: 1739777,
    //       title: "测试2"
    //     }, {
    //       objectname: "444项目立项申请流程",
    //       createdate: "20221213",
    //       id: 1739776,
    //       title: "测试3"
    //     }, {
    //       objectname: "333项目立项申请流程",
    //       createdate: "20221212",
    //       id: 1739775,
    //       title: "测试4"
    //     }, {
    //       objectname: "222项目立项申请流程",
    //       createdate: "20221211",
    //       id: 1739774,
    //       title: "测试5"
    //     }, {
    //       objectname: "111项目立项申请流程",
    //       createdate: "20221210",
    //       id: 1739773,
    //       title: "测试6"
    //     },
    //   ]
    // };
    // this.setState({
    //   tableData: [...data?.result],
    //   tbFilterData: [...data?.result],
    // });
    QueryOafilerela({ projectCode: String(this.props.xmbh || '') })
      .then(res => {
        console.log('表格数据：', res);
        this.setState({
          tableData: [...JSON.parse(res?.responseBody)],
          tbFilterData: [...JSON.parse(res?.responseBody)],
        });
      });
  }

  //查询
  handleTableFilter({ fileType = '', draftDate = [] }) {
    const fuzzySearch = (list, search) => {
      let data = [];
      if (list.length != 0 && search) {
        let str = `\S*${search}\S*`;
        let reg = new RegExp(str, 'i');//不区分大小写
        list.map(item => {
          if (reg.test(item.objectname)) {
            data.push(item);
          }
        })
      }
      return data;
    }

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
      })
      this.setState({
        tbFilterData: [...arr2],
      });
    } else if (fileType !== '' && draftDate.length === 0 || fileType !== '' && draftDate.length === 0) {
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
      })
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
    const {
      isSpinning = false,
      selectedRowKeys,
      tableData,
      tbFilterData,
    } = this.state;
    const columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
      },
      // {
      //   title: '文号',
      //   dataIndex: 'WH',
      // },
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
    const { associatedFileVisible, dictionary: { LCJJCD = [], YZLX = [] } } = this.props;
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
    return (<>
      <Modal wrapClassName='editMessage-modify' width={'120rem'}
        title={null}
        zIndex={100}
        bodyStyle={{
          padding: '0'
        }}
        onOk={() => this.props.onConfirm(this.getDataSelected(selectedRowKeys, tableData))}
        onCancel={this.props.closeAssociatedFileModal}
        visible={associatedFileVisible}>
        <div style={{
          height: '6.2496rem',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#3361FF',
          color: 'white',
          marginBottom: '2.3808rem',
          padding: '0 3.5712rem',
          borderRadius: '1.1904rem 1.1904rem 0 0',
          fontSize: '2.333rem'
        }}>
          <strong>关联文件搜索</strong>
        </div>
        <Spin spinning={isSpinning} tip='加载中' size='large' wrapperClassName='diy-style-spin'>
          <div style={{ padding: '0 3.5712rem' }}>
            <div className="steps-content">
              <div>
                <OperateTab handleTableFilter={(item) => this.handleTableFilter(item)} />
              </div>
              <Table rowSelection={rowSelection} columns={columns} dataSource={tbFilterData} rowKey={record => record.id} />
            </div>
          </div>
        </Spin>
      </Modal></>);
  }
}

export default connect(({ global }) => ({
  dictionary: global.dictionary,
}))(Form.create()(AssociatedFile));
