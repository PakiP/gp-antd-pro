import { getJobDetail, updateJobDetail } from '@/services/api';

export default {
  namespace: 'jobDetail',

  state: {
    data: {
      list: [],
      pagination: {},
      collectionList: {}
    },
  },

  effects: {
    *getJobDetail({ payload }, { call, put }) {
      const response = yield call(getJobDetail, payload);
      yield put({
        type: 'saveJobDetail',
        payload: response,
      });
    },
    *updateJobDetail({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(updateJobDetail, payload);
      !!resolve && resolve(response);
    },
  },

  reducers: {
    saveJobDetail(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        data: res,
      };
    },
  },
};
