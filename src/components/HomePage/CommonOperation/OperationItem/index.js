import React from 'react';
import { Col } from 'antd';
import { Link } from 'dva/router';

class OperationItem extends React.Component {

    render() {
        const { syCycz } = this.props;
        let url = '';
        if (Object.keys(syCycz).length) {
            const czsm = syCycz.czsm.split("|");
            url = czsm[1];
        }

        return (
            <Col xs={24} sm={24} lg={24} xl={12}>
                <Link to={url}>
                    <div className='m-operation-item'>
                        <div className='m-item-icon'>{syCycz.czdy.slice(0,1)}</div>
                        <div className='m-item-name'>
                            {Object.keys(syCycz).length ? syCycz.czdy : ''}
                        </div>
                        <div className='m-item-detail'>
                            {Object.keys(syCycz).length ? syCycz.sl : ''}次
                            <span>&nbsp;|&nbsp;</span>
                            {Object.keys(syCycz).length ? syCycz.sj : ''}
                        </div>
                    </div>
                </Link>

            </Col>
        );
    }
}
export default OperationItem;
