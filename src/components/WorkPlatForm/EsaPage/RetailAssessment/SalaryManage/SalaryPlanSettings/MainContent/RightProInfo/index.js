import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import BasicDataTable from '../../../../../../../Common/BasicDataTable';
import { Card } from 'antd';
import Detail from './Columns/Detail';
/**
 * 右侧 详情
 */

class RightProInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  getDataSource = () => {
    const dataSource = [];
    const { selectedStaff = [] } = this.props;
    const tmplSelectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    tmplSelectedStaff.forEach((item) => {
      const selectedStaffObj = item;
      const { payProgram = [] } = item;
      payProgram.forEach((payItem) => {
        selectedStaffObj[`salary_${payItem.payCodeId}`] = 1;
      });
      dataSource.push(selectedStaffObj);
    });
    return dataSource;
  }

  assembleColumns = () => {
    const { selectedYybName = '', selectedSalary = [] } = this.props;
    const columns = [{
      title: '人员类别',
      dataIndex: 'className',
      width: 200,
      ellipsis: true,
      align: 'center',
      fixed: true,
      render: text => text || '不限',
    }, {
      title: '人员级别',
      dataIndex: 'levelName',
      width: 200,
      ellipsis: true,
      align: 'center',
      fixed: true,
      render: text => text || '不限',
    }, {
      title: '明细',
      dataIndex: 'detail',
      width: 200,
      align: 'center',
      fixed: true,
      render: (_, record) => (<Detail record={record} selectedYybName={selectedYybName} />),
    }];
    selectedSalary.forEach((item) => {
      columns.push({
        title: item.payCodeName,
        dataIndex: `salary_${item.payCodeId}`,
        width: 200,
        align: 'center',
        render: (_, record) => (
          <div className="tc" onClick={() => { this.handleSalaryCellClick(record, item); }} style={{ width: '100%', height: '2rem' }}>
            {
              record[`salary_${item.payCodeId}`] === 1 && <i className="iconfont icon-gou blue" />
            }
          </div>
        ),
      });
    });
    return columns;
  }

  handleSalaryCellClick = (record = {}, salaryItem = {}) => {
    const { selectedStaff = [], dispatch } = this.props;
    const tmplSelectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    // 取消选中-删除人员对应的薪酬数据
    if (record[`salary_${salaryItem.payCodeId}`] === 1) {
      for (let i = 0; i < tmplSelectedStaff.length; i++) {
        if (tmplSelectedStaff[i].classId === record.classId && tmplSelectedStaff[i].levelName === record.levelName) {
          const newPayProgram = tmplSelectedStaff[i].payProgram;
          for (let j = 0; j < newPayProgram.length; j++) {
            if (newPayProgram[j].payCodeId === salaryItem.payCodeId) {
              newPayProgram.splice(j, 1);
              break;
            }
          }
          tmplSelectedStaff[i].payProgram = newPayProgram;
          break;
        }
      }
    } else { // 选中-添加人员薪酬数据
      for (let i = 0; i < tmplSelectedStaff.length; i++) {
        if (tmplSelectedStaff[i].classId === record.classId && tmplSelectedStaff[i].levelName === record.levelName) {
          const newPayProgram = tmplSelectedStaff[i].payProgram;
          newPayProgram.push({
            remk: salaryItem.payCodeName,
            payCodeId: salaryItem.payCodeId,
            programId: '',
            settTypeName: '',
            settType: '0',
            settRestr: '0;2',
            leaveIsCal: '1',
          });
          tmplSelectedStaff[i].payProgram = newPayProgram;
          break;
        }
      }
    }
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedStaff',
        payload: { selectedStaff: tmplSelectedStaff },
      });
    }
  }
  render() {
    const columns = this.assembleColumns();
    const dataSource = this.getDataSource();
    const { height } = this.props;
    const tableProps = {
      // className: "esa-scrollbar esa-planset-tablehead",
      columns,
      dataSource,
      pagination: false,
      bordered: true,
      scroll: {
        x: (columns.length * 200), y: dataSource.length !== 0 ? height - 100 : false
      },
    };
    return (
      <Fragment>
        <Card className="m-card m-card-pay">
          <div>
            <BasicDataTable
              {...tableProps}
            />
          </div>
        </Card>
      </Fragment>
    );
  }
}
export default RightProInfo;
