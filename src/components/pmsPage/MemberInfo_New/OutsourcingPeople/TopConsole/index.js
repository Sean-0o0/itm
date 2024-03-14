import React, { useEffect, useState, forwardRef, useImperativeHandle, useContext } from 'react';
import { Select, Button, Input, TreeSelect, Row, Col, DatePicker, message } from 'antd';
import {
  QueryProjectListPara,
  QueryProjectListInfo,
  QuerySupplierList, QueryUserRole, QueryRequirementListPara, QueryOutsourceMemberList, QueryOutsourceRankInfo,
} from '../../../../../services/pmsServices';
import moment from 'moment';
import Lodash from 'lodash'
import { MemberInfoContext } from '../../index'

const InputGroup = Input.Group;
const { Option } = Select;

export default forwardRef(function TopConsole(props, ref) {

  const { prjNameData, setPrjNameData,//项目名称
    gysData, setGysData,      //所属供应商
    rymcData, setRymcData,    //人员名称
    rydjData, setRydjData     //人员等级
  } = useContext(MemberInfoContext)


  //查询的值
  const [rymc, setRymc] = useState(undefined); //人员名称
  const [rydj, setRydj] = useState(undefined); //人员等级
  const [gw, setGw] = useState(undefined); //岗位
  const [prjName, setPrjName] = useState(undefined); //项目名称
  const [gysmc, setGysmc] = useState(undefined); //供应商名称
  // const [zt, setZt] = useState(undefined); //状态
  const [admissionDate, setAdmissionDate] = useState([]) // 入场日期
  const [departureDate, setDepartureDate] = useState([]) // 离场日期

  const [filterFold, setFilterFold] = useState(true); //收起 true、展开 false
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
  } = props;

  const { WBRYGW = [] } = dictionary;

  useEffect(() => {
    getFilterData();
    return () => {
    };
  }, [xmid]);

  useImperativeHandle(
    ref,
    () => {
      return {
        handleSearch,
        handleReset,
      };
    },
    [rymc, rydj, gw, prjName, gysmc],
  );

  //顶部下拉框查询数据
  const getFilterData = () => {
    LOGIN_USER_INFO.id !== undefined &&
      QueryUserRole({
        userId: String(LOGIN_USER_INFO.id),
      })
        .then(res => {
          if (res?.code === 1) {
            const { role = '', zyrole = '' } = res;
            QueryRequirementListPara({
              current: 1,
              pageSize: 10,
              paging: -1,
              sort: '',
              total: -1,
              cxlx: 'WBRYLB',
              js: zyrole === "暂无" ? role : zyrole,
            })
              .then(res => {
                if (res?.success) {
                  setPrjNameData([...JSON.parse(res.xmxx)]);
                  // console.log("params.cccc", Number(xmid))
                  if (String(xmid) !== "" || xmid !== "undefined") {
                    setPrjName(xmid)
                  }
                  setGysData([...JSON.parse(res.gysxx)]);
                  setRymcData([...JSON.parse(res.wbryxx)]);
                  setRydjData([...JSON.parse(res.rydjxx)]);
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
          const { role = '', zyrole = '', testRole } = res;
          setCurPage(current);
          setCurPageSize(pageSize);
          let params = {
            current,
            pageSize,
            paging: 1,
            sort: "",
            total: -1,
            cxlx: 'ALL',
            js: zyrole === "暂无" ? role : zyrole,
            zzjg: String(LOGIN_USER_INFO.org)
          };
          if (rymc !== undefined && rymc !== '') {
            params.rymc = Number(rymc);
          }
          if (rydj !== undefined && rydj !== '') {
            params.rydj = Number(rydj);
          }
          if (gw !== undefined && gw !== '') {
            params.rygw = Number(gw);
          }
          if (prjName !== undefined && prjName !== '') {
            params.xmmc = Number(prjName);
          }
          if (gysmc !== undefined && gysmc !== '') {
            params.gys = Number(gysmc);
          }
          if (!Lodash.isEmpty(admissionDate)) {
            params.rckssj = admissionDate[0].format('YYYYMMDD')  //入场开始时间
            params.rcjssj = admissionDate[1].format('YYYYMMDD')  //入场结束时间
          }
          if (!Lodash.isEmpty(departureDate)) {
            params.lckssj = departureDate[0].format('YYYYMMDD')  //离场开始时间
            params.lcjssj = departureDate[1].format('YYYYMMDD')  //离场结束时间
          }
          // console.log('点击查询按钮', params);
          QueryOutsourceMemberList(params)
            .then(res => {
              const { code, result, totalrows } = res
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
    setRydj(undefined);
    setGw(undefined);
    setPrjName(undefined);
    setGysmc(undefined);
    // setZt(undefined);
    setAdmissionDate([])
    setDepartureDate([])
  };

  // onChange-start
  //人员名称
  const handleRymcChange = v => {
    console.log('handleRymcChange', v);
    setRymc(v);
  }
  //人员等级
  const handleRydjChange = v => {
    console.log('handleRydjChange', v);
    setRydj(v);
  }
  //岗位
  const handleGwChange = v => {
    console.log('handleRydjChange', v);
    setGw(v);
  }
  //项目名称
  const handlePrjNameChange = v => {
    console.log('handlePrjNameChange', v);
    setPrjName(v);
  };
  //供应商
  const handleGysmcChange = v => {
    console.log('handleGysmcChange', v);
    setGysmc(v);
  };
  // const handleZtChange = v => {
  //   setZt(v);
  // };
  // onChange-end

  return (
    <div className="top-console">

      <div className="item-box">
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
          <div className="item-label">人员等级</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            showArrow
            allowClear
            onChange={handleRydjChange}
            value={rydj}
            placeholder="请选择"
          >
            {rydjData.map((x, i) => (
              <Option key={i} value={x.DJID}>
                {x.DJMC}
              </Option>
            ))}
          </Select>
        </div>

        <div className="console-item">
          <div className="item-label">岗位</div>
          <Select
            className="item-selector"
            dropdownClassName={'item-selector-dropdown'}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            showSearch
            allowClear
            onChange={handleGwChange}
            value={gw}
            placeholder="请选择"
          >
            {WBRYGW.map((x, i) => (
              <Option key={i} value={x.ibm}>
                {x.note}
              </Option>
            ))}
          </Select>
        </div>

        <div className='optionBar'>
          {filterFold && (
            <div className="filter-unfold" onClick={() => setFilterFold(false)}>
              更多
              <i className="iconfont icon-down" />
            </div>
          )}

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

      {!filterFold &&
        <>
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
                  <Option key={x.ID} value={x.ID}>
                    {x.XMMC}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="console-item">
              <div className="item-label">所属供应商</div>
              <Select
                className="item-selector"
                dropdownClassName={'item-selector-dropdown'}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                showSearch
                allowClear
                onChange={handleGysmcChange}
                value={gysmc}
                placeholder="请选择"
              >
                {gysData.map((x, i) => (
                  <Option key={i} value={x.GYSID}>
                    {x.GYSMC}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="console-item">
              <div className="item-label">入场日期</div>
              <DatePicker.RangePicker
                className="item-selector"
                placeholder={['开始日期', '结束日期']}
                allowClear
                value={admissionDate}
                onChange={(dates, dateStrings) => {
                  setAdmissionDate(dates);
                }}
              />
            </div>

            {/*<div className="console-item">*/}
            {/*  <div className="item-label">状态</div>*/}
            {/*  <Select*/}
            {/*    className="item-selector"*/}
            {/*    dropdownClassName="item-selector-dropdown"*/}
            {/*    value={zt}*/}
            {/*    allowClear*/}
            {/*    onChange={handleZtChange}*/}
            {/*    placeholder="请选择"*/}
            {/*  >*/}
            {/*    <Option value="1">无</Option>*/}
            {/*    <Option value="2">正常</Option>*/}
            {/*    <Option value="3">试用期不合格</Option>*/}
            {/*    <Option value="4">离场</Option>*/}
            {/*  </Select>*/}
            {/*</div>*/}
          </div>

          <div className="item-box">
            <div className="console-item">
              <div className="item-label">离场日期</div>
              <DatePicker.RangePicker
                className="item-selector"
                placeholder={['开始日期', '结束日期']}
                allowClear
                value={departureDate}
                onChange={(dates, dateStrings) => {
                  setDepartureDate(dates);
                }}
              />
            </div>


            {!filterFold && (
              <div className="item-box">
                <div className="filter-unfold" onClick={() => setFilterFold(true)}>
                  收起
                  <i className="iconfont icon-up" />
                </div>
              </div>
            )}

          </div>
        </>
      }

    </div>
  );
});
