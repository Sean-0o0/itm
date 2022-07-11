import React from 'react';
import { Tooltip } from 'antd';
import LineType from '../../ClearingPlace/ModuleChart/LineType';
import LineShadowType from '../../ClearingPlace/ModuleChart/LineShadowType';
import PieType from '../../ClearingPlace/ModuleChart/PieType';
import Bar from '../../ClearingPlace/ModuleChart/Bar';

class ModulesChart extends React.Component {
    state = {
    };

    // 获取图表组件
    getChartComponent = data => {
        const { chartType } = data;
        const { indexConfig = [], dispatch } = this.props;
        let com = null;
        switch (chartType) {
            case '1':
                com = '定制类（不支持个性化配置）';
                break;
            // case '2':
            //     com = (
            //         <BarAndLine
            //             configData={data}
            //             indexConfig={indexConfig}
            //         />
            //     ); // 直方图
            //     break;
            case '3':
                com = (
                    <LineShadowType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 折线图渐变
                break;
            case '4':
                com = (
                    <LineType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 折线图
                break;
            case '5':
                com = (
                    <Bar
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 直方图和平均线
                break;
            case '6':
                com = (
                    <PieType
                        configData={data}
                        indexConfig={indexConfig}
                        dispatch={dispatch}
                    />
                ); // 饼图
                break;
            default:
                com = null;
                break;
        }
        return com;
    };

    render() {
        const { records = [], tClass = '', indIv = [] } = this.props;
        const titleClass = `card-title ${tClass}`;
        let text = [];
        let unit = [];
        let detail = [];
        let unitArr = [];

        records.forEach(item => {
            switch (item.chartCode) {
                case 'IndIvTotalNum':
                    unitArr = item.leftVerticalUnit.split("/");
                    unit.push(unitArr[1]?unitArr[1]:'');
                    indIv.forEach(item => {
                        if(item.IDX_CODE === 'XZTZ0101'){
                            text.push(item.NAME||'');
                            detail.push(item.RESULT||'');
                        }
                    });
                    break;
                case 'IndIvTotalIv':
                    unitArr = item.leftVerticalUnit.split("/");
                    unit.push(unitArr[1]?unitArr[1]:'');
                    indIv.forEach(item => {
                        if(item.IDX_CODE === 'XZTZ0102'){
                            text.push(item.NAME||'');
                            detail.push(item.RESULT||'');
                        }
                    });
                    break;
                case 'IndIvNewIncNum':
                    unitArr = item.leftVerticalUnit.split("/");
                    unit.push(unitArr[1]?unitArr[1]:'');
                    indIv.forEach(item => {
                        if(item.IDX_CODE === 'XZTZ0201'){
                            text.push(item.NAME||'');
                            detail.push(item.RESULT||'');
                        }
                    });
                    break;
                case 'IndIvNewIncIv':
                    unitArr = item.leftVerticalUnit.split("/");
                    unit.push(unitArr[1]?unitArr[1]:'');
                    indIv.forEach(item => {
                        if(item.IDX_CODE === 'XZTZ0202'){
                            text.push(item.NAME||'');
                            detail.push(item.RESULT||'');
                        }
                    });
                    break;
                case 'IndIvOutProNum':
                    unitArr = item.leftVerticalUnit.split("/");
                    unit.push(unitArr[1]?unitArr[1]:'');
                    indIv.forEach(item => {
                        if(item.IDX_CODE === 'XZTZ0301'){
                            text.push(item.NAME||'');
                            detail.push(item.RESULT||'');
                        }
                    });
                    break;
                case 'IndIvOutProIv':
                    unitArr = item.leftVerticalUnit.split("/");
                    unit.push(unitArr[1]?unitArr[1]:'');
                    indIv.forEach(item => {
                        if(item.IDX_CODE === 'XZTZ0302'){
                            text.push(item.NAME||'');
                            detail.push(item.RESULT||'');
                        }
                    });
                    break;
                default:
                    break;
            }
        });

        return (
            <div className="ax-card flex-c">
                <div className="box-title">
                    <div className={titleClass}>{records.length && records[0].chartTitle ? records[0].chartTitle : '--'}
                        {records.length && records[0].chartNote ?
                            (<Tooltip placement="top" title={<div>{records[0].chartNote.split('\n').map((item,index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                                <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                            </Tooltip>) : ''
                        }
                    </div>
                </div>
                <div className="flex1 flex-c pt20">
                    {records.map((data, index) => (
                        <div className="chart-box h50 pos-r iv-chart-data" key={index}>
                            <div className="iv-data-unit">{data.leftVerticalUnit}</div>
                            <div className="iv-data-box"><span className="iv-data-title">{text[index] || ''}&nbsp;&nbsp;</span>{detail[index] || ''}<span className="iv-data-tail">&nbsp;{unit[index] || ''}</span></div>
                            <div style={{ height: '100%' ,paddingTop: '2.333rem' }}>{this.getChartComponent(data)}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
export default ModulesChart;
