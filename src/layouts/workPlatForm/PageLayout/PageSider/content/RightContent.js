import React from 'react';
import { Link } from 'dva/router';
import lodash from 'lodash';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

// 用于生成uuid
const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); // eslint-disable-line
};
const guid = () => {
  return (`${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`);
};

class RightContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expendKey: this.props.expendKey,
      selectedMenuKeys: this.props.selectedMenuKeys,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.editExpendKey(nextProps.expendKey, nextProps.selectedMenuKeys);
  }
  menuLangKey = (item = {}) => {
    const langKeys = lodash.get(item, 'title', []).filter(m => lodash.get(m, 'lang') === 'en') || [];
    if (langKeys.length > 0) {
      return lodash.get(langKeys, '[0].text', '');
    }
    return lodash.get(item, 'title[0].text', '');
  }
  editExpendKey = (key, selectedMenuKeys) => {
    this.setState({
      expendKey: key,
      selectedMenuKeys,
    });
  }
  buildDt = (subMenuItem) => {
    const { selectedMenuKeys } = this.state;
    const hasChild = lodash.get(subMenuItem, 'menu.item', []).length !== 0;
    const itemPath = lodash.get(subMenuItem, 'url', '');
    const toLinkObj = {
      pathname: itemPath,
    };
    if (!hasChild) {
      if (/^https?:\/\//.test(itemPath)) {
        return (
          <dt key={guid()} className="m-item-title">
            <a
              className={`m-item-title-link ${selectedMenuKeys.includes(this.menuLangKey(subMenuItem)) ? 'm-subMenuItem-selected' : ''}`}
              href={itemPath}
              target={subMenuItem.windowType === 1 ? '_blank' : ''}
            >
              {lodash.get(subMenuItem, 'title[0].text', '')}
              <i className="iconfont icon-left-line-arrow" />
            </a>
          </dt>
        );
      }
      return (
        <dt key={guid()} className="m-item-title">
          <Link
            className={`m-item-title-link ${selectedMenuKeys.includes(this.menuLangKey(subMenuItem)) ? 'm-subMenuItem-selected' : ''}`}
            to={toLinkObj}
            target={lodash.get(subMenuItem, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
            replace={itemPath === this.props.location.pathname}
          >
            {lodash.get(subMenuItem, 'title[0].text', '')}
            <i className="iconfont icon-left-line-arrow" />
          </Link>
        </dt>
      );
    }
    return (
      <dt
        key={guid()}
        className="m-item-title"
      >
        <a
          className={`m-item-title-link ${selectedMenuKeys.includes(this.menuLangKey(subMenuItem)) ? 'm-subMenuItem-selected' : ''}`}
          style={{ cursor: 'default' }}
        >
          {lodash.get(subMenuItem, 'title[0].text', '')}<i className="iconfont icon-left-line-arrow" />
        </a>
      </dt>
    );
  }
  buildDd = (item) => {
    const { selectedMenuKeys } = this.state;
    const leafItems = lodash.get(item, 'menu.item', []);
    return leafItems.map((leafItem) => {
      const itemPath = lodash.get(leafItem, 'url', '');
      const toLinkObj = {
        pathname: itemPath,
      };
      if (/^https?:\/\//.test(itemPath)) {
        return (
          <a
            key={guid()}
            className="m-item-title-link"
            href={itemPath}
            target={leafItem.windowType === 1 ? '_blank' : ''}
          >
            <span style={{ padding: '0.3rem 1rem 0.3rem 1rem' }} className={selectedMenuKeys.includes(this.menuLangKey(leafItem)) ? 'm-subMenuItem-selected' : ''}>{lodash.get(leafItem, 'title[0].text', '')}</span>
          </a>
        );
      }
      return (
        <Link
          key={guid()}
          className="m-item-cont-link"
          to={toLinkObj}
          target={lodash.get(leafItem, 'windowType', '0') === 1 ? '_blank' : ''} // windowType: 0| 当前页面 1|弹出新页面 2|对话框模式
          replace={itemPath === this.props.location.pathname}
        >
          <span style={{ padding: '0.3rem 1rem 0.3rem 1rem' }} className={selectedMenuKeys.includes(this.menuLangKey(leafItem)) ? 'm-subMenuItem-selected' : ''}>{lodash.get(leafItem, 'title[0].text', '')}</span>
        </Link>
      );
    });
  }

  hasChildItems = (expendKey, menuTree) => {
    if (expendKey !== '') {
      const menuItems = menuTree.filter(item => this.menuLangKey(item) === expendKey);
      return menuItems.some(item => lodash.get(item, 'menu.item') && lodash.get(item, 'menu.item').length > 0);
    }
    return false;
  }

  render() {
    const { menuTree = {}, location = { pathname, search } } = this.props; // eslint-disable-line
    const { expendKey } = this.state;
    const showChild = this.hasChildItems(expendKey, menuTree);
    return (
      <div
        className="m-secmenu-place"
        id="subMenuDiv"
        style={{ display: showChild ? 'block' : 'none', zIndex: 1000, marginLeft: '20.6rem', marginTop: '5.13rem', width: '50rem', height: document.documentElement.clientHeight - 64, position: 'fixed' }}
        // onMouseEnter={this.rightMenuMouseEnter}
      >
        <Scrollbars
          autoHide={false}
          style={{ width: '100%', minHeight: document.documentElement.clientHeight - 64 }}
          className={styles.rightScrollBars}
        >
          <div>
            {
              menuTree.map((item) => {
                const subMenuTree = lodash.get(item, 'menu.item', []);
                const hasChild = subMenuTree.length !== 0;
                if (hasChild) {
                  return (
                    <div key={guid()} className="m-secmenu-box" style={{ display: expendKey === this.menuLangKey(item) ? 'block' : 'none' }}>
                      {
                        subMenuTree.map((subMenuItem) => {
                          return (
                            <dl key={guid()} className="m-secmenu-item">
                              {this.buildDt(subMenuItem)}
                              <dd className="m-item-cont">
                                {this.buildDd(subMenuItem)}
                              </dd>
                            </dl>
                          );
                        })
                      }
                    </div>
                  );
                }
                return true;
              })
            }
          </div>
        </Scrollbars>
      </div>
    );
  }
}
export default RightContent;
