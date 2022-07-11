import React from 'react';
import { Drawer, Button, message } from 'antd';
import { withRouter, Link } from 'dva/router';
import { ptlx } from '../../../utils/config';
import { fetchOperationLog } from '../../../services/basicservices';
import { FetchObjectQuery } from '../../../services/sysCommon/index';
import { FetchQueryScreenPermission, FetchQueryBranSetting } from '../../../services/largescreen';
import PositionDrawer from './PositionDrawer';
import DateBox from './DateBox';

class PageHeader extends React.Component {
  state = {
    fullScreen: false,
    records: [],
    cfgVisible: true,
    visible: false,
    data: [],
    subId: '',
    subsidiary: [],
  };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  // componentWillMount() {
  //   const data = [
  //     { name: '集运分公司TOP10业务量', value: '1' },
  //     { name: '全部业务', value: '2' },
  //     { name: '网开成功渠道TOP5客户', value: '3' },
  //     { name: '集运分公司TOP10待办业务量', value: '4' },
  //     { name: '待办业务', value: '5' },
  //     { name: '网开TOP10待办业务量（按营业部）', value: '6' },
  //     { name: '集运TOP10待办业务量（按营业部）', value: '7' },
  //     { name: '业务受理时长超时TOP5', value: '8' },
  //     { name: '数字督办', value: '9' },
  //     { name: '时段图', value: '10' },
  //   ]
  //   this.setState({
  //     data: data
  //   })
  // }

  componentDidMount() {
    const { location } = this.props;
    const { pathname } = location;
    let name = '';
    let tmpCode = '';
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';

    if (name) {
      fetchOperationLog({
        czdx: tmpCode,
        czff: '',
        czjl: 0,
        czkm: '9003',
        czsm: `进入：${name}|${pathname}|`,
        ip,
        ptlx,
      });
    }
    this.fetchData();
  }

  reset = () => {
    this.setState({
      cfgVisible: false,
    })
    setTimeout(() => {
      this.setState({
        cfgVisible: true,
      })
    }, 1);

  }

  fetchData = () => {
    FetchQueryScreenPermission({
      charcode: ""
    })
      .then((ret = {}) => {
        const { code = 0, records = [] } = ret;
        if (code > 0) {
          this.setState({
            records: records
          })
        }
      })
      .catch(error => {
        message.error(!error.success ? error.message : error.note);
      });
    // if (isPosition) {
    //   this.fetchSubsidiary();
    // }
  };

  fetchOrder = (value, type = 1) => {
    const { fetchOrder } = this.props;
    if (fetchOrder) {
      fetchOrder(value, type, this.reset, this.showPosition)
    }
    // FetchQueryBranSetting({
    //   bran: value,
    // })
    //   .then((ret = {}) => {
    //     const { code = 0, records = [] } = ret;
    //     if (code > 0) {
    //       if(type === 1){
    //         this.setState({
    //           data: records,
    //           subId: value,
    //         })
    //       }else if(type === 2){
    //         this.setState({
    //           data: records,
    //           subId: value,
    //         },()=>{
    //           this.reset();
    //         })
    //       }else if(type === 3){
    //         this.setState({
    //           data: records,
    //           subId: value,
    //         },()=>{
    //           this.reset();
    //           this.position.showPosition()
    //         })
    //       }

    //     }
    //   })
    //   .catch(error => {
    //     message.error(!error.success ? error.message : error.note);
    //   });
  }

  showPosition = () => {
    this.position.showPosition()
  }

  fullScreen = () => {
    const { fullScreen } = this.state;
    let main = document.documentElement;
    // let main = document.body
    if (!fullScreen) {
      this.setState({
        fullScreen: !fullScreen,
      });
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    } else {
      this.setState({
        fullScreen: !fullScreen,
      });
      if (main.requestFullscreen) {
        main.requestFullscreen()
      } else if (main.mozRequestFullScreen) {
        main.mozRequestFullScreen()
      } else if (main.webkitRequestFullScreen) {
        main.webkitRequestFullScreen()
      } else if (main.msRequestFullscreen) {
        main.msRequestFullscreen()
      }
    }
  };

  render() {
    const { records = [], cfgVisible = true } = this.state;
    const { subsidiary = [], subId, data = [], title = '', isPosition = false } = this.props;

    return (
      <React.Fragment>
        <div className="head-wrap">
          <div className='head-left flex-r'>
            <Button onClick={this.showDrawer} type="primary" shape="circle"
              style={{ backgroundColor: '#041866', background: `url(${require("../../../image/icon_zk.png")})`, backgroundSize: 'cover', display: 'block' }}>
            </Button>
            {isPosition && <PositionDrawer ref={c => this.position = c} fetchOrder={this.fetchOrder} subId={subId} subsidiary={subsidiary} data={data} reset={this.reset} cfgVisible={cfgVisible} />}
            <Drawer
              placement='left'
              onClose={this.onClose}
              closable={false}
              visible={this.state.visible}
              headerStyle={{ background: 'none', borderBottom: 'none', padding: '2rem' }}
              bodyStyle={{ padding: '2rem' }}
              mask={false}
              drawerStyle={{
                background: '#041866',
                height: '100%',
                boxShadow: '0 0 1rem #00acff80 inset',
                border: '1px solid transparent'
              }}
              height={'inherit'}
            >
              <Button onClick={this.onClose} type="primary" shape="circle"
                style={{
                  backgroundColor: '#041866', position: 'absolute', right: '6%', top: '2%',
                  background: `url(${require("../../../image/icon_sq.png")})`, backgroundSize: 'cover', display: 'block'
                }}>
              </Button>
              <div className='flex-c' style={{ paddingTop: '3.5rem' }}>
                {records.map((ele = {}, index) => {
                  const { scrcode = '-', scrname = '-' } = ele;
                  if (`/${scrcode}` === this.props.location.pathname) {
                    return <Link to={`/${scrcode}`} className='flex-r a drawer-item' key={index}
                      style={{
                        boxShadow: '0 0 1rem #00acff80 inset',
                        color: '#fff',
                      }}
                    >{scrname}</Link>
                  } else {
                    return <Link to={`/${scrcode}`} className='flex-r a drawer-item' key={index}
                    >{scrname}</Link>
                  }
                })
                }
              </div>
            </Drawer>
          </div>
          <div className="head-title" style={{ cursor: 'pointer' }} onClick={this.fullScreen}>
            <img className="head-logo" src={[require("../../../image/logo2.png")]} alt="" />
            <span className="title-text">{title}</span>
          </div>
          <DateBox />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(PageHeader);
