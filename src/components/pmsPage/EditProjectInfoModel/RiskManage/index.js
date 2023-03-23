import React, {Component} from 'react'
import DataItem from './DataItem'
import {Button} from 'antd'

class RiskManage extends Component {
  state = {
    data: []
  }

  componentDidMount() {
    const {type = 1} = this.props
    let data = [
      {
        title: '风险1',
        nr: '输入产品名称/产品代码',
        cl: '这是一段处理内容文本，这是一段处理内容文本，这是一段处理内容文本'
      }
    ]
    if (type === 1) {
      data = [...data, {}]
    }
    this.setState({
      data: data
    }, () => {
      this.scrollToBottom();
    })
  }

  scrollToBottom() {
    if (this.messagesEnd) {
      const scrollHeight = this.messagesEnd.scrollHeight;//里面div的实际高度  2000px
      const height = this.messagesEnd.clientHeight;  //网页可见高度  200px
      const maxScrollTop = scrollHeight - height;
      this.messagesEnd.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
      //如果实际高度大于可见高度，说明是有滚动条的，则直接把网页被卷去的高度设置为两个div的高度差，实际效果就是滚动到底部了。
    }

  }

  addRisk = () => {
    this.setState({
      data: [...this.state.data, {}]
    })
  }

  removeRisk = (order) => {
    const {data = []} = this.state;
    data.forEach((item, index) => {
      data[index] = this['child' + index].state.item || {}
    })
    data.splice(order, 1)
    this.setState({
      data: data
    })
  }

  onRef = (ref, index) => {
    this['child' + index] = ref
  }

  render() {
    const {data = []} = this.state
    const {onClose} = this.props


    return (<div className='risk-body'>
      <div className='risk-header'>
        <div className='risk-title flex1'>风险信息</div>
        <a className="risk-add iconfont circle-add"
           style={{fontSize: '2.5rem', color: 'rgb(51, 97, 255)', marginLeft: '2rem'}}
           onClick={this.addRisk}>&nbsp;新增</a>
      </div>
      <div className='risk-cont' ref={(el) => {
        this.messagesEnd = el;
      }}>
        {data.map((item, index) => {
          return (
            <DataItem onRef={(ref) => this.onRef(ref, index)} removeRisk={this.removeRisk} data={item} key={index}
                      order={index} total={data.length}/>
          )
        })
        }
      </div>
      <div className='risk-footer'>
        <Button onClick={() => {
          onClose()
        }}>取消</Button>
        <Button style={{background: 'rgb(51, 97, 255)', color: '#fff'}}>保存</Button>
      </div>
    </div>);
  }
}

export default RiskManage;

