import { pageUserList, getUserCollectionList } from '@/services/api';

export default {
  namespace: 'userList',

  state: {
    data: {
      list: [],
      pagination: {},
      collectionList: {}
    },
  },

  effects: {
    *pageUserList({ payload }, { call, put }) {
      const response = yield call(pageUserList, payload);
      yield put({
        type: 'saveUserList',
        payload: response,
      });
    },
    *getUserCollectionList({ payload }, { call, put }) {
      const response = yield call(getUserCollectionList, payload);
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
    saveUserList(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        data: res,
      };
    },
    saveUserCollectionList(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        collectionList: res,
      };
    }
  },
};
