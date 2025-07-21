import React from "react";
import { Tag } from "antd";
import { observer } from "mobx-react-lite";
import weatherStore from "../../stores/WeatherStore";
const TemperatureTag = observer(({ temperature }) => {
  const currentTemperature = parseFloat(temperature);
  let color = undefined;
  if (!!weatherStore.temperatureFilter) {
    const inputTemp = parseFloat(weatherStore.temperatureFilter);
    if (currentTemperature === inputTemp) {
      color = "volcano";
    } else if (currentTemperature < inputTemp) {
      color = "green";
    } else {
      color = "red";
    }
  }

  return (
    <Tag color={color} key={currentTemperature}>
      {!!currentTemperature ? `${currentTemperature}°C` : "N/A"}
    </Tag>
  );
});

export default TemperatureTag;
