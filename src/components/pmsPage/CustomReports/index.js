import React, {useEffect, useState, useRef} from 'react';
import {QueryProjectListInfo, QueryProjectTracking} from '../../../services/pmsServices';
import {message, Progress} from 'antd';
import Reptabs from "./Reptabs";
import RepInfos from "./RepInfos";

export default function CustomReports(props) {
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    return () => {
    };
  }, []);


  return (
    <div className="custom-reports-box">
      <Reptabs/>
      <RepInfos></RepInfos>
    </div>
  );
}
