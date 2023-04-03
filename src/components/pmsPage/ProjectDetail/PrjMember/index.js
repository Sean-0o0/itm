import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_male.png';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';

export default function PrjMember(props) {
  const { prjData, routes } = props;
  const { member } = prjData;
  const [itemWidth, setItemWidth] = useState('48%'); //成员块宽度

  //防抖定时器
  let timer = null;

  useEffect(() => {
    // 页面变化时获取浏览器窗口的大小
    window.addEventListener('prjMemberResize', resizeUpdate);
    window.dispatchEvent(new Event('prjMemberResize', { bubbles: true, composed: true })); //刷新时能触发resize

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('prjMemberResize', resizeUpdate);
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
      if (w < 1860) {
        setItemWidth('48%');
      } else if (w < 2360) {
        setItemWidth('32%');
      } else if (w < 2860) {
        setItemWidth('24%');
      } else if (w < 3360) {
        setItemWidth('19%');
      } else if (w < 3860) {
        setItemWidth('16%');
      } else {
        setItemWidth('13.5%'); //每行 7个
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
  //成员块
  const getMemberItem = ({ position = '--', gender = '男', name = '--', key }) => {
    const jumpToStfDetail = id => {
      window.location.href = `/#/pms/manage/StaffDetail/${EncryptBase64(
        JSON.stringify({
          routes,
          ryid: id,
        }),
      )}`;
    };
    return (
      <div
        className="member-item"
        style={{ width: itemWidth }}
        key={key}
        // onClick={() => jumpToStfDetail(key)}
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
            state: { routes },
          }}
        >
          <div className="top">{position}</div>
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
  return (
    <div className="prj-member-box">
      <div className="top-title">项目人员</div>
      <div className="bottom-box">
        {member?.map(x =>
          getMemberItem({
            position: x.GW,
            gender: x.XB,
            name: x.RYMC,
            key: x.RYID,
          }),
        )}
        {member?.length === 0 && (
          <Empty
            description="暂无人员"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        )}
        {getAfterItem(itemWidth)}
      </div>
    </div>
  );
}
