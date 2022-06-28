import React from 'react';
import { Row, Card, Col } from 'antd';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import 'echarts/lib/component/tooltip';
import 'echarts-liquidfill/src/liquidFill.js';  // eslint-disable-line

class CustomerNorm extends React.Component {
  // 当年收入贡献
  Dnsr = () => {
    const progressBarOption = {
      color: ['#e5e8eb'],
      grid: {   // 直角坐标系内绘图网格
        left: '11%',  //grid 组件离容器左侧的距离,
                     //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
        top: '20',
        right: '10  %',
        bottom: '0',
        containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
        // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
        //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
      },
      xAxis: {  //直角坐标系grid中的x轴,
                //一般情况下单个grid组件最多只能放上下两个x轴,
                //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
        type: 'value',//坐标轴类型,分别有：
                      //'value'-数值轴；'category'-类目轴;
                      //'time'-时间轴;'log'-对数轴
        splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
        axisLabel: {show: false},//坐标轴刻度标签
        axisTick: {show: false},//坐标轴刻度
        axisLine: {show: false},//坐标轴轴线
      },
      yAxis: {
        type: 'category',
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false},
        data: ['当年收入贡献(元)']//类目数据，在类目轴（type: 'category'）中有效。
              //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
      },
      series: [//系列列表。每个系列通过 type 决定自己的图表类型
        {
          name: '',//系列名称
          type: 'bar',//柱状、条形图
          barWidth: 10,//柱条的宽度,默认自适应
          data: [{value:80,itemStyle:{normal:{color:'rgb(255, 80, 80)'}}}],//系列中数据内容数组
          label: { //图形上的文本标签
            show: true,
            position: 'top',//标签的位置
            offset: [0,-5],  //标签文字的偏移，此处表示向上偏移40
            formatter: '{b}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
            color: 'black',//标签字体颜色
            fontSize: 18  //标签字号
          },
          itemStyle: {//图形样式
            normal: {  //normal 图形在默认状态下的样式;
            },
            color: {
              color:'red'
            },
          },
          zlevel:1//柱状图所有图形的 zlevel 值,
                  //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
        },
        {
          name: '进度条背景',
          type: 'bar',
          barGap: '-100%',//不同系列的柱间距离，为百分比。
          // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
          // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
           //并且是对此坐标系中所有 'bar' 系列生效。
          barWidth: 10,
          data: [100],
          itemStyle: {normal: {color: '#ccc'}},
        }
      ],
    };
    return progressBarOption;
  }
  // 当年客户收入贡献比
  Dnkhsr = () => {
    const progressBarOption = {
      color: ['#e5e8eb'],
      grid: {   // 直角坐标系内绘图网格
        left: '11%',  //grid 组件离容器左侧的距离,
                     //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
        top: '20',
        right: '10%',
        bottom: '0',
        containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
        // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
        //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
      },
      xAxis: {  //直角坐标系grid中的x轴,
                //一般情况下单个grid组件最多只能放上下两个x轴,
                //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
        type: 'value',//坐标轴类型,分别有：
                      //'value'-数值轴；'category'-类目轴;
                      //'time'-时间轴;'log'-对数轴
        splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
        axisLabel: {show: false},//坐标轴刻度标签
        axisTick: {show: false},//坐标轴刻度
        axisLine: {show: false},//坐标轴轴线
      },
      yAxis: {
        type: 'category',
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false},
        data: ['当年客户收入贡献比']//类目数据，在类目轴（type: 'category'）中有效。
              //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
      },
      series: [//系列列表。每个系列通过 type 决定自己的图表类型
        {
          name: '',//系列名称
          type: 'bar',//柱状、条形图
          barWidth: 10,//柱条的宽度,默认自适应
          data: [{value:64,itemStyle:{normal:{color:'rgb(78, 196, 247)'}}}],//系列中数据内容数组
          label: { //图形上的文本标签
            show: true,
            position: 'top',//标签的位置
            offset: [0,-5],  //标签文字的偏移，此处表示向上偏移40
            formatter: '{b}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
            color: 'black',//标签字体颜色
            fontSize: 18  //标签字号
          },
          itemStyle: {//图形样式
            normal: {  //normal 图形在默认状态下的样式;
            },
            color: {
              color:'red'
            },
          },
          zlevel:1//柱状图所有图形的 zlevel 值,
                  //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
        },
        {
          name: '进度条背景',
          type: 'bar',
          barGap: '-100%',//不同系列的柱间距离，为百分比。
          // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
          // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
           //并且是对此坐标系中所有 'bar' 系列生效。
          barWidth: 10,
          data: [100],
          itemStyle: {normal: {color: '#ccc'}},
        }
      ],
    };
    return progressBarOption;
  }
  // 当年新增托管资产
  Dnxztg = () => {
    const progressBarOption = {
      color: ['#e5e8eb'],
      grid: {   // 直角坐标系内绘图网格
        left: '11%',  //grid 组件离容器左侧的距离,
                     //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
        top: '20',
        right: '10%',
        bottom: '0',
        containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
        // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
        //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
      },
      xAxis: {  //直角坐标系grid中的x轴,
                //一般情况下单个grid组件最多只能放上下两个x轴,
                //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
        type: 'value',//坐标轴类型,分别有：
                      //'value'-数值轴；'category'-类目轴;
                      //'time'-时间轴;'log'-对数轴
        splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
        axisLabel: {show: false},//坐标轴刻度标签
        axisTick: {show: false},//坐标轴刻度
        axisLine: {show: false},//坐标轴轴线
      },
      yAxis: {
        type: 'category',
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false},
        data: ['当年净新增托管资产(亿元)']//类目数据，在类目轴（type: 'category'）中有效。
              //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
      },
      series: [//系列列表。每个系列通过 type 决定自己的图表类型
        {
          name: '',//系列名称
          type: 'bar',//柱状、条形图
          barWidth: 10,//柱条的宽度,默认自适应
          data: [{value:64,itemStyle:{normal:{color:'rgb(111, 125, 210)'}}}],//系列中数据内容数组
          label: { //图形上的文本标签
            show: true,
            position: 'top',//标签的位置
            offset: [0,-5],  //标签文字的偏移，此处表示向上偏移40
            formatter: '{b}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
            color: 'black',//标签字体颜色
            fontSize: 18  //标签字号
          },
          itemStyle: {//图形样式
            normal: {  //normal 图形在默认状态下的样式;
            },
            color: {
              color:'red'
            },
          },
          zlevel:1//柱状图所有图形的 zlevel 值,
                  //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
        },
        {
          name: '进度条背景',
          type: 'bar',
          barGap: '-100%',//不同系列的柱间距离，为百分比。
          // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
          // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
           //并且是对此坐标系中所有 'bar' 系列生效。
          barWidth: 10,
          data: [100],
          itemStyle: {normal: {color: '#ccc'}},
        }
      ],
    };
    return progressBarOption;
  }
  // 当年新增客户数
  Dnxzkh = () => {
    const progressBarOption = {
      color: ['#e5e8eb'],
      grid: {   // 直角坐标系内绘图网格
        left: '11%',  //grid 组件离容器左侧的距离,
                     //left的值可以是80这样具体像素值，
                    //也可以是'80%'这样相对于容器高度的百分比
        top: '20',
        right: '10%',
        bottom: '0',
        containLabel: true   //gid区域是否包含坐标轴的刻度标签。为true的时候，
        // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
        //所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
      },
      xAxis: {  //直角坐标系grid中的x轴,
                //一般情况下单个grid组件最多只能放上下两个x轴,
                //多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
        type: 'value',//坐标轴类型,分别有：
                      //'value'-数值轴；'category'-类目轴;
                      //'time'-时间轴;'log'-对数轴
        splitLine: {show: false},//坐标轴在 grid 区域中的分隔线
        axisLabel: {show: false},//坐标轴刻度标签
        axisTick: {show: false},//坐标轴刻度
        axisLine: {show: false},//坐标轴轴线
      },
      yAxis: {
        type: 'category',
        axisTick: {show: false},
        axisLine: {show: false},
        axisLabel: {show: false},
        data: ['当年新增客户数(人)']//类目数据，在类目轴（type: 'category'）中有效。
              //如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
      },
      series: [//系列列表。每个系列通过 type 决定自己的图表类型
        {
          name: '',//系列名称
          type: 'bar',//柱状、条形图
          barWidth: 10,//柱条的宽度,默认自适应
          data: [{value:284,itemStyle:{normal:{color:'rgb(253, 196, 109)'}}}],//系列中数据内容数组
          label: { //图形上的文本标签
            show: true,
            position: 'top',//标签的位置
            offset: [0,-5],  //标签文字的偏移，此处表示向上偏移40
            formatter: '{b}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
            color: 'black',//标签字体颜色
            fontSize: 18  //标签字号
          },
          zlevel:1//柱状图所有图形的 zlevel 值,
                  //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
        },
        {
          name: '进度条背景',
          type: 'bar',
          barGap: '-100%',//不同系列的柱间距离，为百分比。
          // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
          // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
           //并且是对此坐标系中所有 'bar' 系列生效。
          barWidth: 10,
          itemStyle: {normal: {color: '#ccc'}},
          data: [1000],
        }
      ],
    };
    return progressBarOption;
  }
  render() {
    return (
      <React.Fragment>
        <Row>
          <Card className="m-card" title={<div style={{ fontWeight: '900' }}>高端客户关键指标简报</div>}>
            <Row>
              <Col span={12} style={{ border: '1px solid rgba(240,240,240,0.8 )', position: 'relative', paddingRight: '1.5rem' }}>
                <Row>
                  <Col span={18}>
                    <i className="iconfont icon-marketValue" style={{ position: 'absolute', top: '35%', left: '2%', fontSize: '30px', backgroundColor: 'rgb(255, 80, 80)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', textAlign: 'center', lineHeight: '50px' }} />
                    <ReactEchartsCore
                      echarts={echarts}
                      style={{ height: '10rem' }}
                      option={this.Dnsr()}
                      notMerge
                      lazyUpdate
                      theme="theme_name"
                    />
                  </Col>
                  <Col span={6}>
                    <b style={{ fontSize: '30px', float: 'right', lineHeight: '10rem' }}>803846.37</b>
                  </Col>
                </Row>
              </Col>
              <Col span={12} style={{ border: '1px solid rgba(240,240,240,0.8 )', position: 'relative', paddingRight: '1.5rem' }}>
                <Row>
                  <Col span={18}>
                    <i className="iconfont icon-stock" style={{ position: 'absolute', top: '35%', left: '2%', fontSize: '30px', backgroundColor: 'rgb(78, 196, 247)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', textAlign: 'center', lineHeight: '50px' }} />
                    <ReactEchartsCore
                      echarts={echarts}
                      style={{ height: '10rem' }}
                      option={this.Dnkhsr()}
                      notMerge
                      lazyUpdate
                      theme="theme_name"
                    />
                  </Col>
                  <Col span={6}>
                    <b style={{ fontSize: '30px', float: 'right', lineHeight: '10rem' }}>69.97%</b>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ border: '1px solid rgba(240,240,240,0.8 )', position: 'relative', paddingRight: '1.5rem' }}>
                <Row>
                  <Col span={18}>
                    <i className="iconfont icon-assInflow" style={{ position: 'absolute', top: '35%', left: '2%', fontSize: '30px', backgroundColor: 'rgb(111, 125, 210)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', textAlign: 'center', lineHeight: '50px' }} />
                    <ReactEchartsCore
                      echarts={echarts}
                      style={{ height: '10rem' }}
                      option={this.Dnxztg()}
                      notMerge
                      lazyUpdate
                      theme="theme_name"
                    />
                  </Col>
                  <Col span={6}>
                    <b style={{ fontSize: '30px', float: 'right', lineHeight: '10rem' }}>149.43</b>
                  </Col>
                </Row>
              </Col>
              <Col span={12} style={{ border: '1px solid rgba(240,240,240,0.8 )', position: 'relative', paddingRight: '1.5rem' }}>
                <Row>
                  <Col span={18}>
                    <i className="iconfont icon-customerAll" style={{ position: 'absolute', top: '35%', left: '2%', fontSize: '30px', backgroundColor: 'rgb(253, 196, 109)', color: 'white', width: '50px', height: '50px', borderRadius: '50%', textAlign: 'center', lineHeight: '50px' }} />
                    <ReactEchartsCore
                      echarts={echarts}
                      style={{ height: '10rem' }}
                      option={this.Dnxzkh()}
                      notMerge
                      lazyUpdate
                      theme="theme_name"
                    />                  
                  </Col>
                  <Col span={6}>
                    <b style={{ fontSize: '30px', float: 'right', lineHeight: '10rem' }}>284</b>
                  </Col>
                </Row>

              </Col>
            </Row>
          </Card>
        </Row>
      </React.Fragment>
    )
  }
}
export default CustomerNorm;