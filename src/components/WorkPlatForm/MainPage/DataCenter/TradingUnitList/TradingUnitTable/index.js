import React from 'react';
import { Button, message, Modal } from 'antd';
import TradingUnitTableCont from './TradingUnitTableCont';
import TreeSelectTransfer from './TreeSelectTransfer';
import ModifyModel from './ModifyModel';
import { FetchQueryMarketUnitCol } from '../../../../../../services/dataCenter';
import config from '../../../../../../utils/config';

const { api } = config;
const { dataCenter: { exportMarketUnitList } } = api;

class TradingUnitTable extends React.Component {

    state = {
        mockData: [],
        targetKeys: [],
        titles: [],
        visible: true,
        modifyVisible: false,
        selectedRow: {},
        type: ''
    }

    componentWillMount() {
        this.fetchQueryMarketUnitCol(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.fetchQueryMarketUnitCol(nextProps)
    }

    fetchQueryMarketUnitCol = (props) => {
        const { params = {} } = props;
        FetchQueryMarketUnitCol({
            ...params
        })
            .then((res = {}) => {
                let { code, records = [] } = res;
                if (code > 0) {
                    records = records.sort((x, y) => x.order - y.order);
                    let targetKeys = records.map(item => item.key || '')
                    let titles = records.map(item => item.title || '')

                    targetKeys = targetKeys.filter((item, index) => {
                        if (isNaN(Number(records[index].key, 10))) {
                            return targetKeys.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
                        } else {
                            return false
                        }

                    });
                    titles = titles.filter((item, index) => {
                        if (isNaN(Number(records[index].key, 10))) {
                            return titles.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
                        } else {
                            return false
                        }

                    });
                    this.setState({
                        mockData: records,
                        targetKeys: targetKeys,
                        titles: titles
                    })
                }
            }).catch((e) => {
                message.error(!e.success ? e.message : e.note);
            });
    }

    handleModifyVisible = (value, type = '', isRefresh) => {
        const { selectedRow = {} } = this.state;
        if (value === true && type === '修改' && Object.keys(selectedRow).length === 0) {
            message.warn("请选择账户！")
        } else {
            if (value === false) {
                this.setState(
                    {
                        modifyVisible: value,
                        type: type,
                        selectedRow: {},
                    }, () => {
                        if (isRefresh === 1) {
                            this.props.queryList()
                        }
                    }
                )
            } else {
                this.setState(
                    {
                        modifyVisible: value,
                        type: type,
                    }, () => {
                        if (isRefresh === 1) {
                            this.props.queryList()
                        }
                    }
                )
            }
        }
    }
    changeDisplayColumn = (value = []) => {
        const newArr = value.filter((item, index) => {
            return value.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
        });
        this.setState({
            targetKeys: newArr,
        })

    }
    changeSelectedRow = (value = []) => {
        this.setState({
            selectedRow: value,
        }, () => {
            this.handleModifyVisible(true, '修改')
        })
    }

    // 导出全部数据
    export = () => {
        const { total, titles, targetKeys } = this.state;
        const { params = {} } = this.props;
        const iframe = this.ifile; // iframe的dom
        if (total === 0) {
            Modal.info({ content: '暂无可导出数据!' });
            return;
        }

        Modal.confirm({
            title: '提示：',
            content: `是否导出数据？`,
            okText: '确定',
            cancelText: '取消',
            onOk() {
                const tableHeaderNames = titles;
                tableHeaderNames.unshift();
                const tableHeaderCodes = targetKeys;
                tableHeaderCodes.unshift();
                const exportPayload = JSON.stringify({
                    isAllSel: 1,
                    unSelectRowKey: '',
                    queryMarketUnitListModel: {
                        ...params
                    },
                    tableHeaderNames: tableHeaderNames.join(','),
                    tableHeaderCodes: tableHeaderCodes.join(','),
                    tableName: "交易单元列表",
                });
                //console.log(exportPayload)
                const actionUrl = exportMarketUnitList;
                // 创建一个表单
                const downloadForm = document.createElement('form');
                downloadForm.id = 'downloadForm';
                downloadForm.name = 'downloadForm';
                // 创建一个输入框
                const input = document.createElement('input');
                input.type = 'text';
                input.name = 'exportPayload';
                input.value = exportPayload;
                // 将该输入框插入到 form 中
                downloadForm.appendChild(input);
                // form 的提交方式
                downloadForm.method = 'POST';
                // form 提交路径
                downloadForm.action = actionUrl;
                // 添加到 body 中
                iframe.appendChild(downloadForm);
                // 对该 form 执行提交
                downloadForm.submit();
                // 删除该 form
                iframe.removeChild(downloadForm);
            },
        });
    }

    render() {
        const { visible = false, titles = [], type = '', selectedRow = {}, modifyVisible = false, mockData = [], targetKeys = [] } = this.state;
        const { ywzl = [], org = [], ltq = [], queryList, data = [], params = {}, dictionary = {}, config = {} } = this.props;

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    {/* <Button className="opt-button" onClick={() => { this.handleModifyVisible(true) }}>修改</Button> */}
                    <Button className="opt-button" style={{ margin: '.7rem .7rem .7rem 0' }} onClick={this.export}>导出</Button>
                    {/* <Button className="opt-button" style={{ margin: '.7rem' }} onClick={() => { this.handleDisplayVisible(true) }}>自定义展示列</Button> */}
                    <TreeSelectTransfer titles={titles} targetKeys={targetKeys} mockData={mockData} changeDisplayColumn={this.changeDisplayColumn} visible={visible} />
                </div>
                <TradingUnitTableCont config={config} dictionary={dictionary} params={params} data={data} queryList={queryList} targetKeys={targetKeys} mockData={mockData} changeSelectedRow={this.changeSelectedRow} />
                {modifyVisible && <ModifyModel ywzl={ywzl} org={org} ltq={ltq} dictionary={dictionary} type={type} selectedRow={selectedRow} visible={modifyVisible} handleDisplayVisible={this.handleModifyVisible} />}
                <iframe title="下载" id="m_iframe" ref={(c) => { this.ifile = c; }} style={{ display: 'none' }} />
            </div>

        );
    }
}

export default TradingUnitTable;