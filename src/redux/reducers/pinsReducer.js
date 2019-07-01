const pinListReducer = (state=[], action) => {
    switch(action.type) {
        case ('SET_PIN_LIST'):
            return action.payload
        default: 
            return state;
    }
}

export default pinListReducer;

