import React from 'react';
import { Row, Col, Button, message } from 'antd';
import OperationList from './OperationList';
import BasicIndexTable from '../../../Common/BasicIndexTable';
import BasicModal from '../../../../../Common/BasicModal';
import EditIndex from './EditIndex';
import { FetchQueryCompanyBusplan, BreakCompanyBusplan } from '../../../../../../services/planning/planning';
import { connect } from 'dva';

class CompanyBusinessPlan extends React.Component {
    state = {
        data: [],
        record: {}
    };

    componentDidMount() {
        this.fetchQueryCompanyBusplan();
    }

    fetchQueryCompanyBusplan = () => {
        FetchQueryCompanyBusplan({
            yr: new Date().getFullYear()
        }).then((ret) => {
            this.setState({
                data: ret.records
            })
        })
    }

    refresh = () => {
        this.fetchQueryCompanyBusplan();
    }

    getColumns = (idxClass) => {
        let columns = [];
        if (idxClass === 1) {
            columns = [{
                columnName: '指标类别',
                colSpan: 1,
                width: '10%',
                dataIndex: 'idxClassName',
                type: '1',
                align: 'center'
            },
            {
                columnName: '指标类型',
                colSpan: 1,
                dataIndex: 'idxTypeName',
                type: '1',
                align: 'center'
            },
            {
                columnName: '指标名称',
                colSpan: 1,
                dataIndex: 'idxName',
                type: '1',
                align: 'center'
            },
            {
                columnName: '当年计划',
                colSpan: 1,
                dataIndex: 'planNum',
                type: '1',
                align: 'center'
            },
            {
                columnName: '上一期数据',
                colSpan: 1,
                dataIndex: 'lastNum',
                type: '1',
                align: 'center'
            },
            {
                columnName: '同比变化',
                colSpan: 1,
                label: '1',
                dataIndex: 'change',
                type: '1',
                align: 'center'
            },
            ];
        } else {
            columns = [{
                columnName: '指标类别',
                colSpan: 1,
                width: '10%',
                dataIndex: 'idxTypeName',
                type: '1',
                align: 'center'
            },
            {
                columnName: '',
                colSpan: 1,
                dataIndex: 'keyWork',
                type: '1',
                align: 'center'
            }
            ];
        }
        return columns;
    }

    editIndex = (record) => {
        this.setState({
            record: record,
        }, () => {
            this.showModal();
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    closeModal = () => {
        this.setState({
            visible: false,
        }, () => {
            this.refresh();
        });
    }

    //弹窗确认点击
    handleOk = () => {
        const { record: { idxId = '' } } = this.state;

        //获取评分规则的参数
        let gradeRulesParams = [];
        if (this.gradeRulesRef) {
            gradeRulesParams = this.gradeRulesRef.getSelectFactorParams();
        }
        let zbArr = [];
        let total = 0;
        gradeRulesParams && gradeRulesParams.forEach(item => {
            const obj = {
                ORG_ID: Number(item.orgId),
                DIST_RATIO: Number(item.distRatio),
            };
            zbArr.push(obj);
            total += Number(item.distRatio);
        });

        // 经营指标分解去除100%限制
        // if (total > 1) {
        //     message.warn("已选组织机构的权重和必须小于或等于100");
        //     return;
        // }

        const params = {
            idxId: idxId,
            orgId: zbArr.length === 0 ? "" : JSON.stringify(zbArr),
            yr: new Date().getFullYear()
        };
        this.breakCompanyBusplan(params);
    }

    //评价方案维护
    breakCompanyBusplan = (params = {}) => {
        BreakCompanyBusplan(params).then((response) => {
            const { code = 0 } = response;
            if (code > 0) {
                message.success("操作成功");
                this.closeModal();
                this.refresh();
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }


    //渲染底部按钮
    renderFooter() {

        return (
            <div style={{ textAlign: "end" }}>
                <Button className="m-btn-radius m-btn-white" onClick={this.closeModal} style={{ fontSize: 'unset' }}>取 消</Button>
                <Button type="primary" className="m-btn-radius m-btn-headColor" onClick={this.handleOk} style={{ fontSize: 'unset' }}>保存</Button>
            </div>
        );
    }

    render() {
        const { data, record } = this.state;
        const { authorities: { companyBusPlan = [] } } = this.props;
        let headerData = [];
        let footerData = [];
        data.forEach(item => {
            if (item.idxClass === '1') {
                headerData.push(item)
            } else {
                footerData.push(item)
            }
        })

        return (
            <Row>
                <Col span={24}>
                    <OperationList refresh={this.refresh} companyBusPlan={companyBusPlan}/>
                </Col>
                <Col span={24} style={{padding:'0 2rem'}}>
                    <BasicIndexTable
                        data={headerData}
                        column={this.getColumns(1)}
                        sortColumn={1}
                        operation={companyBusPlan.includes("companyBusPlanBreak")&&2}
                        editIndex={this.editIndex}
                        onRef={(ref) => this.child1 = ref} />
                    <BasicIndexTable
                        data={footerData}
                        column={this.getColumns(2)}
                        showHeader={false}
                        onRef={(ref) => this.child2 = ref} />
                </Col>
                {/* 分解 */}
                <BasicModal
                    visible={this.state.visible}
                    onCancel={this.closeModal}
                    style={{ /* height: '20rem' */ }}
                    width="80rem"
                    title="经营计划分解"
                    footer={this.renderFooter()}
                >
                    <EditIndex indexRow={record} ref={c => this.gradeRulesRef = c} />
                </BasicModal>
            </Row>
        );
    }
}
export default connect(({ global = {} }) => ({
  authorities: global.authorities,
}))(CompanyBusinessPlan);
