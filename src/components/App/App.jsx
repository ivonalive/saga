import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [favoriteGif, setFavoriteGif] = useState(null);

  const dispatch = useDispatch();

  const searchResults = useSelector((state) => state.searchResults);
  const favorites = useSelector((state) => state.favorites);
  const categories = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch({ type: 'FETCH_FAVORITES' });
    dispatch({ type: 'FETCH_CATEGORIES' });
  }, [dispatch]);

  const handleSearch = () => {
    if (!searchTerm) {
      alert('Not right words');
      return;
    }

    axios.get(`/api/search?q=${searchTerm}&page=1`)
      .then(response => {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data });
      })
      .catch(error => {
        console.log('Error search:', error);
        alert('Something wrong with searching.');
      });
  };

  const handleFavorite = () => {
    axios.post('/api/favorites', {
      url: favoriteGif.images.fixed_height.url,
      title: favoriteGif.title,
      category_ids: selectedCategories
    })
      .then(() => {
        dispatch({ type: 'FETCH_FAVORITES' });
      })
      .catch(error => {
        console.log(error);
        alert('Something wrong with favorite.');
      });
  };

  const handleDeleteFavorite = (favoriteId) => {
    axios.delete(`/api/favorites/${favoriteId}`)
      .then(() => {
        dispatch({ type: 'FETCH_FAVORITES' });
      })
      .catch(error => {
        console.log(error);
        alert('Something wrong with delete favorite.');
      });
  };

  const handleAddCategory = () => {
    axios.post('/api/categories', { name: newCategory })
      .then(() => {
        setNewCategory('');
        dispatch({ type: 'FETCH_CATEGORIES' });
      })
      .catch(error => {
        console.log(error);
        alert('Something went wrong.');
      });
  };

  const handleDeleteCategory = (categoryId) => {
    axios.delete(`/api/categories/${categoryId}`)
      .then(() => {
        dispatch({ type: 'FETCH_CATEGORIES' });
      })
      .catch(error => {
        console.log(error);
        alert('Something wrong with delete category.');
      });
  };

  const handleEditCategory = (categoryId, newName) => {
    axios.put(`/api/categories/${categoryId}`, { name: newName })
      .then(() => {
        dispatch({ type: 'FETCH_CATEGORIES' });
      })
      .catch(error => {
        console.log(error);
        alert('Something wrong with edit category.');
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
            <select multiple onChange={(e) => {
              const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
              setSelectedCategories(selectedCategories);
              setFavoriteGif(gif);
            }}>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <button onClick={handleFavorite}>Add to Favorites</button>
          </div>
        ))}
      </div>
      <h2>Favorites</h2>
      <div>
        {favorites.map((favorite) => (
          <div key={favorite.id}>
            <img src={favorite.url} alt={favorite.title} />
            <div>Categories: {favorite.categories.join(', ') || 'Uncategorized'}</div>
            <button onClick={() => handleDeleteFavorite(favorite.id)}>Delete</button>
          </div>
        ))}
      </div>
      <h2>Manage Categories</h2>
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={handleAddCategory}>Add Category</button>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
            <button onClick={() => handleEditCategory(category.id, prompt('New name:', category.name))}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;