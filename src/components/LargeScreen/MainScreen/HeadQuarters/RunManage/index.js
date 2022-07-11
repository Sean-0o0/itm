import React from 'react';
import InfoItem from './InfoItem';

class RunManage extends React.Component {

    render() {
        const { runManageStateStat = [], runManageData = [], chartTitle = '--' } = this.props;

        let iconAll = '0'; // 总任务数
        let iconNoStart = '0'; // 未完成
        let iconUnderway = '0'; // 进行中
        let iconCompleted = '0'; // 已完成
        let iconAbnormal = '0'; // 异常
        runManageStateStat.forEach(item => {
            if (item) {
                if (item.state === '0') {
                    iconNoStart = item.count;
                } else if (item.state === '1') {
                    iconUnderway = item.count;
                } else if (item.state === '2') {
                    iconCompleted = item.count;
                } else if (item.state === '3') {
                    iconAbnormal = item.count;
                }
            }
        });

        iconAll = parseInt(iconNoStart) + parseInt(iconUnderway) + parseInt(iconCompleted) + parseInt(iconAbnormal);

        // 以下按页面左右顺序排列
        let obj1 = {};
        let obj2 = {};
        let obj3 = {};
        let obj4 = {};
        let obj5 = {};
        let obj6 = {};
        let obj7 = {};

        runManageData.forEach(item => {
            if (item) {
                if (item.IDX_CODE === 'YXGL0102') {
                    obj1 = item;
                } else if (item.IDX_CODE === 'YXGL0101') {
                    obj2 = item;
                } else if (item.IDX_CODE === 'YXGL0202') {
                    obj3 = item;
                } else if (item.IDX_CODE === 'YXGL0201') {
                    obj4 = item;
                } else if (item.IDX_CODE === 'YXGL0104') {
                    obj5 = item;
                } else if (item.IDX_CODE === 'YXGL0203') {
                    obj6 = item;
                } else if (item.IDX_CODE === 'YXGL010401') {
                    obj7 = item;
                }
            }
        });

        return (
            <div className="h100 flex-c zb-data-item">
                <div className="card-title-sec">{chartTitle}</div>
                <div className="flex1 flex-c qs-cont">
                    <div className="fs16 lh20 pl8 pr8 h10">
                        <span className="pr10">总任务数：{iconAll}</span>
                        <span className="pr10"><span className="blue">已完成：</span>{iconCompleted}</span>
                        <span className="pr10"><span className="gray">未完成：</span>{iconNoStart}</span>
                        <span className="pr10"><span className="orange">进行中：</span>{iconUnderway}</span>
                        <span className=""><span className="red">异常：</span>{iconAbnormal}</span>
                    </div>
                    <ul className="flex1 clearfix qs-yw-list">
                        <li className="fl wid100 h33">
                            <InfoItem
                                infoItem={obj1}
                            />
                        </li>
                        <li className="fl wid50 h33">
                            <InfoItem
                                infoItem={obj2}
                            />
                        </li>
                        <li className="fl wid50 h33">
                            <InfoItem
                                infoItem={obj3}
                            />
                        </li>
                        <li className="fl wid33 h33">
                            <InfoItem
                                infoItem={obj4}
                            />
                        </li>
                        <li className="fl wid34 h33">
                            <InfoItem
                                infoItem={obj5}
                            />
                        </li>
                        <li className="fl wid33 h33">
                            <InfoItem
                                infoItem={obj6}
                            />
                        </li>
                        {/* <li className="fl wid33 h33">
                            <InfoItem
                                infoItem={obj7}
                            />
                        </li> */}
                    </ul>
                </div>
            </div>
        );
    }
}

export default RunManage;
