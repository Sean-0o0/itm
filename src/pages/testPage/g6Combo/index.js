import React, { Component } from 'react';
import { Card, Row, Col } from 'antd';
import ComponentList from './ComponentList';
import Canvas from './Canvas';
import Edit from './Details/Edit';

class G6Combo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: '', // 画布模式
      component: '', // 左侧选中的组件
      model: '', // 选择的节点信息
    };
  }

  handleAddComponent = (checked, type) => {
    if (checked) {
      this.setState({
        component: type,
      });
      if (type === 'addEdge') { // 如果是连线
        this.Canvas.beginAddEdge();
        return false;
      }
      if (type === 'delete') { // 如果是删除
        this.Canvas.beginDelete();
        return false;
      }
      if (type === 'addCombo') { // 添加群
        this.Canvas.beginAddCombo();
        return false;
      }
      this.Canvas.addNode(type);
    } else {
      this.setState({
        component: 0,
      });
      this.Canvas.beginEdit();
    }
  }

  handleFormChange = () => {
    setTimeout(() => {
      this.Form.handleSubmit();
    }, 50);
  }

  /**
  * node选择改变的时候
  * @param model 选择的节点/群组的数据
  */
  handleChangeNode = (model) => {
    this.setState({
      model,
    });
  }

  // 点击确认改变nodelabel
  handleChangeParameter = (teamArr, model) => {
    if (Array.isArray(teamArr)) { // 群组修改模式
      this.Canvas.updateNodeLabel(model);
      teamArr.forEach((item) => {
        this.Canvas.updateNodeLabel(item);
      });
    } else {
      this.Canvas.updateNodeLabel(teamArr);
    }
  }

  // 切换为添加节点的mode时 默认切换为选择用户分组组件
  handleChangeComponent = (key) => {
    this.setState({
      component: key,
    });
  }

  // 改变模式 切换模式后要清空model
  changeMode = (mode) => {
    this.setState({
      mode,
      model: '',
    });
  }

  handleSaveData = () => {
    this.Canvas.handleSave();
  }

  render() {
    const { component = '', mode, model } = this.state;
    return (
      <React.Fragment>
        <Card>
          {/* 组件库区域 */}
          <Row gutter={2}>
            <Col span={1}>
              <ComponentList value={component} handleAddComponent={this.handleAddComponent} />
            </Col>
            {/* 画布区域 */}
            <Col span={19} style={{ backgroundColor: '#e8e7e7a6' }}>
              <Canvas ref={(node) => { this.Canvas = node; }} handleChangeNode={this.handleChangeNode} handleChangeComponent={this.handleChangeComponent} changeMode={this.changeMode} />
            </Col>
            {/* 详情展示/属性设置区域 */}
            <Col span={4}>
              { mode === 'default' ? <Edit wrappedComponentRef={(form) => this.Form = form} model={model} mode={mode} handleFormChange={this.handleFormChange} handleChangeParameter={this.handleChangeParameter} handleAddGroup={this.handleAddGroup} /> : null}
            </Col>
          </Row>
        </Card>
      </React.Fragment>
    );
  }
}
export default G6Combo;
