import React, {useEffect, useState, useRef} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo, QueryProjectTracking} from '../../../services/pmsServices';
import {message, Progress} from 'antd';

export default function ProjectTracking(props) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [params, setParams] = useState({
    current: 1,
    pageSize: 5,
    org: '',
    projectId: '',
    projectManager: '',
    projectType: ''
  }); //表格数据-项目列表
  const [trackingData, setTrackingData] = useState([{tableInfo: []}]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTableData(params);
    return () => {
    };
  }, []);

  //项目数据
  const getTableData = (params) => {
    setIsSpinning(true);
    const payload = {
      current: params.current,
      // cycle: 0,
      // endTime: 0,
      // org: 0,
      pageSize: params.pageSize,
      paging: 1,
      // projectId: 0,
      // projectManager: 0,
      // projectType: 0,
      queryType: "XM",
      sort: "",
      // startTime: 0,
      total: -1
    }
    if (params.org !== '') {
      payload.org = params.org;
    }
    if (params.projectId !== '') {
      payload.projectId = params.projectId;
    }
    if (params.projectManager !== '') {
      payload.projectManager = params.projectManager;
    }
    if (params.projectType !== '') {
      payload.projectType = params.projectType;
    }
    QueryProjectTracking({...payload})
      .then(res => {
        if (res?.success) {
          setIsSpinning(false)
          const track = JSON.parse(res.result)
          if (trackingData.length > 0) {
            track.map((item, index) => {
              item.extends = index === 0;
              item.tableInfo = [];
            })
            track.map((item, index) => {
              index === 0 && getInitData(item, track)
            })
          }
          setTotal(res.totalrows)
        }
      })
      .catch(e => {
        setIsSpinning(false)
        message.error('接口信息获取失败', 1);
      });
  };

  const getInitData = async (val, track) => {
    //本周数据
    await getDetailData(val, val.XMZQ, track)
    //上周数据
    await getDetailData(val, -1, track)
  }

  //项目内表格数据-本周/上周
  const getDetailData = (val, XMZQ, trackold) => {
    QueryProjectTracking({
      current: 1,
      cycle: XMZQ,
      // endTime: 0,
      // org: 0,
      pageSize: 5,
      paging: 1,
      projectId: val.XMID,
      // projectManager: 0,
      // projectType: 0,
      queryType: "GZZB",
      sort: "",
      // startTime: 0,
      total: -1
    })
      .then(res => {
        if (res?.success) {
          const track = JSON.parse(res.result)
          console.log("track", track)
          if (track.length > 0) {
            track[0].SJ = XMZQ === -1 ? "上周" : "本周";
            trackold[0].tableInfo.push(track[0]);
          }
          setTrackingData([...trackold])
          XMZQ === -1 && setIsSpinning(false)
          console.log("trackingDataNew", trackold)
        }
      })
      .catch(e => {
        setIsSpinning(false)
        message.error('接口信息获取失败', e);
      });
  };


  const callBackParams = params => {
    console.log('params', params);
    setParams({...params});
  };


  return (
    <div className="project-tracking-box">
      <TopConsole getTableData={getTableData} params={params} callBackParams={callBackParams}
                  dictionary={props.dictionary}/>
      <InfoTable getTableData={getTableData} isSpinning={isSpinning} setIsSpinning={setIsSpinning} total={total}
                 trackingData={trackingData} setTrackingData={setTrackingData} params={params}
                 callBackParams={callBackParams}/>
    </div>
  );
}
