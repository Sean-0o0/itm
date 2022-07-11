import React from 'react';
import { Button, message } from 'antd';
import OverviewHeader from './OverviewHeader';
import { FetchObjectQuery } from '../../../../../services/sysCommon';
import TreeUtils from '../../../../../utils/treeUtils';

class TradingUnitApportion extends React.Component {
    state = {
        selectedRow: {},
        calcVisible: false,
        type: 1,
        org: [],
    }

    componentWillMount() {
        this.fetchObjectQuery('ID,FID,Name', 'lborganization', '', 'org');
    }

    fetchObjectQuery = (cols, serviceid, cxtj, label) => {
        FetchObjectQuery(
            {
                "cols": cols,
                "current": 1,
                "cxtj": cxtj,
                "pageSize": 4000,
                "paging": 1,
                "serviceid": serviceid,
                "sort": "",
                "total": -1
            }
        ).then(res => {
            const { data = [], code = 0, note = '' } = res
            if (code > 0) {
                let temp = {};
                if (label === 'org') {
                    const orgTree = TreeUtils.toTreeData(
                        data,
                        {
                            keyName: 'ID',
                            pKeyName: 'FID',
                            titleName: 'NAME',
                            normalizeTitleName: 'title',
                            normalizeKeyName: 'value'
                        },
                        true
                    )
                    temp[label] = orgTree.length && orgTree[0].children ? orgTree[0].children : []
                } else {
                    temp[label] = data
                }

                this.setState({
                    ...temp
                })
            }else {
                message.error(note)
            }
        }).catch(err => {
            message.error(!err.success ? err.message : err.note);
        })
    }

    changeSelectedRow = (value = []) => {
        this.setState({
            selectedRow: value,
        })
    }

    changeCalcVisible = (value,type) =>{
        this.setState({
            calcVisible: value,
            type:type
        })
    }


    render() {
        const { selectedRow = {}, calcVisible = false, type = 1, org = [] } = this.state;

        return (
            <div className='distribute-box'>
                <OverviewHeader org={org}/>
                <div>
                    <Button className="opt-button" style={{ margin: '.7rem .7rem .7rem 0' }} onClick={()=>this.changeCalcVisible(true,1)}>分摊试算</Button>
                    <Button className="opt-button" style={{ margin: '.7rem' }} onClick={()=>this.changeCalcVisible(true,2)}>分摊确认</Button>
                    <Button className="opt-button" style={{ margin: '.7rem' }} onClick={()=>this.changeCalcVisible(true,3)}>分摊回退</Button>
                </div>
                {/* <div style={{ display: 'flex' }}>
                    <CostList changeSelectedRow={this.changeSelectedRow} />
                    <CostDetail selectedRow={selectedRow}/>
                </div>
                <CalcModal type={type} visible={calcVisible} changeCalcVisible={this.changeCalcVisible}/> */}
            </div>
        );
    }
}

export default TradingUnitApportion;
