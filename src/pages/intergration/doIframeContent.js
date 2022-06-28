import React from 'react';
import Iframe from 'react-iframe';

class DoIframeContent extends React.Component {
  render() {
    const { location: { pathname, search = '' } } = this.props;
    let sdoUrl = pathname + search;
    sdoUrl = sdoUrl.indexOf('?') > 0 ? `${sdoUrl}&time=${new Date().getTime()}` : `${sdoUrl}?time=${new Date().getTime()}`; // 支持点击菜单刷新
    const windowInnerHeight = window.innerHeight; // 浏览器可视区域高度
    const iframeHeight = `${windowInnerHeight - 66}px`;
    let preUrl = localStorage.getItem('sdo') || '';
    if (sdoUrl.indexOf('/didi/') !== -1) {
      preUrl = localStorage.getItem('didi') || '';
    }
    return (
      <Iframe
        target="_top"
        url={`${preUrl}${sdoUrl}`}
        width="100%"
        height={iframeHeight}
        id="myId"
        className=""
        display="initial"
        position="relative"
        styles={{ paddingTop: '3px' }}
        allowFullScreen
      />
    );
  }
}
export default DoIframeContent;
