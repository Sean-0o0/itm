import React, { Component, Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input, Tree } from 'antd';

class BasicDataColTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '', // 搜索关键字
    };
  }

  // eslint-disable-next-line react/sort-comp
  getTreeData = (data) => {
    const treeData = [];
    data.forEach((item) => {
      const treeObj = {};
      treeObj.key = item.sbjDataDtlId;
      treeObj.title = item.sbjDataDtlName;
      treeData.push(treeObj);
    });
    return treeData;
  }

  onSelect = (item,info) => {
    const { editFmla } = this.props;
    if (editFmla) {
      editFmla('${' + item + '}');
    }
  }

  searchIndex = (e) => {
    this.setState({ keyWord: e.target.value })
  }
  render() {
    const { keyWord = '' } = this.state;
    const { basicDataCol = [] } = this.props;
    const filterTreeData = data =>
      data.map((item) => {
        const index = item.title.toLowerCase().indexOf(keyWord.toLowerCase());
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + keyWord.length);
        const selectStr = item.title.substr(index, keyWord.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ background: '#f50', color: '#fff' }}>{selectStr}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) { return { title, key: item.key, children: filterTreeData(item.children) }; }
        return { title, key: item.key };
      });
    return (
      <Fragment>
        <div style={{ border: '1px solid #e6e6e6' }}>
          {/* <div style={{ borderBottom: '1px solid rgb(230, 230, 230)', padding: '.5rem 1rem' }}>数据列选择</div> */}
          {/* <div style={{ padding: '.5rem 0 .5rem 2rem' }} className="esa-input-search"> */}
          <Input
            placeholder="输入关键字搜索"
            onChange={e => this.searchIndex(e)}
            style={{ width: '100%' }}
          />
          {/* </div> */}
          <div>
            <Scrollbars
              autoHide
              style={{ width: '100%', height: '18rem' }}
            >
              <Tree
                onSelect={this.onSelect}
                treeData={filterTreeData(this.getTreeData(basicDataCol))}
              />
            </Scrollbars>
          </div>
        </div>
      </Fragment>
    );
  }
}
export default BasicDataColTree;
