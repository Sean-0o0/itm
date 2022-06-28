import React from 'react';
import { Card, Icon, Empty } from 'antd';
import { FetchQueryNewsComment } from '../../../../../../services/planning/planning';

class IndustryDynamicComents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            extend: true,
        };
    }

    componentWillMount() {
        this.FetchQueryNewsComment();
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    componentWillReceiveProps(nextProps, nextContext) {
    }

    FetchQueryNewsComment = (newId) => {
        if (newId !== undefined) {
            FetchQueryNewsComment({
                cateid: Number(newId),
            }).then(
                res => {
                    const { records, code } = res;
                    if (code > 0) {
                        this.setState({
                            datas: records,
                        });
                    }
                },
            ).catch();
        }else {
            this.setState({
                datas: [],
            });
        }
    };



    render() {
        const { datas = [], } = this.state;
        const { extend = true } = this.state;
        return (
            <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                {
                    datas.length > 0 ? (
                        datas.map((item) => {
                            return (
                                <div style={{ padding: '1rem 1rem 0 0', width: '100%' }} key={item.notcId}>
                                    <Card bodyStyle={{ padding: '1rem', backgroundColor: '#F8F8F8' }}>
                                        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#333333', lineHeight: '2.05rem', }}>{item.comment?.length > 100 && extend ? item.comment.slice(0, 100) + '...' : item.comment}</div>
                                        <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#54A9DF', lineHeight: '2.05rem', textAlign: 'end', }} onClick={() => {
                                            this.setState({
                                                extend: !extend,
                                            })
                                        }}>{item.comment?.length > 100 ? (extend ? '展开' : '收起') : ''}{item.comment?.length > 100 ? <Icon style={{ margin: '0 0.5rem' }} type={extend ? 'down' : 'up'} /> : ''}</div>
                                        <div style={{ display: 'flex', width: '100%', padding: '0.5rem 0 0 0', }}>
                                            <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#999999', lineHeight: '2.05rem', width: '22%' }}>{item.uid}</div>
                                            <div style={{ fontSize: '1.43rem', fontWeight: 400, color: '#999999', lineHeight: '2.05rem', width: '45%', textAlign: 'end' }}>{item.pubtime}</div>
                                        </div>
                                    </Card>
                                </div>
                            );
                        })
                    ) : <Empty style={{ height: '12rem', paddingTop: 'calc((100vh - 27.5rem)/2)' }} />
                }
            </div>

        );
    }
}

export default IndustryDynamicComents;
