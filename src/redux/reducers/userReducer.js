const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload;
    case 'UNSET_USER':
      return {};
    case 'SET_USER_LOCATION':
      return {
        ...state, 
        latitude: action.payload.latitude,
        longitude: action.payload.longitude, 
      }
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;
