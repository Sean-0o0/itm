import React from 'react';
import { Tag } from 'antd';
import AddStaffType from './AddStaffType';

class StaffType extends React.Component {
  // 删除人员
  handleDelete = (levelId,classId) => {
    const { selectedStaff = [], dispatch } = this.props;
    const tmplSelectedStaff = JSON.parse(JSON.stringify(selectedStaff));
    let idx = -1;
    for (let i = 0; i < tmplSelectedStaff.length; i++) {
      if (selectedStaff[i].levelId === levelId && selectedStaff[i].classId === classId)  {
        idx = i;
        break;
      }
    }
    tmplSelectedStaff.splice(idx, 1);
    if (dispatch) {
      dispatch({
        type: 'salaryPlanSettings/updateSelectedStaff',
        payload: { selectedStaff: tmplSelectedStaff },
      });
    }
  }

  // 对已选人员按人员类别分组
  groupBy = (array, name) => {
    const groups = {};
    array.forEach((o) => {
      const group = JSON.stringify(o[name]);
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map((group) => {
      return groups[group];
    });
  }

  render() {
    const {
      staffClassData = [],
      staffLevelData = [],
      selectedStaff = [],
      dispatch,
    } = this.props;
    const sortStaff = this.groupBy(selectedStaff, 'classId');
    return (
      <React.Fragment>
        <AddStaffType
          staffClassData={staffClassData}
          staffLevelData={staffLevelData}
          selectedStaff={selectedStaff}
          dispatch={dispatch}
        />
        {
          sortStaff.map(item => (
            <Tag className=" m-pay-tag ant-tag" key={item[0].classId}>
              <div className="dis-fx">
                <span className="flex">{item[0].className}</span>
              </div>
              <ul className="m-sec-list">
                {
                  item.map(r => (
                    <li key={r.levelId} className="dis-fx wid100">
                      <span className="flex">{r.levelName === '' ? '不限' : r.levelName}</span>
                      <span className="m-pay-tag-icon" style={{ display: 'inline-block', float: 'right' }}>
                        <a onClick={() => { this.handleDelete(r.levelId,r.classId); }}><i className="iconfont icon-delete d-red" /></a>
                      </span>
                    </li>
                  ))
                }
              </ul>
            </Tag>
          ))
        }
      </React.Fragment>
    );
  }
}

export default StaffType;
