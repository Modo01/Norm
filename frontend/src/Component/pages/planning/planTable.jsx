import { useState, useEffect } from "react";
import { Input, Space, Table } from "antd";
import axios from "axios"; // Make sure you have axios installed
import EditButton from "./icon/editIcon";
import RemoveButton from "./icon/removeIcon";
import ValidateIcon from "./icon/validateIcon";

const PlanTable = () => {
  const [searchTexts, setSearchTexts] = useState({});
  const [tableData, setTableData] = useState([]); // State for database data

  useEffect(() => {
    // Fetch data from backend instead of using data.js
    axios
      .get("http://172.30.30.14:3001/norms") // Replace with your actual endpoint
      .then((response) => {
        // Assuming response.data has the structure { data: [...] }
        const fetchedData = response.data.data;
        setTableData(fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
  }, []);

  const handleSearch = (value, dataIndex) => {
    setSearchTexts((prev) => ({ ...prev, [dataIndex]: value }));
  };

  const filteredData = Array.isArray(tableData)
    ? tableData.filter((record) => {
        return Object.keys(searchTexts).every((dataIndex) => {
          const searchText = searchTexts[dataIndex];
          if (!searchText) return true;
          const recordValue = record[dataIndex];
          return (
            recordValue &&
            recordValue
              .toString()
              .toLowerCase()
              .includes(searchText.toLowerCase())
          );
        });
      })
    : [];

  const headerInput = (placeholder, dataIndex) => (
    <div style={{ padding: 0 }}>
      <Input
        placeholder={placeholder}
        value={searchTexts[dataIndex] || ""}
        onChange={(e) => handleSearch(e.target.value, dataIndex)}
        style={{ width: "100%", padding: 0 }}
        variant="borderless"
      />
    </div>
  );

  const columnDefinitions = [
    { placeholder: "Алба", dataIndex: "service", key: "service" },
    { placeholder: "Салбар нэгж", dataIndex: "branch", key: "branch" },
    { placeholder: "Нормын төрөл", dataIndex: "normType", key: "normType" },
    {
      placeholder: "Дэд ангилал",
      dataIndex: "subCategory",
      key: "subCategory",
    },
    {
      placeholder: "Бага ангилал",
      dataIndex: "smallCategory",
      key: "smallCategory",
    },
    {
      placeholder: "Засварын төрөл",
      dataIndex: "repairType",
      key: "repairType",
    },
    { placeholder: "Групп", dataIndex: "group", key: "group" },
    { placeholder: "Нэмэлт", dataIndex: "addition", key: "addition" },
    { placeholder: "Хэмжих нэгж", dataIndex: "unit", key: "unit" },
    { placeholder: "Тоо хэмжээ", dataIndex: "quantity", key: "quantity" },
  ];

  const columns = [
    {
      title: "Д.д",
      key: "number",
      fixed: "left",
      render: (_, __, index) => index + 1,
      width: "4%",
    },
    ...columnDefinitions.map((col) => ({
      title: headerInput(col.placeholder, col.dataIndex),
      dataIndex: col.dataIndex,
      key: col.key,
      width: col.width,
    })),
    {
      title: "Үйлдэл",
      key: "action",
      fixed: "right",
      width: "10%",
      render: () => (
        <Space size="small">
          <EditButton />
          <RemoveButton />
          <ValidateIcon />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      pagination={{
        pageSizeOptions: ["10", "20", "30", "40", "50"],
        showSizeChanger: true,
        defaultPageSize: 10,
        locale: {
          items_per_page: "мөр/ хуудас",
        },
      }}
    />
  );
};

export default PlanTable;
