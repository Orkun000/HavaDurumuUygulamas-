import React from "react";
import WeatherForm from "./components/WeatherForm";
import WeatherList from "./components/WeatherList";
import LanguageSelector from "./components/LanguageSelector";
import { Card, Select, Collapse } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import weatherStore from "./stores/WeatherStore";
import "./i18n";

const { Option } = Select;
const { Panel } = Collapse;

const App = observer(() => {
  const { t, i18n } = useTranslation();

  const { weatherData, selectedCountries } = weatherStore;

  return (
    <div style={{ maxWidth: 700, margin: "50px auto" }}>
      <LanguageSelector />

      <Card title={t("countrySelection")}>
        <WeatherForm />
      </Card>

      {!!weatherData.length && (
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          {selectedCountries.map((dataItem, index) => (
            <Panel header={t("weatherTable")}>
              <Card
                style={{
                  border: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
              >
                <WeatherList />
              </Card>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
});

export default App;
