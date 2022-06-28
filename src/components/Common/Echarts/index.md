注：按需加载
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/bar';
// import 'echarts/lib/chart/pie';
1、普通线图调用示例(line)
 import 'echarts/lib/component/tooltip';
 import 'echarts/lib/component/legend';
 import 'echarts/lib/chart/line';
  const lineDatas = [
        { ZLCV: 1, YLCV: 2, SJ: 20180101 }, 
        { ZLCV: 2, YLCV: 3, SJ: 20180102 }, 
        { ZLCV: 1, YLCV: 2, SJ: 20180103 }
      ];
  <EchartsHelper
            options={[]}
            datas={lineDatas}   
            arrSeries={{ NAME: ['周留存率(%)', '月留存率(%)'], COLUMN: ['ZLCV', 'YLCV'] }} 
            xAxisColumn="SJ" 
            type="line" 
            multiY={false}
            width="100%"  
            height="20rem"
          />

2、普通线图调用示例(line2，与1的不同在于数据返回格式)
 import 'echarts/lib/component/tooltip';
 import 'echarts/lib/component/legend';
 import 'echarts/lib/chart/line';
 const line2Datas = [
    { RQ: '20151023', VALUE: '3', QDMC: '渠道1' },
    { RQ: '20151023', VALUE: '1', QDMC: '渠道2' },
    { RQ: '20151024', VALUE: '0', QDMC: '渠道1' },
    { RQ: '20151024', VALUE: '2', QDMC: '渠道2' },
  ];
  <EchartsHelper
            options={[]}
            datas={line2Datas}
            valueColumn="VALUE"
            legendColumn="QDMC"
            xAxisColumn="RQ"
            type="line2"
            width="100%"
            height="25rem"
          />

3、饼状图调用示例(pie)
 import 'echarts/lib/component/tooltip';
 import 'echarts/lib/component/legend';
 import 'echarts/lib/chart/pie';
  const pieDatas = [
      { RATE: 1, TYPE: '类型A' }, 
      { RATE: 3, TYPE: '类型B' }, 
      { RATE: 5, TYPE: '类型C' }
      ];
   <EchartsHelper
            options={[]}
            datas={pieDatas}
            valueColumn="RATE"
            titleColumn="TYPE"
            chartName="类型分布图"
            type="pie"
            width="100%"
            height="20rem"
          />

4、柱状图调用示例(bar)
 import 'echarts/lib/component/tooltip';
 import 'echarts/lib/component/legend';
 import 'echarts/lib/chart/bar';
  const barDatas = [
    { ZLCV: 1, YLCV: 2, SJ: 20180101 },
    { ZLCV: 2, YLCV: 3, SJ: 20180102 },
    { ZLCV: 1, YLCV: 2, SJ: 20180103 },
  ];
  <EchartsHelper
            options={[]}
            datas={barDatas}
            dataMapping={{ NAME: ['客户交易量(万元)', '客户总资产(万元)'], COLUMN: ['ZLCV', 'YLCV'] }}
            xAxisColumn="SJ"
            multiY={false}
            type="bar"
            width="100%"
            height="20rem"
          />




5、线柱组合图(barAndLine)
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
 const lineAndBarDatas = [
    { ZLCV: 1, YLCV: 2, SYL: 4, SJ: 20180101 },
    { ZLCV: 2, YLCV: 3, SYL: 8, SJ: 20180102 },
    { ZLCV: 1, YLCV: 2, SYL: 1, SJ: 20180103 },
  ];
  <EchartsHelper
            options={[]}
            datas={lineAndBarDatas}
            dataMapping={{ NAME: ['新增开户数', '开户增长率(%)', '收益率(%)'], COLUMN: ['ZLCV', 'YLCV', 'SYL'], TYPE: ['bar', 'line', 'line'] }}
            xAxisColumn="SJ"
            multiY
            type="barAndLine"
            width="100%"
            height="20rem"
          />

6、横向柱状图(YaxisBar)
 import 'echarts/lib/component/tooltip';
 import 'echarts/lib/component/legend';
 import 'echarts/lib/chart/bar';
  const lineAndBarDatas = [
    { SJ: '2016年', CATAGORY: '股票', SCORE: 40 },
    { SJ: '2017年', CATAGORY: '股票', SCORE: 55 },
    { SJ: '2018年', CATAGORY: '股票', SCORE: 70 },
    { SJ: '2016年', CATAGORY: '证券', SCORE: 33 },
    { SJ: '2017年', CATAGORY: '证券', SCORE: 88 },
    { SJ: '2018年', CATAGORY: '证券', SCORE: 23 },
    { SJ: '2016年', CATAGORY: '基金', SCORE: 90 },
    { SJ: '2017年', CATAGORY: '基金', SCORE: 44 },
    { SJ: '2018年', CATAGORY: '基金', SCORE: 77 },
  ];
   <EchartsHelper
            options={[]}
            datas={lineAndBarDatas}
            colName={['CATAGORY', 'SJ', 'SCORE']}
            stack={false}
            type="yaxisBar"
            width="100%"
            height="25rem"
          />
