import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Select,
  message,
  Spin,
  InputNumber,
  Popover,
  Col,
  Row,
} from "antd";
import axios from "axios";
import { useTranslation } from "react-i18next";
import FormItem from "antd/es/form/FormItem";

const { Option } = Select;

const cityCoordinates = {
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

const WeatherForm = ({ onWeatherFetched, onTempFetched }) => {
  const [availableCities, setAvailableCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [selectedCountries, setSelectedCountries] = useState([]);

  useEffect(() => {
    const newCities = [];
    selectedCountries.forEach((country) => {
      const citiesOfThisCountry = Object.keys(cityCoordinates[country]); // lat long al
      newCities.push(...citiesOfThisCountry);
    });
    setAvailableCities(newCities);
    onWeatherFetched([]);
  }, [selectedCountries]);

  const handleCountryChange = (countries) => {
    setSelectedCountries(countries);
  };
  const content = (
    <div>
      <p>Content</p>
      <p>Content</p>
    </div>
  );

  const onFinish = async (values) => {
    console.log(values);
    const { country, city, temperature } = values;
    onTempFetched(temperature);

    const allWeatherData = [];
    const selectedCities = city;

    setLoading(true);
    try {
      for (const selectedCity of selectedCities) {
        let countryOfCity = null;
        for (const countryKey in cityCoordinates) {
          if (cityCoordinates[countryKey][selectedCity]) {
            countryOfCity = countryKey;
            break;
          }
        }
        const { latitude, longitude } =
          cityCoordinates[countryOfCity]?.[selectedCity];
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
        allWeatherData.push(formatted);
        message.success(`${selectedCity} için hava durumu başarıyla yüklendi!`);
      }
      onWeatherFetched(allWeatherData);
    } catch (error) {
      console.error("API isteği hatası:", error);
      message.error("Hava durumu alınamadı. Lütfen tekrar deneyin.");
      onWeatherFetched([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setAvailableCities([]);
    setSelectedCountries([]);
    onWeatherFetched([]);
    onTempFetched(null);
    message.info(t("formCleared"));
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 400 }}
    >
      <Row>
        <Col span={10}>
          <Form.Item
            label={t("country")}
            name="country"
            rules={[{ required: true, message: t("required_country") }]}
            key="country-form-item"
          >
            <Select
              placeholder={t("select_country_placeholder")}
              mode="multiple"
              onChange={handleCountryChange}
              size="small"
              key="country-select"
            >
              {Object.keys(cityCoordinates).map((country) => (
                <Option value={country} key={country}>
                  {t(country)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("city_label")}
            name="city"
            rules={[{ required: true, message: t("required_city") }]}
            key="city-form-item"
          >
            <Select
              placeholder={t("select_city_placeholder")}
              mode="multiple"
              size="small"
              key="city-select"
              disabled={availableCities.length === 0}
              option
            >
              {availableCities.map((city) => (
                <Option value={city} key={city}>
                  {t(city)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item key="submit-button-item">
            <Button type="primary" htmlType="submit" loading={loading}>
              {t("search_button")}
            </Button>
            <Button
              onClick={handleClear}
              type="default"
              style={{
                borderColor: "#d9d9d9",
                color: "rgba(0, 0, 0, 0.45)",
                marginLeft: 8,
              }}
            >
              {t("clear_button")}
            </Button>
          </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={10}>
          <Form.Item label={t("temp_input_label")} name="temperature">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default WeatherForm;
