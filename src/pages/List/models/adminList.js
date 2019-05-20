import { pageAdminList, addNewAdmin, changeAdminPsw, changeAdminStatus } from '@/services/api';

export default {
  namespace: 'adminList',

  state: {
    data: {
      list: [],
      pagination: {},
      collectionList: {}
    },
  },

  effects: {
    *pageAdminList({ payload }, { call, put }) {
      const response = yield call(pageAdminList, payload);
      yield put({
        type: 'saveAdminList',
        payload: response,
      });
    },
    *addAdmin({ payload }, { call, put }) {
      const response = yield call(addNewAdmin, payload);
      return response;
    },
    *changeAdminPsw({ payload }, { call, put }) {
      const response = yield call(changeAdminPsw, payload);
      return response;
    },
    *changeAdminStatus({ payload }, { call, put }) {
      const response = yield call(changeAdminStatus, payload);
      return response;
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
    saveAdminList(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        data: res,
      };
    },
    saveNewAdmin(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        newAdmin: res,
      };
    },
  },
};
