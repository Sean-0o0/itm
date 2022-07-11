import React from 'react';

class TaskItem extends React.Component {
    render() {
        const { state, itemCode = '0' } = this.props;
        let icon = "";
        let itemArr = ['参数调整', '客户资金调整', '席位资金调整', '文件处理', '日终清算', '日终对账']
        if (state !== "") {
            switch (state) {
                case '0':
                    icon = "icon_nostart.png";
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
        if (itemCode === '0') {
            itemArr.splice(4, 0, '行权交收');
        } else if (itemCode === '2') {
            itemArr.splice(4, 0, '现券交收')
        }

        return (
            <React.Fragment>
                {
                    itemArr.map((name, index) => (
                        <li className="mt12" key={index}>
                            <div className="line"> </div>
                            <div className="desc">
                                <div className='time'>{name}</div>
                                {
                                    icon === "" ? "" :
                                        (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                                }
                            </div>
                        </li>
                    ))
                }

                {/* <li className="mt12">
                    <div className="line"> </div>
                    <div className="desc">
                        <div className='time'>客户资金调整</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li>
                <li className="mt12">
                    <div className="line"> </div>
                    <div className="desc">
                        <div className='time'>席位资金调整</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li>
                <li className="mt12">
                    <div className="line"> </div>
                    <div className="desc">
                        <div className='time'>文件处理</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li>
                <li className="mt12">
                    <div className="line"> </div>
                    <div className="desc">
                        <div className='time'>日终清算</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li>
                <li className="mt12">
                    <div className="line"> </div>
                    <div className="desc">
                        <div className='time'> 日终对账</div>
                        {
                            icon === "" ? "" :
                                (<div className='cont'><img className="fs-zjyw-img" src={[require("../../../../../../image/" + icon)]} alt="" /></div>)
                        }
                    </div>
                </li> */}
            </React.Fragment>
        );
    }
}
export default TaskItem;
