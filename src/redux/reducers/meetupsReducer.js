import { combineReducers } from 'redux'

const userMeetups = (state=[], action) => {
    switch(action.type) {
        case ('SET_USER_MEETUPS'):
            return action.payload
        default: 
            return state;
    }
}

const allMeetups = (state=[], action) => {
    switch(action.type) {
        case ('SET_ALL_MEETUPS'):
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({
    userMeetups,
    allMeetups,
  });