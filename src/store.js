import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';

const searchResults = (state = [], action) => {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return action.payload;
    default:
      return state;
  }
};

const favorites = (state = [], action) => {
  switch (action.type) {
    case 'SET_FAVORITES':
      return action.payload;
    default:
      return state;
  }
};

const categories = (state = [], action) => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return action.payload;
    default:
      return state;
  }
};

function* fetchFavorites() {
  try {
    const response = yield axios.get('/api/favorites');
    yield put({ type: 'SET_FAVORITES', payload: response.data });
  } catch (error) {
    console.error('Error fetching favorites', error);
  }
}

function* fetchCategories() {
  try {
    const response = yield axios.get('/api/categories');
    yield put({ type: 'SET_CATEGORIES', payload: response.data });
  } catch (error) {
    console.error('Error fetching categories', error);
  }
}

function* addFavorite(action) {
  try {
    yield axios.post('/api/favorites', action.payload);
    yield put({ type: 'FETCH_FAVORITES' });
  } catch (error) {
    console.error('Error adding favorite', error);
  }
}

function* deleteFavorite(action) {
  try {
    yield axios.delete(`/api/favorites/${action.payload}`);
    yield put({ type: 'FETCH_FAVORITES' });
  } catch (error) {
    console.error('Error deleting favorite', error);
  }
}

function* rootSaga() {
  yield takeEvery('FETCH_FAVORITES', fetchFavorites);
  yield takeEvery('FETCH_CATEGORIES', fetchCategories);
  yield takeEvery('ADD_FAVORITE', addFavorite);
  yield takeEvery('DELETE_FAVORITE', deleteFavorite);
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    searchResults,
    favorites,
    categories
  }),
  applyMiddleware(sagaMiddleware, logger)
);

sagaMiddleware.run(rootSaga);

export default store;
