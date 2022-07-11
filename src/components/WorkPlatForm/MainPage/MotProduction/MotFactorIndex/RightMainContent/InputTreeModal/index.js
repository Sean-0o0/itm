/* eslint-disable no-return-assign */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/no-did-mount-set-state */
import React, { Fragment } from 'react';
import { Row, Col, Button, Form, Input, Card, Tree } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

/**
 * 考评人员结构配置
 */

class InputTreeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      expandedKeys: [],
    };
  }
  componentDidMount() {
    this.setState({ data: this.props.data });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      const { treeData } = nextProps;
      let expandedKeys = [];
      treeData.forEach(itme => {
        expandedKeys.push(itme.key + "")
      });
      this.setState({
        data: nextProps.data,
        expandedKeys,
      });
    } else {
      const { treeData } = nextProps;
      let expandedKeys = [];
      treeData.forEach(itme => {
        expandedKeys.push(itme.key + "")
      });
      this.setState({
        expandedKeys,
      });
    }
    if (nextProps.inputTreeType === true) {
      this.setPositionForTextArea(nextProps.position, nextProps.inputTreeLength);
    }
  }
  onClick = (index) => {
    const props = this.contentProp.textAreaRef; // 获取dom节点实例
    const position = this.getPositionForTextArea(props); // 光标的位置
    const { bqData, setData } = this.props;
    const { data } = this.state;
    const str = `\${${bqData[index].bqmc}}`;
    let newData = data;
    if (position.start === position.end) {
      newData = newData.slice(0, position.start) + str + newData.slice(position.start);
    } else {
      newData = newData.slice(0, position.start) + str + newData.slice(position.end);
    }
    if (setData) {
      setData('inputTreeData', newData);
      setData('inputTreeType', true);
      setData('inputTreeLength', str.length);
      setData('position', position);
    }
  }
  onSelect = (selectedKeys, e) => {
    const { setInputTreeData } = this.props;
    const props = this.contentProp.textAreaRef; // 获取dom节点实例
    const position = this.getPositionForTextArea(props); // 光标的位置
    if (e.node.props.children.length === 0) {
      const str = e.node.props.title.split('(')[0];
      if (setInputTreeData) {
        setInputTreeData(str, position);
      }
      this.setState({ position });
    }
  }
  onChange = (e) => {
    const { setData } = this.props;
    setData('inputTreeData', e.target.value);
  }
  getPositionForTextArea = (ctrl) => {
    // 获取光标位置
    const CaretPos = {
      start: 0,
      end: 0,
    };
    if (ctrl?.selectionStart) { // Firefox support
      CaretPos.start = ctrl.selectionStart;
    }
    if (ctrl?.selectionEnd) {
      CaretPos.end = ctrl.selectionEnd;
    }
    return (CaretPos);
  };
  setPositionForTextArea = (position, inputTreeLength) => {
    const props = this.contentProp.textAreaRef; // 获取dom节点实例
    setTimeout(() => {
      this.setCursorPosition(props, position.start + inputTreeLength);
    }, 20);
    this.props.setData('inputTreeType', false);
  };
  setCursorPosition = (ctrl, pos) => {
    if (ctrl) {
      ctrl.focus();
    }
    if (pos) {
      ctrl.setSelectionRange(pos, pos);
    }
  };
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
    });
  }
  render() {
    const { data, expandedKeys } = this.state;
    const { type, bqData, treeData, xskz } = this.props;
    let sql = data;
    for (const bq of bqData) {
      const re = new RegExp(`\\\${${bq.bqdm}}`, 'g');
      sql = sql.replace(re, `\${${bq.bqmc}}`);
    }
   
    return (
      <Fragment>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="factor-item">
              {
                bqData.map((item) => {
                  return <Button className={type ? '' : 'factor-bottom m-btn-table-headColor'}
                    style={{ marginRight: type ? '1.5rem' : '' }} onClick={() => this.onClick(item.index)}
                    disabled={type} >{item.bqmc}</Button>;
                })
              }
            </div>
          </Col>
          <div>
            <Col xs={24} sm={17} md={17} lg={17}>
              <div className="factor-item" >
                <Input.TextArea className="mot-input" ref={input => this.contentProp = input} autosize={{ minRows: 12, maxRows: 14 }} value={sql} disabled={type} onChange={this.onChange} />
              </div>
            </Col>
            {xskz ? '' : (
              <Col xs={24} sm={7} md={7} lg={7}>
                <div className="factor-item" style={{ margin: '1rem 2rem 0 1rem' }}>
                  <Card>
                    <Scrollbars autoHide style={{ width: '100%', height: '21.3rem' }} >
                      {treeData.length !== 0 ? (
                        <Tree
                          onSelect={this.onSelect}
                          treeData={treeData}
                          className="factor-tree"
                          disabled={type}
                          expandedKeys={expandedKeys}
                          onExpand={this.onExpand}
                        />
                      ) : ''}
                    </Scrollbars>
                  </Card >
                </div>
              </Col>
            )}
          </div>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(InputTreeModal);
