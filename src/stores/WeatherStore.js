import { makeAutoObservable } from "mobx";
import { message } from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";

const initialCityCoordinates = {
  Türkiye: {
    İstanbul: { latitude: 41.0082, longitude: 28.9784 },
    İzmir: { latitude: 38.4192, longitude: 27.1287 },
  },
  Almanya: {
    Berlin: { latitude: 52.52, longitude: 13.405 },
    Hamburg: { latitude: 53.5511, longitude: 9.9937 },
  },
  Fransa: {
    Paris: { latitude: 48.8566, longitude: 2.3522 },
  },
  Yunanistan: {
    Atina: { latitude: 37.9838, longitude: 23.7275 },
  },
  İtalya: {
    Roma: { latitude: 41.9028, longitude: 12.4964 },
  },
  İngiltere: {
    Londra: { latitude: 51.5074, longitude: -0.1278 },
  },
  Portekiz: {
    Lizbon: { latitude: 38.7169, longitude: -9.1399 },
  },
  İspanya: {
    Madrid: { latitude: 40.4168, longitude: -3.7038 },
  },
};

class WeatherStore {
  weatherData = [];
  temperatureFilter = null;
  loading = false;
  selectedCountries = [];
  availableCities = [];
  cityCoordinates = initialCityCoordinates;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get dataSource() {
    return this.weatherData.map((item, index) => ({
      key: index,
      time: item.time,
      temperature: item.temperature,
      city: item.city,
    }));
  }

  setSelectedCountries = (countries) => {
    this.selectedCountries = countries;
    this.updateAvailableCities();
    this.setWeatherData([]);
    this.setTemperatureFilter(null);
  };

  updateAvailableCities = () => {
    const newCities = [];
    this.selectedCountries.forEach((country) => {
      const cities = Object.keys(this.cityCoordinates[country]);
      newCities.push(...cities);
    });
    this.availableCities = newCities;
  };

  setTemperatureFilter = (temp) => {
    this.temperatureFilter = temp;
  };

  setLoading = (value) => {
    this.loading = value;
  };

  setWeatherData = (data) => {
    this.weatherData = data;
  };

  fetchWeatherData = async (values, t) => {
    const { city, temperature } = values;
    this.setTemperatureFilter(temperature);

    const allWeatherData = [];
    const selectedCities = city;

    this.setLoading(true);
    try {
      for (const selectedCity of selectedCities) {
        let countryOfCity = null;
        for (const countryKey in this.cityCoordinates) {
          if (this.cityCoordinates[countryKey][selectedCity]) {
            countryOfCity = countryKey;
            break;
          }
        }

        const { latitude, longitude } =
          this.cityCoordinates[countryOfCity]?.[selectedCity];

        const {
          data: {
            hourly: { time: times, temperature_2m: temps },
          },
        } = await axios.get("https://api.open-meteo.com/v1/forecast", {
          params: {
            latitude,
            longitude,
            hourly: "temperature_2m",
          },
        });

        const formatted = times.map((time, index) => ({
          time,
          temperature: temps[index],
          city: selectedCity,
        }));
        allWeatherData.push(...formatted);
      }

      this.setWeatherData(allWeatherData);
    } catch (error) {
      console.error(t("apiError"), error);
      message.error(t("weatherFetchError"));
      this.setWeatherData([]);
    } finally {
      this.setLoading(false);
    }
  };

  clearForm = (t) => {
    this.setSelectedCountries([]);
    this.setWeatherData([]);
    this.setTemperatureFilter(null);
    message.info(t("formCleared"));
  };
}
export default new WeatherStore();
