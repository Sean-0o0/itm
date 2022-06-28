import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { staffrelationship: { staffDepartmentList, staffTeamList, staffJurisdictionNumber, optionalStaffList, cusContractList }, commonbase: { optionalUserList } } = api;

// 综合通用  管辖部门列表(部门名称、部门经理)
export async function getStaffDepartmentList(payload) {
  const option = {
    url: staffDepartmentList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 综合通用  管辖团队列表(部门名称、部门经理)
export async function getStaffTeamList(payload) {
  const option = {
    url: staffTeamList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 综合通用  获取管辖人员数
export async function getStaffJurisdictionNumber(payload) {
  const option = {
    url: staffJurisdictionNumber,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 综合通用  获取可选人员列表
export async function getOptionalStaffList(payload) {
  const option = {
    url: optionalStaffList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// 客户全景  获取客户签约流水
export async function getCusContractList(payload) {
  const option = {
    url: cusContractList,
    method: 'post',
    data: payload,
  };
  return request(option);
}

// HT整合 ---------------------------------------------------------------
// 综合通用  获取可选人员列表
export async function getOptionalUserList(payload) {
  const option = {
    url: optionalUserList,
    method: 'post',
    data: payload,
  };
  return request(option);
}
// HT整合 ---------------------------------------------------------------
