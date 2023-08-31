import { Empty, Modal, Popconfirm, Popover } from 'antd';
import React, { useEffect, useState } from 'react';
import avatarMale from '../../../../assets/homePage/img_avatar_male.png';
import avatarFemale from '../../../../assets/homePage/img_avatar_female.png';
import iconQuestion from '../../../../assets/projectDetail/icon_question.png';
import iconRefuse from '../../../../assets/projectDetail/icon_refuse.png';
import { EncryptBase64 } from '../../../Common/Encrypt';
import { useHistory } from 'react-router-dom';
import { InviteMemberAgain } from '../../../../services/pmsServices';

export default function PrjMember(props) {
  const { prjData, routes, xmid, getPrjDtlData, isLeader } = props;
  const { member = [], prjBasic = {} } = prjData;
  const history = useHistory();
  let LOGIN_USER_ID = Number(JSON.parse(sessionStorage.getItem('user'))?.id);
  let isXMJL = LOGIN_USER_ID === Number(prjBasic.XMJLID);

  const getMemberData = () => {
    // return member; //生产
    if (isLeader || isXMJL) return member;
    return member.filter(x => x.RYZT === '1'); //只有项目经理和领导看得到非正常状态的人员
  };

  //成员块
  const getMemberItem = ({
    position = '--',
    gender = '男',
    name = '--',
    key,
    status,
    positionId,
  }) => {
    const popoverContent = (
      <div className="list">
        <Popconfirm title={`是否确认操作？`} onConfirm={() => inviteAgain('ZCYQ')} okText="确认">
          <div className="item" key="再次邀请">
            再次邀请
          </div>
        </Popconfirm>
        <Popconfirm title={`是否确认操作？`} onConfirm={() => inviteAgain('BZXS')} okText="确认">
          <div className="item" key="不再显示">
            不再显示
          </div>
        </Popconfirm>
      </div>
    );
    //跳转人员详情
    const jumpToStaffDetail = key => {
      history.push({
        pathname:
          '/pms/manage/staffDetail/' +
          EncryptBase64(
            JSON.stringify({
              ryid: key,
            }),
          ),
        state: { routes },
      });
    };

    //ZCYQ|再次邀请；BZXS|不再显示
    const inviteAgain = operateType => {
      InviteMemberAgain({
        memberId: Number(key),
        operateType,
        post: Number(positionId),
        projectId: Number(xmid),
      })
        .then(res => {
          if (res?.success) {
            // console.log('🚀 ~ InviteMemberAgain ~ res', res);
            getPrjDtlData();
            message.success('操作成功', 1);
          }
        })
        .catch(e => {
          console.error('🚀再次邀请/不再显示', e);
          message.error('操作失败', 1);
        });
    };

    return (
      <div className="member-item" key={key} onClick={() => jumpToStaffDetail(key)}>
        <div className="top">{position}</div>
        <div className="bottom">
          <div className="bottom-left">
            <img src={gender === '男' ? avatarMale : avatarFemale} alt="" />
            {status === '5' && <img src={iconRefuse} alt="" className="member-status-img" />}
            {status === '4' && <img src={iconQuestion} alt="" className="member-status-img" />}
          </div>
          <span>{name}</span>
          <div
            onClick={e => {
              e.stopPropagation();
            }}
          >
            {isXMJL && (status === '4' || status === '5') && (
              <Popover
                placement="bottomRight"
                title={null}
                content={popoverContent}
                overlayClassName="btn-more-content-popover"
                arrowPointAtCenter
              >
                <i className="iconfont icon-more2" />
              </Popover>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (getMemberData().length === 0) return null;
  return (
    <div className="prj-member-box">
      <div className="top-title">项目人员（{getMemberData().length}）</div>
      <div className="bottom-box">
        {getMemberData().map(x =>
          getMemberItem({
            position: x.GW,
            gender: x.XB,
            name: x.RYMC,
            key: x.RYID,
            status: x.RYZT,
            positionId: x.GWID,
          }),
        )}
        {getMemberData().length === 0 && (
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
