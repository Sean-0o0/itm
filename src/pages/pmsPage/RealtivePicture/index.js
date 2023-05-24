import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import testImg from '../../../assets/projectBuilding/ddxm.png'
class RealtivePicturePage extends Component {
  state = {
    zoom: 1
  }

  roamMap = (flag) => {
    // const echartsInstance = this.chart.getEchartsInstance();
    // const currentZoom = echartsInstance.getOption().series[0].zoom // 当前的缩放比例
    // console.log('currentZoom',currentZoom)
    const { zoom } = this.state
    let increaseAmplitude = 0.2 // 点击按钮每次 放大/缩小 比例
    if (flag === 1) {
      increaseAmplitude = -0.2
    }
    // echartsInstance.setOption({
    //   series: {
    //     zoom: currentZoom * increaseAmplitude
    //   }
    // })
    this.setState({
      zoom: (zoom+increaseAmplitude)>0.2&&(zoom+increaseAmplitude)<2?zoom+increaseAmplitude:zoom
    })
  }

  add = () => {
    this.roamMap(0)
  }

  sub = () => {
    this.roamMap(1)
  }

  render() {
    const { zoom } = this.state
    const data = [
      { xmmc: '企划平台迭代项目', ysmc: '战略企划管理平台迭代项目', rymc: '朱衎', gys: '供应商1' },
      { xmmc: '信息技术综合管理平台迭代', ysmc: '项目信息综合管理平台（迭代）', rymc: '朱衎', gys: '供应商2' },
      { xmmc: '项目管理部2023年产品人力外包', ysmc: '项目管理人力外包服务', rymc: '朱衎', gys: '供应商3' },
      { xmmc: '阿里信创专有云平台原厂支持服务及第三方驻场运维服务', ysmc: '信创阿里专有云维护费', rymc: '曾招光', gys: '供应商3' },
      { xmmc: '余杭数据中心IDC机房扩容', ysmc: '余杭数据中心IDC及办公场地租赁', rymc: '曾招光', gys: '供应商1' },
      { xmmc: '信创异构（华为）私有云测试平台', ysmc: '2023年云计算平台建设', rymc: '黄庆', gys: '供应商4' },
      { xmmc: '余杭VMware私有云扩容软件采购的立项申请', ysmc: '2023年云计算平台建设', rymc: '黄庆', gys: '供应商2' },
      { xmmc: '2023年VMware私有云TAM原厂服务', ysmc: '私有云VMWARE TAM原厂服务', rymc: '黄庆', gys: '供应商1' },
      { xmmc: '收益凭证业务数据报送文件接口规范项目', ysmc: '业务系统优化及需求改造', rymc: '陈南南', gys: '供应商2' },
      { xmmc: '明珠国际商务中心4、5幢十八楼综合布线工程', ysmc: '开发部新办公区综合布线项目', rymc: '陈欣', gys: '供应商1' },
    ]
    // let nodes = [];
    let nodeNm = [];
    let nodes = []
    let links = [];
    data.forEach(item => {
      const arr = Object.keys(item);
      arr.forEach(ele => {
        if (!nodeNm.includes(item[ele])) {
          nodeNm.push(item[ele])
          if (ele.includes('xm')) {
            nodes.push({
              name: item[ele],
              symbolSize: 30,
              category: 0,
            })
          } else if (ele.includes('ysmc')) {
            nodes.push({
              name: item[ele],
              category: 1,
              symbolSize: 20
            })
          } else if (ele.includes('ry')) {
            nodes.push({
              name: item[ele],
              category: 2,
              symbolSize: 20,
            })
          } else if (ele.includes('gys')) {
            nodes.push({
              name: item[ele],
              symbolSize: 20,
              category: 3,
            })
          }
        } else {
          const index = nodeNm.indexOf(item[ele]);
          nodes[index].symbolSize += 5;
          const xmIndex = nodeNm.indexOf(item.xmmc);
          nodes[xmIndex].symbolSize += 5;
          if (nodes[index].symbolSize > 30) {
            nodes[index].label = {
              show: true,
              position: "bottom",
              distance: 5,
              align: "center",
              color: '#333'
            }
          }
          if (nodes[xmIndex].symbolSize > 30) {
            nodes[xmIndex].label = {
              show: true,
              position: "bottom",
              distance: 5,
              align: "center",
              color: '#333'
            }
          }
        }

        let link = {}
        if (ele !== 'xmmc') {
          link.source = item.xmmc;
          link.target = item[ele];
          links.push(link)
        }
      })
    })

    console.log('links', links)
    console.log('nodes', nodes)

    const categories = [
      { name: '项目' },
      { name: '预算项目' },
      { name: '人员' },
      { name: '供应商' },
    ]

    const option = {
      legend: [{
        data: ['项目', '预算项目', '人员', '供应商'],
        bottom: 20,
        left: 20,
        icon: 'circle',
      }],
      tooltip: {
        backgroundColor: '#fff',
        formatter:(params)=>{
          console.log('params',params)
          const {data={}} = params
          return "<div style='color: #333'>"
          +"项目建设情况"
          +"<div style='margin-top: 100px;color: red'>"
          +"项目总数"
          +"<img src='"+testImg+"'/>"
          +"<div>"
          +"</div>"
        }
      },
      color: ['rgb(85, 121, 214)', 'rgb(254, 167, 87)', 'rgb(214, 216, 225)', 'rgb(213, 58, 53)'],
      series: [
        {
          type: 'graph',
          layout: 'force',
          nodes: nodes,
          links: links,
          categories: categories,
          zoom: zoom,
          label:{
            formatter:(params)=>{
              const { name } = params
              console.log('aaa',params)
              return name.slice(0,8)+ '\n'+name.slice(8,18)+'...'
            }
          },
          force: { //力引导图基本配置
            repulsion: 200, //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
            gravity: 0.02, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
            edgeLength: 80, //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
            layoutAnimation: true
            //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
          },
        },
      ],
    }

    return (<div className='realtive-page' style={{ height: '100%' }}>
      <ReactEchartsCore
        ref={(e) => { this.chart = e; }}
        echarts={echarts}
        style={{ height: '100%', width: '100%' }}
        option={option}
        notMerge
        lazyUpdate
      />
      <div className='pobtm'>
        <div className='btn-back add' onClick={this.add}>+</div>
        <div className='btn-back sub' onClick={this.sub}>-</div>
        <div className='btn-back'>{(zoom*100).toFixed(0)+'%'}</div>
      </div >
    </div >);
  }
}

export default RealtivePicturePage;