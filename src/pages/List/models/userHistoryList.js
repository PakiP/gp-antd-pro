import { pageUserHistoryListById } from '@/services/api';

export default {
  namespace: 'userHistoryList',

  state: {
    data: {
      list: [],
      pagination: {},
      collectionList: {}
    },
  },

  effects: {
    *pageUserHistoryListById({ payload }, { call, put }) {
      const response = yield call(pageUserHistoryListById, payload);
      yield put({
        type: 'saveUserHistoryList',
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
    saveUserHistoryList(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        data: res,
      };
    },
  },
};
