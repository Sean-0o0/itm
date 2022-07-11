import React from 'react';
import bgi from '../../assets/404_bg.png';

class ErrorPage extends React.Component {
  backToIndex = () => {
    window.location.href = '/#/index';
  }

  render() {
    const { type = "403" } = this.props;
    let content = "抱歉，你无权访问该页面";
    if (type === "404") {
      content = "页面不存在";
    } else if (type === "500") {
      content = "系统异常，请返回重试";
    }

    return (
      <div className="m-row-noPadding ant-row clearfix" style={{ background: '#FFFFFF', margin: 0, height: '100%', position: 'relative' }}>
        <div style={{ textAlign: 'center', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', paddingBottom: '30px' }}>
          <div style={{ paddingTop: 0 }}>
            <img src={bgi} width="340" alt="" />
          </div>
          <div style={{ fontSize: '14px', color: '#666666', lineHeight: '20px', paddingTop: '10px' }}>{content}</div>
          <div style={{ paddingTop: '20px' }}>
            {/* <button style={{ padding: '0 18px', border: 0, height: '32px', borderRadius: '4px', color: '#FFFFFF', backgroundColor: '#54A9DF', cursor: 'pointer' }} onClick={this.backToIndex}>
              返回首页
            </button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorPage;
