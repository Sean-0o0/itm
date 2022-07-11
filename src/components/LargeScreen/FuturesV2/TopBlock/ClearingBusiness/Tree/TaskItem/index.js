import React from 'react';

class TaskItem extends React.Component {

    render() {
        const { infoItem = {}, status = '0' } = this.props;
        let icon = "";
        if (infoItem !== {}) {
            switch (infoItem.STATE) {
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

        return (
            <React.Fragment>
                <li style={{ height: '2.2rem' }}>
                    <div className="line" style={{ bottom: '1rem' }}> </div>
                    <div className="desc">
                        <div className='time nwp'>{infoItem.IDX_NM ? infoItem.IDX_NM : ""}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li>
            </React.Fragment>
        );
    }
}
export default TaskItem;
