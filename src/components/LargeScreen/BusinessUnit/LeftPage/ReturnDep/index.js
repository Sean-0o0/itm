import React from 'react';
import { connect } from 'dva';
import { FetchQueryChartIndexData } from '../../../../../services/largescreen';
import { message } from 'antd';


class ReturnDep extends React.Component {
  state = {
    dataList: []
  };

  componentDidMount() {
  }

  componentWillUnmount() {
  }


  fetchData = (chartCode) => {
    FetchQueryChartIndexData({
      chartCode: chartCode,
    })
      .then((ret = {}) => {
        const { code = 0, data = [] } = ret;
        if (code > 0) {
          this.setState({ dataList: data });
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
  };


  render() {
    const {chartConfig = []} = this.props;
    if(chartConfig.length && chartConfig[0].chartCode) {
      this.fetchData(chartConfig[0].chartCode);
    }
    const { dataList } = this.state;
    return (
      <div className="h50 pd10">
        <div className="ax-card flex-c">
          <div className="box-title">
            <div className="card-title title-l">归口部门使用情况</div>
          </div>
          <div className="pos-r" style={{width: '100%', height: '100%'}}>
            <div style={{display: 'flex',marginTop: '1rem', height: '15%', width: '100%', flexDirection: 'row'}}>
              <div style={{width: '18%', height: '100%', textAlign: 'center'}}></div>
              <div style={{width: '3%',textAlign: 'center',marginTop: '1.7rem', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>
              <div style={{width: '45%', height: '100%', marginTop: '1.8rem',marginLeft: '1rem', color: '#00ACFF'}}>
                使用率
              </div>
              <div style={{width: '3%',textAlign: 'center',marginTop: '1.7rem', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>
              <div style={{width: '31%', height: '100%', marginTop: '1.8rem',marginLeft: '1rem', color: '#00ACFF'}}>
                闲置率
              </div>
            </div>

            {
              dataList.map((item, index) => {
                return (
                  <div style={{display: 'flex', height: '14%', width: '100%', flexDirection: 'row'}}>
                    <div style={{width: '30%', height: '100%',fontWeight: 'bold', textAlign: 'right'}}>{item.GROUPNAME}</div>
                    <div style={{width: '60%', height: '100%',position:'relative',marginLeft: '2rem'}}>
                      <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#00C2FF', width: item.USERATE +'%',zIndex: '1'}}></div>
                      <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#054492', width: '100%'}}></div>
                      <div style={{position: 'absolute', left: '0', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>
                      <div style={{position: 'absolute', left: '5%', top: '35%', color: '#00ACFF'}}>{item.USERATE}%</div>
                      <div style={{position: 'absolute', left: (item.USERATE - 2) + '%', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>
                      <div style={{position: 'absolute', left: (item.USERATE -2 + 5) + '%', top: '35%'}}>{item.VACANCYRATE}%</div>
                    </div>
                  </div>
                )
              })
            }



            {/*<div style={{display: 'flex', height: '17%', width: '100%', flexDirection: 'row'}}>*/}
            {/*  <div style={{width: '30%', height: '100%',fontWeight: 'bold', textAlign: 'right'}}>销售交易业务总部</div>*/}
            {/*  <div style={{width: '60%', height: '100%',position:'relative',marginLeft: '2rem'}}>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#00C2FF', width: '30%',zIndex: '1'}}></div>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#054492', width: '100%'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '0', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '5%', top: '35%', color: '#00ACFF'}}>87%</div>*/}
            {/*    <div style={{position: 'absolute', left: '28%', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '33%', top: '35%'}}>10%</div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div style={{display: 'flex', height: '17%', width: '100%', flexDirection: 'row'}}>*/}
            {/*  <div style={{width: '30%', height: '100%',fontWeight: 'bold', textAlign: 'right'}}>销售交易业务总部</div>*/}
            {/*  <div style={{width: '60%', height: '100%',position:'relative',marginLeft: '2rem'}}>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#00C2FF', width: '30%',zIndex: '1'}}></div>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#054492', width: '100%'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '0', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '5%', top: '35%', color: '#00ACFF'}}>87%</div>*/}
            {/*    <div style={{position: 'absolute', left: '28%', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '33%', top: '35%'}}>10%</div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div style={{display: 'flex', height: '17%', width: '100%', flexDirection: 'row'}}>*/}
            {/*  <div style={{width: '30%', height: '100%',fontWeight: 'bold', textAlign: 'right'}}>销售交易业务总部</div>*/}
            {/*  <div style={{width: '60%', height: '100%',position:'relative',marginLeft: '2rem'}}>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#00C2FF', width: '30%',zIndex: '1'}}></div>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#054492', width: '100%'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '0', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '5%', top: '35%', color: '#00ACFF'}}>87%</div>*/}
            {/*    <div style={{position: 'absolute', left: '28%', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '33%', top: '35%'}}>10%</div>*/}
            {/*  </div>*/}
            {/*</div>*/}

            {/*<div style={{display: 'flex', height: '17%', width: '100%', flexDirection: 'row'}}>*/}
            {/*  <div style={{width: '30%', height: '100%',fontWeight: 'bold', textAlign: 'right'}}>销售交易业务总部</div>*/}
            {/*  <div style={{width: '60%', height: '100%',position:'relative',marginLeft: '2rem'}}>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#00C2FF', width: '30%',zIndex: '1'}}></div>*/}
            {/*    <div style={{position: 'absolute', height: '1.5rem', left:'0', borderRadius: '4rem', background: '#054492', width: '100%'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '0', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-use-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '5%', top: '35%', color: '#00ACFF'}}>87%</div>*/}
            {/*    <div style={{position: 'absolute', left: '28%', top: '30%',width: '4%',textAlign: 'center', height: '25%',backgroundSize: '100% 100%', backgroundImage:"url("+require("../../../../../image/icon-leave-tag.png")+")", backgroundRepeat: 'no-repeat'}}></div>*/}
            {/*    <div style={{position: 'absolute', left: '33%', top: '35%'}}>10%</div>*/}
            {/*  </div>*/}
            {/*</div>*/}




          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
}))(ReturnDep);
