import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Collapse, Spin, Icon } from 'antd';
import moment from 'moment';
import { EncryptBase64 } from '../../Common/Encrypt';
import { Link } from 'react-router-dom';
import avatarMale from '../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../assets/homePage/img_avatar_female.png';
import { QueryMemberInfo } from '../../../services/pmsServices';
import { FetchQueryOrganizationInfo } from '../../../services/projectManage';
import TreeUtils from '../../../utils/treeUtils';
const { Panel } = Collapse;

export default function StaffInfo(props) {
  const {} = props;
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
            value: '11168',
            title: '机构中心',
            fid: '11167',
            children: [
              {
                value: '11169',
                title: '项目管理部',
                fid: '11168',
              },
              {
                value: '11170',
                title: '移动金融开发部',
                fid: '11168',
              },
              {
                value: '11172',
                title: '大数据应用开发部',
                fid: '11168',
              },
              {
                value: '11173',
                title: '质量控制部',
                fid: '11168',
              },
              {
                value: '13243',
                title: '内控开发部',
                fid: '11168',
              },
            ],
          });
          setOrgData([...data]);
          console.log('🚀 ~ FetchQueryOrganizationInfo ~ res', data);
          getStaffData(data);
        }
      })
      .catch(e => {
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
          console.log('🚀 ~ QueryMemberInfo', JSON.parse(res.record));
          let memberArr = JSON.parse(res.record);
          finalData.forEach(item => {
            let parentArr = [];
            memberArr.forEach(y => {
              if (y.orgId === item.value) parentArr.push(y);
            });
            item.members = parentArr;
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
        console.error('QueryMemberInfo', e);
      });
  };

  //成员块
  const getMemberItem = ({ gender = '男', name = '--', key = '' }) => {
    return (
      <div className="member-item" key={key}>
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
          <div className="bottom">
            <div className="bottom-left">
              <img src={gender === '男' ? avatarMale : avatarFemale} />
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
        <div className="bottom-box">
          <div className="leader-list">
            {data.members.map(m => (
              <div className="leader-item" key={m.id}>
                <div className="position">
                  <i>#</i> {m.gw || '--'}
                </div>
                {getMemberItem({ gender: m.xb || '--', name: m.name || '--', key: m.id })}
              </div>
            ))}
          </div>
          <Collapse
            // accordion
            bordered={false}
            defaultActiveKey={[data.children[0]?.value]}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
          >
            {data.children.map(x => (
              <Panel header={x.title} key={x.value}>
                <div className="panel-content">
                  {x.members.map(m =>
                    getMemberItem({ gender: m.xb || '--', name: m.name || '--', key: m.id }),
                  )}
                  {getAfterItem(itemWidth)}
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
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
        {staffData.map(x => getOrgItem(x))}
      </Spin>
    </div>
  );
}
