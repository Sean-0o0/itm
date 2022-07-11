import React from 'react';

class TaskItem extends React.Component {

  render() {
    const {infoItem = {}, current = -1, order = -1} = this.props;
    let icon = "";
    let boldClass = "";
    let timeClass = "line";
    if (infoItem !== {}) {
      switch (infoItem.SUBSTATE) {
        case '0':
          icon = "icon_nostart.png";
          break;
        case '1':
          icon = "icon_underway.png";
          break;
        case '2':
          icon = "icon_completed.png";
          break;
        case '3':
          icon = "icon_abnormal.png";
          break;
        default:
          break;
      }
    }
    if (current !== -1 && current === order) {
      boldClass = `${boldClass} boldClass`;
      timeClass = `${timeClass} timeClass`;
    }

    return (
      <React.Fragment>
        <li className={boldClass} style={{fontSize: '3rem'}}>
          <div className={timeClass} style={{bottom: '1rem'}}></div>
          <div className="desc"  style={{paddingLeft:'.5rem'}}>
            {
              current !== order ? "" :
                (<div className="left"><img className="fd-current-img"
                                            src={[require("../../../../../../../image/icon_jt@3x.png")]} alt=""/></div>)
            }
            <div className='time'
                 style={{paddingLeft: current !== order ? '2rem' : ''}}>{infoItem.IDX_NM ? infoItem.IDX_NM : ""}</div>
            {
              icon === "" ? "" :
                (<div className='cont'><img className="fs-zjyw-img"
                                            src={[require("../../../../../../../image/" + icon)]} alt=""/></div>)
            }
          </div>
        </li>
      </React.Fragment>
    );
  }
}

export default TaskItem;
