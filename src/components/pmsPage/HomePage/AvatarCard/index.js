import React, { useEffect, useState } from 'react';

export default function AvatarCard(props) {
  const {} = props;
  useEffect(() => {
    return () => {};
  }, []);
  return (
    <div className="avatar-card-box">
      <div className="avatar">
        <img src={require('../../../../assets/homePage/img_avatar_male.png')} alt=''/>
      </div>
      <div className="title">
        <span>
          早上好！王建军
        </span>
        <div className="desc">
          交互产品经理，这是你在浙商证券的第1342天
        </div>
      </div>
    </div>
  );
}
