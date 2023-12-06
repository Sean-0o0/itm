import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import {Select, Button, Input, TreeSelect, Row, Col, Icon, message} from 'antd';
import {QueryProjectListPara, QueryProjectListInfo} from '../../../../services/pmsServices';
import TreeUtils from '../../../../utils/treeUtils';
import {set} from 'store';
import {connect} from "dva";
import {FetchQueryOrganizationInfo} from "../../../../services/projectManage";
import { setParentSelectableFalse } from '../../../../utils/pmsPublicUtils';

const InputGroup = Input.Group;
const {Option} = Select;

export default forwardRef(function TopConsole(props, ref) {
  //下拉框数据
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [prjMngerData, setPrjMngerData] = useState([]); //项目经理
  const [orgData, setOrgData] = useState([]); //应用部门
  const [orgOpen, setOrgOpen] = useState(false); //下拉框展开
  //查询的值
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [prjMnger, setPrjMnger] = useState(undefined); //项目经理
  const [org, setOrg] = useState([]); //应用部门
  const [prjStat, setPrjStat] = useState([]); //状态
  const {XMGZSX} = props.dictionary; //字典
  console.log("XMGZSX", props.dictionary)
  const {
    params,
    callBackParams,
    getTableData,
  } = props;

  useEffect(() => {
    getFilterData();
    getOrgData();
    return () => {
    };
  }, []);

  //获取部门数据
  const getOrgData = () => {
    FetchQueryOrganizationInfo({
      type: 'XXJS',
    })
      .then(res => {
        if (res?.success) {
          let data = TreeUtils.toTreeData(res.record, {
            keyName: 'orgId',
            pKeyName: 'orgFid',
            titleName: 'orgName',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0].children[0].children;
          // data.push({
          //   value: 'szyyzx',
          //   title: '数字应用中心',
          //   fid: '11167',
          //   children: [],
          // });
          data.forEach(node => setParentSelectableFalse(node))
          setOrgData([...data]);
        }
      })
      .catch(e => {
        message.error('部门信息查询失败', 1);
        console.error('FetchQueryOrganizationInfo', e);
      });
  };

  //顶部下拉框查询数据
  const getFilterData = () => {
    QueryProjectListPara({
      current: 1,
      czr: 0,
      pageSize: 10,
      paging: 1,
      sort: 'string',
      total: -1,
      cxlx: 'XMLB',
    })
      .then(res => {
        if (res?.success) {
          let orgTree = TreeUtils.toTreeData(JSON.parse(res.orgRecord), {
            keyName: 'ID',
            pKeyName: 'FID',
            titleName: 'NAME',
            normalizeTitleName: 'title',
            normalizeKeyName: 'value',
          })[0].children[0];
          // setOrgData(p => [...[orgTree]]);
          setPrjMngerData(p => [...JSON.parse(res.projectManagerRecord)]);
          setPrjNameData(p => [...JSON.parse(res.projectRecord)]);
        }
      })
      .catch(e => {
        console.error('QueryProjectListPara', e);
        message.error('下拉框信息查询失败', 1);
      });
  };

  //查询按钮
  const handleSearch = () => {
    getTableData({...params})
  };

  //重置按钮
  const handleReset = v => {
    setPrjName(undefined); //项目名称
    setPrjMnger(undefined); //项目经理
    setOrg([]); //应用部门
    setPrjStat(undefined);//状态
    callBackParams({
      current: 1,
      pageSize: 5,
      org: '',
      projectId: '',
      projectManager: '',
      projectType: ''
    })
  };

  // onChange-start
  //项目经理
  const handlePrjMngerChange = v => {
    // console.log('handlePrjMngerChange', v);
    // if (v === undefined) v = '';
    setPrjMnger(v);
    callBackParams({...params, projectManager: Number(v),})
  };
  //项目名称
  const handlePrjNameChange = v => {
    setPrjName(v);
    callBackParams({...params, projectId: Number(v),})
  };
  //应用部门
  const handleOrgChange = v => {
    // console.log('handleOrgChange', v);
    setOrg(v);
    callBackParams({...params, org: Number(v),})
  };
  //应用部门
  const handlePrjStatChange = v => {
    // console.log('handlePrjStatChange', v);
    setPrjStat(v);
    callBackParams({...params, projectType: Number(v),})
  };
  // onChange-end

  return (
    <div className="top-console">
      <div className="item-box">
        <div className="console-item">
          <div className="item-label">项目名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handlePrjNameChange}
            value={prjName}
            placeholder="请选择"
          >
            {prjNameData.map((x, i) => (
              <Option key={i} value={x.XMID}>
                {x.XMMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">项目经理</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handlePrjMngerChange}
            value={prjMnger}
            placeholder="请选择"
          >
            {prjMngerData.map((x, i) => (
              <Option key={i} value={x.ID}>
                {x.USERNAME}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">部门</div>
          <TreeSelect
            allowClear
            showArrow
            className="item-selector"
            showSearch
            // treeCheckable
            // maxTagCount={2}
            // maxTagTextLength={42}
            // maxTagPlaceholder={extraArr => {
            //   return `等${extraArr.length + 2}个`;
            // }}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            treeNodeFilterProp="title"
            dropdownClassName="newproject-treeselect"
            dropdownStyle={{maxHeight: 300, overflow: 'auto'}}
            treeData={orgData}
            placeholder="请选择"
            onChange={handleOrgChange}
            value={org}
            treeDefaultExpandedKeys={['1', '8857']}
            open={orgOpen}
            onDropdownVisibleChange={v => setOrgOpen(v)}
          />
          <Icon
            type="down"
            className={'label-selector-arrow' + (orgOpen ? ' selector-rotate' : '')}
          />
        </div>
        <div className="console-item">
          <div className="item-label">筛选状态</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handlePrjStatChange}
            value={prjStat}
            placeholder="请选择"
          >
            {XMGZSX.map((x, i) => (
              <Option key={x.ibm} value={x.ibm}>
                {x.note}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          className="btn-search"
          type="primary"
          onClick={handleSearch}
        >
          查询
        </Button>
        <Button className="btn-reset" onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
});
