import { pageJobList, changeJobStatus, updateJobDetail } from '@/services/api';

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
      const response = yield call(pageJobList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *changeJobStatus({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(changeJobStatus, payload);
      // yield put({
      //   type: 'saveJobStatus',
      //   payload: response,
      // });
      !!resolve && resolve(response);
    },
    *updateJobDetail({ payload }, { call, put }) {
      const { resolve } = payload;
      const response = yield call(updateJobDetail, payload);
      !!resolve && resolve(response);
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
    saveJobStatus(state, action) {
      const res = action.payload.result;
      // console.log(res);
      return {
        ...state,
      };
    },
  },
};
