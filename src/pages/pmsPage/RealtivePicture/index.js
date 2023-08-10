import React, { Component } from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/graph';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import testImg from '../../../assets/projectBuilding/ddxm.png';
import ZoomBox from './ZoomBox';
import FilterBox from './FilterBox';
class RealtivePicturePage extends Component {
  state = {
    dataSource: [],
    data: [],
    zoom: 1,
    options: [],
    nodeNm: [],
    nodes: [],
    links: [],
  };

  componentDidMount() {
    const dataSource = [
      { XMMC: '****资管机构版网上交易项目', YSMC: '备用预算', GYS: '供应商1', RYMC: '文娟娟,童卫' },
      {
        XMMC: '客户画像二期',
        YSMC: '数据治理与大数据应用',
        GYS: '上海吉贝克信息技术有限公司',
        RYMC: '崔倬苒,施彦标,魏帅',
      },
      {
        XMMC: '工会活动预约系统一期',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商12',
        RYMC: '童卫,贾洋洋',
      },
      {
        XMMC: '投行债券簿记发行管理系统',
        YSMC: '备用预算',
        GYS: '供应商11',
        RYMC: '杜正文,杨学燃,童卫,问婕,黄彩虹',
      },
      {
        XMMC: '余杭VMware私有云扩容软件采购的立项申请',
        YSMC: '2023年云计算平台建设',
        GYS: '供应商31',
        RYMC: '黄庆',
      },
      {
        XMMC: '2022年度信息技术开发部考评系统',
        YSMC: '备用预算',
        GYS: '供应商1',
        RYMC: '徐文春,文娟娟,郑潜',
      },
      {
        XMMC: '理财商城对接中证服务',
        YSMC: '理财商城个性化营销推荐平台',
        GYS: '供应商51',
        RYMC: '傅潇,吴王润,张峻,曾本芬,江鑫,盛星星,苏令峰,蒋茜',
      },
      {
        XMMC: '理财商城支持妥妥递电子签约',
        YSMC: '财富管理业务数智化支持',
        GYS: '供应商12',
        RYMC: '傅潇,吴王润,张峻,曾本芬,江鑫,王博,盛星星,苏令峰,蒋茜',
      },
      {
        XMMC: '自营极速交易项目软件',
        YSMC: '自营分公司信息系统优化及需求改造',
        GYS: '供应商1',
        RYMC: '王特国,童卫',
      },
      { XMMC: '大型语言模型数智化平台', YSMC: '备用预算', GYS: '供应商1', RYMC: '朱浩路,童卫' },
      {
        XMMC: '信息技术事业部数字服务平台二期优化',
        YSMC: '备用预算',
        GYS: '供应商13',
        RYMC: '张颖,徐文春,徐雪,童卫',
      },
      { XMMC: '全球行情指数项目', YSMC: '备用预算', GYS: '供应商1', RYMC: '王宪文,童卫' },
      { XMMC: '产业链库项目', YSMC: '备用预算', GYS: '供应商2', RYMC: '王宪文,童卫' },
      {
        XMMC: '信创异构（华为）私有云测试平台',
        YSMC: '2023年云计算平台建设',
        GYS: '供应商31',
        RYMC: '黄庆',
      },
      {
        XMMC: '数字化文化宣导物料动画设计',
        YSMC: '备用预算',
        GYS: '供应商42',
        RYMC: '徐雪,童卫,郑潜',
      },
      {
        XMMC: '投行收入&绩效管理系统二期',
        YSMC: '人力外包',
        GYS: '供应商52',
        RYMC: '杜正文,杨学燃,童卫,黄彩虹',
      },
      { XMMC: '智慧食堂订餐预约系统', YSMC: '新业务支持', GYS: '供应商1', RYMC: '童卫,贾洋洋' },
      {
        XMMC: '融券宝系统平台',
        YSMC: '新业务支持',
        GYS: '供应商3',
        RYMC: '童卫,贾洋洋,郑潜,陈丙成,陈炎坤',
      },
      {
        XMMC: '理财商城个性化营销推荐平台',
        YSMC: '理财商城个性化营销推荐平台',
        GYS: '供应商11',
        RYMC: '傅潇,曾本芬,王博,盛星星,苏令峰,蒋茜,郑志琦',
      },
      {
        XMMC: '资管综合运营平台二期',
        YSMC: '备用预算',
        GYS: '供应商3',
        RYMC: '俞林林,文娟娟,童卫',
      },
      {
        XMMC: '2023年VMware私有云TAM原厂服务',
        YSMC: '私有云VMWARE TAM原厂服务',
        GYS: '供应商5',
        RYMC: '黄庆',
      },
      {
        XMMC: '科创板做市借券项目',
        YSMC: '自营分公司信息系统优化及需求改造',
        GYS: '供应商35',
        RYMC: '王谦,钟政乐',
      },
      { XMMC: '企业库项目', YSMC: '备用预算', GYS: '供应商1', RYMC: '王宪文,童卫' },
      {
        XMMC: 'Figma Professional协同设计工具采购项目',
        YSMC: '备用预算',
        GYS: '供应商61',
        RYMC: '童卫,郑潜',
      },
      {
        XMMC: '数字虚拟人迭代项目2023',
        YSMC: '信息系统迭代开发项目',
        GYS: '供应商5',
        RYMC: '朱浩路,童卫,郑潜',
      },
      {
        XMMC: '信息技术事业部数字服务平台',
        YSMC: '备用预算',
        GYS: '供应商81',
        RYMC: '徐雪,杨学燃,童卫',
      },
      {
        XMMC: '2023汇金谷迭代开发',
        YSMC: '备用预算',
        GYS: '供应商54',
        RYMC: '全佳潇,崔倬苒,徐雪,童卫,萧方赛,蒋茜,贾洋洋,郑潜,阮苏娜',
      },
      { XMMC: '用户中心系统', YSMC: '备用预算', GYS: '供应商64', RYMC: '周位壬' },
      {
        XMMC: '场外衍生品管理系统DMA收益互换簿记模块项目',
        YSMC: '备用预算',
        GYS: '供应商46',
        RYMC: '王特国,童卫',
      },
      {
        XMMC: '托管部托管和外包系统相关业务改造项目',
        YSMC: '托管业务信息系统优化及需求改造',
        GYS: '供应商6',
        RYMC: '周翠',
      },
      {
        XMMC: '报价回购品种独占额度和到期自动买入',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商7',
        RYMC: '王谦,钟政乐',
      },
      { XMMC: '中金所高频行情建设', YSMC: '业务数据扩充', GYS: '供应商7', RYMC: '姜超' },
      {
        XMMC: '卡方ATGO算法平台两融模块采购',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商5',
        RYMC: '谢尚进',
      },
      {
        XMMC: '同花顺联合运营-****汇金资讯投顾产品项目',
        YSMC: '新业务支持',
        GYS: '供应商15',
        RYMC: '崔倬苒,王宪文,童卫',
      },
      { XMMC: 'Web端设计规范项目', YSMC: '自研项目无预算', GYS: '供应商5', RYMC: '童卫,郑潜' },
      { XMMC: '业务专家招投标系统', YSMC: '自研项目无预算', GYS: '供应商15', RYMC: '杨学燃' },
      { XMMC: '财务制单系统', YSMC: '自研项目无预算', GYS: '供应商9', RYMC: '杨学燃' },
      {
        XMMC: '****会议会务管理系统',
        YSMC: '数字办公',
        GYS: '供应商39',
        RYMC: '徐文春,杨学燃',
      },
      { XMMC: '无纸化会议系统', YSMC: '自研项目无预算', GYS: '供应商8', RYMC: '吴王润,苏令峰' },
      {
        XMMC: '区块链综合服务治理平台项目',
        YSMC: '区块链综合服务治理平台项目',
        GYS: '供应商8',
        RYMC: '童卫,蒋茜',
      },
      { XMMC: '市场化转融资业务', YSMC: '新业务支持', GYS: '供应商2', RYMC: '王谦,钟政乐' },
      { XMMC: 'ZScloud微服务开发框架', YSMC: '备用预算', GYS: '供应商4', RYMC: '薛波杰' },
      {
        XMMC: '智能双录项目',
        YSMC: '理财商城个性化营销推荐平台',
        GYS: '供应商7',
        RYMC: '吴王润,苏令峰,蒋茜',
      },
      { XMMC: '运营活动', YSMC: '备用预算', GYS: '供应商7', RYMC: '徐雪,童卫' },
      {
        XMMC: '杭州到东莞联通线路费用',
        YSMC: '杭州到东莞联通线路费用',
        GYS: '供应商24',
        RYMC: '王荣华',
      },
      {
        XMMC: '网上业务',
        YSMC: '恒生账户业务周边接口',
        GYS: '供应商3',
        RYMC: '吴王润,崔倬苒,江鑫,阮苏娜',
      },
      { XMMC: 'AI智能训练平台', YSMC: 'AI智能训练平台', GYS: '供应商13', RYMC: '姚彬,王博,陈志勇' },
      {
        XMMC: '迭代研发管理系统采购项目',
        YSMC: 'ones项目迭代管理系统维护费',
        GYS: '供应商3',
        RYMC: '唐伟通',
      },
      {
        XMMC: '产品智能运营平台',
        YSMC: '产品中心投研管理',
        GYS: '供应商10',
        RYMC: '唐伟通,林桂芳',
      },
      {
        XMMC: '全链路集中监控与流量分析服务器磁盘扩容采购',
        YSMC: '2023年度基础硬件供应商入围项目',
        GYS: '供应商10',
        RYMC: '孙磊',
      },
      { XMMC: '墨刀正版原型设计软件采购项目', YSMC: '备用预算', GYS: '供应商29', RYMC: '张颖' },
      { XMMC: '产品中心', YSMC: '产品中心投研管理', GYS: '供应商9', RYMC: '唐伟通,曾本芬,林桂芳' },
      {
        XMMC: '2023 年投行业务系统开发人力外包项目',
        YSMC: '开发外包人员费用',
        GYS: '供应商11',
        RYMC: '杨学燃',
      },
      {
        XMMC: '余杭数据中心IDC机房扩容',
        YSMC: '余杭数据中心IDC及办公场地租赁',
        GYS: '供应商11',
        RYMC: '曾招光',
      },
      {
        XMMC: '阿里信创专有云平台原厂支持服务及第三方驻场运维服务',
        YSMC: '信创阿里专有云维护费',
        GYS: '供应商4',
        RYMC: '曾招光',
      },
      {
        XMMC: '关于内控开发部数据中台人力外包项目的议案',
        YSMC: '人力外包',
        GYS: '供应商74',
        RYMC: '杜真真',
      },
      {
        XMMC: '关于内控开发部资管数据中台人力外包项目的议案',
        YSMC: '人力外包',
        GYS: '供应商84',
        RYMC: '俞林林',
      },
      {
        XMMC: '2023年大数据开发人力外包项目',
        YSMC: '开发外包人员费用',
        GYS: '供应商95',
        RYMC: '施彦标',
      },
      { XMMC: '信创无影云桌面二期', YSMC: '信创云桌面（二期）', GYS: '供应商45', RYMC: '刘子腾' },
      {
        XMMC: '债券营销及客户管理平台四期需求采购项目',
        YSMC: '自营分公司信息系统优化及需求改造',
        GYS: '供应商5',
        RYMC: '厉超文',
      },
      { XMMC: '北交所融资融券项目', YSMC: '新业务支持', GYS: '供应商5', RYMC: '钟政乐' },
      {
        XMMC: '采购信用极速大宗、个性化维保比、董监高模块',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商5',
        RYMC: '钟政乐',
      },
      {
        XMMC: '互联网终端系统全面注册制改造项目',
        YSMC: '互联网新业务支持',
        GYS: '供应商5',
        RYMC: '全佳潇,叶利娜,杨欣',
      },
      { XMMC: '测试人力外包项目', YSMC: '运维及测试人力外包', GYS: '供应商5', RYMC: '邵刚强' },
      {
        XMMC: '反洗钱及人员投资行为管理系统迭代开发项目',
        YSMC: '合规类系统升级改造',
        GYS: '供应商5',
        RYMC: '问婕',
      },
      {
        XMMC: '数据中心CISCO设备维保采购',
        YSMC: '****机房网络设备续保项目',
        GYS: '供应商5',
        RYMC: '邢玉平',
      },
      { XMMC: '汇金谷扩容', YSMC: '汇金谷扩容', GYS: '供应商5', RYMC: '全佳潇' },
      {
        XMMC: '北交所做市',
        YSMC: '投行相关系统优化及需求改造',
        GYS: '供应商5',
        RYMC: '张帅,赵晓伟',
      },
      { XMMC: '一体化风控平台', YSMC: '风控类系统升级改造', GYS: '供应商5', RYMC: '马铎' },
      { XMMC: '彭博终端机采购', YSMC: '彭博系统使用年费', GYS: '供应商5', RYMC: '厉超文' },
      {
        XMMC: '区块链综合服务治理平台项目二期',
        YSMC: '区块链综合服务治理平台项目二期（信创）',
        GYS: '供应商5',
        RYMC: '童卫,蒋茜,陶士南',
      },
      {
        XMMC: '核心服务器采购项目',
        YSMC: '余杭核心服务器更换',
        GYS: '供应商53',
        RYMC: '张春春,钟政乐',
      },
      {
        XMMC: '容错服务器采购项目',
        YSMC: '余杭核心服务器更换',
        GYS: '供应商43',
        RYMC: '王乐,钟政乐',
      },
      {
        XMMC: '企划平台迭代项目',
        YSMC: '战略企划管理平台迭代项目',
        GYS: '供应商43',
        RYMC: '张颖,朱衎,童卫,贾洋洋,郑潜',
      },
      {
        XMMC: '数字化运营设计服务采购',
        YSMC: '数字化运营设计服务费用',
        GYS: '供应商3',
        RYMC: '童卫,郑潜',
      },
      {
        XMMC: '信息技术综合管理平台迭代',
        YSMC: '项目信息综合管理平台（迭代）',
        GYS: '供应商63',
        RYMC: '张颖,朱浩路,朱衎,童卫,萧方赛,郑潜',
      },
      {
        XMMC: '自营分公司基金管理系统项目',
        YSMC: '自营分公司信息系统优化及需求改造',
        GYS: '供应商73',
        RYMC: '王特国,童卫',
      },
      {
        XMMC: '关于向恒生电子采购全面注册制系统改造项目',
        YSMC: '新业务支持',
        GYS: '供应商3',
        RYMC: '钟政乐',
      },
      {
        XMMC: '融资融券担保品管理系统采购项目',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商17',
        RYMC: '施彦标,黄彩虹',
      },
      {
        XMMC: '下沙防勒索邮件病毒安全网关的采购项目',
        YSMC: '网络安全建设',
        GYS: '供应商17',
        RYMC: '叶利娜',
      },
      {
        XMMC: '****陆家嘴世纪金融广场1号楼27楼 智能化工程',
        YSMC: '27楼智能化工程',
        GYS: '供应商7',
        RYMC: '江宾',
      },
      {
        XMMC: '明珠国际商务中心4、5幢十八楼综合布线工程',
        YSMC: '开发部新办公区综合布线项目',
        GYS: '供应商7',
        RYMC: '陈欣',
      },
      {
        XMMC: '研究所携宁研报系统二期项目',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商37',
        RYMC: '钟政乐',
      },
      {
        XMMC: '项目管理部2023年产品人力外包',
        YSMC: '项目管理人力外包服务',
        GYS: '供应商47',
        RYMC: '徐雪,朱衎,童卫',
      },
      {
        XMMC: '上交所债券做市',
        YSMC: '自营分公司信息系统优化及需求改造',
        GYS: '供应商7',
        RYMC: '张帅',
      },
      {
        XMMC: '2023年零售业务人力外包',
        YSMC: '理财商城个性化营销推荐平台',
        GYS: '供应商97',
        RYMC: '张峻',
      },
      {
        XMMC: '自营分公司极速交易项目',
        YSMC: '备用预算',
        GYS: '供应商8',
        RYMC: '王特国,童卫,钟政乐',
      },
      {
        XMMC: '南方中心二期机柜租赁项目',
        YSMC: '深圳南方中心（东莞）托管机房租赁',
        GYS: '供应商8',
        RYMC: '钟政乐',
      },
      {
        XMMC: '****股份有限公司数据中心非思科网络核心设备维保采购',
        YSMC: '****机房网络设备续保项目',
        GYS: '供应商28',
        RYMC: '李佩星',
      },
      {
        XMMC: '数据资产目录建设项目',
        YSMC: '数据治理与大数据应用',
        GYS: '供应商48',
        RYMC: '施彦标',
      },
      {
        XMMC: '收益凭证业务数据报送文件接口规范项目',
        YSMC: '业务系统优化及需求改造',
        GYS: '供应商38',
        RYMC: '陈南南',
      },
      {
        XMMC: '关于基金托管，外包估值以及投资监督系统支持广州期货交易所业务改造的议案',
        YSMC: '托管业务信息系统优化及需求改造',
        GYS: '供应商8',
        RYMC: '周翠',
      },
      {
        XMMC: '极速交易系统信创改造',
        YSMC: '核心系统信创改造',
        GYS: '供应商8',
        RYMC: '谢尚进,钟政乐',
      },
      {
        XMMC: '基金投顾系统及资配系统个性化需求和信创改造项目',
        YSMC: '核心系统信创改造',
        GYS: '供应商88',
        RYMC: '钟政乐',
      },
      { XMMC: '数字化工会管理系统', YSMC: '人力外包', GYS: '供应商2', RYMC: '吴波涌' },
      {
        XMMC: '上海卡方科技2023年度技术服务费',
        YSMC: '卡方技术服务费',
        GYS: '供应商32',
        RYMC: '钟政乐',
      },
      {
        XMMC: '数字看板二期项目',
        YSMC: '数字经营决策系统',
        GYS: '供应商32',
        RYMC: '张颖,童卫,萧方赛,郑潜,阮苏娜,黄彩虹',
      },
      { XMMC: '投资管理系统', YSMC: '新业务支持', GYS: '供应商62', RYMC: '朱浩路,童卫' },
      {
        XMMC: '****资管交易所交易行为控制功能采购项目',
        YSMC: '备用预算',
        GYS: '供应商72',
        RYMC: '徐海锋',
      },
      {
        XMMC: '关于资管公司私有云软件授权实施项目',
        YSMC: '备用预算',
        GYS: '供应商2',
        RYMC: '徐海锋',
      },
      { XMMC: 'RM风险计量引擎', YSMC: 'RM计算引擎', GYS: '供应商16', RYMC: '马铎' },
      {
        XMMC: '存量客户一站式服务工具系统建设项目',
        YSMC: '互联网新业务支持',
        GYS: '供应商96',
        RYMC: '叶利娜',
      },
    ];
    const xmmc = '北交所做市';

    const data = dataSource.filter(item => {
      return item.XMMC === xmmc;
    });

    this.getGraph(data);

    this.setState({
      dataSource,
    });
  }

