import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* meetupSaga() {
    yield takeLatest('ADD_MEETUP', addMeetup);
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
    console.log('User get request failed', error);
  }
}

export default meetupSaga;