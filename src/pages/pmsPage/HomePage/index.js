import React, { useEffect, useState } from 'react';
import { DecryptBase64 } from '../../../components/Common/Encrypt';
import HomePageTab from '../../../components/pmsPage/HomePage';

//首页
export default function HomePage(props) {
  useEffect(() => {
    return () => {};
  }, []);
  return <HomePageTab {...props} />;
}
