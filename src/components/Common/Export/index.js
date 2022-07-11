import React from 'react';
import { Modal, Button, Row, Col, Progress } from 'antd';

class Export extends React.Component {
  state = {
    modalVisible: false,
    percent: 0,
  }
  componentWillUnmount() {
    // 清空定时器,避免内存泄漏
    if (this.timers && this.timers.length > 0) {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
      });
      this.timers = null;
    }
    // 关闭EventSource,避免内存泄漏
    if (this.eventSources && this.eventSources.length > 0) {
      this.eventSources.forEach((eventSource) => {
        if (eventSource && eventSource.close) {
          eventSource.close();
        }
      });
      this.eventSources = null;
    }
  }
  // 生成uuid
  guid = () => {
    const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
    return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
  }
  showConfirm = () => {
    const {
      exportPercentUtl = '/api/customerAggs/v2/exportPercent', // 点击导出后系统处理进度信息
      isPercent = false,
    } = this.props;
    const { param, selectAll, selectedRowKeys = [], total = 0, url } = this.props;
    let selectedCount = 0;
    if (selectAll) {
      selectedCount = total - selectedRowKeys.length;
    } else {
      selectedCount = selectedRowKeys.length;
    }
    if (selectedCount <= 0) {
      Modal.info({ content: '暂无可导出数据!' });
      return;
    }
    let uuid = '';
    if (isPercent) {
      uuid = this.guid(); // 获取唯一识别码
    }
    const _this = this;
    Modal.confirm({
      title: '提示：',
      content: `是否导出选中${selectedCount}条数据？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        const exportPayload = JSON.stringify({
          ...param,
          uuid,
        });
        const formDom = document.createElement('form');
        formDom.id = 'form';
        formDom.name = 'form';
        // 添加到 body 中
        document.getElementById('m_iframe').appendChild(formDom);
        // 创建一个输入
        const input = document.createElement('input');
        // 设置相应参数
        input.type = 'text';
        input.name = 'exportPayload';
        input.value = exportPayload;
        // 将该输入框插入到 form 中
        formDom.appendChild(input);
        // form 的提交方式
        formDom.method = 'POST';
        // form 提交路径
        formDom.action = url;
        // 对该 form 执行提交
        formDom.submit();
        // 删除该 form
        document.getElementById('m_iframe').removeChild(formDom);
        if (selectedCount >= 10000 && typeof EventSource !== 'undefined' && uuid) {
          if (!_this.timers) {
            _this.timers = [];
          }
          // 浏览器支持 Server-Sent
          const timer1 = setTimeout(() => {
            _this.setState({ modalVisible: true, percent: 0 });
            const source = new EventSource(`${exportPercentUtl}?uuid=${uuid}`);
            let eventSourcesIndex = 0;
            // 成功与服务器发生连接时触发
            source.onopen = () => {
              if (!_this.eventSources) {
                _this.eventSources = [];
              }
              eventSourcesIndex = _this.eventSources.legnth;
              _this.eventSources.push(source);
            };
            source.onmessage = (event) => {
              const { data: percent = 0 } = event;
              if (percent === '100') {
                source.close();
                if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
                const timer2 = setTimeout(() => {
                  _this.setState({ modalVisible: false, percent: 0 });
                  if (_this.timers && _this.timers.length > 0) {
                    const index = _this.timers.findIndex(timer => timer === timer2);
                    if (index >= 0) {
                      _this.timers.splice(index, 1);
                    }
                  }
                }, 1000);
                _this.timers.push(timer2);
              }
              // handle message
              _this.setState({ percent });
            };
            source.onerror = () => {
              source.close();
              if (_this.eventSources && _this.eventSources.length > 0) _this.eventSources.splice(eventSourcesIndex, 1);
              const timer3 = setTimeout(() => {
                _this.setState({ modalVisible: false, percent: 0 });
                if (_this.timers && _this.timers.length > 0) {
                  const index = _this.timers.findIndex(timer => timer === timer3);
                  if (index >= 0) {
                    _this.timers.splice(index, 1);
                  }
                }
              }, 1000);
              _this.timers.push(timer3);
            };
          }, 500);
          _this.timers.push(timer1);
        } else {
          // 浏览器不支持 Server-Sent..
        }
      },
    });
  };
  render() {
    const { buttonTitle = '导出' } = this.props;
    const { modalVisible, percent } = this.state;
    return (
      <span>
        <Button className="fcbtn m-btn-border m-btn-border-headColor btn-1c" onClick={this.showConfirm}>{buttonTitle}</Button>
        <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
        <Modal
          title="系统处理中,请稍候..."
          centered
          destroyOnClose
          closable={false}
          maskClosable={false}
          visible={modalVisible}
          footer={null}
        >
          <Row>
            <Col span={2}>进度:</Col>
            <Col span={22}><Progress percent={parseInt(percent, 10)} status={percent === '100' ? 'success' : 'active'} /></Col>
          </Row>
        </Modal>
      </span>
    );
  }
}
export default Export;
