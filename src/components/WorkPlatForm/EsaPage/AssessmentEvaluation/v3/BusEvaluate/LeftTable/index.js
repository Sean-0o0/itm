import React, { Component } from 'react';
import BasicDataTable from '../../../../../../Common/BasicDataTable'
import { Form, Input, Tooltip } from 'antd';

const FormItem = Form.Item;

/* 左侧表格 */
class LeftTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftColumns: [],  //左侧表格列
      flag:false,
    };
  }
  componentWillReceiveProps(nextProps, nextContext) {
    console.log("columnsMinStatus",nextProps)
    if(this.props !== nextProps){
      let leftColumns;
      if (nextProps.columnsMinStatus) {
        leftColumns = this.structMinleftColumns();
      } else {
        leftColumns = this.structLeftColumns();
      }
      this.setState({
        leftColumns
      })
    }
  }

  componentWillMount() {
      // const leftColumns = this.structLeftColumns();
      // this.setState({
      //   leftColumns
      // })
  }

  //构造左侧表格列
  structLeftColumns = () => {
    const { form: { getFieldDecorator },shuji = false, initialization,data: { records = [] } } = this.props;
    // console.log("records0000000",records);
    const columns = shuji ? [
      {
        title: '业务条线',
        dataIndex: 'orgName',
        width: '25%',
        render: (value, row, index) => {
          return (<span style={{ fontWeight: "600" }} title={initialization && value.length > 10 && value}>
            {initialization ? value.substr(0, 10) : value}{initialization && value.length > 10 && '...'}
          </span>)
        }
      },
      {
        title: '效率得分',
        dataIndex: 'effTotal',
        width: '15%',
        align: 'center',
      },
      {
        title: '总分',
        dataIndex: 'scorTotal',
        width: '15%',
        align: 'center',
      },
      {
        title: '评分状态',
        dataIndex: 'status',
        width: '15%',
        align: 'center',
        render: (value, row, index) => {
          return <span className='esa-evaluate-table-head-color' >{value}</span>
        }
      },
      {
        title: '评分进度',
        dataIndex: 'step',
        width: '30%',
        align: 'center',
      },
    ] : [
      {
        title: '业务条线',
        dataIndex: 'orgName',
        width: '25%',
        render: (value, row, index) => {
          return (<span style={{ fontWeight: "600" }} title={initialization && value.length > 10 && value}>
            {initialization ? value.substr(0, 10) : value}{initialization && value.length > 10 && '...'}
          </span>)
        }
      },
      {
        title: '效率得分',
        dataIndex: 'effTotal',
        width: '12%',
        align: 'center',
      },
      {
        title: '质量得分',
        dataIndex: 'qltyTotal',
        width: '12%',
        align: 'center',
      },
      {
        title: '总分',
        dataIndex: 'scorTotal',
        width: '10%',
        align: 'center',
      },
      {
        title: '评分状态',
        dataIndex: 'status',
        width: '12%',
        align: 'center',
        render: (value, row, index) => {
          return <span className='esa-evaluate-table-head-color' >{value}</span>
        }
      },
      {
        title: '总裁综评',
        dataIndex: 'ceoTotal',
        width: '14%',
        // ellipsis: true,
        render: (value, row, index) => {
          let pattern = new RegExp(/^[0-9]*$/,"g");
          let message = '请填写数字!';
          return <FormItem style={{ marginBottom: 0 }} >
            {getFieldDecorator(`ceoTotal${index}`, {
              // initialValue: value,
              rules: [{
                required: !pattern.test(value),
                pattern,
                message,
              }],
              validateTrigger: 'onBlur',
            })(<Tooltip placement="right" title={value}>
            <Input
            onClick={(e) =>{
              //抑制事件冒泡
                e.stopPropagation();
              }
            }
            id={row?.orgId}
            value={value}
            // allowClear
            // 打分角色	roleId	VARCHAR2		1|董事长;2|总裁;15|党委书记;4|战略企划部
            disabled={row.roleId !== "2"}
            onChange={(e) => {
              records[index].ceoTotal = e.target.value
              this.setState({
                flag: !this.state.flag,
              })
              // let obj = {};
              // let str = 'ceoTotal' + index;
              // this.$set(obj, str);
              // this.props.form.setFieldsValue({
              //   `${obj}`: value.toString(),
              // })
            }}
          /></Tooltip>)}</FormItem>
        }
      },
      {
        title: '董事长确认',
        dataIndex: 'chairTotal',
        width: '14%',
        // ellipsis: true,
        render: (value, row, index) => {
          let pattern = new RegExp(/^[0-9]*$/,"g");
          let message = '请填写数字!';
          return <FormItem style={{ marginBottom: 0 }} >
            {getFieldDecorator(`chairTotal${index}`, {
              // initialValue: value,
              rules: [{
                required: !pattern.test(value),
                pattern,
                message,
              }],
              validateTrigger: 'onBlur',
            })(<Tooltip placement="right" title={value}>
            <Input
            onClick={(e) =>{
              //抑制事件冒泡
                e.stopPropagation();
              }
            }
            // allowClear
            // 打分角色	roleId	VARCHAR2		1|董事长;2|总裁;15|党委书记;4|战略企划部
            disabled={row.roleId !== "1"}
            id = {row?.orgId}
            value={value}
            onChange={(e) => {
              records[index].chairTotal = e.target.value
              this.setState({
                flag: !this.state.flag,
              })
            }}
          /></Tooltip>)}</FormItem>
        }
      },
      {
        title: '评分进度',
        dataIndex: 'step',
        width: '29%',
        align: 'center',
      },
    ];
    return columns;
  }


  //收缩之后的表格列
  structMinleftColumns = () => {
    const columns = [
      {
        title: '业务条线',
        dataIndex: 'orgName',
        render: (value, row, index) => {
          return <span style={{ fontWeight: "600" }} title={value.length > 10 && value}>{value.substr(0, 10)}{value.length > 10 && '...'}</span>
        }
      },
    ];
    return columns;
  }

  //设置选中行样式
  setRowClassName = (record) => {
    const { selectedRow: { orgId = '', roleId = '' } } = this.props;
    return record.orgId === orgId && record.roleId === roleId ? 'clickRowStyle' : '';
  }
  // 选中行
  onClickRow = (record) => {
    return {
      onClick: () => {
        const { changeLeftColumnsStatus, changeSelectedRow, columnsMinStatus, selectedRow: { orgId = '', roleId = '' } } = this.props;
        if (record.orgId === orgId && record.roleId === roleId) {
          // 如果是收缩状态，再次点击 应该展开
          let leftColumns = []
          if (columnsMinStatus) {
            leftColumns = this.structLeftColumns();
          } else {
            leftColumns = this.structMinleftColumns();
          }
          if (typeof (changeLeftColumnsStatus) === "function") {
            changeLeftColumnsStatus(!columnsMinStatus)
          }
          this.setState({
            leftColumns
          })
        } else {
          let leftColumns = []
          if (columnsMinStatus) {
            leftColumns = this.structMinleftColumns();
          } else {
            leftColumns = this.structLeftColumns();
          }
          this.setState({
            leftColumns
          })
          if (typeof (changeSelectedRow) === "function") {
            changeSelectedRow(record)
          }
        }
      },
    };
  }

  // 清空表单数据
  refleshForm = () => {
    this.props.form.resetFields();
  }

  // 保存草稿
  preservation = () => {
    this.handleSubmitLeft('1');
  }

  // 提交
  submit = () => {
    this.handleSubmitLeft('2');
  }

  // 表单提交
  handleSubmitLeft = (type) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { handleSubmitLeft } = this.props;
        if (handleSubmitLeft) {
          handleSubmitLeft(type);
        }
      }
    });
  };

  render() {
    const { height, data: { records = [] }  } = this.props;
    const { leftColumns, } = this.state;
    return (
      // <Scrollbars
      //   autoHide
      //   style={{ height: height, minHeight: 270 }}
      //   renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
      // >
        <BasicDataTable
          className="esa-evaluate-lender-left-table"
          columns={leftColumns}
          dataSource={records}
          pagination={false}
          bordered
          rowClassName={this.setRowClassName}
          onRow={this.onClickRow}
          // rowKey="orgId"
          scroll={{ y: height < (records.length + 1) * 40 && height - 40 }}
        />
      // </Scrollbars>
    );
  }
}

// export default BusEvaluate;
export default Form.create()(LeftTable);
