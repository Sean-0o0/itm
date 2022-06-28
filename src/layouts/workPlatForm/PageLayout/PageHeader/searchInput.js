import React from 'react';
import { connect } from 'dva';
import lodash from 'lodash';
import classnames from 'classnames';
import { Input, AutoComplete, Icon, message } from 'antd';
import { Link } from 'dva/router';
import debounce from 'lodash.debounce';
import { FetchCustomerTips } from '../../../../services/customersenior/simpleCustomerList';
import { FetchQueryProductTips } from '../../../../services/financialproducts';
// import { FetchQueryStaffTips } from '../../../../../services/staffrelationship';
import { HighLightKeyword } from '../../../../components/Common/TextHandler/HtmlToText';
import { EncryptBase64 } from '../../../../components/Common/Encrypt';
import styles from './searchInput.less';

const Option = AutoComplete.Option; // eslint-disable-line
const OptGroup = AutoComplete.OptGroup; // eslint-disable-line

class SearchInput extends React.Component {
  constructor() {
    super();
    this.fetchDatas = debounce(this.fetchDatas, 200);// 强制一个函数在某个连续时间段内只执行一次
  }
  state={
    // widths: '17rem',
    menuList: [], // 当前方案的菜单数据
    menuCount: 0,
    customerList: [],
    customerCount: 0,
    productList: [],
    productCount: 0,
    // fetching: false,
    fillValue: '',
    isFirstSearch: true,
  }

