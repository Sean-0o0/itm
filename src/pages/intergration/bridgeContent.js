import React from 'react';
import Bridge from 'livebos-bridge'

const { events } = Bridge.constants

class BridgeContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bridge: null
    };
    this.iframeHeight = 0;
    this.iframeRef = React.createRef();
  }

  componentWillMount() {
    this.setIframeHeight();
  }

  componentDidMount() {
    setTimeout(() => {
      this.iframeRef.current.onload = (() => {
        this.connect();
      })
    }, 0)

  }

  setIframeHeight = () => {
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `calc(${windowInnerHeight}px - 7rem)`;
    this.iframeHeight = iframeHeight;
  }

  connect = () => {
    const { onSucess } = this.props;
    const bridge = new Bridge(this.iframeRef.current.contentWindow)
    bridge.onReady(() => {
      bridge.on(events.SESSION_TIME_OUT, () => {
        window.location.href = '/#/login';
      })
      bridge.on(events.OPERATE_CALLBACK, (data) => {
        const { callback: { cancelFlag }, success } = data;
        if (cancelFlag === true) {
          this.close()
        }
        if (success === true) {
          onSucess();
          this.close()
        }
      })
      this.setState({
        bridge
      })
    })
  }

  close = () => {
    const { bridge = null } = this.state;
    if (bridge !== null) {
      bridge.close()
      this.setState({
        bridge: null
      })
    }
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel()
    }

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
      if (itemUrl.startsWith('/UIProcessor') || itemUrl.startsWith('/OperateProcessor') || itemUrl.startsWith('/ShowWorkflow') || itemUrl.startsWith('/WorkProcessor')) {
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
                <iframe
                  key={item}
                  src={`${localStorage.getItem('livebos') || 'livebos'}${item}`}
                  style={{
                    width: '100%',
                    height: livebosUrl === item ? this.iframeHeight : 0,
                    borderColor: 'transparent',
                  }}
                  ref={this.iframeRef}
                  title='livebos'

                />
              </div>
            );
          })
        }
      </div>

    );
  }
}

export default BridgeContent;
