import { getTagCloud } from '@/services/api';

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
  },

  reducers: {
    saveTagCloud(state, action) {
      return {
        ...state,
        tags: action.payload,
      };
    },
  },
};
