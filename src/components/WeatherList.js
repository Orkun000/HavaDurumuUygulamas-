import { Table, Empty, DatePicker, Space, Button, Input, Tag } from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { observer } from "mobx-react-lite";
import weatherStore from "../stores/WeatherStore";
import DateRangeFilterDropdown from "./weatherList/DateRangeFilter";
import TemperatureTag from "./weatherList/TemperatureTag";
import renderTimeColumn from "../utils/RenderTimeColumn";
import OnFilter from "../utils/OnFilter";

const WeatherTable = observer(() => {
  const { t } = useTranslation();
  const columns = [
    {
      title: t("time"),
      dataIndex: "time",
      key: "time",
      render: renderTimeColumn(t),
      filterDropdown: (props) => (
        <DateRangeFilterDropdown {...props} store={weatherStore} />
      ),
      filterIcon: (filtered) => (
        <CalendarOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: OnFilter(moment),
      sorter: (a, b) => moment(a.time) - moment(b.time),
      sortDirections: ["descend"],
    },
    {
      title: t("temperature"),
      key: "temperature_tags",
      dataIndex: "temperature",
      render: (_, { temperature }) => {
        return <TemperatureTag temperature={temperature} />;
      },
      sorter: (a, b) => a.temperature - b.temperature,
    },
  ];

  return (
    <>
           {" "}
      <Table
        columns={columns}
        dataSource={weatherStore.dataSource}
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: <Empty description={t("noData")} />,
        }}
      />
         {" "}
    </>
  );
});

export default WeatherTable;
