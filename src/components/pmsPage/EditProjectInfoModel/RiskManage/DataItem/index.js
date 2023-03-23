import React, {Component} from 'react'
import {Form, Input, Row, Col} from 'antd';

const {TextArea} = Input;

class DataItem extends Component {
  state = {
    item: {}
  }

  componentDidMount() {
    this.setState({
      item: this.props.data || {}
    })
    this.props.onRef(this)
  }

  componentWillReceiveProps(nextprops) {
    const {data = {}} = nextprops;
    const {data: oldData = {}} = this.props;
    if (JSON.stringify(data) !== JSON.stringify(oldData)) {
      this.setState({
        item: data
      })
    }
  }

  removeRisk = () => {
    const {removeRisk, order} = this.props;
    if (removeRisk) {
      removeRisk(order)
    }
  }

  changeTitle = (e) => {
    this.setState({
      item: {
        ...this.state.item,
        title: e.target.value
      }
    })
  }

  changeCont = (e) => {
    this.setState({
      item: {
        ...this.state.item,
        nr: e.target.value
      }
    })
  }

  changeDecs = (e) => {
    this.setState({
      item: {
        ...this.state.item,
        cl: e.target.value
      }
    })
  }

  render() {
    const {data = {}, order = 0, total = 1} = this.props;
    const {
      title = '',
      nr = '',
      cl = ''
    } = data

    return (
      <div className='data-body'>
        <div className='data-header'>
          <div className='flex1 data-title'>风险{order + 1}</div>
          <a className="data-add iconfont delete"
             style={{fontSize: '2.5rem', color: 'rgb(51, 97, 255)', marginLeft: '2rem'}}
             onClick={this.removeRisk}>&nbsp;删除</a>
        </div>
        <div className='data-cont' style={{borderBottom: order === total - 1 ? 'unset' : '1px solid #DBDFE6'}}>
          <Row gutter={24} style={{margin: '0 0 2rem'}}>
            <Col span={5} className='label'><span className='require'>*</span>风险标题:</Col>
            <Col span={19}><Input key={title} defaultValue={title} placeholder="请输入" onChange={this.changeTitle}/></Col>
          </Row>
          <Row gutter={24} style={{margin: '0 0 2rem'}}>
            <Col span={5} className='label'><span className='require'>*</span>风险内容:</Col>
            <Col span={19}><TextArea key={nr} defaultValue={nr} placeholder="请输入" rows={2} onChange={this.changeCont}/></Col>
          </Row>
          <Row gutter={24} style={{margin: '0 0 2rem'}}>
            <Col span={5} className='label'>处理内容:</Col>
            <Col span={19}><TextArea key={cl} defaultValue={cl} placeholder="请输入" rows={2} onChange={this.changeDecs}/></Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create()(DataItem);
