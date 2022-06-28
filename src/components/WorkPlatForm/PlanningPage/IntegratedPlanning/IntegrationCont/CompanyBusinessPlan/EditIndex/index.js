import React from 'react';
import { Row, Col, message } from 'antd';
import SelectedFactor from './SelectedFactor';
import UnselectedFactor from './UnselectedFactor';
import { FetchQueryOrgList, FetchQueryCompanyBusplanBreak } from '../../../../../../../services/planning/planning';

class EditIndex extends React.Component {
    state = {
        allFactorData: [], //所有组织机构列表数据
        rightSelectFactorData: [], //右边表格 -已选组织机构数据
        leftUnselectFactorData: [],  //未选组织机构的列表数据
        totalItem: {
            orgId: '-1',
            idxName: "总计",
            distRatio: "0",
        },  //总计 项
        pageParam: {
            paging: 1,
            current: 1,
            pageSize: 999,
            total: -1,
            sort: '',
        }
    };

    componentDidMount() {
        this.fetchQueryOrgList();
    }

    fetchQueryOrgList = async () => {
        const { indexRow: { idxId = '', idxName = '' } } = this.props;
        const { pageParam, totalItem } = this.state;
        await FetchQueryCompanyBusplanBreak({
            yr: new Date().getFullYear(),
            idxId
        }).then((ret) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                const rightSelectFactorData = records;
                rightSelectFactorData.push(totalItem)
                this.setState({
                    rightSelectFactorData: rightSelectFactorData,
                })
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
        const { rightSelectFactorData = [] } = this.state;
        FetchQueryOrgList({
            planType: 2,
            ...pageParam
        }).then((ret) => {
            const { code = 0, records = [] } = ret;
            if (code > 0) {
                let list = [];
                const allArray = records.map(item => item.orgId);
                const rightArray = rightSelectFactorData.map(item => item.orgId);
                list = allArray.filter(item => {
                    return rightArray.indexOf(item) === -1;
                });
                let leftUnselectFactorData = [];
                records.forEach(element => {
                    if (list.indexOf(element.orgId) !== -1) {
                        const temp = { ...element, idxName: idxName }
                        leftUnselectFactorData.push(temp);
                    }
                });
                this.setState({
                    allFactorData: records,
                    leftUnselectFactorData: leftUnselectFactorData,
                })
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    //type 1|已选中列表中 删除因子，  2|未选因子列表中，点击因子,   3|
    changeFactorList = (record, type = "") => {
        const { indexRow: { idxName = '' } } = this.props;
        const { leftUnselectFactorData = [], rightSelectFactorData = [], totalItem } = this.state;

        if (type === "1") {
            //筛选出 非总计 和非删除的 的数据,保证总计项 在末尾
            const finalSelect = rightSelectFactorData.filter(item => item.orgId !== record.orgId && item.orgId !== '-1');
            this.setState({
                leftUnselectFactorData: [...leftUnselectFactorData, record],
                rightSelectFactorData: [...finalSelect, totalItem],
            }, () => {
            });
        } else if (type === '2') {
            const finalUnSelect = leftUnselectFactorData.filter(item => item.orgId !== record.orgId);
            //筛选出 非总计 的数据,保证总计项 在末尾
            const finalSelect = rightSelectFactorData.filter(item => item.orgId !== '-1');
            const item = { ...record, distRatio: '0', idxName: idxName }
            this.setState({
                leftUnselectFactorData: [...finalUnSelect],
                rightSelectFactorData: [item, ...finalSelect, totalItem]
            });
        } else if (type === '3') {
            //console.log('record', record)
            const index = rightSelectFactorData.findIndex(item => item.orgId === record.orgId);
            if (!!~index) {
                rightSelectFactorData[index] = record;
                this.setState({ rightSelectFactorData });
            }
        }
    }

    //保存时 获取已选的因子参数
    getSelectFactorParams = () => {
        if (this.selectedFactorRef) {
            const { state = {} } = this.selectedFactorRef;
            const { qzArr = [] } = state;
            return qzArr;
        }
        return [];
    }

    render() {
        const { rightSelectFactorData, leftUnselectFactorData } = this.state;

        return (
            <Row style={{ margin: "20px" }} >
                <Col span={7}>
                    <UnselectedFactor data={leftUnselectFactorData} changeFactorList={this.changeFactorList} />
                </Col>
                <Col span={2} style={{ position: "relative" }}>
                    <span style={{ position: "absolute", top: "70px", left: "40%" }}>
                        <i className="iconfont icon-left-line-arrow" ></i>
                    </span>

                </Col>
                <Col span={15}>
                    <SelectedFactor dataSource={rightSelectFactorData} changeFactorList={this.changeFactorList} ref={c => this.selectedFactorRef = c} />
                </Col>
            </Row >
        );
    }
}
export default EditIndex;
