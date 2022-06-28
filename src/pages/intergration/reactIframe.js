import React from 'react';
import Iframe from 'react-iframe';
// import debounce from 'lodash.debounce';
import eventUtils from 'livebos-frame/dist/utils/event';

class ReactIframe extends React.Component {
  state = {
    iframeHeight: '',
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
    const iframeHeight = `${windowInnerHeight - 66}px`;
    this.setState({
      iframeHeight,
    });
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
    const { iframeHeight } = this.state;
    const { location: { pathname, search = '' } } = this.props;
    let livebosUrl;
    livebosUrl = pathname + search;
    // if (this.handleExclude(pathname)) {
    //   if (search.startsWith('?')) {
    //     livebosUrl = search.substring(1);
    //   }
    // }
    if (livebosUrl.indexOf('iframe') >= 0) {
      livebosUrl = livebosUrl.replace('/iframe/', '');
    }
    if (livebosUrl.startsWith('http') === -1) {
      livebosUrl = livebosUrl.indexOf('?') > 0 ? `${livebosUrl}&time=${new Date().getTime()}` : `${livebosUrl}&time=${new Date().getTime()}`; // 支持点击菜单刷新
    }
    // const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    // const iframeHeight = `${windowInnerHeight - 66}px`;

    return (
      <Iframe
        target="_top"
        url={livebosUrl}
        width="100%"
        height={iframeHeight}
        id="myId"
        className=""
        display="initial"
        position="relative"
        style={{ paddingTop: '3px', position: 'relative', display: 'initial', width: '100%' }}
        allowFullScreen
      />
    );
  }
}
export default ReactIframe;