  handleAutoCompleteOnClick = (value, isFirstSearch) => {
    if (!value || isFirstSearch) {
      this.handleSearch('');
    }
  }
  handleSearch = (value) => {
    const valueFormat = value.replace(/'/g, '');
    if (this.state.isFirstSearch && value !== '') {
      this.setState({
        isFirstSearch: false,
      });
    }
    this.setState({
      menuList: [],
      customerList: [],
      productList: [],
    });
    this.fetchDatas(valueFormat);
  }

  fetchDatas = (value) => {
    if (value !== '') {
      this.handleSearchMenuList(value);
      this.handleSearchCustomerList(value);
      this.handleSearchProductList(value);
    }
  }

  handleHighlightKeyword = (text) => {
    const { fillValue = '' } = this.state;
    return HighLightKeyword(text, fillValue, true);
  }

  // 处理菜单数据
  handleSearchMenuList = (value) => {
    const getMenuDataList = (list = [], menuTree) => {
      menuTree.forEach((m) => {
        list.push(m);
        const children = lodash.get(m, 'menu.item', []);
        if (children.length) {
          return getMenuDataList(list, children);
        }
      });
      return list;
    };
    const { menuTree = [] } = this.props;
    let tmpl = getMenuDataList([], menuTree);
    // 筛选出菜单名称包含关键字的
    tmpl = tmpl.filter(m => m.url && lodash.get(m, 'title[0].text', '').indexOf(value) > -1);
    // 名称和url对象
    const tmplMenus = tmpl.map((m, i) => ({
      key: i,
      title: lodash.get(m, 'title[0].text', ''),
      dm: m.url,
      highLightKey: this.handleHighlightKeyword(lodash.get(m, 'title[0].text', '')),
    }));
    this.setState({
      menuList: tmplMenus,
      menuCount: tmplMenus.length,
    });
  }

  // 模糊搜索客户
  handleSearchCustomerList = (value) => {
    const khfwDatas = [];
    const { authorities } = this.props;
    // 查询客户范围
    if (Reflect.has(authorities, 'myCustomerRole')) {
      khfwDatas.push(1);
    }
    if (Reflect.has(authorities, 'teamCustomerRole')) {
      khfwDatas.push(2);
    }
    if (Reflect.has(authorities, 'departmentCustomerRole')) {
      khfwDatas.push(3);
    }
    if (khfwDatas.length === 0) {
      khfwDatas.push(1);
    }
    FetchCustomerTips({
      keyword: value,
      customerQueryType: khfwDatas,
      queryItems: [
        'customer_no', 'customer_name', 'customer_id',
      ],
    }).then((response) => {
      const { data = [], count = 0 } = response;
      const dataSource = [];
      data.forEach((element) => {
        const tempObject = {};
        if (element instanceof Object) {
          const keys = Object.keys(element);
          keys.forEach((key) => {
            if (element[key] instanceof Object) {
              const secondKeys = Object.keys(element[key]);
              secondKeys.forEach((secondKey) => {
                tempObject[`${key}.${secondKey}`] = element[key][secondKey];
              });
            } else {
              tempObject[key] = element[key];
            }
          });
          dataSource.push({
            key: tempObject.customer_id,
            // value: tempObject.customer_id,
            title: tempObject.customer_name,
            dm: tempObject.customer_no,
            // counts: count,
            highLightKey: this.handleHighlightKeyword(tempObject.customer_no),
          });
        }
      });
      this.setState({
        customerList: dataSource,
        customerCount: count,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  // 模糊搜索产品
  handleSearchProductList = (value) => {
    FetchQueryProductTips({
      paging: 1,
      current: 1,
      pageSize: 10,
      total: -1,
      sort: '',
      keyword: value,
    }).then((response) => {
      const { records = [], total = 0 } = response;
      const dataSource = [];
      records.forEach((item) => {
        dataSource.push({
          key: item.cpid,
          // id: item.cpid,
          dm: item.cpdm,
          title: item.cpmc,
          highLightKey: this.handleHighlightKeyword(item.cpdm),
        });
      });
      this.setState({
        productList: dataSource,
        productCount: total,
      });
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }
  renderTitle = (title) => {
    return (
      <span>
        {title.name}
        <span className="blue" style={{ float: 'right' }}>共{title.count}条</span>
      </span>
    );
  }
  renderChlidren= (list) => {
    const result = [];
    list.forEach((item) => {
      result.push({
        title: item.title,
        dm: item.dm,
        key: item.key,
        highLightKey: item.highLightKey,
      });
    });
    return result;
  }
  renderListResult = (menuCount, customerCount, productCount, menuList, customerList, productList) => {
    // 根据不同的结果数量展示不一样的
    // 需要展示的数据数组
    let showCountArr = [
      { key: 0, count: menuCount, list: menuList },
      { key: 1, count: customerCount, list: customerList },
      { key: 2, count: productCount, list: productList },
    ];
    // 每种展示多少条
    let countPerList = 0;
    showCountArr = showCountArr.filter(m => m.count !== 0);
    if (showCountArr.length === 0) {
      countPerList = 0;
    } else if (showCountArr.length === 1) {
      countPerList = 9;
    } else if (showCountArr.length === 2) {
      countPerList = 4;
    } else if (showCountArr.length === 3) {
      countPerList = 3;
    }
    const result = {};
    if (countPerList) {
      showCountArr.forEach((m) => {
        result[`result${m.key}`] = this.renderChlidren((m.list || []).slice(0, countPerList));
      });
    }
    return result;
  }

  hanleChange = (value) => {
    this.setState({
      fillValue: value,
    });
  }

  render() {
    const { menuCount = 0, customerCount = 0, productCount = 0, menuList = [], customerList = [], productList = [], isFirstSearch = true, fillValue = '' } = this.state;
    const { result0, result1, result2 } = this.renderListResult(menuCount, customerCount, productCount, menuList, customerList, productList);
    // 组建数据源 四种情况
    const dataSource = [];
    if (menuCount) {
      dataSource.push({
        key: 0,
        title: {
          name: '菜单',
          count: menuCount,
        },
        children: result0,
      });
    }
    if (customerCount) {
      dataSource.push({
        key: 1,
        title: {
          name: '客户',
          count: customerCount,
        },
        children: result1,
      });
    }
    if (productCount) {
      dataSource.push({
        key: 2,
        title: {
          name: '产品',
          count: productCount,
        },
        children: result2,
      });
    }
    if (!(menuCount || customerCount || productCount)) {
      dataSource.push({
        key: '#',
        title: {
          name: '无结果',
          count: 0,
        },
        children: [{
          title: '',
          key: ' ',
          dm: '',
          noData: '换个关键词试试!',
        }],
      });
    }
    const options = dataSource.map((group, index) => (
      <OptGroup
        key={index}
        label={this.renderTitle(group.title)}
      >
        {group.children.map((opt) => {
          let linkUrl = '';
          if (group.key === 0) {
            linkUrl = `${opt.dm}`;
          } else if (group.key === 1) {
            linkUrl = `/customerPanorama/index/${EncryptBase64(opt.key)}`;
          } else if (group.key === 2) {
            linkUrl = `/productPanorama/index/${EncryptBase64(opt.key)}`;
          }
          return (
            group.key === 0 ? (
              <Option key={`${group.key}-${opt.key}-${opt.title}`} value={opt.title}>
                <Link to={linkUrl} style={{ color: '#2daae4', width: '100%', display: 'block' }}>
                  <span dangerouslySetInnerHTML={{ __html: opt.highLightKey }} />
                </Link>
              </Option>
            ) : (
                linkUrl && (
                  <Option key={`${group.key}-${opt.key}-${opt.title}`} value={`${opt.dm}  ${opt.title}`.trim()}>
                    <Link to={linkUrl} target="_blank" style={{ color: '#2daae4', width: '100%', display: 'block' }}>
                      <span dangerouslySetInnerHTML={{ __html: opt.highLightKey }} />&nbsp;{opt.title}
                    </Link>
                  </Option>
                )
            )
          );
        })}
      </OptGroup>
    ));
    return (
      <div id="SearchInput_pageheader" style={{ width: '100%' }} >
        <AutoComplete
          allowClear
          className={classnames('certain-category-search', styles.searchInput)}
          dropdownClassName="certain-category-search-dropdown"
          dropdownMatchSelectWidth={false}
          dropdownStyle={{ width: '17rem', zIndex: 999, top: '36px', position: 'fixed' }}
          style={{ width: '100%', color: '#6E6E6E' }}
          dataSource={options}
          placeholder="菜单/客户/产品"
          optionLabelProp="value"
          onChange={this.hanleChange}
          // getPopupContainer={hasFathter ? () => document.getElementById('SearchInput_pageheader') : () => document.body}
          // placeholder="证券/产品"
          value={fillValue}
          onSearch={(value) => { this.handleSearch(value); }}
        >
          <Input
            onClick={() => this.handleAutoCompleteOnClick(fillValue, isFirstSearch)}
            suffix={fillValue ? <span /> : <Icon type="search" className="certain-category-icon" />}
          />
        </AutoComplete>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  authorities: global.authorities,
}))(SearchInput);
