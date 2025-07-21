import React, { useEffect } from "react";
import { Form, Button, Select, message, InputNumber, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import weatherStore from "../stores/WeatherStore";
import { observer } from "mobx-react-lite";

const { Option } = Select;

const WeatherForm = observer(() => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const {
    selectedCountries,
    availableCities,
    loading,
    cityCoordinates,
    setSelectedCountries,
    fetchWeatherData,
    clearForm,
  } = weatherStore;

  useEffect(() => {
    form.setFieldsValue({
      city: undefined,
      temperature: undefined,
    });
  }, [selectedCountries, form]);

  const handleCountryChange = (countries) => {
    setSelectedCountries(countries);
    form.setFieldsValue({ city: undefined, temperature: undefined });
  };

  const onFinish = async (values) => {
    await fetchWeatherData(values, t);
  };

  const handleClear = () => {
    form.resetFields();
    clearForm(t);
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
            rules={[{ required: true, message: t("requiredCountry") }]}
          >
            <Select
              placeholder={t("selectCountry")}
              mode="multiple"
              onChange={handleCountryChange}
              size="small"
            >
              {Object.keys(cityCoordinates).map((country) => (
                <Option value={country} key={country}>
                  {t(country)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("city")}
            name="city"
            rules={[{ required: true, message: t("requiredCity") }]}
          >
            <Select
              placeholder={t("selectCity")}
              mode="multiple"
              size="small"
              disabled={!availableCities.length}
            >
              {availableCities.map((city) => (
                <Option value={city} key={city}>
                  {t(city)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t("search")}
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
              {t("clear")}
            </Button>
          </Form.Item>
        </Col>
        <Col span={2}></Col>
        <Col span={10}>
          <Form.Item label={t("tempInput")} name="temperature">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
});

export default WeatherForm;
