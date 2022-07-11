// import getRoutes from '../routesConfig';
import RecentlyVisiteUtils from './recentlyVisiteUtils';
/**
 *  otherTab路由
 */
const LocalPathUtils = {
  saveRoutesHaveName() {
    const routerList = [
      {"note":"观点详情","path":"/wm/viewPointDetail/"},
      {"note":"问答详情","path":"/wm/QuestionAndAnswerDetail/"},
      {"note":"交易中心","path":"/wm/portfolio/tradingCenterForTab"},
      {"note":"交易中心","path":"/wm/portfolio/tradingCenter/"},
      {"note":"组合详情","path":"/wm/portfolio/profolioDetail/"},
      {"note":"组合详情","path":"/wm/portfolio/profolioDetailForTab/"},
      {"note":"排行版","path":"/wm/portfolio/rankListContainer/"},
      {"note":"点评详情","path":"/wm/commentDetail/"},
      {"note":"新建组合","path":"/wm/portfolio/creatProfolio"},
      {"note":"个人中心","path":"/wm/personalCenter"},
      {"note":"新建/编辑资讯","path":"/wm/infomation/creatInfomation/"},
      {"note":"资讯详情","path":"/wm/infomation/informationDetail/"},
      {"note":"股票池详情","path":"/wm/stockPool/stockPoolDetail/"},
      {"note":"新建/编辑股票池","path":"/wm/stockPool/createStockPool/"},
      {"note":"炒股大赛","path":"/wm/speculateStockGame/speculateStockGameList"},
      {"note":"大赛详情","path":"/wm/speculateStockGame/speculateStockGameDetail/"},
      {"note":"大赛排名","path":"/wm/speculateStockGame/speculateStockGameRank/"},
      {"note":"资讯中心","path":"/wm/infomationCenter/homepage"},
      {"note":"促销活动查询","path":"/wm/productPromotionPage/SearchPage"},
      {"note":"投顾个人基本信息","path":"/wm/personal/BasicInfomation"},
      {"note":"资讯详情","path":"/DP/infomationCenter/detailPage/"}
    ];
    sessionStorage.setItem('routerListHaveNote', JSON.stringify(routerList));
    return routerList;
  },

  getRoutesHaveName() {
    // sessionStorage.removeItem('routerListHaveNote');
    const tempList = sessionStorage.getItem('routerListHaveNote');
    if (tempList) {
      const routerList = JSON.parse(tempList);
      return routerList;
    }
    return this.saveRoutesHaveName();
  },
  // 路径中包含的参数
  configPath(routerList) {
    if (routerList.length > 0) {
      const finalPathList = routerList.map((e) => {
        if (e.path.indexOf(':') !== -1) {
          return { note: e.note, path: e.path.substring(0, e.path.indexOf(':')) };
        }
        return { note: e.note, path: e.path };
      });
      return finalPathList;
    }
    return routerList;
  },

  cleanRouterList() {
    sessionStorage.setItem('routerListHaveNote', '');
  },

  // 删除tab导航 传url /wm/infomation/stockRecommendationsInfo
  handleDeleteUrl: (url = '', tabUrls = []) => {
    const removeIndex = tabUrls.findIndex((tabUrl) => { return tabUrl === url; });
    let { href } = window.location;
    href = href.substring(href.indexOf('#') + 1, href.length);
    // 如果关闭的是正在浏览的页面才进行跳转
    if (href === url) {
      // 跳转到临近的url（优先前一个）
      if (tabUrls.length > 0) {
        const tmplArr = [tabUrls[removeIndex - 1], tabUrls[removeIndex + 1]];
        const tmplHref = tmplArr[0] || tmplArr[1];
        window.location.href = `/#${tmplHref}`;
      }
    }
    // 删除对象缓存
    const urls = RecentlyVisiteUtils.mapUrls || [];
    const tmpl = urls.filter(item => item.url !== url);
    RecentlyVisiteUtils.mapUrls = tmpl;
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    // 删除session缓存
    const tmplSesn = recentlyVisitedUrls.filter(item => item.indexOf(`${url}|`) < 0);
    sessionStorage.setItem('recentlyVisited', tmplSesn);
  },
  // 由于新增编辑使用同一个页面，需要额外进行判断url的参数部分
  extraJudgeUrlList: [
    { path: '/wm/stockPool/createStockPool/eyJ0', note: '新增股票池' },
    { path: '/wm/stockPool/createStockPool/eyJj', note: '编辑股票池' },
    { path: '/wm/infomation/creatInfomation/eyJjemx4IjoiMS', note: '新增资讯' },
    { path: '/wm/infomation/creatInfomation/eyJjemx4IjoiMi', note: '编辑资讯' },
  ],
};


export default LocalPathUtils;
