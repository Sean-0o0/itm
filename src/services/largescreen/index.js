import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
  largescreen: {
    queryModuleChartConfig,
    queryChartIndexConfig,
    queryChartIndexData,
    queryOptIdxState, 
    queryOptIdxStateStat,
    queryErrOrImpRpt,
    queryESB,
    queryDW,
    queryErrOrImpRptStat,
    queryCallInfo,
    queryWK,
    queryBaseDblcs,
    querySyTzgg,
    queryBaseNewClass,
    querySyCycz,
    // queryJyrHk
    queryAccountProperty,
    queryScreenPermission,
    getRiskIndexTaskMon,
    queryUnfinishTargetList,
    queryBranUserSettings,
    addBranSetting,
    queryBranSetting
  },
} = api;

// 查询模块图表配置
export async function FetchQueryModuleChartConfig(payload) {
  const option = {
    url: queryModuleChartConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询图表指标配置
export async function FetchQueryChartIndexConfig(payload) {
  const option = {
    url: queryChartIndexConfig,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询图表指标数据
export async function FetchQueryChartIndexData(payload) {
  const option = {
    url: queryChartIndexData,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询运作类指标状态
export async function FetchQueryOptIdxState(payload) {
  const option = {
    url: queryOptIdxState,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 查询运作类指标状态统计
export async function FetchQueryOptIdxStateStat(payload) {
  const option = {
    url: queryOptIdxStateStat,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 重大事项查询
export async function FetchQueryErrOrImpRpt(payload) {
  const option = {
    url: queryErrOrImpRpt,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// ESB对接集中运营接口
export async function FetchQueryChartESBData(payload) {
  const option = {
    url: queryESB,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// 数仓数据实时查询接口
export async function FetchQueryChartDWData(payload) {
  const option = {
    url: queryDW,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 重大事项统计查询
export async function FetchQueryErrOrImpRptStat(payload) {
  const option = {
    url: queryErrOrImpRptStat,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询呼叫呼入服务
export async function FetchQueryCallInfo(payload) {
  const option = {
    url: queryCallInfo,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 查询呼叫中心网开数据
export async function FetchQueryWK(payload) {
  const option = {
    url: queryWK,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//获取代办流程数
export async function FetchQueryBaseDblcs(payload) {
  const option = {
    url: queryBaseDblcs,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//获取通知公告
export async function FetchQuerySyTzgg(payload) {
  const option = {
    url: querySyTzgg,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//获取通知公告
export async function FetchQueryBaseNewClass(payload) {
  const option = {
    url: queryBaseNewClass,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//获取常用操作
export async function FetchQuerySyCycz(payload) {
  const option = {
    url: querySyCycz,
    method: 'post',
    data: payload,
  };
  return request(option);
}

//是否香港交易日
// export async function FetchQueryJyrHk(payload) {
//   const option = {
//     url: queryJyrHk,
//     method: 'post',
//     data: payload,
//   };
//   return request(option);
// }

//期货-未规范客户数实时查询接口
export async function FetchQueryAccountProperty(payload) {
  const option = {
    url: queryAccountProperty,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function FetchQueryScreenPermission(payload) {
  const option = {
    url: queryScreenPermission,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function FetchGetRiskIndexTaskMon(payload) {
  const option = {
    url: getRiskIndexTaskMon,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function FetchQueryUnfinishTargetList(payload) {
  const option = {
    url: queryUnfinishTargetList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function FetchQueryBranUserSettings(payload) {
  const option = {
    url: queryBranUserSettings,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function AddBranSetting(payload) {
  const option = {
    url: addBranSetting,
    method: 'post',
    data: payload,
  };
  return request(option);
}

export async function FetchQueryBranSetting(payload) {
  const option = {
    url: queryBranSetting,
    method: 'post',
    data: payload,
  };
  return request(option);
}