  roamMap = zoom => {
    const echartsInstance = this.chart.getEchartsInstance();
    echartsInstance.setOption({
      series: {
        zoom: zoom,
      },
    });
  };

  getGraph = (data = [], name) => {
    let nodeNm = [];
    let nodes = [];
    let links = [];
    const itemStyle = {
      // shadowColor: 'rgba(0, 0, 0, 0.5)',
      // shadowBlur: 10,
      color: '#f7f8fa',
      borderWidth: 4,
      borderColor: 'rgb(51, 97, 255)',
    };
    //获取展示数据
    data.forEach(item => {
      const arr = Object.keys(item);
      arr.forEach(ele => {
        if (ele !== 'RYMC') {
          if (!nodeNm.includes(item[ele])) {
            nodeNm.push(item[ele]);
            if (ele === 'XMMC') {
              nodes.push({
                name: item[ele],
                symbolSize: 70,
                category: 0,
                itemStyle: name === item[ele] ? itemStyle : {},
                label:{
                  show: true,
                }
              })
            } else if (ele === 'YSMC') {
              nodes.push({
                name: item[ele],
                category: 1,
                symbolSize: 70,
                itemStyle: name === item[ele] ? itemStyle : {},
                
              })
            } else if (ele === 'GYS') {
              nodes.push({
                name: item[ele],
                symbolSize: 70,
                category: 3,
                itemStyle: name === item[ele] ? itemStyle : {},
              })
            }
          }
          let link = {};
          if (ele !== 'XMMC') {
            link.source = item.XMMC;
            link.target = item[ele];
            links.push(link)
            // const index = nodeNm.indexOf(item[ele]);
            // if (nodes[index].symbolSize < 80) {
            //   nodes[index].symbolSize += 5;
            // }
            // const xmIndex = nodeNm.indexOf(item.XMMC);
            // if (nodes[xmIndex].symbolSize < 80) {
            //   nodes[xmIndex].symbolSize += 5;
            // }
            // if (nodes[index].symbolSize > 60) {
            //   nodes[index].label = {
            //     show: true,
            //   };
            // }
            // if (nodes[xmIndex].symbolSize > 60) {
            //   nodes[xmIndex].label = {
            //     show: true,
            //   };
            // }
          }
        } else {
          const rys = item[ele].split(',');
          rys.forEach(li => {
            if (!nodeNm.includes(li)) {
              nodeNm.push(li);
              nodes.push({
                name: li,
                category: 2,
                symbolSize: 70,
                itemStyle: name === li ? itemStyle : {},
                label:{
                  show: true,

                }
              })
            }
            let link = {};
            link.source = item.XMMC;
            link.target = li;
            links.push(link);
            // const index = nodeNm.indexOf(li);
            // if (nodes[index].symbolSize < 80) {
            //   nodes[index].symbolSize += 5;
            // }
            // const xmIndex = nodeNm.indexOf(item.XMMC);
            // if (nodes[xmIndex].symbolSize < 60) {
            //   nodes[xmIndex].symbolSize += 5;
            // }
            // if (nodes[index].symbolSize > 80) {
            //   nodes[index].label = {
            //     show: true,
            //   };
            // }
            // if (nodes[xmIndex].symbolSize > 60) {
            //   nodes[xmIndex].label = {
            //     show: true,
            //   };
            // }
          });
        }
      });
    });

    this.setState({
      nodeNm,
      nodes,
      links,
      data,
    });
  };

