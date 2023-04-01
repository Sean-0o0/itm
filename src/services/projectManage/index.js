import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { projectManage: {
  querySoftwareList,
  queryProjectLabel,
  queryOrganizationInfo,
  queryBudgetProjects,
  queryMemberInfo,
  queryMilestoneStageInfo,
  queryMatterUnderMilepost,
  queryMilepostInfo,
  creatProject,
  queryProjectDetails,
  queryStationInfo,
  queryProjectInfoAll
} } = api;

// 查询软件清单
export async function FetchQuerySoftwareList(payload, configObj) {
  const option = {
    url: querySoftwareList,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询标签信息
export async function FetchQueryProjectLabel(payload, configObj) {
  const option = {
    url: queryProjectLabel,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询组织机构信息
export async function FetchQueryOrganizationInfo(payload, configObj) {
  const option = {
    url: queryOrganizationInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询预算项目信息
export async function FetchQueryBudgetProjects(payload, configObj) {
  const option = {
    url: queryBudgetProjects,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询人员信息
export async function FetchQueryMemberInfo(payload, configObj) {
  const option = {
    url: queryMemberInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询里程碑阶段信息
export async function FetchQueryMilestoneStageInfo(payload, configObj) {
  const option = {
    url: queryMilestoneStageInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}


// 查询里程碑事项信息
export async function FetchQueryMatterUnderMilepost(payload, configObj) {
  const option = {
    url: queryMatterUnderMilepost,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询里程碑信息
export async function FetchQueryMilepostInfo(payload, configObj) {
  const option = {
    url: queryMilepostInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 新建、修改项目
export async function OperateCreatProject(payload, configObj) {
  const option = {
    url: creatProject,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 修改项目时查询项目详细信息
export async function FetchQueryProjectDetails(payload, configObj) {
  const option = {
    url: queryProjectDetails,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询岗位信息
export async function FetchQueryStationInfo(payload, configObj) {
  const option = {
    url: queryStationInfo,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}

// 查询所有项目信息
export async function FetchQueryProjectInfoAll(payload, configObj) {
  const option = {
    url: queryProjectInfoAll,
    method: 'post',
    data: payload,
  };
  return request(option, configObj);
}
