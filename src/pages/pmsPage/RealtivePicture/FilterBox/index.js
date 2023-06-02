import React, { Component } from 'react'
import { Input } from 'antd'
import debounce from 'lodash.debounce';

class FilterBox extends Component {
  constructor(props){
    super(props);
    // this.handleChange = debounce(this.handleChange, 800);
    this.state = {
      options: [],
      value: ''
    }
  }

  handleChange = (e) => {
    const value = e.target.value;
    const { dataSource = [] } = this.props;
    let options = []
    let nodeNm = []
    dataSource.forEach(item => {
      if (item.RYMC.includes(value)) {
        const rys = item.RYMC.split(',');
        rys.forEach(ele => {
          if (ele.includes(value)) {
            if (!nodeNm.includes(ele)) {
              nodeNm.push(ele)
              options.push({
                category: 2,
                categoryName: '人员',
                name: ele
              })
            }
          }
        })
      }
      if (item.XMMC.includes(value)) {
        if (!nodeNm.includes(item.XMMC)) {
          nodeNm.push(item.XMMC)
          options.push({
            category: 0,
            categoryName: '项目',
            name: item.XMMC
          })
        }
      }
      if (item.YSMC.includes(value)) {
        if (!nodeNm.includes(item.YSMC)) {
          nodeNm.push(item.YSMC)
          options.push({
            category: 1,
            categoryName: '预算项目',
            name: item.YSMC
          })
        }
      }
      if (item.GYS.includes(value)) {
        if (!nodeNm.includes(item.GYS)) {
          nodeNm.push(item.GYS)
          options.push({
            category: 3,
            categoryName: '供应商',
            name: item.GYS
          })
        }
      }
    })
    this.setState({
      value: value,
      options: options
    })
  }

  onSelect = (item={}) =>{
    const {categoryName, name} = item
    this.setState({
      value: name,
      options: []
    },()=>{
      this.props.onSelect(item)
    })
    
  }

  render() {
    const { options = [], value } = this.state;
    return (<div className='pobtop'>
      <i className="iconfont icon-search-name icon-personal" />
      <Input type="text" value={value} onChange={this.handleChange} placeholder='请输入项目/供应商/人员' />
      <div className='downer-box' style={{display: options.length?'block': 'none'}}>
        {options.map((item,index)=>{
          const { categoryName, name} = item;
          return <div className='downer-item' key={index} onClick={()=>this.onSelect(item)}>
          <div className='category'>{categoryName}</div>
          <div className='item-data'><div className='icon-first'>{name.slice(0,1)}</div>{name}</div>
        </div>
        })}
      </div>
    </div >);
  }
}

export default FilterBox;