  onSelect = (item = {}) => {
    const { name, category } = item;
    const { dataSource = [] } = this.state;
    if (category === 0) {
      const data = dataSource.filter(item => {
        return item.XMMC === name;
      });
      this.getGraph(data);
    } else if (category === 1) {
      const data = [];
      dataSource.forEach(item => {
        if (item.YSMC === name) {
          data.push({
            XMMC: item.XMMC,
            YSMC: name,
          });
        }
      });
      this.getGraph(data);
    } else if (category === 2) {
      //人员
      const data = [];
      dataSource.forEach(item => {
        if ((',' + item.RYMC + ',').includes(',' + name + ',')) {
          data.push({
            XMMC: item.XMMC,
            RYMC: name,
          });
        }
      });
      this.getGraph(data);
    } else {
      const data = [];
      dataSource.forEach(item => {
        if (item.GYS === name) {
          data.push({
            XMMC: item.XMMC,
            GYS: name
          })
        }
      });
      this.getGraph(data);
    }
  };

  getRoam = () => {
    const echartsInstance = this.chart.getEchartsInstance();
    return echartsInstance.getOption().series[0].zoom;
  };

  getTooltipCont = (dataType,data) =>{
    if (dataType === 'node') {
      const { name } = data
      return "<div class='tooltip-content'>"
        + "<div class='top-header'>"
        + "<div class='header-title'>"+name+"</div>"
        + "<a class='header-link' href='https://www.baidu.com/' target='_blank'>详情 ＞</a>"
        + "</div>"
        + "<div class='label-box'>"
        + "<div class='label-item'>自研项目</div>"
        + "<div class='label-item'>专班项目</div>"
        + "<div class='label-item'>迭代项目</div>"
        + "</div>"
        + "<div class='detail-box'>"
        + "<div class='detail-item'>"
        + "<div class='item-label'>项目经理：</div>"
        + "<div class='item-value'>郑潜</div>"
        + "</div>"
        + "<div class='detail-item'>"
        + "<div class='item-label'>创建时间：</div>"
        + "<div class='item-value'>2023/03/03</div>"
        + "</div>"
        + "<div class='detail-item'>"
        + "<div class='item-label'>属性2：</div>"
        + "<div class='item-value'>外采部门</div>"
        + "</div>"
        + "<div class='detail-item'>"
        + "<div class='item-label'>应用部门：</div>"
        + "<div class='item-value'>项目管理部门</div>"
        + "</div>"
        + "</div>"
        + "<div class='lcb-box'>"
        + "<div class='lcb-header'>"
        + "<div class='dot'></div>"
        + "⌜项目立项⌟ 阶段"
        + "<div class='value'>16.7%</div>"
        + "</div>"
        + "<div class='lcb-process'>"
        + "<div class='lcb-process-percent' style='width: 16.7%'></div>"
        + "</div>"
        + "</div>"
        + "</div>"
    } else if (dataType === 'edge'){
      return "<div style='width: 0;height:0; opacity: 0'></div>"
    }

  }

