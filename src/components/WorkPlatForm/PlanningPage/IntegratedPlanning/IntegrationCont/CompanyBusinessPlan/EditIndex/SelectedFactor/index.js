/*
 * @Author:
 * @Date: 2021-02-27 14:15:46
 * @Description: 新增修改评价方案 已选因子
 */
import React, { Component, Fragment } from 'react';
import { Row, Tooltip, InputNumber } from 'antd';
import BasicDataTable from '../../../../../../../Common/BasicDataTable';
class SelectedFactor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qzArr: [],  //权重数组
    };
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource = [] } = nextProps;
    this.setState({
      dataSource: dataSource,
    });
    this.getQZArr(dataSource);
  }

  //构造权重数组
  getQZArr = (data = []) => {
    const { qzArr = [] } = this.state;
    let newArr = [];
    data.forEach(item => {
      if (item.orgId !== "-1") {
        let distRatio = '';
        qzArr.forEach(qzItem => {
          if (qzItem.orgId === item.orgId) {
            distRatio = qzItem.distRatio;
          }
        });
        newArr.push({
          orgId: item.orgId,
          distRatio: item.distRatio || distRatio,
        });
      }
    });
    this.setState({
      qzArr: newArr,
    });
  }

  renderText = (value, suffix = '%') => {
    if (value !== 'NaN') {
      return `${value}${suffix}`;
    }
    return '--';
  }

  //输入权重改变
  onInputNumber = (value, row) => {
    const { changeFactorList } = this.props;
    const distRatio = (Number.parseFloat(value) / 100).toString();
    changeFactorList && changeFactorList({ ...row, distRatio: distRatio }, "3");
  }

  //构造表格列
  assenmbleColumns = (data = []) => {
    const { qzArr } = this.state;
    let total = 0;
    qzArr.forEach(item => {
      total += Number.parseFloat(item.distRatio);
    });

    const columns = [
      {
        title: () => <span style={{ color: "#333", fontWeight: "bold" }}>指标名称</span>,
        dataIndex: 'idxName',
        width: '30%',
        className: "ac-cpyj-table-column",
        render: (value, row, index) => {
          let obj = {
            children: value,
            props: {
            },
          };
          if (data.length > 1) {
            if (index === 0) {
              obj.props.rowSpan = data.length - 1;
            } else if (index === data.length - 1) {
              obj.props.rowSpan = 1;
            } else {
              obj.props.rowSpan = 0;
            }
          }
          return obj;
        },
      },
      {
        title: () => <span style={{ color: "#333", fontWeight: "bold" }}>组织机构</span>,
        dataIndex: 'orgName',
        // width: '43%',
        render: (text, row, index) => {
          if (index < (data.length - 1)) {
            return (
              <div style={{ marginLeft: "3px", height: "1.333rem", lineHeight: "1.333rem", position: "relative" }}>
                <div style={{ maxWidth: "calc(100% - 12px)", marginLeft: "3px", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block" }}>
                  {text}
                </div>
                <Tooltip placement="top" title={row.orgName}>

                  <i className="iconfont icon-about1" style={{ fontSize: "12px", color: "#999999", position: "absolute", top: "0.05rem" }}></i>
                </Tooltip>
              </div>
            );
          }
          return {
            children: <div className={`${Number(total) < 1 ? 'm-headColor' : 'iraa-warning-red'}`} style={{ textAlign: 'center' }}>{this.renderText(Number(total * 100).toFixed(2))}</div>,
            props: {
              colSpan: 3,
            },
          };
        },
      },
      {
        title: () => <span style={{ color: "#333", fontWeight: "bold" }}>权重%</span>,
        dataIndex: 'distRatio',
        width: '18%',
        // render: (text,) => {
        //   return <Input />
        // }


        render: (text, row, index) => {
          if (index < (data.length - 1)) {
            const formatter = {
              formatter: value => `${value}%`,
              parser: value => value.replace('%', ''),
              // precision: 2,
              min: 0,
              max: 100
            }
            return <InputNumber
              {...formatter}
              className="m-antd-input-number"
              style={{ width: '100%' }}
              onChange={(value) => { this.onInputNumber(value, row); }}
              defaultValue={Number(text) * 100} />;
          }
          return {
            children: null,
            props: {
              colSpan: 0,
            },
          };
        },
      },



      {
        title: () => <span style={{ color: "#333", fontWeight: "bold" }}>操作</span>,

        dataIndex: 'cz',
        width: '10%',
        align: 'center',
        render: (text, row, index) => {
          if (index < (data.length - 1)) {
            return (
              // <a>
              <i className="iconfont icon-shanchu blue" style={{ fontSize: "16px", cursor: "pointer" }} onClick={() => { this.deleteRow(row); }} />

              // </a>
            );
          }
          return {
            children: null,
            props: {
              colSpan: 0,
            },
          };
        },

      },
    ];
    return columns;
  }

  //删除已选因子
  deleteRow = (record) => {
    const { changeFactorList } = this.props;
    changeFactorList && changeFactorList(record, "1");

  }

  render() {

    const { dataSource = [] } = this.state;

    const tableProps = {
      rowKey: 'orgId',
      columns: this.assenmbleColumns(dataSource),
      // dataSource: dataSource.length === 1 ? [] : dataSource,  //长度为1 说明只有总计项
      dataSource: dataSource,
    };

    return (
      <Fragment>

        <Row style={{ marginLeft: "10px", alignItems: "center", position: "relative" }}>
          <div >
            <div className="ac-cpyj-title-point"></div>
            <span style={{ marginLeft: "5px" }} className="ac-cpyj-title" >已选组织机构</span>
          </div>

        </Row>

        <Row style={{ marginTop: "20px" }} className='selected-table'>
          <BasicDataTable
            ref={(table) => this.table = table}
            {...tableProps}
            bordered
            pagination={false}
            className="m-table-customer m-antd-scrollbar-table"
            scroll={{ y: 250 }}
          // onRow={record => {
          //   return {
          //     onClick: event => { this.moveRow(record) }, // 点击行
          //   };
          // }}
          />
        </Row>


      </Fragment>
    );
  }
}

export default SelectedFactor;
