import React, { Component } from 'react'
import { Link } from 'dva/router';
import { Breadcrumb } from 'antd'
import boyImg from '../../../../assets/staffDetail/img_boy.png';
import girlImg from '../../../../assets/staffDetail/img_girl.png';
import fqImg from '../../../../assets/staffDetail/img_fq.png';
import cyImg from '../../../../assets/staffDetail/img_cy.png';
import zbImg from '../../../../assets/staffDetail/img_zb.png';
import ktImg from '../../../../assets/staffDetail/img_kt.png';

class ToConsole extends Component {
    state = {
    }

    render() {
        const { routes = [] } = this.props;
        console.log("routesroutes-ccc-staf", routes)
        return (
            <div className="header-bread">
                <Breadcrumb separator=">">
                    {routes.map((item, index) => {
                        const { name = item, pathname = '' } = item
                        const historyRoutes = routes.slice(0, index + 1)
                        return <Breadcrumb.Item key={index}>
                            {index === routes.length - 1 ? <>{name}</> :
                                <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>
                                    {name}
                                </Link>}
                        </Breadcrumb.Item>
                    })

                    }
                </Breadcrumb>
            </div>);
    }
}

export default ToConsole;
