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

export default forwardRef(function TopConsole(props, ref) {
  //下拉框数据
  const [prjNameData, setPrjNameData] = useState([]); //项目名称
  const [rymcData, setRymcData] = useState([]); //人员名称
  //查询的值
  const [rymc, setRymc] = useState(undefined); //人员名称
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [kqlx, setKqlx] = useState(undefined); //项目名称
  const LOGIN_USER_INFO = JSON.parse(sessionStorage.getItem('user'));
  const {
    setTableLoading,
    setTableData,
    setTotal,
    setCurPage,
    setCurPageSize,
    curPage,
    curPageSize,
    dictionary,
    xmid,
    ryid,
    lxid,
    routes,
  } = props;
  const {KQLX} = dictionary;

  useEffect(() => {
    getFilterData();
    return () => {
    };
  }, [xmid, ryid, lxid]);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
        handleReset,
      };
    },
    [rymc, prjName, kqlx],
  );


  //顶部下拉框查询数据
  const getFilterData = () => {
    LOGIN_USER_INFO.id !== undefined &&
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const {role = '', zyrole = ''} = res;
          QueryRequirementListPara({
            current: 1,
            pageSize: 10,
            paging: -1,
            sort: '',
            total: -1,
            cxlx: 'KQLB',
            js: zyrole === "暂无" ? role : zyrole,
          })
            .then(res => {
              if (res?.success) {
                setPrjNameData([...JSON.parse(res.xmxx)]);
                console.log("params.cccc", Number(xmid))
                if (String(xmid) !== "" || xmid !== "undefined") {
                  setPrjName(xmid)
                }
                console.log("params.cccc", Number(ryid))
                if (String(ryid) !== "" || ryid !== "undefined") {
                  setRymc(ryid)
                }
                console.log("params.cccc", Number(lxid))
                if (String(lxid) !== "" || lxid !== "undefined") {
                  setKqlx(lxid)
                }
                setRymcData([...JSON.parse(res.wbryxx)]);
              }
            })
            .catch(e => {
              console.error('QueryRequirementListPara', e);
            });
        }
      })
      .catch(e => {
        console.error('HomePage-QueryUserRole', e);
        message.error('用户角色信息查询失败', 1);
      });
  };

  //查询按钮
  const handleSearch = (current = 1, pageSize = 20, sort = 'ID ASC') => {
    setTableLoading(true);
    //获取用户角色
    QueryUserRole({
      userId: String(LOGIN_USER_INFO.id),
    })
      .then(res => {
        if (res?.code === 1) {
          const {role = '', zyrole = ''} = res;
          setCurPage(current);
          setCurPageSize(pageSize);
          let params = {
            current,
            pageSize,
            paging: 1,
            sort: "",
            total: -1,
            // js: zyrole === "暂无" ? role : zyrole,
            // zzjg: String(LOGIN_USER_INFO.org)
          };
          if (rymc !== undefined && rymc !== '') {
            params.ryid = Number(rymc);
          }
          if (prjName !== undefined && prjName !== '') {
            params.xmid = Number(prjName);
          }
          if (kqlx !== undefined && kqlx !== '') {
            params.lxid = Number(kqlx);
          }
          console.log('🚀 ~ file: index.js:119 ~ handleSearch ~ params:', params);
          QueryOutsourceMemberAttendance(params)
            .then(res => {
              const {code, result, totalrows} = res
              if (code > 0) {
                setTableData(p => [...JSON.parse(result)]);
                setTotal(totalrows);
                // console.log('🚀 ~ file: index.js:52 ~ getTableData ~ tableArr:', tableArr);
                setTableLoading(false);
              }
            })
            .catch(e => {
              console.error('handleSearch', e);
              message.error('查询失败', 1);
              setTableLoading(false);
            });
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
        console.error('QueryUserRole', e);
      });
  };

  //重置按钮
  const handleReset = () => {
    setRymc(undefined);
    setPrjName(undefined);
    setKqlx(undefined)
  };

  // onChange-start
  //人员名称
  const handleRymcChange = v => {
    console.log('handleRymcChange', v);
    setRymc(v);
  }
  //项目名称
  const handlePrjNameChange = v => {
    console.log('handlePrjNameChange', v);
    setPrjName(v);
  };
  //考勤类型
  const handleKqlxChange = v => {
    console.log('handleKqlxChange', v);
    setKqlx(v);
  };
  // onChange-end

  console.log("routes-ccccc", routes)

  return (
    <div className="top-console">
      <div className="item-box">
        {/*<Breadcrumb separator=">">*/}
        {/*  {routes?.map((item, index) => {*/}
        {/*    const { name = item, pathname = '' } = item;*/}
        {/*    const historyRoutes = routes.slice(0, index + 1);*/}
        {/*    return (*/}
        {/*      <Item key={index}>*/}
        {/*        {index === routes.length - 1 ? (*/}
        {/*          <>{name}</>*/}
        {/*        ) : (*/}
        {/*          <Link to={{ pathname: pathname, state: { routes: historyRoutes } }}>{name}</Link>*/}
        {/*        )}*/}
        {/*      </Item>*/}
        {/*    );*/}
        {/*  })}*/}
        {/*</Breadcrumb>*/}
        <div className="console-item">
          <div className="item-label">外包项目</div>
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
              <Option key={x.ID} value={x.ID}>
                {x.XMMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">人员名称</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleRymcChange}
            value={rymc}
            placeholder="请选择"
          >
            {rymcData.map((x, i) => (
              <Option key={i} value={x.RYID}>
                {x.RYMC}
              </Option>
            ))}
          </Select>
        </div>
        <div className="console-item">
          <div className="item-label">考勤类型</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleKqlxChange}
            value={kqlx}
            placeholder="请选择"
          >
            {KQLX.map((x, i) => (
              <Option key={i.ibm} value={x.ibm}>
                {x.note}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          className="btn-search"
          type="primary"
          onClick={() => handleSearch(curPage, curPageSize)}
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
