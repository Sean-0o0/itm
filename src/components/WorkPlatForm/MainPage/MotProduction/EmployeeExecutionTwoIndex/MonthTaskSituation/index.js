import React, { Fragment } from 'react';
import { Row,Col, message} from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts-liquidfill/src/liquidFill.js';  // eslint-disable-line
import moment from 'moment';

//引入请求路径的示例
import { FetchQueryStaffSuperviseTaskTotalStatistics } from '../../../../../../services/motProduction';

class MonthTaskSituation extends React.Component {
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
  fetchData=(props)=>{
    const { selectMonth } = props;
    if(selectMonth !== null){
      FetchQueryStaffSuperviseTaskTotalStatistics({
        spvsMo: moment(selectMonth,"YYYYMM").format("YYYYMM"),
      }).then((res) => {
        if (res.code === 1) {
          const { records = [] } = res;
          records.forEach(element => {
            if(element.cpltNum === ""){
              element.cpltNum = "--";
            }
            if(element.taskCpltRt === "%"){
              element.taskCpltRt = "0%";
            }
            if(element.taskNum === ""){
              element.taskNum = "--";
            }
          });
          this.setState({
            records,
          });
        }
      }).catch((error) => {
        message.error(!error.success ? error.message : error.note);
      });
    }
  }

  getOption = () =>{
    const { records = [] } = this.state;
    if(records.length > 0){
      if(records[0].taskCpltRt === ""){
        records[0].taskCpltRt = 0;
      }
    }
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
          value: records[0] == null ? 0 : records[0]['taskCpltRt'].replace('%','')/100,
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
              return '';
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
    const {  records = [] } = this.state;
    const option = this.getOption(); 
    return (
      <Fragment>
          <div className="mot-empexc-card-content" style={{border:'none'}}>
          <Row style={{borderBottom:'1px dashed #EDEDED'}}>
              <Col span={6}>
                <div style={{height:'80px'}}>
                  <div style={{height:'60px',width:'60px',float:'left'}}>
                    <ReactEchartsCore
                    echarts={echarts}
                    style={{ height: '60px', width: '60px' }}
                    option={option}
                    notMerge
                    lazyUpdate
                    theme="theme_name"
                    />
                  </div>
                  <div style={{float:'left',color:'#333333',marginLeft:'1rem'}}>
                    <div style={{marginTop:'5px'}}>任务完成率</div>
                    <div style={{marginTop:'12px'}}>{records[0]==null?'--':records[0].taskCpltRt}</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{height:'80px'}}>
                  <div style={{float:'left',color:'#333333'}}>
                    <div style={{marginTop:'5px'}}>任务数</div>
                    <div style={{marginTop:'12px'}}>{records[0]==null?'--':records[0].taskNum}</div>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{height:'80px'}}>
                  <div style={{float:'left',color:'#333333'}}>
                    <div style={{marginTop:'5px'}}>已完成</div>
                    <div style={{marginTop:'12px'}}>{records[0]==null?'--':records[0].cpltNum}</div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
      </Fragment>
    );
  }
}

export default MonthTaskSituation;
