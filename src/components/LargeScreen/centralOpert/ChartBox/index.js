import React from 'react';
import { Tooltip } from 'antd';
import PieType from './PieType';
import BarType from './BarType';
import BarAndLine from './BarAndLine';
import LineType from './LineType';
import LableLinePieType from './LableLinePieType';
import StackBarType from './StackBarType';

class ChartBox extends React.Component {
    // 获取图表组件
    getChartComponent = (chartType) => {
        const { data = [], xAxisData = [], fqqdArr = [], type = '', selfRun = false, gradientColor = 'false', colorList = [] } = this.props;
        // console.log(data)
        let com = null;
        switch (chartType) {
            case '1':
                com = (
                    <PieType
                        data={data}
                    />
                ); // 饼图
                break;
            case '2':
                com = (
                    <BarType
                        data={data}
                        selfRun={selfRun}
                        xAxisData={xAxisData}
                        type={type}
                        colorList={colorList}
                        gradientColor={gradientColor}
                    />
                ); // 柱状图
                break;
            case '3':
                com = (
                    <BarAndLine
                        data={data}
                        xAxisData={xAxisData}
                        fqqdArr={fqqdArr}
                    />
                ); // 折线图（总量柱状图）
                break;
            case '4':
                com = (
                    <LineType
                        data={data}
                        xAxisData={xAxisData}
                    />
                ); // 折线图
                break;
            case '5':
                com = (
                    <LableLinePieType
                        data={data}
                    />
                ); // 饼图
                break;
            case '6':
              com = (
                <StackBarType
                  colorList={colorList}
                  data={data}
                />
              ); // 堆叠条形图
            break;
            default:
                com = null;
                break;
        }
        return com;
    };

    render() {
        const { tClass = '', title = '', chartType = '1', chartConfig = [], selfRun = false } = this.props;
        const titleClass = `card-title ${tClass}`;
        return (
            <div className="ax-card flex-c">
                <div className="box-title">
                  {selfRun === true ? (
                    <div className={titleClass}>
                      {chartConfig.length && chartConfig[0].chartTitle ? chartConfig[0].chartTitle : ''}
                      {chartConfig.length && chartConfig[0].chartNote ? "(" + chartConfig[0].chartNote + ")" : ''}
                    </div>
                    ) : (
                    <div className={titleClass}>{title ? title : '--'}
                      {chartConfig.length && chartConfig[0].chartNote ?
                        (<Tooltip placement="top" title={<div>{chartConfig[0].chartNote.split("\n").map((item, index) => { return <span key={index}>{item}<br /></span> })}</div>}>
                          <img className="title-tip" src={[require("../../../../image/icon_tip.png")]} alt="" />
                        </Tooltip>) : ''
                      }
                    </div>
                  )}
                </div>
                <div className="flex1 flex-c">
                    <div className="chart-box1 flex1 pos-r">
                      {selfRun === true ? (
                        <React.Fragment>
                          <div style={{ height: '37%'}}>
                          {this.getChartComponent("6")}
                          </div>
                          <div style={{ height: '63%'}}>
                            {this.getChartComponent(chartType)}
                          </div>
                        </React.Fragment>
                      ): (
                        <div style={{ height: '100%'}}>
                          {this.getChartComponent(chartType)}
                        </div>
                      )}

                    </div>
                </div>
            </div>
        );
    }
}
export default ChartBox;
