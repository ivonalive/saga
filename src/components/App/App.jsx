import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

function App() {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const searchResults = useSelector((state) => state.searchResults);


  const handleSearch = () => {
    if (!searchTerm) {
      alert('Please enter right term');
      return;
    }

    axios.get(`/api/search?q=${searchTerm}`)
      .then(response => {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });
      })
      .catch(error => {
        console.log('Error searching:', error);
        alert('Something wrong.');
      });
  };



  return (
    <div>
      <h1>Giphy Search!</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {searchResults.map((gif) => (
          <div key={gif.id}>
            <img src={gif.images.fixed_height.url} alt={gif.title} />
          </div>
        ))}
      </div>
    </div>


  );
}


export default App;
