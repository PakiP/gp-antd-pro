import { pageLog, startCrawler, stopCrawler } from '@/services/api';

export default {
  namespace: 'automaker',

  state: {
    data: {
      logList: [],
      isRun: true
    },
  },

  effects: {
    // *pageJobList({ payload }, { call, put }) {
    //   console.log(payload);
    //   const response = yield call(pageJobList, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    *getLatestLog({ payload }, { call, put }) {
      const response = yield call(pageLog, payload);
      yield put({
        type: 'saveLogLsit',
        payload: response,
      });
    },
    *startCrawler({ payload }, { call, put }) {
      const response = yield call(startCrawler, payload);
    },
    *stopCrawler({ payload }, { call, put }) {
      const response = yield call(stopCrawler, payload);
    }
  },

  reducers: {
    // save(state, action) {
    //   const res = action.payload.result;
    //   return {
    //     ...state,
    //     data: res,
    //   };
    // },
    saveLogLsit(state, action) {
      const res = action.payload.result;
      return {
        ...state,
        logList: res,
      };
    },
    stopLog(state) {
      // const res = action.payload.result;
      return {
        ...state,
        isRun: false,
      };
    }
  },
};
