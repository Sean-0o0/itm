import React from 'react';
import { Button, message } from 'antd';
import TreeSelectTransfer from './TreeSelectTransfer';
import TradingUnitTableCont from './TradingUnitTableCont';
import BasicModal from '../../../../../Common/BasicModal';
import BridgeModel from '../../../../../Common/BasicModal/BridgeModel';
import { FetchQueryMarketUnitCol, UpdateMarketUnitList } from '../../../../../../services/dataCenter';
class TradingUnitTable extends React.Component {
    state = {
        mockData: [],
        targetKeys: [],
        titles: [],
        visible: false,
        updateVisible: false,
        importVisible: false,
        isDiff: false
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

    changeDisplayColumn = (value = []) => {
        const newArr = value.filter((item, index) => {
            return value.indexOf(item) === index;  // 因为indexOf 只能查找到第一个  
        });
        this.setState({
            targetKeys: newArr,
        })

    }

    handleUpdateVisible = (value) => {
        this.setState({
            updateVisible: value
        })
    }
    importVisible = (value) => {
        this.setState({
            importVisible: value
        })
    }

    onSuccess = () => {
        const { queryList } = this.props;
        if (queryList) {
            this.props.queryList({ isdb: 1 })
        }
    }

    changeDiff = () => {
        const { params: { isdb } } = this.props;
        if (isdb === 1) {
            this.setState({
                isDiff: true
            })
        } else {
            message.warn("请先导入外部数据!")
        }

    }

    confirmUpdate = () => {
        UpdateMarketUnitList({
        })
            .then((res = {}) => {
                let { code = 0, note='' } = res;
                if (code > 0) {
                    message.success("导入数据更新成功")
                    this.handleUpdateVisible(false)
                } else {
                    message.error(note)
                }
            }).catch((e) => {
                message.error(!e.success ? e.message : e.note);
            });

    }

    render() {
        const { isDiff = false, importVisible = false, updateVisible = false, mockData = [], targetKeys = [], titles = [] } = this.state;
        const { queryList, data = [], params = {}, dictionary = {}, config = {} } = this.props;
        const modalProps = {
            isAllWindow: 1,
            // defaultFullScreen: true,
            width: '60rem',
            height: '35rem',
            title: '导入',
            style: { top: '30rem' },
            visible: importVisible,
            footer: null,
        };

        const updateProps = {
            width: '60rem',
            height: '35rem',
            title: '更新',
            style: { top: '30rem' },
            visible: updateVisible,
            onCancel: () => this.handleUpdateVisible(false),
            footer: null,
        };

        return (
            <div className='tradingunitlist-table'>
                <div className='tradingunitlist-table-opt'>
                    <Button className="opt-button" style={{ margin: '2rem .7rem .7rem 0' }} onClick={() => this.importVisible(true)}>导入</Button>
                    <Button className="opt-button" style={{ margin: '2rem .7rem .7rem' }} onClick={() => this.changeDiff()}>数据对比</Button>
                    <Button className="opt-button" style={{ margin: '2rem .7rem .7rem' }} onClick={() => { this.handleUpdateVisible(true) }}>数据更新</Button>
                    <TreeSelectTransfer titles={titles} targetKeys={targetKeys} mockData={mockData} changeDisplayColumn={this.changeDisplayColumn} />
                </div>
                <TradingUnitTableCont isDiff={isDiff} config={config} dictionary={dictionary} params={params} data={data} queryList={queryList} targetKeys={targetKeys} mockData={mockData} changeSelectedRow={this.changeSelectedRow} />
                <BasicModal {...updateProps}>
                    <div className="modify-model">
                        <div style={{ padding: '3rem 8rem 3rem', borderBottom: '1px solid #EEEEEE', textAlign: 'center' }}>
                            数据即将更新！
                        </div>
                        <div className="display-column-footer">
                            <Button onClick={() => this.handleUpdateVisible(false)}>关闭</Button>
                            <Button type="primary" onClick={this.confirmUpdate}>确定</Button>
                        </div>
                    </div>
                </BasicModal>
                {importVisible && <BridgeModel modalProps={modalProps} onSucess={() => this.onSuccess()} onCancel={() => this.importVisible(false)} src='/livebos/OperateProcessor?operate=LoadExcel&Table=tJYDYDBDR' />}
            </div>

        );
    }
}

export default TradingUnitTable;