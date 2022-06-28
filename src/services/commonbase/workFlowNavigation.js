import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const { commonbase: { workFlowNavigation } } = api;

// 获取人员流程导航数据
export async function getWorkFlowNavigation(payload) {
  const option = {
    url: workFlowNavigation,
    method: 'post',
    data: payload,
  };
  return request(option);
}
