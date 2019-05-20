import { pageUserCollectionListById } from '@/services/api';

export default {
  namespace: 'userCollectionList',

  state: {
    data: {
      list: [],
      pagination: {},
      collectionList: {}
    },
  },

  effects: {
    *pageUserCollectionListById({ payload }, { call, put }) {
      const response = yield call(pageUserCollectionListById, payload);
      yield put({
        type: 'saveUserCollectionList',
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
    saveUserCollectionList(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        data: res,
      };
    },
  },
};
