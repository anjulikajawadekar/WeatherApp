import {React, useState, useEffect} from "react";
import axios from 'axios';

function Anuja(){

    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({ loading: false, data: {}, error: false });
    const [dailyWeather, setDailyWeather] = useState({ loading: false, current: {}, daily: [], error: false });
    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';


    const getWeatherByCoordinates = async (lat, lon) => {
        setWeather({ ...weather, loading: true });
        try {
            const res = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: { lat, lon, units: 'metric', appid: api_key },
            });
            setWeather({ data: res.data, loading: false, error: false });
            console.log("hello");
            console.log(res.data);
        } catch (error) {
            setWeather({ ...weather, data: {}, error: true });
            console.error('Error fetching weather data', error);
        }
    };

    const fetchDailyWeatherData = async (lat, lon) => {
        setDailyWeather({ ...dailyWeather, loading: true });
        try {
            const res = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
                params: { lat, lon, units: 'metric', appid: api_key },
            });
            setDailyWeather({ current: res.data.current, daily: res.data.daily, loading: false, error: false });
        } catch (error) {
            setDailyWeather({ ...dailyWeather, loading: false, error: true });
            console.error('Error fetching daily weather data', error);
        }
    };

    useEffect(() => {
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("hello: "+{latitude, longitude});
                getWeatherByCoordinates(latitude, longitude);
                // fetchDailyWeatherData(latitude, longitude);
                console.log("hello: "+{latitude, longitude});
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


    // const search = async (event) => {
	// 	if (event.key === 'Enter') {
	// 		event.preventDefault();
	// 		setInput('');
	// 		setWeather({ ...weather, loading: true });
	// 		const url = 'https://api.openweathermap.org/data/2.5/weather';
	// 		const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
	// 		await axios
	// 			.get(url, {
	// 				params: {
	// 					q: input,
	// 					units: 'metric',
	// 					appid: api_key,
	// 				},
	// 			})
	// 			.then((res) => {
	// 				console.log('res', res);
	// 				setWeather({ data: res.data, loading: false, error: false });
	// 			})
	// 			.catch((error) => {
	// 				setWeather({ ...weather, data: {}, error: true });
	// 				setInput('');
	// 				console.log('error', error);
	// 			});
	// 	}
	// };

    return(
        <>
        <h1>Anuja</h1>
        <input
                    type="text"
                    className="city-search"
                    placeholder="Search City Name.."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={search}
                    onKeyDown={search}
                />

        <input
        value={"asdf"}
        name="city"

/>
        </>
    )
}

export default Anuja;