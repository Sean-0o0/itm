import React, {useEffect, useState, useRef} from 'react';
import InfoTable from './InfoTable';
import TopConsole from './TopConsole';
import {QueryProjectListInfo, QueryProjectTracking, QueryUserRole} from '../../../services/pmsServices';
import {message, Progress} from 'antd';
import moment from "moment";

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
  const [prjRepManage, setPrjRepManage] = useState('');
  const LOGIN_USER_ID = String(JSON.parse(sessionStorage.getItem('user'))?.id);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getTableData(params);
    queryUserRole();
    return () => {
    };
  }, []);
  const queryUserRole = () => {
    QueryUserRole({
      userId: Number(LOGIN_USER_ID),
    })
      .then(res => {
        if (res.code === 1) {
          setPrjRepManage(res.zyrole);
        }
      })
      .catch(e => {
        message.error('用户信息查询失败', 1);
      });
  }

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
          console.log("tracktracktrack-ccc", track)
          if (track.length > 0) {
            track.map((item, index) => {
              item.extends = index === 0;
              item.tableInfo = [];
            })
            track.map((item, index) => {
              index === 0 && getInitData(item, track)
            })
          } else {
            setTrackingData([])
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
    //本周和上周数据
    await getDetailData(val, val.XMZQ, track)
  }

  //项目内表格数据-本周/上周
  const getDetailData = (val, XMZQ, trackold) => {
    // 上周一到这周末
    let start = moment().week(moment().week()).startOf('week').format('YYYYMMDD');
    let end = moment().week(moment().week()).endOf('week').format('YYYYMMDD');
    let weekOfday = parseInt(moment().format('d'))
    let laststart = moment().subtract(weekOfday + 6, 'days').format('YYYYMMDD')
    let lastend = moment().subtract(weekOfday, 'days').format('YYYYMMDD')
    console.log("start", start)
    console.log("end", end)
    console.log("laststart", laststart)
    console.log("lastend", lastend)
    QueryProjectTracking({
      current: 1,
      // cycle: XMZQ,
      endTime: end,
      pageSize: 5,
      paging: 1,
      projectId: val.XMID,
      queryType: "GZZB",
      sort: "",
      startTime: laststart,
      total: -1
    })
      .then(res => {
        if (res?.success) {
          const track = JSON.parse(res.result)
          console.log("track", track)
          let thisweek = track.filter(item => item.XMZQ === XMZQ)
          let lastweek = track.filter(item => item.XMZQ !== XMZQ)
          if (thisweek.length > 0) {
            thisweek[0].SJ = "本周";
            trackold[0].tableInfo.push(thisweek[0]);
          }
          if (lastweek.length > 0) {
            lastweek[0].SJ = "上周";
            trackold[0].tableInfo.push(lastweek[0]);
          }
          console.log("trackoldtrackold-ccc", trackold)
          setTrackingData([...trackold])
          setIsSpinning(false)
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
                 callBackParams={callBackParams} prjRepManage={prjRepManage}/>
    </div>
  );
}
