import React, { Component } from 'react';
import { Table } from 'antd'

/* 左侧表格 */
class LeftTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leftColumns: [],  //左侧表格列
    };
  }


  componentDidMount() {
    this.structLeftColumns(1);
  }

  //更新
  UNSAFE_componentWillReceiveProps(props) {
    if (props.curClickRowId === '') {
      this.structLeftColumns(1)
    }
  }

  //获取列数据 根据type值决定展开方式 半展开功能屏蔽
  structLeftColumns = (type, wfId = '') => {
    const { changeFoldType, } = this.props
    let leftColumns = []
    //要获取多列时
    if (type === 1) {
      leftColumns = [
        {
          title: <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>责任状名称</span>,
          dataIndex: 'planName',
          width: '33.333%',
          render: (text, row, index) => {
            //return <b>{text}</b>
            return <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{text}</span>
          }
        },
        // {
        //   title: <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>考核方案类型</span>,
        //   dataIndex: 'planTypeName',
        //   render: (text, row, index) => {
        //     //return <b>{text}</b>
        //     return <span style={{ fontSize: '1.1rem' }}>{text}</span>
        //   }
        // },
        {
          title: <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>当前步骤</span>,
          dataIndex: 'stepName',
          width: '33.333%',
          render: (text, row, index) => {
            //return <b>{text}</b>
            return <span style={{ fontSize: '1.1rem' }}>{text}</span>
          }
        }, {
          title: <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>步骤执行人</span>,
          dataIndex: 'auditEmp',
          width: '33.333%',
          render: (text, row, index) => {
            //return <b>{text}</b>
            return <span style={{ fontSize: '1.1rem' }}>{text}</span>
          }
        }
      ];
    }
    //点击行后
    if (type === 2) {
      //如果是当前选中的行 则展开左侧表  该功能暂时屏蔽 后续需要的时候再打开
      // if (foldType === 2) {
      //   leftColumns = [
      //     {
      //       title: '考核方案名称',
      //       dataIndex: 'planName',
      //       render: (text, row, index) => {
      //         return <b>{text}</b>
      //         // return <span>{text}</span>
      //       }

      //     }, {
      //       title: '考核方案类型',
      //       dataIndex: 'planTypeName',
      //     },
      //     {
      //       title: '当前步骤',
      //       dataIndex: 'stepName',
      //     }, {
      //       title: '步骤执行人',
      //       dataIndex: 'auditEmp',
      //     }
      //   ];
      //   //changeFoldType(1)
      // } else {
      leftColumns = [
        {
          title: <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>责任状名称</span>,
          dataIndex: 'planName',
          render: (text, row, index) => {
            //return <b>{text}</b>
            return <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{text}</span>
          }
        }
      ];
      changeFoldType(2)
      //}
    }
    this.setState({
      leftColumns
    })
  }

  //点击行换色
  setSelectHrpFactRowClassName = (record) => {
    const { curClickRowId } = this.props
    return record.wfId === curClickRowId ? 'clickRowStyl' : ''
  }

  render() {
    const { leftData } = this.props;
    const { leftColumns } = this.state;
    return (
      // <Scrollbars
      //   autoHide
      //   style={{ height: height, minHeight: 270 }}
      //   renderTrackHorizontal={props => <div {...props} style={{ display: 'none' }} />}
      // >
      <Table
        bordered
        columns={leftColumns}
        dataSource={leftData}
        rowKey={record => record.wfId}
        style={{ cursor: 'pointer' }}
        //style={{ height: '50rem' }}
        onRow={record => {
          return {
            onClick: event => {
              const { changeCurClickRowId } = this.props
              //点击行换色
              changeCurClickRowId(record)
              //点击行改变列
              this.structLeftColumns(2, record.wfId)
            }, // 点击行
          };
        }}
        rowClassName={this.setSelectHrpFactRowClassName}

      />
      // </Scrollbars>
    );
  }
}

// export default BusEvaluate;
export default LeftTable;
