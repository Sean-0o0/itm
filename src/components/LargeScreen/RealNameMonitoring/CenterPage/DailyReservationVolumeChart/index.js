import React from 'react';
import { connect } from 'dva';
import { message, } from 'antd';
import ChartBox from '../../ChartBox';
import {
  FetchQueryChartDWData,
} from '../../../../../services/largescreen';

class DailyReservationVolumeChart extends React.Component {
  state = {
    data: [],
    xAxisData: [],
    colorList: ['rgba(226, 60, 57, 1)', 'rgba(0, 172, 255, 1)',],
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.records !== this.props.records) {
  //     this.fetchData();
  //   }
  // }

  componentWillMount() {
    this.fetchData();
  }

  //表头数据查询
  fetchData = () => {
    FetchQueryChartDWData({
      chartCode: 'RNSReservedTrend'
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          let map = {}
          for (let i = 0; i < data.length; i++) {
            let ai = data[i]
            if (!map[ai.INDEXNO]) {
              map[ai.INDEXNO] = [ai]
            } else {
              map[ai.INDEXNO].push(ai)
            }
          }
          let dataName = [];
          let dataNum = [];
          let dataNum1 = [];
          let dataNum2 = [];
          data.forEach((item) => {
            //去重
            if (dataName.indexOf(item.GROUPNO) === -1) {
              dataName.push(item.GROUPNO)
            }
          });
          map[1].forEach((item) => {
            dataNum1.push(item.NUM)
          });
          map[2].forEach((item) => {
            dataNum2.push(item.NUM)
          });
          dataNum.push(dataNum1);
          dataNum.push(dataNum2);
          this.setState({
            data: dataNum,
            xAxisData: dataName,
          });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const { data = [], xAxisData = [], colorList = [], } = this.state;
    // const { dispatch } = this.props;

    return (
      <div className="h50 pd10">
        <ChartBox
          data={data}
          xAxisData={xAxisData}
          colorList={colorList}
          yAxisName=''
          tClass='title-c'
          title='每日预留量走势图'
          chartType='4'/>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(DailyReservationVolumeChart);
