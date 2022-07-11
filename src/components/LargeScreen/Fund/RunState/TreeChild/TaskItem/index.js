import React from 'react';

class TaskItem extends React.Component {

    render() {
        const { infoItem = {}, current = -1, order = -1 } = this.props;
        let icon = "";
        let boldClass = "mt12";
        let timeClass = "line";
        if (infoItem !== {}) {
            switch (infoItem.STATE) {
                case '0':
                    icon = "";
                    break;
                case '1':
                    icon = "icon_underway2.png";
                    break;
                case '2':
                    icon = "icon_completed2.png";
                    break;
                case '3':
                    icon = "icon_abnormal2.png";
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
                <li className={boldClass}>
                    <div className={timeClass}> </div>
                    <div className="desc">
                        {
                            current !== order ? "" :
                                (<div className="left"><img className="fd-current-img" src={[require("../../../../../../image/icon_jt@3x.png")]} alt="" /></div>)
                        }
                        <div className='time'>{infoItem.IDX_NM ? infoItem.IDX_NM : ""}</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li>
            </React.Fragment>
        );
    }
}
export default TaskItem;
