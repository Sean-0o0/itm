import React from 'react';
import LBFrame from 'livebos-frame';
// import debounce from 'lodash.debounce';
import eventUtils from 'livebos-frame/dist/utils/event';

class IframeContent extends React.Component {
  constructor(props) {
    super(props);
    this.iframeHeight = 0;
  }
  componentWillMount() {
    eventUtils.attachEvent('message', this.onMessage);
    // this.setIframeHeight = debounce(this.setIframeHeight, 200);
    // window.addEventListener('resize', this.setIframeHeight); // 后期优化为resizeobserver
    this.setIframeHeight();
  }
  onMessage = (event) => { // iframe的回调事件
    let msg = {};
    try {
      msg = JSON.parse(event.data);
      // if (!msg) {
      //   this.handleCancel();
      // } else {
      //   const { dispatch } = this.props;
      //   if (dispatch) { // 操作完成后,刷新消息提醒条数
      //     dispatch({
      //       type: 'mainPage/fetchMessageNoticeNum',
      //       payload: {},
      //     });
      //   }
      //   this.handleCancel();
      // }
      // TODO..
    } catch (ignored) {
      return;
    }
    switch (msg.type) {
      case 'sessionTimeout':
        window.location.href = '/#/login';
        break;
      default:
        break;
    }
  }
  setIframeHeight = () => {
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `${windowInnerHeight - 66 - 55}px`;
    // this.setState({
    //   iframeHeight,
    // });
    this.iframeHeight = iframeHeight;
  }
  handleExclude = (pathname = '') => {
    const includes = ['/UIProcessor', '/OperateProcessor', '/ShowWorkflow'];
    let flag = true;
    includes.forEach((item) => {
      if (pathname.startsWith(item)) {
        flag = false;
      }
    });
    return flag;
  }
  render() {
    // const { iframeHeight } = this.state;
    const { location: { pathname, search = '' } } = this.props;
    let livebosUrl;
    livebosUrl = pathname + search;
    livebosUrl = livebosUrl.indexOf('?') > 0 ? `${livebosUrl}` : `${livebosUrl}`; // 支持点击菜单刷新
    // const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    // const iframeHeight = `${windowInnerHeight - 66}px`;
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const includeUrl = [];
    recentlyVisitedUrls.forEach((item) => {
      const itemUrl = item.split('|')[0];
      if (itemUrl.startsWith('/UIProcessor') || itemUrl.startsWith('/OperateProcessor') || itemUrl.startsWith('/ShowWorkflow')) {
        includeUrl.push(itemUrl);
      }
    });
    const tempUrls = includeUrl.filter(item => item === livebosUrl) || [];
    if (tempUrls.length === 0) {
      includeUrl.push(livebosUrl);
    }
    return (
      <div>
        {
          includeUrl.map((item) => {
            return (
              <div style={{ display: livebosUrl === item ? '' : 'none' }}>
                <LBFrame
                  key={item}
                  src={`${localStorage.getItem('livebos') || ''}${item}`}
                  // width="100%"
                  height={this.iframeHeight}
                  id="myId"
                  className=""
                  style={{ position: 'relative', display: 'initial', width: '100%' }}
                  allowFullScreen
                  frameborder="no"
                  border="0"
                  onMessage={this.onMessage}
                />
              </div>
            );
        })
        }
      </div>
    );
  }
}
export default React.memo(IframeContent);
