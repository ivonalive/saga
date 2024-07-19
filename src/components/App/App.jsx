import 'dotenv/config';

const GIPHY_API_KEY =process.env.GIPHY_API_KEY



function App() {
  return (
    <div>
      <h1>Giphy Search!</h1>
      <div id="gif-container">
    <p>{GIPHY_API_KEY}</p>
      </div>
    </div>
  );
}


export default App;
