import { Empty, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import iconQuestion from '../../../../assets/projectDetail/icon_question.png';
import iconRefuse from '../../../../assets/projectDetail/icon_refuse.png';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { Link } from 'react-router-dom';

export default function PrjMember(props) {
  const { prjData, routes } = props;
  const { member } = prjData;

  //成员块
  const getMemberItem = ({ position = '--', gender = '男', name = '--', key, status }) => {
    const popoverContent = (
      <div className="list">
        <div className="item" onClick={() => {}} key="再次邀请">
          再次邀请
        </div>
        <div className="item" onClick={() => {}} key="不再显示">
          不再显示
        </div>
      </div>
    );
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
            state: { routes },
          }}
        >
          <div className="top">{position}</div>
          <div className="bottom">
            <div className="bottom-left">
              <img src={gender === '男' ? avatarMale : avatarFemale} alt="" />
              {/* {status !== '1' &&
                (status === '5' ? (
                  <img src={iconRefuse} alt="" className="member-status-img" />
                ) : (
                  <img src={iconQuestion} alt="" className="member-status-img" />
                ))} */}
            </div>
            <span>{name}</span>
            {/* {status !== '1' && (
              <Popover
                placement="bottomRight"
                title={null}
                content={popoverContent}
                overlayClassName="btn-more-content-popover"
                arrowPointAtCenter
              >
                <i className="iconfont icon-more2" />
              </Popover>
            )} */}
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
            // status: x.RYZT,
          }),
        )}
        {member?.length === 0 && (
          <Empty
            description="暂无人员"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ width: '100%', marginBottom: '16px' }}
          />
        )}
      </div>
    </div>
  );
}
