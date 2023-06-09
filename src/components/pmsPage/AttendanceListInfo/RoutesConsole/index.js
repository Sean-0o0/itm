import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import {Select, Button, Input, TreeSelect, Row, Col, DatePicker, message, Breadcrumb} from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QuerySupplierList, QueryUserRole, QueryRequirementListPara, QueryOutsourceMemberList, QueryOutsourceMemberAttendance,
} from '../../../../services/pmsServices';
import moment from 'moment';
import {Link} from "react-router-dom";

const InputGroup = Input.Group;
const {Option} = Select;
const {Item} = Breadcrumb;

export default forwardRef(function RoutesConsole(props) {
  const {
    routes,
  } = props;

  useEffect(() => {
    return () => {
    };
  }, [routes]);

  console.log("routes-ccccc", routes)

  return (
    <div className="routes-console">
      <div className="item-box">
        <Breadcrumb separator=">">
          {routes?.map((item, index) => {
            const {name = item, pathname = ''} = item;
            const historyRoutes = routes.slice(0, index + 1);
            return (
              <Item key={index}>
                {index === routes.length - 1 ? (
                  <>{name}</>
                ) : (
                  <Link to={{pathname: pathname, state: {routes: historyRoutes}}}>{name}</Link>
                )}
              </Item>
            );
          })}
        </Breadcrumb>
      </div>
    </div>
  );
});
