import lodash from 'lodash';
import { fetchOperationLog } from '../services/basicservices';
import { ptlx } from './config';
/**
 * Object对象相关的自定义处理函数
 */
let menuName = {};
const RecentlyVisiteUtils = {
  getNameAndUrl(url, menuTree) { // 遍历目录树 找到url 和name
    if (menuTree) {
      menuTree.forEach((tempItem) => {
        if (tempItem.menu && tempItem.url !== url) {
          this.getNameAndUrl(url, tempItem.menu.item || []);
        } else if (lodash.get(tempItem, 'url', '').indexOf(url) !== -1) {
          const itemUrl = lodash.get(tempItem, 'url', '');
          if (itemUrl.indexOf('{') !== -1) {
            if (itemUrl.indexOf(url) !== -1) {
              menuName = tempItem;
            }
          }
          if (url.indexOf(itemUrl) !== -1) {
            menuName = tempItem;
          }
        }
      });
    }
    return menuName;
  },
  saveRecentlyVisiteUtils(plocPath, search, name = '') {
    let tempName = name;
    let tempCode = '';
    // 保存最近访问的url
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    const tempRecentUrl = `${plocPath + search}|${name}`;
    const tempIndex = recentlyVisitedUrls.findIndex((item) => { return item.substring(0, item.indexOf('|')) === tempRecentUrl.substring(0, tempRecentUrl.indexOf('|')); });
    const tempIndexName = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url === plocPath + search; });
    tempName = tempIndexName >= 0 ? RecentlyVisiteUtils.mapUrls[tempIndexName].name : '';
    // 处理菜单路径的后缀
    const menuTree = JSON.parse(sessionStorage.getItem('menuTree')) || [];
    const tempObj = this.getNameAndUrl(`${plocPath + search}`, menuTree) || {};
    tempName = lodash.get(tempObj, 'title[0].text', '');
    tempCode = lodash.get(tempObj, 'describe[0].text', '');
    tempCode = tempCode.indexOf('|') !== -1 ? lodash.get(tempCode.split('|'), '[0]') : tempCode;
    const ip = localStorage.getItem('userIP') ? localStorage.getItem('userIP') : '';
    if (tempName) {
      fetchOperationLog({
        czdx: tempCode,
        czff: '',
        czjl: 0,
        czkm: '9003',
        czsm: `进入：${tempName}|${tempRecentUrl}`,
        ip,
        ptlx,
      });
    }
    if (tempIndex >= 0) {
      /* if (name) {
        recentlyVisitedUrls.push(tempRecentUrl);
      } else {
        recentlyVisitedUrls.push(recentlyVisitedUrls[tempIndex]);
      }
      recentlyVisitedUrls.splice(tempIndex, 1); */
      return;
    }
    recentlyVisitedUrls.push(tempRecentUrl);
    /* if (recentlyVisitedUrls.length > 8) {
      recentlyVisitedUrls.splice(0, 1);
    } */
    sessionStorage.setItem('recentlyVisited', recentlyVisitedUrls.join(','));
  },
  cleanRecentlyVisiteUtils() {
    sessionStorage.setItem('recentlyVisited', '');// 清除历史记录
  },
  mapUrls: [], // 所有目录的url和名称
};

export default RecentlyVisiteUtils;

