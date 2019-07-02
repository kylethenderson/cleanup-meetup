import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* pinsSaga() {
  yield takeLatest('FETCH_PINS', fetchPins);
  yield takeLatest('ADD_PIN', addPin)
}


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

function* addPin(action) {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };


    yield axios.post('/api/pins', action.payload, config);
    yield put({ type: 'FETCH_PINS' });
  } catch (error) {

  }
}

// function formatDate(date) {
//   return date.substring(5, 7) + "/" + date.substring(8, 10) + "/" + date.substring(0, 4)
// }

export default pinsSaga;