/* eslint-disable array-callback-return */
/* eslint-disable react/no-did-mount-set-state */
import React, { Fragment } from 'react';
import { Row, Input, Menu } from 'antd';


const { Search } = Input;

// 员工定义-左边模块
class LeftContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyWord: '', // 关键字

    };
  }

  componentDidMount() {
    const defaultActiveKey = [];
    const { leftPanelList = [] } = this.props;
    leftPanelList.forEach((item) => {
      defaultActiveKey.push(item.ID);
    });
    this.setState({
      defaultActiveKey,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.leftPanelList !== this.props.leftPanelList) {
      const defaultActiveKey = [];
      const { leftPanelList = [] } = nextProps;

      leftPanelList.forEach((item) => {
        defaultActiveKey.push(item.ID);
      });
      this.setState({
        defaultActiveKey,
      });
    }
  }


    // 关键字搜索
    handleSearch = (value) => {
      const { onkeyWordSearch } = this.props;
      if (onkeyWordSearch && typeof onkeyWordSearch === 'function') {
        this.setState({
          keyWord: value,
        }, () => {
          onkeyWordSearch(value);
        });
      }
    }

    // 点击选择MOt事件
    onMotClick = (motId) => {
      const { onMotClick } = this.props;
      if (onMotClick && typeof onMotClick === 'function') {
        onMotClick(motId);
      }
    }


    // 关键字标红
    keySingleRender = (text, key) => {
      if (key && text && typeof text === 'string' && typeof key === 'string') {
        const newTextArr = text.split('').map((t) => {
          return key.indexOf(t) > -1 ? `<span style="color:red">${t}</span>` : t;
        });
        const newText = newTextArr.join('');
        return (<span dangerouslySetInnerHTML={{ __html: newText }} />);
      }
      return text;
    }

    // //折叠面板展开
    // onCollapseChange = (e) => {
    //     this.setState({
    //         defaultActiveKey: e

    //     }
    //     )
    // }

    onOpenChange = (openKeys) => {
      this.setState({ defaultActiveKey: openKeys });
    };


    render() {
      const { keyWord = '', defaultActiveKey = [] } = this.state;
      const { leftListData = [], leftPanelList = [], selectedMotId } = this.props;
      return (
        <Fragment>

          <Row style={{ overflow: 'auto', height: '700px', padding: '1rem 0 0 0' }}>
            <span style={{ display: 'flex', marginBottom: 8, padding: '0 1rem' }}>
              <Search placeholder="搜索" onChange={(e) => { this.handleSearch(e.target.value); }} className="mot-prod-search-input" />
            </span>
            <Menu
              mode="inline"
              openKeys={defaultActiveKey}
              onOpenChange={this.onOpenChange}

              selectedKeys={selectedMotId}
            >
              {
                            leftPanelList.map(item => (
                              <Menu.SubMenu
                                key={item.ID}
                                className="mot-factor-name"
                                title={
                                  <div>
                                    <span style={{ color: '#333333', fontWeight: 'bold' }}>{item.DIC_NOTE}</span>
                                  </div>
                                    }
                              >
                                {leftListData.map((childitem, childIndex) => {
                                        if (Number(childitem.sbrdStg) === Number(item.DIC_CODE)) {
                                            return (
                                              <Menu.Item key={childitem.evntId}>
                                                <div key={childIndex} style={{ cursor: 'pointer' }} onClick={() => { this.onMotClick(childitem.evntId); }}>

                                                  <div style={{ padding: '0 10px', display: 'inline-block' }} className="mot-yyb-hover">{this.keySingleRender(childitem.evntNm, keyWord)}</div>
                                                </div>

                                              </Menu.Item>

                                            );
                                        }
                                    })}

                              </Menu.SubMenu>
))
                        }

            </Menu>

            {/* <Collapse bordered={false} className='mot-collapse-bg mot-yyb-hideLine' activeKey={defaultActiveKey} onChange={(e) => this.onCollapseChange(e)}>
                        {
                            leftPanelList && leftPanelList.map((item) => {
                                return (
                                    <Panel header={item.DIC_NOTE} key={item.ID} >
                                        {leftListData.map((childitem, childIndex) => {
                                            if (Number(childitem.sbrdStg) === Number(item.DIC_CODE)) {
                                                return (
                                                    <div key={childIndex} style={{ padding: '8px 0', cursor: 'pointer' }} onClick={() => { this.onMotClick(childitem.evntId) }}>

                                                        <div style={{ padding: "0 10px", display: 'inline-block' }} className='mot-yyb-hover'>{this.keySingleRender(childitem.evntNm, keyWord)}</div>
                                                    </div>

                                                )
                                            }

                                        })}
                                    </Panel>
                                )
                            })
                        }
                    </Collapse> */}
          </Row>
        </Fragment>
      );
    }
}

// export default connect(({ motEvent, global }) => ({
//     dictionary: global.dictionary,
//     authorities: global.authorities,
// }))(RyMotDefineIndex);
export default LeftContent;
