import { Table, Empty, DatePicker, Space, Button, Input, Tag } from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import moment from "moment";

const { RangePicker } = DatePicker;

const WeatherTable = ({ data, temp }) => {
  const { t } = useTranslation();
  const [filteredDateRange, setFilteredDateRange] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const times = data.map((item) => moment(item.time));
      const calculatedMin = moment.min(times);
      const calculatedMax = moment.max(times);

      setMinDate(calculatedMin);
      setMaxDate(calculatedMax);
    } else {
      setMinDate(null);
      setMaxDate(null);
    }
  }, [data]);

  const disabledDate = (current) => {
    if (!minDate || !maxDate) {
      return false;
    }
    return (
      current &&
      (current < minDate.startOf("day") || current > maxDate.endOf("day"))
    );
  };

  const handleDateFilter = (dates, confirm) => {
    confirm();
    setFilteredDateRange(dates);
  };

  const handleDateReset = (clearFilters, confirm, setSelectedKeys) => {
    if (clearFilters) {
      clearFilters();
    }
    setSelectedKeys([]);
    setFilteredDateRange(null);
    confirm();
  };

  const columns = [
    {
      title: t("time"),
      dataIndex: "time",
      key: "time",
      render: (formattedTime) => {
        const parts = formattedTime.split("T");
        const datePart = parts[0];
        const timePart = parts[1];

        return (
          <>
            Tarih: {datePart} <br />
            Saat: {timePart}
          </>
        );
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <RangePicker
            showTime={{ format: "HH" }}
            value={
              selectedKeys[0] && selectedKeys[0].length === 2
                ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
                : null
            }
            onChange={(dates) => {
              setSelectedKeys(dates ? [dates.map((d) => d.toISOString())] : []);
            }}
            onOk={(dates) => {
              handleDateFilter(dates, confirm);
              close();
            }}
            style={{ marginBottom: 8, display: "block" }}
            disabledDate={disabledDate}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                const currentDates =
                  selectedKeys[0] && selectedKeys[0].length === 2
                    ? [moment(selectedKeys[0][0]), moment(selectedKeys[0][1])]
                    : null;
                handleDateFilter(currentDates, confirm);
                close();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              {t("filter")}
            </Button>
            <Button
              onClick={() => {
                handleDateReset(clearFilters, confirm, setSelectedKeys);
                close();
              }}
              size="small"
              style={{ width: 90 }}
            >
              {t("reset")}
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              {t("close")}
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <CalendarOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),

      onFilter: (value, record) => {
        if (!value || value.length !== 2) {
          return true;
        }
        const [startDateStr, endDateStr] = value;
        const recordTime = moment(record.time);
        const startDate = moment(startDateStr);
        const endDate = moment(endDateStr);

        return recordTime.isBetween(startDate, endDate, null, "[]");
      },
      sorter: (a, b) => moment(a.time) - moment(b.time),
      sortDirections: ["descend"],
    },

    {
      title: t("temperature"),
      key: "temperature_tags",
      dataIndex: "temperature",
      render: (_, { temperature }) => {
        const currentTemperature = parseFloat(temperature);
        const inputTemp = parseFloat(temp);

        let color = undefined;

        if (!isNaN(currentTemperature) && !isNaN(inputTemp)) {
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
            {currentTemperature !== undefined && currentTemperature !== null
              ? currentTemperature
              : "N/A"}
          </Tag>
        );
      },
      sorter: (a, b) => a.temperature - b.temperature,
    },
  ];

  const dataSource = data.map((item, index) => ({
    key: index,
    time: item.time,
    temperature: item.temperature,
  }));

  return (
    <>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: 6,
          showSizeChanger: false,
        }}
        locale={{
          emptyText: <Empty description={t("noData")} />,
        }}
      />
    </>
  );
};

export default WeatherTable;
