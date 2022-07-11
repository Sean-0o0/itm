import React, { Fragment } from 'react';
import { Menu, message } from 'antd';
// 引入请求路径的示例
import { FetchQueryMotUrl } from '../../../../../services/motProduction';
import DisPatchIndex from '../DisPatchIndex';
import DistributeStreamTableConfig from '../DistributeStreamTableConfig';

class MotMonitoring extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '1',
      cdhUrl: '',
      engineConsoleUrl: '',
      sparkUrl: '',
      yarnUrl: '',
    };
  }
  componentDidMount() {
    FetchQueryMotUrl().then((res) => {
      if (res.code === 1) {
        const { cdhUrl, engineConsoleUrl, sparkUrl, yarnUrl } = res;
        this.setState({
          cdhUrl,
          engineConsoleUrl,
          sparkUrl,
          yarnUrl,
        });
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  handleClick = e => {
    if(e.key === '1' || e.key === '2'){
      this.setState({
        key: e.key,
      });
    }
  };
  render() {
    const { key, yarnUrl, cdhUrl, sparkUrl, engineConsoleUrl } = this.state;
    return (
      <Fragment>
      <Menu className="mot-factor-name" onClick={this.handleClick} selectedKeys={[key]} mode="horizontal">
        <Menu.Item key="1" style={{ color: '#000000', fontSize: '16px'  }}>
          分组监控
        </Menu.Item>
        <Menu.Item key="2" style={{ color: '#000000', fontSize: '16px'  }}>
          流表配置监控
        </Menu.Item>
        <Menu.Item key="3" disabled={ engineConsoleUrl === '' }>
          <a href={ engineConsoleUrl } target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '16px'  }}>
            引擎控制台
          </a>
        </Menu.Item>
        <Menu.Item key="4" disabled={ cdhUrl === '' }>
          <a href={ cdhUrl } target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '16px'  }}>
            CDH
          </a>
        </Menu.Item>
        <Menu.Item key="5" disabled={ yarnUrl === '' }>
          <a href={ yarnUrl } target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '16px'  }}>
            YARN
          </a>
        </Menu.Item>
        <Menu.Item key="6" disabled={ sparkUrl === '' }>
          <a href={ sparkUrl } target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontSize: '16px'  }}>
            SPARK
          </a>
        </Menu.Item>
      </Menu>
      {
        key === '1' ? (
          <DisPatchIndex />
        ) : ''
      }
      {
        key === '2' ? (
          <DistributeStreamTableConfig />
        ) : ''
      }
      </Fragment>
    );
  }
}

export default MotMonitoring;
