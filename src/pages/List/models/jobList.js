import { pageJobList } from '@/services/api';

export default {
  namespace: 'jobList',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *pageJobList({ payload }, { call, put }) {
      console.log(payload);
      const response = yield call(pageJobList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // *add({ payload, callback }, { call, put }) {
    //   const response = yield call(addRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(updateRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
  },

  reducers: {
    save(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        data: res,
      };
    },
  },
};
