/* eslint-disable react/no-unused-state */
import React, { Fragment } from 'react';
import { Row, Col, Button, Form, Table, Card, Tree, Input, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import FCTR from './FCTR';

/**
 * 考评人员结构配置
 */

class EventCalcRuleData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      mouseKey: '',
    };
  }
  componentDidMount() {
    // this.fetchData(this.props.data);
  }
  componentWillReceiveProps() {
    // if (nextProps.data !== this.props.data) {
    //   this.fetchData(nextProps.data);
    // }

  }
  // fetchData = (data) => {
  //   // let clickKey = '';
  //   // if (data.length !== 0) {
  //   //   clickKey = data[0].COND_NO;
  //   // }
  //   this.setState({ clickKey: 0 });
  // }
  onSelect = (selectedKeys, e) => {
    const { setCalcRuleData } = this.props;
    if (e.node.props.children.length === 0) {
      const foctorId = e.node.props.id;
      if (setCalcRuleData) {
        setCalcRuleData(foctorId);
      }
    }
  }
  onRow = (row, index) => {
    const { clickKey } = this.props;
    const { mouseKey } = this.state;
    return {
      onClick: () => {
        if (clickKey !== index) {
          this.props.setData('clickKey', index);
        }
      },
      onMouseEnter: () => {
        if (mouseKey !== index) {
          this.setState({ mouseKey: index });
        }
        if (clickKey === '') {
          this.props.setData('clickKey', index);
        }
      },
      // onMouseLeave: event => {
      //   this.setState({ mouseKey: '' });
      // }
    };
  }
  onChangeInput = (value, indexFCTR, index) => {
    const { onChangeInput } = this.props;
    if (onChangeInput) {
      onChangeInput(value, indexFCTR, index);
    }
  }
  onChangeSelect = (value, indexFCTR, index) => {
    const { onChangeSelect } = this.props;
    if (onChangeSelect) {
      onChangeSelect(value, indexFCTR, index);
    }
  }
  // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;
    this.props.handleOnkeyWordFactor('', keyWord);
  }
  // 行样式处理
  rowClassNameFunc = (record, index) => {
    const { clickKey, type } = this.props;
    if (!type) {
      return index === clickKey ? 'findedss' : '';
    }
  }
  fetchColums = () => {
    const { type, clickKey } = this.props;
    const { mouseKey } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'COND_NO',
        key: 'COND_NO',
        align: 'center',
        width: '20%',
        className: 'mot-event-calcRule-xuhao-colunm',
        render: (text) => {
          return (
            <div className="mot-event-calcRule-xuhao">
              {type ? '' : clickKey !== '' && mouseKey !== '' && (mouseKey + 1).toString() === text ? (
                <div className={clickKey === mouseKey ? 'mot-event-calcRule-xuhao-icon sel' : 'mot-event-calcRule-xuhao-icon'}>
                  <Icon type="close" onClick={() => this.props.onCalcRuleDelect('', mouseKey)} />
                </div>
              ) : ''}
              <span style={{ color: '#333333', marginLeft: type || clickKey === '' || mouseKey === '' || (mouseKey + 1).toString() !== text ? '60px' : '' }}>{text}</span>
            </div>
          );
        },
      },
      {
        title: '计算因子',
        dataIndex: 'FCTR',
        key: 'FCTR',
        align: 'center',
        width: '40%',
        className: 'mot-event-calcRule-xuhao-colunm',
        render: (text) => {
          if (text !== '') {
            return (
              text.map((item, index) => (
                <div className="mot-event-calcRule" style={{ marginBottom: item.FCTR_VAR.length > 1 ? (item.FCTR_VAR.length - 1) * 52 : 0 }}>
                  {type ? '' : clickKey !== '' && mouseKey !== '' && (mouseKey + 1).toString() === item.COND_NO ? (
                    <div className={clickKey === mouseKey ? 'mot-event-calcRule-icon sel' : 'mot-event-calcRule-icon'}>
                      <Icon type="close" onClick={() => this.props.onCalcRuleDelect(index, mouseKey)} />
                    </div>
                  ) : ''}
                  <span style={{ color: '#333333', marginLeft: type || clickKey === '' || mouseKey === '' || (mouseKey + 1).toString() !== item.COND_NO ? '60px' : '', height: '32px' }}>{item.FCTR_NM}</span>
                  {<div className="mot-event-calcRule" />}
                </div>
              ))
            );
          }
        },
      },
      {
        title: '参数定义',
        dataIndex: 'FCTR',
        key: 'FCTR_VAR',
        textAlign: 'left',
        width: '40%',
        render: (text) => {
          if (text !== '') {
            return (
              text.map((Item, indexFCTR) =>
              (Item.FCTR_VAR.length > 0 ? Item.FCTR_VAR.map((item, index) =>
                <FCTR type={type} item={item} indexFCTR={indexFCTR} index={index} onChangeInput={this.onChangeInput} onChangeSelect={this.onChangeSelect} />) : <div className="mot-event-calcRule" style={{ paddingLeft: 0 }}>--</div>))
            );
          }
        },
      },
    ];
    return columns;
  }
  render() {
    const { type, treeData, data } = this.props;
    for (let i = 0; i < treeData.length; i++) {
      for (let j = 0; j < treeData[i].children.length; j++) {
        if (treeData[i].children[j].strtUseSt === '0') {
          treeData[i].children[j].disabled = true;
        }
      }
    }
    return (
      <Fragment>
        <Row>
          <Col xs={24} sm={17} md={17} lg={17}>
            <div className="factor-item">
              {
                type ? '' : (
                  <span><Button className="factor-bottom m-btn-table-headColor" onClick={this.props.onCalcRuleAdd} >新增并集条件</Button>
                    <Button className="factor-bottom m-btn-table-headColor-qk mot-cancel-btn" onClick={() => this.props.setData('calcRuleData', [])} >清空条件</Button>
                  </span>
                )}
            </div>
          </Col>
          <Col xs={24} sm={7} md={7} lg={7}>
            <div className="factor-item" style={{ margin: '1rem 2rem 0 1rem' }}>
              {
                type ? '' :
                  <Input.Search placeholder="搜索" onChange={this.handleOnkeyWord} className="mot-prod-search-input" />
              }
            </div>
          </Col>
          <div>
            <Col xs={24} sm={17} md={17} lg={17}>
              <div className="factor-item" >
                <Table
                  className="factor-table"
                  style={{ minWidth: '300px' }}
                  columns={this.fetchColums(data)}
                  dataSource={data}
                  pagination={false}
                  size="middle "
                  bordered={false}
                  onRow={type ? '' : this.onRow}
                  rowClassName={this.rowClassNameFunc}
                />
              </div>
            </Col>
            <Col xs={24} sm={7} md={7} lg={7}>
              <div className="factor-item" style={{ margin: '1rem 2rem 0 1rem' }}>
                <Card >
                  <Scrollbars autoHide style={{ width: '100%', height: '28.96rem' }} >
                    {treeData.length !== 0 ? (
                      <Tree
                        defaultExpandAll
                        onSelect={this.onSelect}
                        treeData={treeData}
                        className="factor-tree"
                        disabled={type}
                      />
                    ) : ''}
                  </Scrollbars>
                </Card >
              </div>
            </Col>
          </div>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(EventCalcRuleData);
