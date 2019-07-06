import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
  
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

function* editMeetup(action) {
  try{
    yield axios.put('/api/meetups', action.payload);
    yield put({ type: 'FETCH_PINS'});
  } catch(error) {
    console.log('Error in editing meetup', error)
  }
}

function* deleteMeetup(action) {
  try {
    console.log('deleteMeetup payload:', action.payload);
    yield axios.delete(`/api/meetups/${action.payload}`)
    yield put({ type: 'FETCH_PINS'});
  } catch (error) {
    console.log('Error deleting meetup', error);
  }
}

function* joinMeetup(action) {
  try {
    yield axios.post('/api/meetups/join', action.payload)
    yield put({ type: 'FETCH_PINS'});
  }catch (error) {
    console.log('Error joining meetup', error);
  }
}

function* leaveMeetup(action) {
  console.log(action.payload);
  try {
    yield axios.delete(`api/meetups/join/${action.payload.meetupId}`);
    yield put({type: 'FETCH_PINS'});
  } catch(error) {
    console.log('Error leaving meetup', error);
  }
}

function* meetupSaga() {
  yield takeLatest('ADD_MEETUP', addMeetup);
  yield takeLatest('FETCH_USER_MEETUPS', getMeetups)
  yield takeLatest('DELETE_MEETUP', deleteMeetup)
  yield takeLatest('EDIT_MEETUP', editMeetup)
  yield takeLatest('JOIN_MEETUP', joinMeetup)
  yield takeLatest('LEAVE_MEETUP', leaveMeetup)
}

export default meetupSaga;