import { combineReducers } from 'redux'

const pinList = (state=[], action) => {
    switch(action.type) {
        case ('SET_PIN_LIST'):
            return action.payload
        default: 
            return state;
    }
}

const selectedPin = (state=null, action) => {
    switch(action.type) {
        case ('SET_SELECTED_PIN'):
            return action.payload;
        case ('CLEAR_SELECTED_PIN'):
            return null;
        default: 
            return state;
    }
}

export default combineReducers({
    pinList,
    selectedPin,
  });