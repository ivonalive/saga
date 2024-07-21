import { createStore } from 'redux';

const initialState = {
  searchResults: [],
  favorites: [],
  categories: [] 
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

export default store;