  render() {
    const { zoom, dataSource = [], nodeNm, nodes, links } = this.state;

    const categories = [
      { name: '项目' },
      { name: '预算项目' },
      { name: '人员' },
      { name: '供应商' },
    ];

    const onEvents = {
      click: params => {
        const {
          data: { category, name },
        } = params;
        const { dataSource = [], data = [] } = this.state;
        const xmList = data.map(item => item.XMMC);
        let isChange = false;
        dataSource.forEach(item => {
          const { XMMC } = item;
          if (category === 2) {
            if ((',' + item.RYMC + ',').includes(',' + name + ',')) {
              if (!xmList.includes(XMMC)) {
                data.push({
                  XMMC: item.XMMC,
                  RYMC: name,
                });
                isChange = true;
              }
            }
          } else if (category === 1) {
            if (item.YSMC === name) {
              if (!xmList.includes(XMMC)) {
                data.push({
                  XMMC: item.XMMC,
                  YSMC: name,
                });
                isChange = true;
              }
            }
          } else if (category === 3) {
            if (item.GYS === name) {
              if (!xmList.includes(XMMC)) {
                data.push({
                  XMMC: item.XMMC,
                  GYS: name,
                });
                isChange = true;
              }
            }
          } else if (category === 0) {
            if (XMMC === name) {
              if (!xmList.includes(XMMC)) {
                data.push(item);
                isChange = true;
              } else {
                const index = xmList.indexOf(XMMC);
                data[index] = item;
                isChange = true;
              }
            }
          }
        });
        if (isChange) {
          this.getGraph(data, name);
        }
      },
    };

    return (<div className='realtive-page' style={{ height: '100%' }}>
      {nodes && <ReactEchartsCore
        ref={(e) => { this.chart = e; }}
        echarts={echarts}
        style={{ height: '100%', width: '100%' }}
        option={{
          legend: [{
            data: ['项目', '预算项目', '人员', '供应商'],
            bottom: 20,
            left: 20,
            icon: 'circle',
          }],
          tooltip: {
            show: true,
            enterable: true,
            hideDelay: 100,
            backgroundColor: '#f7f8fa',
            padding: 0,
            renderMode: 'html',
            formatter: (params) => {
              const { data = {}, dataType } = params
              return this.getTooltipCont(dataType,data);
            }
          },
          color: ['#56a9f8', 'rgb(254, 167, 87)', 'rgb(214, 216, 225)', '#b883f8'],
          series: [
            {
              type: 'graph',
              layout: 'force',
              nodes: nodes,
              links: links,
              categories: categories,
              zoom: zoom,
              roam: 'move',
              emphasis: {
                itemStyle: {
                  color: '#f7f8fa',
                  borderWidth: 4,
                  borderColor: 'rgb(51, 97, 255)'
                },
                lineStyle: {
                  width: 3,
                  color: '#000'
                }
              },
              label: {
                show: true,
                position: "inside",
                distance: 5,
                align: "center",
                color: '#333',
                formatter: (params) => {
                  const { name } = params;
                  // switch(category){
                  //   case 0:
                  //     name = '项目';
                  //     break;
                  //   case 1:
                  //     name = '预算';
                  //     break;
                  //   case 2:
                  //     name = '人员';
                  //     break;
                  //   case 3:
                  //     name = '供应商';
                  //     break;
                  //   default:
                  //     break;  
                  // }
                  if (name.length > 10) {
                    return name.slice(0, 5) + '\n' + name.slice(5, 10) + '...'
                  } else if (name.length > 5) {
                    const length = Math.floor(name.length / 2)
                    return name.slice(0, length) + '\n' + name.slice(length)
                  } else {
                    return name
                  }
                }
              },
              force: { //力引导图基本配置
                repulsion: 200, //节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                gravity: 0.02, //节点受到的向中心的引力因子。该值越大节点越往中心点靠拢。
                edgeLength: 100, //边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                // layoutAnimation: false
                //因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
              },
            }
          ]
        }}
        notMerge
        lazyUpdate={false}
        onEvents={onEvents}
      />
      }
      <FilterBox dataSource={dataSource} onSelect={this.onSelect} />
      <ZoomBox getRoam={this.getRoam} roamMap={this.roamMap} />
    </div>
    );
  }
}

export default RealtivePicturePage;
