import React from 'react';
import { Tag, Popover, Row, Icon } from 'antd';

const { CheckableTag } = Tag;
const tomcat = require('../Canvas/Icon/tomcat.png');
const nginx = require('../Canvas/Icon/nginx.png');
const redis = require('../Canvas/Icon/redis.png');
const zookeeper = require('../Canvas/Icon/zookeeper.png');
const combo = require('../Canvas/Icon/combo.jpg');

const imgObj = {
  tomcat,
  nginx,
  redis,
  zookeeper,
  combo
};

class ComponentList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  handleAddComponent = (checked, value) => {
    this.props.handleAddComponent && this.props.handleAddComponent(checked, value);
  }
  render() {
    const radioStyle = {
      display: 'block',
      height: '40px',
      lineHeight: '40px',
      borderRadius: 0,
      border: 0,
      textAlign: 'center',
      marginTop: '1rem',
    };
    const { value = '' } = this.props;
    return (
      <Row style={{ backgroundColor: 'white', padding: '1rem' }}>
        <CheckableTag checked={value === 'tomcat'} style={radioStyle} onChange={(e) => { this.handleAddComponent(e, 'tomcat'); }} value="tomcat">
          <Popover placement="right" content="Tomcat" trigger="hover">
            <img src={imgObj['tomcat']} alt="" />
          </Popover>
        </CheckableTag>
        <CheckableTag checked={value === 'nginx'} style={radioStyle} onChange={(e) => { this.handleAddComponent(e, 'nginx'); }} value="nginx">
          <Popover placement="right" content="Nginx" trigger="hover">
            <img src={imgObj['nginx']} alt="" />
          </Popover>
        </CheckableTag>
        <CheckableTag checked={value === 'redis'} style={radioStyle} onChange={(e) => { this.handleAddComponent(e, 'redis'); }} value="redis">
          <Popover placement="right" content="Redis" trigger="hover">
            <img src={imgObj['redis']} alt="" />
          </Popover>
        </CheckableTag>
        <CheckableTag checked={value === 'addCombo'} style={radioStyle} onChange={(e) => { this.handleAddComponent(e, 'addCombo'); }} value="addCombo">
          <Popover placement="right" content="添加群" trigger="hover">
            <img src={imgObj['combo']} alt="" />
          </Popover>
        </CheckableTag>
        <CheckableTag checked={value === 'addEdge'} style={radioStyle} onChange={(e) => { this.handleAddComponent(e, 'addEdge'); }} value="addEdge">
          <Popover placement="right" content="连线" trigger="hover">
            <i className="iconfont icon-lianxian" style={{ color: '#2da9e4', fontSize: '18px' }} />
          </Popover>
        </CheckableTag>
        <CheckableTag checked={value === 'delete'} style={radioStyle} onChange={(e) => { this.handleAddComponent(e, 'delete'); }} value="delete">
          <Popover placement="right" content="删除" trigger="hover">
            <Icon type="delete" theme="filled" style={{ color: '#2da9e4', fontSize: '18px' }} />
          </Popover>
        </CheckableTag>
      </Row>
    );
  }
}

export default ComponentList;

