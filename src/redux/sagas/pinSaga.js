import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchPins(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return all of
    // pins in the database
    const response = yield axios.get('/api/pins', config);
    yield put({ type: 'SET_PIN_LIST', payload: response.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* fetchPin(action) {
  try {
    const username = yield axios.get(`/api/pins/username/${action.payload.ref_created_by}`)
    yield put({type:'SET_SELECTED_PIN', payload: {
      ...action.payload, 
      username: username.data,
    }})

  } catch(error) {
    console.log('Error fetching selected pin', error);
  }
}

function* addPin(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };
    yield axios.post('/api/pins', action.payload, config);
    yield put({ type: 'CLEAR_SELECTED_PIN' });
    yield put({ type: 'FETCH_PINS' });
  } catch (error) {

  }
}

// deletePin takes the id of the pin to be deleted
function* deletePin(action) {
  yield axios.delete(`/api/pins/${action.payload}`)
  yield put({ type: 'FETCH_PINS' });
}

function* pinsSaga() {
  yield takeLatest('FETCH_PINS', fetchPins);
  yield takeLatest('SELECT_PIN', fetchPin);
  yield takeLatest('ADD_PIN', addPin)
  yield takeLatest('DELETE_PIN', deletePin)
}

export default pinsSaga;