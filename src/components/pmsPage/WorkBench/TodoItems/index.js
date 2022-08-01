import {Collapse, Row, Col, Calendar, Select, Radio, Table, Badge, Tooltip} from 'antd';
import React from 'react';
import BridgeModel from "../../../Common/BasicModal/BridgeModel";

const {Panel} = Collapse;
const {Group, Button} = Radio;

class TodoItems extends React.Component {
  state = {
    //立项流程发起弹窗
    sendVisible: false,
    //立项流程发起url
    sendUrl: '',
    //信息录入
    fillOutVisible: false,
    //信息录入url
    fillOutUrl: '',
  };

  componentDidMount() {
  }

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  }

  handleUrl = (text) => {
    switch (text) {
      case "周报填写":
        window.location.href = `/#/UIProcessor?Table=ZBTX&hideTitlebar=true`;
        break;
      case "合同信息录入":
        this.handleFillOut(text);
        break;
      case "合同签署流程发起":
        this.handleSend(text);
        break;
      case "立项申请流程发起":
        this.handleSend(text);
        break;
    }
  }

  dateCellRender = (value) => {
    const listData = this.getListData(value);
    return (
      <ul style={{margin: '0.1rem', paddingLeft: '1rem'}}>
        {listData.map(item => (
          <li key={item.content}>
            <Tooltip title={item.content}><Badge status={item.type}/></Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  getListData = (value) => {
    let listData;
    //可以获取月份
    console.log("monthmonth22", value.month())

    if (value.month() === new Date().getMonth()) {
      switch (value.date()) {
        case 8:
          listData = [
            {type: 'warning', content: '周报填写'},
          ];
          break;
        case 10:
          listData = [
            {type: 'warning', content: '合同信息录入'},
          ];
          break;
        case 15:
          listData = [
            {type: 'warning', content: '合同签署流程发起'},
          ];
          break;
        default:
      }
    }
    return listData || [];
  };

  handleSend = (name) => {
    let sendUrl = "";
    switch (name) {
      case "合同签署流程发起":
        sendUrl = "/OperateProcessor?operate=TLC_LCFQ_HTLYY&Table=TLC_LCFQ";
        break;
      case "立项申请流程发起":
        sendUrl = "/OperateProcessor?operate=TLC_LCFQ_LXSQLCFQ&Table=TLC_LCFQ";
        break;
    }
    this.setState({
      sendUrl: sendUrl,
    });
    this.setState({
      sendVisible: true,
    });
  };

  handleFillOut = (name) => {
    let fillOutUrl = "";
    switch (name) {
      case "合同信息录入":
        fillOutUrl = "/OperateProcessor?operate=TXMXX_XMXX_ADDCONTRACTAINFO&Table=TXMXX_XMXX";
        break;
    }
    this.setState({
      fillOutUrl: fillOutUrl,
    });
    this.setState({
      fillOutVisible: true,
    });
  };

  closeSendModal = () => {
    this.setState({
      sendVisible: false,
    });
  };

  closeFillOutModal = () => {
    this.setState({
      fillOutVisible: false,
    });
  };

  render() {
    const columns = [
      {
        title: '时间',
        dataIndex: 'sj',
        key: 'sj',
      },
      {
        title: '待办事项',
        dataIndex: 'dbsx',
        key: 'dbsx',
        render: text => (
          <Tooltip title={text}><a onClick={() => this.handleUrl(text)}>{text.slice(0, 8)}</a></Tooltip>
        ),
      },
      {
        title: '详情内容',
        dataIndex: 'xqnr',
        key: 'xqnr',
        render: text => (
          <Tooltip title={text}>{text.length > 8 ? text.slice(0, 8) + '...' : text}</Tooltip>
        ),
      },
      {
        title: '相关项目',
        dataIndex: 'xgxm',
        key: 'xgxm',
        render: text => <Tooltip title={text}><a>{text?.slice(0, 8)}</a></Tooltip>,
      },
    ];

    const data = [
      {
        key: '1',
        sj: '2022-04-15',
        dbsx: '周报填写',
        xqnr: '本周周报未填写',
        xgxm: '项目信息管理系统',
      },
      {
        key: '2',
        sj: '2022-04-15',
        dbsx: '合同信息录入',
        xqnr: '上传文档',
        xgxm: '项目信息管理系统',
      },
      {
        key: '3',
        sj: '2022-04-15',
        dbsx: '合同签署流程发起',
        xqnr: '项目信息管理系统合同签署流程发起',
        xgxm: '项目信息管理系统',
      },
      {
        key: '4',
        sj: '2022-04-15',
        dbsx: '立项申请流程发起',
        xqnr: '项目信息管理系统立项申请流程发起',
        xgxm: '项目信息管理系统',
      },
    ];
    const {sendVisible, sendUrl, fillOutVisible, fillOutUrl} = this.state;
    const sendModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '发起流程',
      style: {top: '30rem'},
      visible: sendVisible,
      footer: null,
    };
    const fillOutModalProps = {
      isAllWindow: 1,
      // defaultFullScreen: true,
      width: '100rem',
      height: '58rem',
      title: '信息录入',
      style: {top: '30rem'},
      visible: fillOutVisible,
      footer: null,
    };
    const src_send = localStorage.getItem('livebos') + sendUrl;
    const src_fillOut = localStorage.getItem('livebos') + fillOutUrl;
    return (
      <Row style={{height: '90%', margin: '3rem'}}>
        <Col span={6} style={{height: '100%',}}>
          <div style={{border: '1px solid #d9d9d9', borderRadius: 4, height: '100%',}}>
            <Calendar
              // monthCellRender={this.monthCellRender}
              dateCellRender={this.dateCellRender}
              fullscreen={false}
              headerRender={({value, type, onChange, onTypeChange}) => {
                const start = 0;
                const end = 12;
                const monthOptions = [];

                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  current.month(i);
                  months.push(localeData.monthsShort(current));
                }

                for (let index = start; index < end; index++) {
                  monthOptions.push(
                    <Select.Option className="month-item" key={`${index}`}>
                      {months[index]}
                    </Select.Option>,
                  );
                }
                const month = value.month();

                const year = value.year();
                const options = [];
                for (let i = year - 10; i < year + 10; i += 1) {
                  options.push(
                    <Select.Option key={i} value={i} className="year-item">
                      {i}
                    </Select.Option>,
                  );
                }
                return (
                  <div style={{padding: 10}}>
                    <Row type="flex" justify="space-between">
                      <Col>
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          className="my-year-select"
                          onChange={newYear => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                          value={String(year)}
                        >
                          {options}
                        </Select>
                        &nbsp;
                        <Select
                          size="small"
                          dropdownMatchSelectWidth={false}
                          value={String(month)}
                          onChange={selectedMonth => {
                            const newValue = value.clone();
                            newValue.month(parseInt(selectedMonth, 10));
                            onChange(newValue);
                          }}
                        >
                          {monthOptions}
                        </Select>
                      </Col>
                    </Row>
                  </div>
                );
              }}
              onPanelChange={this.onPanelChange}
            />
          </div>
        </Col>
        <Col span={18} style={{height: '100%', padding: '0 2rem'}}>
          {/*立项流程发起弹窗*/}
          {sendVisible &&
          <BridgeModel modalProps={sendModalProps} onSucess={this.onSuccess} onCancel={this.closeSendModal}
                       src={src_send}/>}
          {/*信息录入弹窗*/}
          {fillOutVisible &&
          <BridgeModel modalProps={fillOutModalProps} onSucess={this.onSuccess} onCancel={this.closeFillOutModal}
                       src={src_fillOut}/>}
          <Table bordered columns={columns} dataSource={data} style={{height: '100%'}}/>
        </Col>
      </Row>
    );
  }
}

export default TodoItems;
