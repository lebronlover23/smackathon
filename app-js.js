import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const NASA_API_KEY = 'oyIAqOFFEKcUBtrkqbDI0PTD2I8NMultuw7jCcco';

function App() {
  const [apodData, setApodData] = useState(null);
  const [asteroidData, setAsteroidData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch APOD
        const apodResponse = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
        );
        setApodData(apodResponse.data);

        // Fetch Asteroid data
        const today = new Date().toISOString().split('T')[0];
        const asteroidResponse = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&api_key=${NASA_API_KEY}`
        );
        setAsteroidData(asteroidResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Error fetching NASA data');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading NASA data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>NASA Space Dashboard</h1>
      </header>

      <main>
        {/* APOD Section */}
        {apodData && (
          <section className="apod-section">
            <h2>Astronomy Picture of the Day</h2>
            <div className="apod-content">
              <img src={apodData.url} alt={apodData.title} className="apod-image" />
              <div className="apod-info">
                <h3>{apodData.title}</h3>
                <p>{apodData.explanation}</p>
                <p className="date">Date: {apodData.date}</p>
                {apodData.copyright && (
                  <p className="copyright">Copyright: {apodData.copyright}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Asteroid Section */}
        {asteroidData && (
          <section className="asteroid-section">
            <h2>Near Earth Objects</h2>
            <div className="asteroid-grid">
              {Object.values(asteroidData.near_earth_objects)[0]
                .slice(0, 6)
                .map((asteroid, index) => (
                  <div key={index} className="asteroid-card">
                    <h3>{asteroid.name}</h3>
                    <p>
                      Size: {
                        ((asteroid.estimated_diameter.kilometers.estimated_diameter_min +
                          asteroid.estimated_diameter.kilometers.estimated_diameter_max) / 2).toFixed(2)
                      } km
                    </p>
                    <p>
                      Speed: {
                        parseInt(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)
                      } km/h
                    </p>
                    <p>
                      Miss Distance: {
                        parseInt(asteroid.close_approach_data[0].miss_distance.kilometers)
                      } km
                    </p>
                    <p className={asteroid.is_potentially_hazardous_asteroid ? 'hazard' : 'safe'}>
                      {asteroid.is_potentially_hazardous_asteroid ? 'Potentially Hazardous' : 'Safe'}
                    </p>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;