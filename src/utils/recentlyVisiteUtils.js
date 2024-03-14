import lodash from 'lodash';
import { fetchOperationLog } from '../services/basicservices';
import { ptlx } from './config';
/**
 * Object对象相关的自定义处理函数
 */
let menuName = {};
const RecentlyVisiteUtils = {
  getNameAndUrl(url, menuTree) {
    // 遍历目录树 找到菜单对象
    if (menuTree) {
      menuTree.forEach(tempItem => {
        const itemUrl = lodash.get(tempItem, 'url', '');
        const getPageName = str => {
          const regex = /\/pms\/manage\/(\w+)(?:\/|$)/; // 匹配斜杠后面的单词字符，有斜杠就直到遇到下一个斜杠结束
          const match = str.match(regex);
          if (match && match[1]) {
            return match[1];
          } else {
            return null;
          }
        };
        let itemName = getPageName(itemUrl);
        let curName = getPageName(url);
        if (tempItem.menu && tempItem.url !== url) {
          this.getNameAndUrl(url, tempItem.menu.item || []);
        } else if (
          itemUrl === url ||
          (itemName !== null && curName !== null && itemName === curName)
        ) {
          menuName = tempItem;
        }
      });
    }
    return menuName;
  },
  saveRecentlyVisiteUtils(plocPath, search, name = '') {
    let tempName = name;
    // 保存最近访问的url
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited')
      ? sessionStorage.getItem('recentlyVisited').split(',')
      : [];
    const tempRecentUrl = `${plocPath + search}|${name}`;
    const tempIndex = recentlyVisitedUrls.findIndex(item => {
      return (
        item.substring(0, item.indexOf('|')) ===
        tempRecentUrl.substring(0, tempRecentUrl.indexOf('|'))
      );
    });
    // 处理菜单路径的后缀
    let menuTree = JSON.parse(sessionStorage.getItem('menuTree')) || [];
    menuTree = menuTree.concat(specialMenus);
    const tempObj = this.getNameAndUrl(`${plocPath + search}`, menuTree) || {};
    tempName = lodash.get(tempObj, 'title[0].text', '');
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    if (tempName) {
      const params = {
        czdx: tempName,
        czff: '查看',
        czjl: 0,
        czkm: '9003',
        czsm: `进入：${tempName}|${tempRecentUrl}`,
        ip,
        ptlx,
      };
      fetchOperationLog(params);
    }
    if (tempIndex >= 0) {
      return;
    }
    recentlyVisitedUrls.push(tempRecentUrl);
    sessionStorage.setItem('recentlyVisited', recentlyVisitedUrls.join(','));
  },
  cleanRecentlyVisiteUtils() {
    sessionStorage.setItem('recentlyVisited', ''); // 清除历史记录
  },
  mapUrls: [], // 所有目录的url和名称
};
//特殊菜单数据 - 后续还得细分tab
const specialMenus = [
  {
    // 人员详情
    title: [{ text: '人员详情' }],
    url: '/pms/manage/staffDetail',
  },
  {
    // 标签详情
    title: [{ text: '标签详情' }],
    url: '/pms/manage/labelDetail',
  },
  {
    // 项目详情
    title: [{ text: '项目详情' }],
    url: '/pms/manage/ProjectDetail',
  },
  {
    //供应商详情
    title: [{ text: '供应商详情' }],
    url: '/pms/manage/SupplierDetail',
  },
  {
    // 预算执行情况
    title: [{ text: '预算执行情况' }],
    url: '/pms/manage/BudgetExcute',
  },
  {
    // 供应商情况
    title: [{ text: '供应商情况' }],
    url: '/pms/manage/SupplierSituation',
  },
  {
    // 部门人员情况
    title: [{ text: '部门人员情况' }],
    url: '/pms/manage/departmentOverview',
  },
  {
    // 项目建设情况
    title: [{ text: '项目建设情况' }],
    url: '/pms/manage/projectBuilding',
  },
  {
    // 需求详情
    title: [{ text: '需求详情' }],
    url: '/pms/manage/DemandDetail',
  },
  {
    //外包人员详情
    title: [{ text: '外包人员详情' }],
    url: '/pms/manage/MemberDetail',
  },
  {
    // 外包需求列表
    title: [{ text: '外包需求列表' }],
    url: '/pms/manage/SupplierDmInfo',
  },
  {
    // 简历分发
    title: [{ text: '简历分发' }],
    url: '/pms/manage/ResumeDistribution',
  },
  {
    // 报表管理
    title: [{ text: '报表管理' }],
    url: '/pms/manage/CustomRptManagement',
  },
  {
    // 报告内容
    title: [{ text: '报告内容' }],
    url: '/pms/manage/CustomReportDetail',
  },
  {
    // 项目明细
    title: [{ text: '项目明细' }],
    url: '/pms/manage/ProjectStatisticsInfo',
  },
  {
    // 阶段项目列表
    title: [{ text: '阶段项目列表' }],
    url: '/pms/manage/ProjectStateInfo',
  },
  {
    // 项目统计
    title: [{ text: '项目统计' }],
    url: '/pms/manage/ProjectMemberStatisticsInfo',
  },
  {
    // 合同编辑
    title: [{ text: '普通合同信息编辑' }],
    url: '/pms/manage/InnovationContractEdit',
  },
  {
    // 合同查看
    title: [{ text: '普通合同信息查看' }],
    url: '/pms/manage/InnovationContractView',
  },
  {
    // 预算填报
    title: [{ text: '预算填报' }],
    url: '/pms/manage/BudgetSubmit',
  },
  {
    // 预算详情
    title: [{ text: '预算详情' }],
    url: '/pms/manage/BudgetDetail',
  },
  {
    // 外包人员列表-特殊处理
    title: [{ text: '外包人员列表' }],
    url: '/pms/manage/MemberInfo',
  },
];
export { specialMenus };
export default RecentlyVisiteUtils;
