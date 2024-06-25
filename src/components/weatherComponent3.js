import { React, useState, useEffect } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faTemperatureLow, faTint, faEye, faCloud, faWind, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import img1 from '../images/cloud1.jpg';
import ChartComponent from './ChartComponent';
import '../App.css';

function WeatherComponent3() {
    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
    const [dailyWeather, setDailyWeather] = useState({ loading: false, current: {}, daily: [], error: false });

    const toDateFunction = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${weekdays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
    };

    const getWeatherByCoordinates = async (lat, lon) => {
        setWeather({ ...weather, loading: true });
        try {
            const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: { lat, lon, units: 'metric', appid: api_key },
            });
            setWeather({ data: res.data, loading: false, error: false });
            console.log(res.data);
        } catch (error) {
            setWeather({ ...weather, data: {}, error: true });
            console.error('Error fetching weather data', error);
        }
    };

    const fetchDailyWeatherData = async (lat, lon) => {
        setDailyWeather({ ...dailyWeather, loading: true });
        try {
            if(!weather.error){
                const res = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
                    params: { lat, lon, units: 'metric', appid: api_key },
                });
                setDailyWeather({ current: res.data.current, daily: res.data.daily, loading: false, error: false });
            }
            else{
                setDailyWeather({ ...dailyWeather, loading: false, error: true });
            }
               
        } catch (error) {
            setDailyWeather({ ...dailyWeather, loading: false, error: true });
            console.error('Error fetching daily weather data', error);
        }
    };

    useEffect(() => {

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByCoordinates(latitude, longitude);
                fetchDailyWeatherData(latitude, longitude);
            },
            (error) => {
                console.error('Error getting location', error);
                setWeather({ ...weather, error: true });
            }
        );
    }, []);

    const search = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setWeather({ ...weather, loading: true });
            try {
                const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                    params: { q: input, units: 'metric', appid: api_key },
                });
                const { lat, lon } = res.data.coord;
                getWeatherByCoordinates(lat, lon);
                fetchDailyWeatherData(lat, lon);
                setInput('');
            } catch (error) {
                setWeather({ ...weather, data: {}, error: true });
                setInput('');
                console.error('Error fetching weather data', error);
            }
        }
    };

    return (
        <div className="App" style={{ backgroundImage: `url(${img1})` }}>
            <div className='App-content'>
                <h4 className="app-name">Weather App</h4>
                <div className="search-bar">
                    <input
                        type="text"
                        className="city-search"
                        placeholder="Search by City Name.."
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyPress={search}
                        onKeyDown={search}
                    />
                </div>

                {weather.loading && (
                    <>
                        <br />
                        <br />
                        <div className="spinner-container" style={{
                            alignItems:"center", display:'flex',
                            justifyContent:"center", 
                            }}
                            >
                        <Oval type="Oval" color="gray" height={50} width={50} />
                    </div>
                    </>
                )}
                {weather.error && (
                    <>
                        <br />
                        <br />
                        <span className="error-message">
                            <FontAwesomeIcon icon={faFrown} />
                            <span style={{ fontSize: '20px' }}>  City not found</span>
                        </span>
                    </>
                )}
                {weather.data.main && (
                    <div className='App-content'>
                        <div className="city-name">
                            <h2>
                                {weather.data.name}, <span>{weather.data.sys.country}</span>
                            </h2>
                            <div className="date">
                                <span>{toDateFunction(weather.data.dt)}</span>
                            </div>
                            <p className="description">{weather.data.weather[0].description.toUpperCase()}</p>
                            <div className="icon-temp">
                                <img
                                    className=""
                                    src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                                    alt={weather.data.weather[0].description}
                                />
                                {Math.round(weather.data.main.temp)}
                                <sup className="deg">°C</sup>
                            </div>

                            <div className="row all-card">
                                <div className="transparent-card">
                                    <div className="card-header">
                                        <h5>Feels like</h5>
                                    </div>
                                    <div className="card-body">
                                        {weather.data.main.feels_like}°C
                                    </div>
                                    <div>
                                        <FontAwesomeIcon icon={faTemperatureLow} />
                                    </div>
                                </div>

                                <div className="transparent-card">
                                    <div className="card-header">
                                        <h5>Humidity</h5>
                                    </div>
                                    <div className="card-body">
                                        {weather.data.main.humidity}%
                                    </div>
                                    <div><FontAwesomeIcon icon={faTint} /></div>
                                </div>

                                <div className="transparent-card">
                                    <div className="card-header">
                                        <h5>Visibility</h5>
                                    </div>
                                    <div className="card-body">
                                        {(weather.data.visibility / 1000).toFixed(1)} km
                                    </div>
                                    <div><FontAwesomeIcon icon={faEye} /></div>
                                </div>

                                <div className="transparent-card">
                                    <div className="card-header">
                                        <h5>Weather</h5>
                                    </div>
                                    <div className="card-body">
                                        {weather.data.weather[0].description}
                                    </div>
                                    <div><FontAwesomeIcon icon={faCloud} /></div>
                                </div>

                                <div className="transparent-card">
                                    <div className="card-header">
                                        <h5>Wind speed</h5>
                                    </div>
                                    <div className="card-body">
                                        {weather.data.wind.speed} m/s
                                    </div>
                                    <div><FontAwesomeIcon icon={faWind} /></div>
                                </div>

                                <div className="transparent-card">
                                    <div className="card-header">
                                        <h5>Pressure</h5>
                                    </div>
                                    <div className="card-body">
                                        {weather.data.main.pressure} hPa
                                    </div>
                                    <div><FontAwesomeIcon icon={faTachometerAlt} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <hr />
                <div className="container">
                    <div className="row App-content">
                        {!weather.error && !dailyWeather.loading && !dailyWeather.error && dailyWeather.daily.length > 0 && (
                        
                            <>
                                <div className="col-6 App-content" style={{ width: '50%' }}>
                                    <ChartComponent className="" daily={dailyWeather.daily} />
                                </div>
                                <div className="col-6 App-content">
                                    <table className="table table-striped" style={{ color: 'gray' }}>
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Humidity</th>
                                                <th>Min temp.</th>
                                                <th>Max temp.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dailyWeather.daily.map((day, index) => (
                                                <tr key={index}>
                                                    <td>{toDateFunction(day.dt)}</td>
                                                    <td>{day.humidity}%</td>
                                                    <td>{Math.round(day.temp.min)}°C</td>
                                                    <td>{Math.round(day.temp.max)}°C</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeatherComponent3;
