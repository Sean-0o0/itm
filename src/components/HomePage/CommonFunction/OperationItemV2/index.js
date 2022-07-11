import React from 'react';
import { Col } from 'antd';
import { Link } from 'dva/router';

class NewsItem extends React.Component {

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
                  <div className='cf-flex2'>
                    <div  className='cf-font'>
                      {/*<a href='http://localhost:8001/#/mainScreen'>*/}

                      <img className="title-tip" src={[require("../../../../image/homepage/cz01.png")]} alt="" />

                      <div  className='cf-wz'>{Object.keys(syCycz).length ? syCycz.czdy : ''}
                      </div>
                      {/*</a>*/}
                    </div>
                    </div>
                </Link>

            </Col>
        );
    }
}
export default NewsItem;
