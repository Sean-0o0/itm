/*
 * @Author:
 * @Date: 2021-02-27 14:15:46
 * @Description: 新增修改评价方案 评分规则-未选因子
 */
import React, { Component, Fragment } from 'react';
import { Row, Input, List } from 'antd';
// const { Search } = Input;
class UnselectedFactor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchWord: "",  //搜索的关键字，前端进行筛选
        };
    }

    //点击选择因子
    selectNode = (record) => {
        const { changeFactorList } = this.props;
        changeFactorList && changeFactorList(record, "2");
    }

    //搜索
    // onSearch = (value) => {
    //     this.setState({
    //         searchWord: value,
    //     }, ()=>{

    //     });
    // }

    render() {
        const { data = [] } = this.props;

        return (
            <Fragment>
                <Row style={{ marginLeft: "10px", display: "flex", alignItems: "center", position: "relative" }}>
                    <div >
                        <div className="ac-cpyj-title-point"></div>
                        <span style={{ marginLeft: "5px" }} className="ac-cpyj-title" >未选组织机构</span>
                    </div>
                    {/* <div style={{ position: "absolute", right: "0" }}>
                        <Search placeholder="筛选组织机构" className="m-input-search-white m-input  ac-cpyj-input" onSearch={this.onSearch} style={{ width: 200 }} />
                    </div> */}
                </Row>
                <Row className="ac-cpyj-collapse-slideBar">
                    <Row style={{ marginTop: "20px", maxHeight: "300px", overflowY: 'auto' }} >
                        {data && data.length > 0 && (
                            <List
                                className="ac-cpyj-collapse "
                                bordered
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item
                                        key={item.orgId}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { this.selectNode(item); }}>
                                        <div className="ac-cpyj-panel-node">
                                            <div className="ac-cpyj-panel-title">{item.orgName}</div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        )}
                    </Row>
                </Row>
            </Fragment>
        );
    }
}

export default UnselectedFactor;
