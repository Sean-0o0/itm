import React from 'react';
import PieType from './/PieType';

class CentralOperation extends React.Component {
    render() {
        const { centralOperation = [], top10BusVolDis = [], chartTitle = '--' } = this.props;

        let firstColName = "-"; // 第一列名称
        let firstColVal = "-"; // 第一列数值
        let secondColName = "-"; // 第二列名称
        let secondColVal = "-"; // 第二列数值
        let thirdColName = "-"; // 第三列名称
        let thirdColVal = "-"; // 第三列数值
        let fourColName = "-"; // 第四列名称
        let fourColVal = "-"; // 第四列数值

        centralOperation.forEach(item => {
            if (item) {
                if (item.IDX_CODE === 'JZYY01') {
                    firstColName = item.IDX_NM;
                    firstColVal = item.RESULT ? Number.parseInt(item.RESULT) : "";
                } else if (item.IDX_CODE === 'JZYY0108') {
                    secondColName = item.IDX_NM;
                    secondColVal = item.RESULT ? Number.parseInt(item.RESULT) : "";
                } else if (item.IDX_CODE === 'JZYY0109') {
                    thirdColName = item.IDX_NM;
                    thirdColVal = item.RESULT ? Number.parseInt(item.RESULT) : "";
                } else if (item.IDX_CODE === 'JZYY02') {
                    fourColName = item.IDX_NM;
                    fourColVal = item.RESULT ? Number.parseInt(item.RESULT) : "";
                }
            }
        });

        return (
            <div className="flex-c zb-data-item h100">
                <div className="card-title-sec">{chartTitle}</div>
                <div className="flex1 zjyw-cont tc flex-c">
                    <div className="clearfix h23">
                        <div className="fl wid30 yyyw-item h100">
                            <div className="fs16 lh20 h36">{firstColName}</div>
                            <div className="yyyw-num">{firstColVal}&nbsp;<span className="fs16 fwn">笔</span></div>
                        </div>
                        <div className="fl wid40 yyyw-item h100">
                            <div className="fs16 lh20 h36">{secondColName}&nbsp;/&nbsp;{thirdColName}</div>
                            <div className="yyyw-num">{secondColVal}&nbsp;<span className="fs16 fwn">笔</span>&nbsp;/&nbsp;{thirdColVal}&nbsp;<span className="fs14 fwn">%</span></div>
                        </div>
                        <div className="fl wid30 yyyw-item h100">
                            <div className="fs16 lh20 h36">{fourColName}</div>
                            <div className="yyyw-num">{fourColVal}&nbsp;<span className="fs16 fwn">笔</span></div>
                        </div>
                    </div>
                    {/* <div style={{ height: "20rem" }}> */}
                    <div style={{ height: "77%" }}>
                        <PieType
                            data={top10BusVolDis}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default CentralOperation;
