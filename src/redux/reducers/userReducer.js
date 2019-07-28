import getDistance from 'geolib/es/getDistance';

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
    case 'SET_USER_DISTANCE':
      const distance = getDistance(
        action.payload.userCoords,
        action.payload.venueCoords
      );
      return {
        ...state,
        distance: distance,
      }
    default:
      return state;
  }
};

// user will be on the redux state at:
// state.user
export default userReducer;
