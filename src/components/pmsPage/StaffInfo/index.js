import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Collapse, Spin, Icon, Empty, message, Tooltip } from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../Common/Encrypt';
import { Link } from 'react-router-dom';
import avatarMale from '../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../assets/homePage/img_avatar_female.png';
import leaderTag from '../../../assets/homePage/leader-tag.png';
import leaderTagRight from '../../../assets/homePage/leader-tag-right.png';
import { QueryMemberInfo } from '../../../services/pmsServices';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';
import TreeUtils from '../../../utils/treeUtils';
import { connect } from 'dva';
const { Panel } = Collapse;

export default connect(({ global }) => ({
  dataAnonymization: global.dataAnonymization,
}))(function StaffInfo(props) {
  const { dataAnonymization } = props;
  const [isSpinning, setIsSpinning] = useState(false); //加载状态
  const [orgData, setOrgData] = useState([]); //部门数据
  const [staffData, setStaffData] = useState([]); //人员数据
  const [itemWidth, setItemWidth] = useState('48%'); //成员块宽度
  const location = useLocation();
  let timer = null;

  useEffect(() => {
    getOrgData();

    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('resize', resizeUpdate);
    window.dispatchEvent(new Event('resize', { bubbles: true, composed: true })); //刷新时能触发resize

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', resizeUpdate);
      clearTimeout(timer);
    };
  }, []);

  //防抖
  const debounce = (fn, waits) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn(...arguments);
    }, waits);
  };

  //屏幕宽度变化触发
  const resizeUpdate = e => {
    const fn = () => {
      let w = e.target.innerWidth; //屏幕宽度
      // console.log('🚀 ~ file: index.js ~ line 21 ~ resizeUpdate ~ w', w);
      if (w < 1845) {
        setItemWidth('45.37%');
      } else if (w < 2250) {
        setItemWidth('29.654%');
      } else if (w < 2655) {
        setItemWidth('22.034%');
      } else if (w < 3060) {
        setItemWidth('17.523%');
      } else {
        setItemWidth('14.549%');
      }
    };
    debounce(fn, 300);
  };

  //flex列表尾部占位置的空标签，处理justify-content对齐问题
  const getAfterItem = width => {
    let arr = [];
    for (let i = 0; i < 7; i++) {
      //每行最多n=8个
      arr.push('');
    }
    return arr.map((x, k) => <i key={k} style={{ width }} />);
  };

  //获取部门数据
  const getOrgData = () => {
    setIsSpinning(true);
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
          })[0].children[0].children[0].children[0].children;
          data.push({
            value: 'szyyzx',
            title: '数字应用中心',
            fid: '11167',
            children: [],
          });
          setOrgData([...data]);
          // console.log('🚀 ~ FetchQueryOrganizationInfo ~ res', data);
          getStaffData(data);
        }
      })
      .catch(e => {
        message.error('部门信息查询失败', 1);
        console.error('FetchQueryOrganizationInfo', e);
      });
  };

  //获取人员数据
  const getStaffData = (orgArr = []) => {
    QueryMemberInfo({
      type: 'ALL',
    })
      .then(res => {
        if (res?.success) {
          // let arr = [];
          let finalData = JSON.parse(JSON.stringify(orgArr));
          // console.log('🚀 ~ QueryMemberInfo', JSON.parse(res.record), finalData);
          let memberArr = JSON.parse(res.record);
          finalData.forEach(item => {
            let parentArr = [];
            memberArr.forEach(y => {
              if (y.orgId === item.value) parentArr.push(y);
            });
            if (item.value === '357') {
              let arr = [...parentArr];
              arr.forEach(x => {
                if (x.name === '朱校均') {
                  x.orderNum = 1;
                } else if (x.name === '陈燕萍') {
                  x.orderNum = 2;
                } else if (x.name === '陶明敏') {
                  x.orderNum = 3;
                } else if (x.name === '孙磊') {
                  x.orderNum = 4;
                } else if (x.name === '胡凡') {
                  x.orderNum = 5;
                }
              });
              // 非要就先写死
              arr.push({
                gw: '总经理助理',
                id: '10704',
                name: dataAnonymization ? '钟**' : '钟政乐',
                orgId: '357', //原是运行保障三部"15505"
                orgName: '信息技术运保部',
                xb: '男',
                xh: '1',
                orderNum: 6,
              });
              parentArr = arr.sort((a, b) => a.orderNum - b.orderNum);
            }

            item.members = parentArr;
            // 非要就先写死
            if (item.value === '11168') {
              item.members?.unshift({
                gw: '总经理',
                id: '1852',
                name: dataAnonymization ? '黄**' : '黄玉锋',
                orgId: '11168',
                orgName: '信息技术开发部',
                xb: '男',
                xh: '1',
              });
            }
            item.children?.forEach(x => {
              let childArr = [];
              memberArr.forEach(y => {
                if (y.orgId === x.value) childArr.push(y);
              });
              x.members = childArr;
            });
          });
          // console.log('🚀 ~ file: index.js:155 ~ getStaffData ~ finalData:', finalData);
          setStaffData(p => [...finalData]);
          setIsSpinning(false);
        }
      })
      .catch(e => {
        message.error('人员信息查询失败', 1);
        console.error('QueryMemberInfo', e);
      });
  };

  //成员块
  const getMemberItem = ({
    gender = '男',
    name = '--',
    key = '',
    post = '--',
    topLeader = false,
    bottomLeader = false,
  }) => {
    return (
      <div
        className="member-item"
        key={key}
        style={
          topLeader || bottomLeader
            ? { border: '1px solid rgba(51, 97, 255, 0.2)', borderRadius: '16px' }
            : {}
        }
      >
        <Link
          to={{
            pathname:
              '/pms/manage/staffDetail/' +
              EncryptBase64(
                JSON.stringify({
                  ryid: key,
                }),
              ),
            state: { routes: [{ name: '人员列表', pathname: location.pathname }] },
          }}
        >
          <div
            className="bottom"
            style={
              topLeader || bottomLeader
                ? {
                    background: '#3363ff14',
                    borderRadius: '16px',
                  }
                : {}
            }
          >
            <div className="bottom-left">
              <img src={gender === '男' ? avatarMale : avatarFemale} />
              {(topLeader || bottomLeader) && (
                <div className="leader-tag" style={topLeader ? { backgroundColor: '#FFCD00' } : {}}>
                  <img src={leaderTag} className="leader-tag-img" />
                </div>
              )}
            </div>
            <span>{name}</span>
          </div>
        </Link>
      </div>
    );
  };

  //部门块
  const getOrgItem = (data = { title: '--', children: [], members: [] }) => {
    return (
      <div className="staff-org-item" key={data.value}>
        <div className="top-name">{data.title || '--'}</div>
        {data.children?.length === 0 ? (
          <div className="item-empty">
            <Empty
              description="暂无数据..."
              style={{
                fontFamily: 'PingFangSC-regular, PingFang SC',
                fontWeight: 'normal',
              }}
            />
          </div>
        ) : (
          <div className="bottom-box">
            <div className="leader-list">
              {data.members.map(m => (
                <div className="leader-item" key={m.id}>
                  <Tooltip title={m.gw || '--'} placement="topLeft">
                    <div className="position">
                      <i>#</i>
                      <span>{m.gw || '--'}</span>
                    </div>
                  </Tooltip>
                  {getMemberItem({
                    gender: m.xb || '--',
                    name: m.name || '--',
                    key: m.id,
                    post: m.gw,
                    topLeader: true,
                  })}
                </div>
              ))}
              {getAfterItem(itemWidth)}
            </div>
            <Collapse
              // accordion
              bordered={false}
              defaultActiveKey={[data.children[0]?.value]}
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
            >
              {data.children?.map(x => (
                <Panel header={x.title} key={x.value}>
                  <div className="panel-content">
                    {x.members.map(m =>
                      getMemberItem({
                        gender: m.xb || '--',
                        name: m.name || '--',
                        key: m.id,
                        post: m.gw,
                        bottomLeader:
                          m.gw?.includes('经理') &&
                          !m.gw?.includes('项目经理') &&
                          !m.gw?.includes('产品经理'),
                      }),
                    )}
                    {x.members?.length === 0 && (
                      <Empty
                        description="暂无数据..."
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        style={{
                          width: '100%',
                          margin: 0,
                          fontFamily: 'PingFangSC-regular, PingFang SC',
                          fontWeight: 'normal',
                        }}
                      />
                    )}
                    {getAfterItem(itemWidth)}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="staff-info-box">
      <Spin
        spinning={isSpinning}
        tip="加载中"
        size="large"
        wrapperClassName="staff-info-spin-wrapper"
      >
        {getOrgItem(staffData[1])}
        {getOrgItem(staffData[0])}
        {getOrgItem(staffData[2])}
      </Spin>
    </div>
  );
});
