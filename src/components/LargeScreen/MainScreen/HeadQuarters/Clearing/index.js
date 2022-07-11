import React from 'react';
import InfoItem from './InfoItem';

class Clearing extends React.Component {
    render() {
        const { optIdxStateStat = [], clearingPlace = [], chartTitle = '--' } = this.props;
        let iconAll = '0'; // 总任务数
        let iconNoStart = '0'; // 未完成
        let iconUnderway = '0'; // 进行中
        let iconCompleted = '0'; // 已完成
        let iconAbnormal = '0'; // 异常
        optIdxStateStat.forEach(item => {
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
        // console.log(clearingPlace)
        iconAll = parseInt(iconNoStart) + parseInt(iconUnderway) + parseInt(iconCompleted) + parseInt(iconAbnormal);

        // 设置显示位置
        let arr = [1, 4, 2, 5, 3, 6];
        // 晚上只返回5个，只显示5个
        if (clearingPlace && clearingPlace.length === 5) {
            arr = [1, 4, 2, 5, 3];
        }

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
                    <ul className=" flex1 clearfix qs-yw-list">
                        {arr.map(i => (
                            <InfoItem
                                key={i}
                                infoItem={clearingPlace[i - 1]}
                            />))}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Clearing;
