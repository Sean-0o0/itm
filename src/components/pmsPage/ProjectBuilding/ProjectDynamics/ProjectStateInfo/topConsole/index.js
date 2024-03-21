import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, Icon, message, Breadcrumb } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QueryProjectStatisticsList,
  QueryProjectDynamics,
} from '../../../../../../services/pmsServices';
import TreeUtils from '../../../../../../utils/treeUtils';
import { set } from 'store';
import { Link } from 'react-router-dom';
import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;

export default (function TopConsole(props) {
  const { filterData = {}, setFilterData, handleSearch } = props;

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item" key="projectName">
          <div className="item-label">项目名称</div>
          <Input
            value={filterData.projectName}
            className="item-selector"
            onChange={v => {
              v.persist();
              if (v.target.value === '') {
                setFilterData(p => ({ ...p, projectName: undefined }));
                handleSearch({ ...filterData, projectName: undefined });
              } else {
                setFilterData(p => ({ ...p, projectName: v.target.value }));
                handleSearch({ ...filterData, projectName: v.target.value });
              }
            }}
            placeholder={'请输入项目名称'}
            allowClear
            style={{ width: '100%' }}
          />
        </div>
        <div className="console-item" key="projectManager">
          <div className="item-label">项目经理</div>
          <Input
            value={filterData.projectManager}
            className="item-selector"
            onChange={v => {
              v.persist();
              if (v.target.value === '') {
                setFilterData(p => ({ ...p, projectManager: undefined }));
                handleSearch({ ...filterData, projectManager: undefined });
              } else {
                setFilterData(p => ({ ...p, projectManager: v.target.value }));
                handleSearch({ ...filterData, projectManager: v.target.value });
              }
            }}
            placeholder={'请输入项目经理'}
            allowClear
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
});
