import { getTagCloud, getJobAndUserNum, getCategoryGroup, getCrawlerStatus } from '@/services/api';

export default {
  namespace: 'monitor',

  state: {
    tags: [],
  },

  effects: {
    *fetchTags(_, { call, put }) {
      const response = yield call(getTagCloud);
      yield put({
        type: 'saveTagCloud',
        payload: response.result,
      });
    },
    *getJobAndUserNum(_, { call, put }) {
      const response = yield call(getJobAndUserNum);
      yield put({
        type: 'saveJobAndUserNum',
        payload: response.result,
      });
    },
    *getCategoryGroup(_, { call, put }) {
      const response = yield call(getCategoryGroup);
      yield put({
        type: 'saveCategoryGroup',
        payload: response.result,
      });
    },
    *getCrawlerStatus(_, { call, put }) {
      const response = yield call(getCrawlerStatus);
      yield put({
        type: 'saveCrawlerStatus',
        payload: response.result,
      });
    },
  },

  reducers: {
    saveTagCloud(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
    saveJobAndUserNum(state, action) {
      return {
        ...state,
        jobAndUserNum: action.payload,
      };
    },
    saveCategoryGroup(state, action) {
      return {
        ...state,
        categoryGroup: action.payload,
      };
    },
    saveCrawlerStatus(state, action) {
      return {
        ...state,
        crawlerStatus: action.payload,
      };
    },
  },
};
