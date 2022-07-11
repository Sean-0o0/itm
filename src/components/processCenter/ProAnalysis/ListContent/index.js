/* eslint-disable react/sort-comp */
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Row, Col, Input, Menu, Form } from 'antd';

/**
 * 左侧查询搜索组件
 */
class LeftSearchComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      modalTips: '',
      clickType: '',
      visibleAdd: false,
      openKeys: ['00'],
    };
  }

  //rootSubmenuKeys = this.props.rootSubmenuKeys;

  onClick = (e) => {
    this.props.setData('clickKeys', e.key);
    if(e.key === '00'){
      this.props.fetchAnalysisData(2,'');
      this.props.fetchAnalysisData(3,'');
      this.props.fetchAnalysisData(4,'');
    }else{
      this.props.fetchAnalysisData(5,e.key);
      this.props.fetchAnalysisData(6,e.key);
      this.props.fetchAnalysisData(7,e.key);
      this.props.fetchAnalysisData(8,e.key);
    }
  };

  // 关键字搜索
  handleOnkeyWord = (e) => {
    const keyWord = e.target.value;
    this.props.handleOnkeyWord(keyWord);
  }


  onOpenChange = (openKeys) => {
    //this.props.setData('openKeys', openKeys);
    let rootSubmenuKeys = this.props.rootSubmenuKeys;
   
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if(latestOpenKey === '00'){
      this.setState({ openKeys : ['00']});
    }else if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {

      this.setState({
        openKeys: latestOpenKey ? ['00',latestOpenKey] : [],
      });
    }
  };
  clickStep = (e) =>{
    this.props.clickStep(e.key);
  }
  render() {
    const { Data, clickKeys, searchValue } = this.props;
    return (
      <Fragment >
        
        <Row style={{ height: '100%' }}>
          <Scrollbars autoHide style={{ width: '100%', height: '100%' }} >
            <Col xs={24} sm={24} lg={24} xl={24} style={{ paddingTop: 10 }}>
              {/* 搜索框 */}
              <span style={{ display: 'flex', marginBottom: 8, paddingLeft: 24,paddingRight:24 }}>
                <Input.Search placeholder="请输入流程名称" onChange={this.handleOnkeyWord} className="mot-prod-search-input" />
              </span>
              <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.clickStep}
                selectedKeys={[clickKeys]}
              >
                <Menu.SubMenu className="mot-factor-name" key="00"                 
                    title={
                      <span style={{ color: '#333333', fontWeight: 'bold' }}>工作流统计分析</span>
                    }
                    onTitleClick = {this.onClick}
                  >
                {
                    Data.map(element =>{
                      return (<Menu.SubMenu key={element.element} title = {element.category} >
                        {
                          element.data.map(Item => {
                            const index = Item.wfName.indexOf(searchValue);
                            const beforeStr = Item.wfName.substr(0, index);
                            const afterStr = Item.wfName.substr(index + searchValue.length);
                            const title =
                              index > -1 ? (
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '80%' }}>
                                  <span >{beforeStr}</span>
                                  <span style={{ color: '#ff2300' }}>{searchValue}</span>
                                  <span >{afterStr}</span>
                                </div>
                              ) : (
                                <div>
                                  <span>{Item.wfName}</span>
                                </div>
                              );
                            
                              return ( <Menu.SubMenu key={Item.id} title = {title} onTitleClick = {this.onClick}> 
                                {
                                  Item.subMenu ? Item.subMenu.map(item => {                              
                                    return <Menu.Item key={item.stepId} > {item.stepName}</Menu.Item>
                                  }):""
                                }
                              </Menu.SubMenu>);
                            })
                        }
                        </Menu.SubMenu> );
                    })
                    
                }
                </Menu.SubMenu>
              </Menu>
            </Col>
          </Scrollbars>
        </Row>
      </Fragment>
    );
  }
}
export default Form.create()(LeftSearchComponent);
