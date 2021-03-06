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

const singleMeetup = (state={}, action) => {
    switch(action.type) {
        case ('SET_SINGLE_MEETUP'):
            return action.payload;
        case ('CLEAR_SINGLE_MEETUP'):
            return {};
        default: 
            return state;
    }
}

export default combineReducers({
    userMeetups,
    allMeetups,
    singleMeetup,
  });