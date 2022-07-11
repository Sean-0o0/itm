import React, { Fragment } from 'react';
import { message} from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts-liquidfill/src/liquidFill.js';  // eslint-disable-line
import { FetchQueryStaffSuperviseTaskTotalStatistics } from '../../../../../../services/motProduction';


class MonthTaskCompletion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    this.fetchData(this.props);
  }
  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }
  fetchData = (props) =>{
    const { lastMonth } = props;
    FetchQueryStaffSuperviseTaskTotalStatistics({
      spvsMo: lastMonth,
    }).then((res) => {
      if (res.code === 1) {
        const { records = [] } = res;
        this.setState({
          records,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  getOption = () =>{
    const { records = [] } = this.state;
    if(records.length > 0){
      if(records[0].taskCpltRt === ""){
        records[0].taskCpltRt = 0;
      }
    }
    console.log('records',records[0]['taskCpltRt'])
    // 构造echarts水球图
    const option = {
      series: [{
        type: 'liquidFill',
        backgroundStyle: {
          color: '#eeeeee',
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0,
        },
        data: [{
          value: records[0] && records[0]['taskCpltRt']? records[0]['taskCpltRt'].replace('%','')/100 : 0,
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
          },
        }, {
          value: records[0] == null ? 0 : records[0]['taskCpltRt'].replace('%','')/100,
          direction: 'left',
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0)',
            shadowBlur: 0,
            color: 'rgb(254, 201, 126)',
          },
        }],
        radius: '80%',
        color: 'rgb(254, 201, 126)',
        outline: {
          show: false,
        },
        label: {
          normal: {
            formatter: function(a,b,c){
              return c;
              }, 
            textStyle: {
                color: 'white', //波浪上文本颜色
                insideColor: 'yellow', //波浪内部字体颜色
                fontSize: 20
            },
        }
        },
      },
      {
        type: 'pie',
        radius: ['95%', '100%'],
        avoidLabelOverlap: false,
        clockwise: false,
        hoverOffset: 0,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: false,
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          {
            value: records[0] == null ? 0 : records[0]['taskCpltRt'].replace('%',''),
            name: '已完成',
            itemStyle: {
              color: 'rgb(254, 201, 126)',
            },
          },
          {
            value: 100-(records[0] == null ? 0 : records[0]['taskCpltRt'].replace('%','')),
            name: '未完成',
            itemStyle: {
              color: '#e5e8eb',
            },
          },
        ],
      },
      ],
    };
    return option;
  }
  render() {
    const option = this.getOption(); 
    return (
      <Fragment>
        <div className="mot-empexc-succ">
            <div style={{color:'#333333',fontWeight:'bold'}}>任务完成度</div>
                  <ReactEchartsCore
                    echarts={echarts}
                    style={{ height: '80%', width: '80%',marginLeft:'10%',marginTop:'1.5rem' }}
                    option={option}
                    notMerge
                    lazyUpdate
                    theme="theme_name"
                  />
          </div>
      </Fragment>
    );
  }
}

export default MonthTaskCompletion;
