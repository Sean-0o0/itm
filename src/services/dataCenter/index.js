import request from '../../utils/request';
import config from '../../utils/config';

const { api } = config;
const {
    dataCenter: {
        queryMarketUnitList,
        queryMarketUnitCol,
        operateMarketUnitInfo,
        updateMarketUnitList,
        queryNature
    },
} = api;

// 查询交易单元列表
export async function FetchQueryMarketUnitList(payload) {
    const option = {
        url: queryMarketUnitList,
        method: 'post',
        data: payload,
    };
    return request(option);
}

// 查询交易单元列表可选列
export async function FetchQueryMarketUnitCol(payload) {
    const option = {
        url: queryMarketUnitCol,
        method: 'post',
        data: payload,
    };
    return request(option);
}

// 修改交易单元列表记录
export async function OperateMarketUnitInfo(payload) {
    const option = {
        url: operateMarketUnitInfo,
        method: 'post',
        data: payload,
    };
    return request(option);
}

// 导入更新交易单元列表
export async function UpdateMarketUnitList(payload) {
    const option = {
        url: updateMarketUnitList,
        method: 'post',
        data: payload,
    };
    return request(option);
}

// 查询交易单元性质
export async function FetchQueryNature(payload) {
    const option = {
        url: queryNature,
        method: 'post',
        data: payload,
    };
    return request(option);
}

