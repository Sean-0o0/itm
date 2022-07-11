import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import AccountQuery from './AccountQuery';
import AccountTable from './AccountTable';
import { FetchQuerySelfAccountList } from '../../../services/processCenter';

class AccountList extends React.Component {
    state = {
        system: '',
        data: [],
        config: {},
        params: {
            current: 1,
            pageSize: 10,
            paging: 1,
            total: 100,
            isDiff: false
        }
    }

    componentWillMount() {
        this.fetchQuerySelfAccountList({})
    }

    fetchQuerySelfAccountList = (payload,isDiff = false) => {
        const { params = {} } = this.state;
        FetchQuerySelfAccountList({
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
                        isDiff: isDiff
                    })
                }
            }).catch((e) => {
                message.error(!e.success ? e.message : e.note);
            });
    }

    // changeSystem = (value) => {
    //     this.setState({
    //         system: value
    //     })
    // }

    render() {
        const { system = '', config = [], data = [], params = {}, isDiff } = this.state;
        const { dictionary } = this.props;
        return (
            <div className='accountlist-box'>
                <AccountQuery queryList={this.fetchQuerySelfAccountList} dictionary={dictionary} />
                <AccountTable isDiff={isDiff} dictionary={dictionary} params={params} config={config} data={data} system={system} queryList={this.fetchQuerySelfAccountList} />
            </div>
        );
    }
}

export default connect(({ global }) => ({
    dictionary: global.dictionary
}))(AccountList);
