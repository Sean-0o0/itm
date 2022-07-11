import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { FetchQueryMarketUnitList } from '../../../../../services/dataCenter';
import TradingUnitTable from './TradingUnitTable';

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
            isdb: 2
        },
    }

    componentWillMount() {
        this.fetchQueryMarketUnitList({})    
    }

    fetchQueryMarketUnitList = (payload) => {
        const { params = {} } = this.state;
        FetchQueryMarketUnitList({
            ...params,
            ...payload
        })
            .then((res = {}) => {
                const { code, records = [], dbl = '', totalrows = 100, note = '' } = res;
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
                }else {
                    message.error(note)
                }
            }).catch((e) => {
                message.error(!e.success ? e.message : e.note);
            });
    }
    render() {
        const { config = [], data = [], params = {} } = this.state;

        return (
            <div className='tradingunitlist-box'>
                <TradingUnitTable params={params} config={config} data={data} queryList={this.fetchQueryMarketUnitList}/>
            </div>
        );
    }
}

export default TradingUnitList;
