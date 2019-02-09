export const setNotifySetting = (state, data) => {
  state.notifySetting = { ...state.notifySetting, ...data };
};

export const setUserName = (state, data) => {
  state.userName = data;
};

export const setRouterList = (state, data) => {
  state.routerList = data;
};
