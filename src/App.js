import React, { useState } from "react";
import WeatherForm from "./components/WeatherForm";
import WeatherTable from "./components/WeatherTable";
import { Card, Select, Collapse, Divider, Col } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./i18n";

const { Option } = Select;
const { Panel } = Collapse;
const App = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [filteredTemp, setFilteredTemp] = useState([]);
  const { t, i18n } = useTranslation();

  return (
    <div style={{ maxWidth: 700, margin: "50px auto" }}>
      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <Select
          defaultValue={i18n.language}
          style={{ width: 120 }}
          onChange={(lng) => i18n.changeLanguage(lng)}
        >
          <Option value="tr">Türkçe</Option>
          <Option value="en">English</Option>
        </Select>
      </div>
      <Card title={t("country_selection_title")}>
        <WeatherForm
          onWeatherFetched={setWeatherData}
          onTempFetched={setFilteredTemp}
        />
      </Card>

      {!!weatherData.length && (
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          {weatherData.map((dataItem, index) => (
            <Panel header={t("weather_table_title")} key={index}>
              <Card
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
              >
                <WeatherTable
                  key={dataItem.id}
                  data={dataItem}
                  temp={filteredTemp}
                />
              </Card>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
};

export default App;
