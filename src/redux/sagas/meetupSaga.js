import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* meetupSaga() {
    yield takeLatest('ADD_MEETUP', addMeetup);
    yield takeLatest('FETCH_USER_MEETUPS', getMeetups)
  }

  
function* addMeetup(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return the meetups
    // for the logged in user.
    yield axios.post('/api/meetups/add', action.payload, config);
    yield put({type: 'CLEAR_SELECTED_PIN'});
    yield put({ type: 'FETCH_PINS'});
  } catch (error) {
    console.log('Meetup post request failed', error);
  }
}

function* getMeetups() {
    try {
        const userMeetups = yield axios.get('/api/meetups');
        yield put({type: 'SET_USER_MEETUPS', payload: userMeetups.data});
    } catch( error ) {
        console.log('Meetup get request failed', error);
    }
}

export default meetupSaga;

// axios.get('api/user-meetups')
//         .then( response => {
//             this.props.dispatch({type: 'SET_USER_MEETUPS', payload: response.data})
//         })
//         .catch( error => {
//             console.log('Error in getting user meetups', error);
//         })