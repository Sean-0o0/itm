import React from 'react';
import { connect } from 'dva';
import { Icon, Divider } from 'antd';
import { withRouter } from 'dva/router';
import debounce from 'lodash/debounce';
import styles from './index.less';
import { suffix } from '../../../utils/config';
import RecentlyVisiteUtils from '../../../utils/recentlyVisiteUtils';

class RecentlyVisited extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHistory = debounce(this.onChangeHistory, props.wait);
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    // this.mapUrls = []; // 所有目录的url和名称
    this.node = null; // 元素的dom
    this.nodeWidth = 0;
    this.state = {
      isOnen: false,
      isBlock: false, // 是否块级元素
      urls: recentlyVisitedUrls,
      style: {
        right: '3rem',
      },
    };
  }
  componentWillMount() {
    this.unlisten = this.props.history.listen(this.onChangeHistory);
  }
  componentWillUnmount() {
    this.unlisten();
  }
  onChangeHistory = () => {
    const recentlyVisitedUrls = sessionStorage.getItem('recentlyVisited') ? sessionStorage.getItem('recentlyVisited').split(',') : [];
    this.setState({
      urls: recentlyVisitedUrls,
    });
  }
  ondragstart = (e) => { // 开始拖拽时
    // 记录刚一拖动位置
    const { offsetX, offsetY } = e;
    this.offsetX = offsetX || 0;
    this.offsetY = offsetY || 0;
    this.setState({
      isOnen: false,
    });
  }
  ondrag = () => { // 正在拖拽中
    // let x = e.pageX;
    // let y = e.pageY;
    // // drag事件最后一刻，无法读取鼠标的坐标，pageX和pageY都变为0
    // if (x === 0 && y === 0) {
    //   return; // 不处理拖动最后一刻X和Y都为0的情形
    // }
    // x -= this.offsetX;
    // y -= this.offsetY;
    // x = x >= 500 ? x : 500;
    // const right = document.body.clientWidth - x;
    // this.setState({
    //   isOnen: false,
    //   isBlock: x <= this.nodeWidth + 40, // 当宽度小于nodeWidth时候，变为块级元素
    //   style: {
    //     right,
    //   },
    // });
  }
  ondragend = (event) => { // 拖拽结束
    let x = event.pageX;
    let y = event.pageY;
    // drag事件最后一刻，无法读取鼠标的坐标，pageX和pageY都变为0
    if (x === 0 && y === 0) {
      return; // 不处理拖动最后一刻X和Y都为0的情形
    }
    x -= this.offsetX;
    y -= this.offsetY;
    x = x >= 500 ? x : 500;
    const right = document.body.clientWidth - x;
    this.setState({
      isOnen: false,
      isBlock: x <= this.nodeWidth + 40, // 当宽度小于nodeWidth时候，变为块级元素
      style: {
        right,
      },
    });
  }
  onMouseEnter = () => { // 鼠标进入事件
    this.setState({ isOnen: true });
  }
  onReady = (c) => {
    if (c) {
      this.node = c;
    }
  }
  getNameAndUrl=(value) => { // 遍历目录树 找到url 和name
    const { url = '', title = [], menu = {} } = value;
    if (url && title.length > 0) {
      RecentlyVisiteUtils.mapUrls.push({
        url,
        name: title[0].text,
      });
    }
    if (Reflect.has(menu, 'item')) {
      menu.item.forEach((tempItem) => {
        this.getNameAndUrl(tempItem);
      });
    }
  }
  /**
   * 路由后缀处理
   */
  concatSuffix = (menuData) => {
    const suffixWithDot = `${suffix ? `.${suffix}` : ''}`;
    return menuData.map((item) => {
      const finalItem = { ...item };
      if (item.url && !item.url.endsWith(suffixWithDot)) {
        finalItem.url = `${item.url}${suffixWithDot}`;
      }
      if (item.menu && item.menu.length > 0) {
        finalItem.menu = this.concatSuffix(item.menu);
      }
      return finalItem;
    });
  }
  render() {
    const { menuTree = [] } = this.props;
    // 处理菜单路径的后缀
    const finalMenuData = [];
    RecentlyVisiteUtils.mapUrls = [];
    if (suffix) {
      finalMenuData.push(...this.concatSuffix(menuTree));
    } else {
      finalMenuData.push(...menuTree);
    }
    finalMenuData.forEach((item) => {
      this.getNameAndUrl(item);
    });
    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={() => { this.setState({ isOnen: false }); }}
        onMouseDown={() => { // 获取组件的宽度
          const { offsetWidth } = this.node;
          this.nodeWidth = offsetWidth >= this.nodeWidth ? offsetWidth : this.nodeWidth;
          this.setState({ isOnen: false });// 处理拖拽的阴影定位不正确的情况
        }}
        className={`${styles.recentlyVisited_box}`}
        style={{ ...this.state.style }}
        onDragStart={this.ondragstart}
        onDrag={this.ondrag}
        onDragEnd={this.ondragend}
        ref={this.onReady}
        draggable
      >
        <div
          className={`${styles.m_btn} ${this.state.isOnen ? styles.m_btn_open : styles.m_btn_close}`}
        >
          <span>
            {/* <span style={{ display: this.state.isOnen ? '' : 'none' }} className={styles.m_link} >历史记录：</span> */}
            {
            this.state.urls.map((item, index) => {
              const url = item.substring(0, item.indexOf('|'));
              let name = item.substring(item.indexOf('|') + 1);
              if (!name || name === '') {
                const tempIndex = RecentlyVisiteUtils.mapUrls.findIndex((tempItem) => { return tempItem.url === url; });
                name = tempIndex >= 0 ? RecentlyVisiteUtils.mapUrls[tempIndex].name : '';
              }
              const blockStyle = this.state.isBlock ? 'block' : '';
              return (
                <span key={`${item}_${index}`} style={{ display: this.state.isOnen ? blockStyle : 'none', margin: this.state.isBlock ? '1rem' : '' }}>
                  {/* {index === 0 ? <span style={{ display: this.state.isOnen ? '' : 'none' }} className={styles.m_link} >历史记录：</span> : null} */}
                  {name && <a onMouseDown={(e) => { e.stopPropagation(); RecentlyVisiteUtils.saveRecentlyVisiteUtils(url, '', name); }} className={styles.m_link} href={`/#${url}`}>{name}</a>}
                  {name && <Divider style={{ display: this.state.isBlock ? 'none' : '' }} type="vertical" />}
                </span>
              );
            })
          }
            <Icon
              draggable="true"
              style={{ display: this.state.isBlock && this.state.isOnen ? 'none' : '', margin: '1rem', fontSize: '1.5rem', cursor: 'pointer', color: '#313131' }}
              type={this.state.isOnen ? 'double-right' : 'double-left'}
            />
          </span>
        </div>
      </div>
    );
  }
}
export default withRouter(connect(({ mainPage }) => ({
  menuTree: mainPage.menuTree,
}))(RecentlyVisited));
