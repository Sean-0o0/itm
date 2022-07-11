import React from 'react';
import { Row, Col, message } from 'antd';
import OperationItem from '../CommonFunction/OperationItem';
import { FetchQuerySyCycz } from '../../../services/largescreen';

class CommonOperation extends React.Component {
    state = {
        syCycz: [],
    };

    componentDidMount() {
        this.fetchQuerySyCycz();
    }

    fetchQuerySyCycz = () => {
        FetchQuerySyCycz({
        }).then((result = {}) => {
            const { code = 0, records = [] } = result;
            if (code > 0) {
                this.setState({
                    syCycz: records,
                });
            }
        }).catch((error) => {
            message.error(!error.success ? error.message : error.note);
        });
    }

    render() {
        const { syCycz } = this.state;
        return (
            <Row style={{ height: '100%' }}>
                <Col xs={24} sm={24} lg={24} xl={24} className='m-outline-box'>
                    <div style={{ width: '100%' }}>
                        <div className='m-outline-left2'>
                            常用菜单
                            </div>
                    </div>
                </Col>
                <Col xs={24} sm={24} lg={24} xl={24} style={{ height: 'calc(100% - 4.5rem)' }}>
                    <Row className = 'm-opr-box'>
                        {
                            syCycz.map((item,key) => (
                                <OperationItem syCycz={item} key={key}/>
                            ))
                        }
                        {/* <OperationItem/>
                        <OperationItem/>
                        <OperationItem/> */}
                    </Row>
                </Col>
            </Row>
        );
    }
}
export default CommonOperation;
