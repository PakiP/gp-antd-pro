import { stringify } from 'qs';
import request from '@/utils/request';


export async function startCrawler(params) {
  return request('/api/crawler/crawlJobData', {
    method: 'POST',
    data: {
      ...params,
      method: 'get',
    },
  });
}

export async function stopCrawler(params) {
  return request('/api/crawler/stop', {
    method: 'GET',
    data: {
      ...params,
      method: 'get',
    },
  });
}

export async function pageLog(params) {
  return request('/api/manage/pageLog', {
    method: 'GET',
    data: {
      ...params,
      method: 'get',
    },
  });
}

export async function pageJobList(params) {
  return request('/api/manage/pageJobList', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function pageUserList(params) {
  return request('/api/manage/pageUserList', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function changeJobStatus(params) {
  return request('/api/manage/changeJobStatus', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateJobDetail(params) {
  return request(`/api/manage/updateJobDetail?${stringify(params)}`);
}


export async function getUserCollectionList(params) {
  return request(`/api/manage/getUserCollectionList?${stringify(params)}`);
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function getTagCloud() {
  return request(`/api/manage/getTagCloud`);
}

export async function getJobAndUserNum() {
  return request(`/api/manage/getJobAndUserNum`);
}

export async function getCategoryGroup() {
  return request(`/api/manage/getCategoryGroup`);
}

export async function getCrawlerStatus() {
  return request(`/api/manage/getCrawlerStatus`);
}

export async function getMenuList() {
  return request(`/api/crawler/getMenuList`);
}


