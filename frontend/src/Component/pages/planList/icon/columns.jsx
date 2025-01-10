// import EditButton from "./icon/editIcon";
// import RemoveButton from "./icon/removeIcon";
// import ValidateIcon from "./icon/validateIcon";
// import React from "react";
// import { Input, Space, Table } from "antd";

// export const columns = () => [
//   {
//     title: "Д.д",
//     key: "number",
//     fixed: "left",
//     render: (_, __, index) => index + 1,
//     width: "4%",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Алба"
//           value={searchTexts["service"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "service")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "service",
//     key: "service",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Салбар нэгж"
//           value={searchTexts["branch"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "branch")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "branch",
//     key: "branch",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Нормын төрөл"
//           value={searchTexts["normType"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "normType")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "normType",
//     key: "normType",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Дэд ангилал"
//           value={searchTexts["subclass"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "subclass")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "subclass",
//     key: "subclass",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Бага ангилал"
//           value={searchTexts["smallClass"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "smallClass")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "smallClass",
//     key: "smallClass",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Засварын төрөл"
//           value={searchTexts["repairType"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "repairType")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "repairType",
//     key: "repairType",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Групп"
//           value={searchTexts["group"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "group")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "group",
//     key: "group",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Нэмэлт"
//           value={searchTexts["addition"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "addition")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "addition",
//     key: "addition",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Хэмжих нэгж"
//           value={searchTexts["unit"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "unit")}
//           style={{ width: "100%" }}
//         />
//       </div>
//     ),
//     dataIndex: "unit",
//     key: "unit",
//   },
//   {
//     title: (
//       <div>
//         <Input
//           placeholder="Тоо хэмжээ"
//           value={searchTexts["number"] || ""}
//           onChange={(e) => handleSearch(e.target.value, "number")}
//           style={{ width: "100%", height: "30px" }}
//         />
//       </div>
//     ),
//     dataIndex: "number",
//     key: "number",
//     width: "8%",
//   },
//   {
//     title: "Үйлдэл",
//     key: "action",
//     fixed: "right",
//     width: "10%",
//     render: (_, record) => (
//       <Space size="small">
//         <EditButton />
//         <RemoveButton />
//         <ValidateIcon />
//       </Space>
//     ),
//   },
// ];
