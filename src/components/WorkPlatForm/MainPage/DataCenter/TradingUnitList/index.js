import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { FetchQueryMarketUnitList } from '../../../../../services/dataCenter';
import TradingUnitQuery from './TradingUnitQuery';
import TradingUnitTable from './TradingUnitTable';
import { FetchObjectQuery } from '../../../../../services/sysCommon';
import TreeUtils from '../../../../../utils/treeUtils';

class TradingUnitList extends React.Component {
    state = {
        system: '',
        data: [],
        config: {},
        params: {
            current: 1,
            pageSize: 10,
            paging: 1,
            total: 100,
        },
        ywzl: [],
        org: [],
        ltq: [],
    }

    componentWillMount() {
        this.fetchQueryMarketUnitList({})
        this.fetchObjectQuery('ID,BusinessSubclassName', 'tJYDYYWZL', '', 'ywzl');
        // this.fetchObjectQuery('ID,TradeUnitProperty', 'tJYDYXZSJSX', '', 'xz');
        this.fetchObjectQuery('ID,FID,Name', 'lborganization', 'fid=100000', 'org');
        this.fetchObjectQuery('ID,JYDYMC', 'TZYJYDY', 'UN_CIRCLE = ID and END_DATE is null', 'ltq');
        
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
                // if (label === 'org') {
                //     const orgTree = TreeUtils.toTreeData(
                //         data,
                //         {
                //             keyName: 'ID',
                //             pKeyName: 'FID',
                //             titleName: 'NAME',
                //             normalizeTitleName: 'title',
                //             normalizeKeyName: 'value'
                //         },
                //         true
                //     )
                //     temp[label] = orgTree.length && orgTree[0].children ? orgTree[0].children : []
                // } else {
                    temp[label] = data
                // }

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

    fetchQueryMarketUnitList = (payload) => {
        const { params = {} } = this.state;
        FetchQueryMarketUnitList({
            ...params,
            ...payload
        })
            .then((res = {}) => {
                const { code, records = [], dbl = '', totalrows = 100 } = res;
                if (code > 0) {
                    const config = JSON.parse(dbl) || {};
                    records.forEach((element, index) => {
                        element.key = index;
                    });
                    this.setState({
                        config,
                        data: records,
                        params: {
                            ...params,
                            ...payload,
                            total: totalrows
                        },
                    })
                }
            }).catch((e) => {
                message.error(!e.success ? e.message : e.note);
            });
    }

    render() {
        const { config = [], data = [], params = {}, ywzl = [], org = [], ltq = [] } = this.state;
        const { dictionary } = this.props;
        return (
            <div className='tradingunitlist-box'>
                <TradingUnitQuery ywzl={ywzl} org={org} ltq={ltq} queryList={this.fetchQueryMarketUnitList} dictionary={dictionary} />
                <TradingUnitTable ywzl={ywzl} org={org} ltq={ltq} dictionary={dictionary} params={params} config={config} data={data} queryList={this.fetchQueryMarketUnitList} />
            </div>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary
}))(TradingUnitList);
