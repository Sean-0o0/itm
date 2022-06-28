/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Tag } from 'antd';
import AddSalaryItems from './AddSalaryItems';

class SalaryItems extends React.Component {
  deleteSelectedItems = (payCodeId) => {
    const { selectedSalary = [], selectedStaff = [], dispatch } = this.props;
    const tmplSelectedSalary = JSON.parse(JSON.stringify(selectedSalary));
    let idx = -1;
    for (let i = 0; i < tmplSelectedSalary.length; i++) {
      if (selectedSalary[i].payCodeId === payCodeId) {
        idx = i;
        break;
      }
    }
    tmplSelectedSalary.splice(idx, 1);
    // 更新已选薪酬
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedSalary',
        payload: { selectedSalary: tmplSelectedSalary },
      });
    }
    // 清理已选人员的对应的薪酬数据
    const tmplselectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    for (let i = 0; i < tmplselectedStaff.length; i++) {
      const { payProgram } = tmplselectedStaff[i];
      const payProgramIdx = payProgram.findIndex(payProgramItem => payProgramItem.payCodeId === payCodeId);
      if (payProgramIdx !== -1) {
        payProgram.splice(payProgramIdx, 1);
        tmplselectedStaff[i].payProgram = payProgram;
      }
    }
    // 更新已选人员薪酬数据
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedStaff',
        payload: { selectedStaff: tmplselectedStaff },
      });
    }
  }

  // 排序已选薪酬
  sortSelectedItems = (payCodeId, type) => {
    const { selectedSalary = [], dispatch } = this.props;
    const tmplSelectedSalary = JSON.parse(JSON.stringify(selectedSalary));
    let idx = -1;
    for (let i = 0; i < tmplSelectedSalary.length; i++) {
      if (selectedSalary[i].payCodeId === payCodeId) {
        idx = i;
        break;
      }
    }
    if (type === 'up') {
      tmplSelectedSalary[idx - 1] = tmplSelectedSalary.splice(idx, 1, tmplSelectedSalary[idx - 1])[0];
    } else {
      tmplSelectedSalary[idx] = tmplSelectedSalary.splice(idx + 1, 1, tmplSelectedSalary[idx])[0];
    }
    // 更新已选薪酬
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedSalary',
        payload: { selectedSalary: tmplSelectedSalary },
      });
    }
  }

  // 已选薪酬添加薪酬名称
  assembleSelectedSalary = (selectedSalary) => {
    const { salaryData = [] } = this.props;
    const tmplSelectedSalary = JSON.parse(JSON.stringify(selectedSalary));
    const newSelectedSalary = [];
    tmplSelectedSalary.forEach((item) => {
      const salaryObj = salaryData.find(salaryItem => salaryItem.ID === item.payCodeId);
      if(typeof(salaryObj) !== 'undefined'){
        newSelectedSalary.push(salaryObj);
      }
    });
    return newSelectedSalary;
  }

  render() {
    const {
      selectedYyb = '',
      selectedSalary = [],
      salaryData = [],
      dispatch } = this.props;
    const selectedSalaryList = this.assembleSelectedSalary(selectedSalary);
    return (
      <React.Fragment>
        <AddSalaryItems
          selectedYyb={selectedYyb}
          selectedSalary={selectedSalary}
          salaryData={salaryData}
          dispatch={dispatch}
        />
        {
          selectedSalaryList.map((item, index) => (
            <Tag className=" m-pay-tag dis-fx" key={item.ID} style={{ whiteSpace: 'normal' }}>
              <span className="flex">{item.PAY_NAME}</span>
              <span className="m-pay-tag-icon">
                <a disabled={index === 0 ? true : false} onClick={() => { this.sortSelectedItems(item.ID, 'up'); }}>
                  <i className={`iconfont icon-up-line-arrow ${index === 0 ? 'gray' : 'blue'}`} /></a>
              </span>
              <span className="m-pay-tag-icon">
                <a disabled={index === selectedSalaryList.length - 1 ? true : false} onClick={() => { this.sortSelectedItems(item.ID, 'down'); }}>
                  <i className={`iconfont icon-down-line-arrow ${index === selectedSalaryList.length - 1 ? 'gray' : 'blue'}`} /></a>
              </span>
              <span className="m-pay-tag-icon">
                <a onClick={() => { this.deleteSelectedItems(item.ID); }}><i className="iconfont icon-delete d-red" /></a>
              </span>
            </Tag>
          ))
        }
      </React.Fragment>
    );
  }
}

export default SalaryItems;
