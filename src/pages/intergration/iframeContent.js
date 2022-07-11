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
    this.setIframeHeight();
  }

  onMessage = (event) => { // iframe的回调事件
    let msg = {};
    try {
      msg = JSON.parse(event.data);
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
    const iframeHeight = `${windowInnerHeight - 66 }px`;
    this.iframeHeight = iframeHeight;
  }

  handleExclude = (pathname = '') => {
    const includes = ['/UIProcessor', '/OperateProcessor', '/ShowWorkflow', '/WorkProcessor'];
    let flag = true;
    includes.forEach((item) => {
      if (pathname.startsWith(item)) {
        flag = false;
      }
    });
    return flag;
  }

  handleOnLoad = () => {
    // alert('加载完成');
    document.getElementById('htmlContent').scrollTo(0, 0);
  }

  render() {
    const { location: { pathname, search = '' } } = this.props;
    let livebosUrl;
    livebosUrl = pathname + search;
    livebosUrl = livebosUrl.indexOf('?') > 0 ? `${livebosUrl}` : `${livebosUrl}`; // 支持点击菜单刷新
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const includeUrl = [];
    recentlyVisitedUrls.forEach((item) => {
      const itemUrl = item.split('|')[0];
      if (itemUrl.startsWith('/UIProcessor') || itemUrl.startsWith('/OperateProcessor') || itemUrl.startsWith('/ShowWorkflow') || itemUrl.startsWith('/WorkProcessor'))  {
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
                  src={`${localStorage.getItem('livebos') || 'livebos'}${item}`}
                  width="100%"
                  height={livebosUrl === item ? this.iframeHeight : 0}
                  id="myId"
                  className=""
                  style={{ position: 'relative', display: 'initial', width: '100%' }}
                  allowFullScreen
                  frameBorder="no"
                  border="0"
                  onMessage={this.onMessage}
                  onLoad={this.handleOnLoad}
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
