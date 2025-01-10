// import { useState, useEffect } from "react";
// import { Input, Space, Table, Tag, Select, DatePicker } from "antd";
// import axios from "axios";
// import EditIcon from "./action/edit/editIcon";
// import RemoveIcon from "./action/removeIcon";
// import ValidateIcon from "./action/validateIcon";
// import PrintIcon from "./action/printIcon";
// import CancelIcon from "./action/cancelIcon";
// import dayjs from "dayjs";

// const { RangePicker } = DatePicker; //Онооны муж сонгох компонент

// const NormTable = () => {
//   //Хайлт болон шүүлтүүрийн төлвүүд
//   const [searchTexts, setSearchTexts] = useState({});
//   const [dateFromFilter, setDateFromFilter] = useState(null);
//   const [dateToFilter, setDateToFilter] = useState(null);
//   const [creatorFilter, setCreatorFilter] = useState("");
//   const [validatorFilter, setValidatorFilter] = useState("");
//   const [validatedFilter, setValidatedFilter] = useState("");

//   // Norm өгөгдлийн төлөв
//   const [normData, setNormData] = useState([]);

//   // Компонент анх ачаалагдахад өгөгдлийг татах
//   useEffect(() => {
//     axios
//       .get("http://172.30.30.14:3001/norms")
//       .then((response) => {
//         const fetchedData = response.data.data;
//         setNormData(fetchedData);
//       })
//       .catch((error) => {
//         console.error("Error fetching norm data:", error);
//       });
//   }, []);

//   const handleSearch = (value, dataIndex) => {
//     setSearchTexts((prev) => ({ ...prev, [dataIndex]: value }));
//   };

//   // Баганын гарчиг хэсэги хайлтын талбар үүсгэх
//   const headerInput = (placeholder, dataIndex) => (
//     <Input
//       placeholder={placeholder}
//       value={searchTexts[dataIndex] || ""}
//       onChange={(e) => handleSearch(e.target.value, dataIndex)}
//       style={{ padding: 0 }}
//       variant="borderless"
//     />
//   );

//   // Өгөгдлийг шүүх функц
//   const filteredData = normData.filter((record) => {
//     // Бүх баганад тохирох эсэхийг шалгах
//     const columnFiltersPass = Object.keys(searchTexts).every((dataIndex) => {
//       const searchText = searchTexts[dataIndex];
//       if (!searchText) return true; // Хайлт хоосон бол бүх өгөгдлийг харуулах
//       const recordValue = record[dataIndex];
//       return (
//         recordValue &&
//         recordValue.toString().toLowerCase().includes(searchText.toLowerCase())
//       );
//     });

//     // Огнооны шүүлт
//     const recordDate = record.statusDate ? dayjs(record.statusDate) : null;
//     const fromDate = dateFromFilter ? dayjs(dateFromFilter) : null;
//     const toDate = dateToFilter ? dayjs(dateToFilter) : null;

//     const datePass =
//       (!fromDate || (recordDate && !recordDate.isBefore(fromDate))) &&
//       (!toDate || (recordDate && !recordDate.isAfter(toDate)));

//     // Үүсгэгчээр шүүх
//     const creatorPass = creatorFilter
//       ? record.creator?.toLowerCase().includes(creatorFilter.toLowerCase())
//       : true;

//     // Баталгаажуулагчаар шүүх
//     const validatorPass = validatorFilter
//       ? record.validator?.toLowerCase().includes(validatorFilter.toLowerCase())
//       : true;

//     // Төлөвөөр шүүх
//     const validatedPass = validatedFilter
//       ? record.status === validatedFilter
//       : true;

//     // Бүх шүүлт амжилттай бол өгөгдлийг буцаах
//     return (
//       columnFiltersPass &&
//       datePass &&
//       creatorPass &&
//       validatorPass &&
//       validatedPass
//     );
//   });

//   const columns = [
//     {
//       title: "Д.Д",
//       key: "number",
//       fixed: "left",
//       render: (_, __, index) => index + 1,
//       width: "1%",
//     },
//     {
//       title: headerInput("САЛБАР НЭГЖ", "branch"),
//       dataIndex: "branch",
//       key: "branch",
//       width: "5%",
//     },
//     {
//       title: headerInput("ДЭД АНГИЛАЛ", "subCategory"),
//       dataIndex: "subCategory",
//       key: "subCategory",
//       width: "5%",
//     },
//     {
//       title: headerInput("БАГА АНГИЛАЛ", "smallCategory"),
//       dataIndex: "smallCategory",
//       key: "smallCategory",
//       width: "5%",
//     },
//     {
//       title: headerInput("ЗАСВАРЫН ТӨРӨЛ", "repairType"),
//       dataIndex: "repairType",
//       key: "repairType",
//       width: "6%",
//     },
//     {
//       title: headerInput("ГРУПП", "group"),
//       dataIndex: "group",
//       key: "group",
//       width: "5%",
//     },
//     {
//       title: headerInput("НЭМЭЛТ", "addition"),
//       dataIndex: "addition",
//       key: "addition",
//       width: "5%",
//     },
//     {
//       title: headerInput("ХЭМЖИХ НЭГЖ", "unit"),
//       dataIndex: "unit",
//       key: "unit",
//       width: "5%",
//     },
//     {
//       title: headerInput("НИЙТ ҮНЭ", "netPrice"),
//       dataIndex: "netPrice",
//       key: "netPrice",
//       width: "5%",
//     },
//     {
//       title: "ТӨЛӨВ",
//       dataIndex: "status",
//       key: "status",
//       width: "5%",
//       render: (status) => {
//         let color = "";
//         switch (status) {
//           case "Баталгаажсан":
//             color = "green";
//             break;
//           case "Хадгалагдсан":
//             color = "blue";
//             break;
//           case "Засварлагдсан":
//             color = "yellow";
//             break;
//           case "Цуцлагдсан":
//             color = "red";
//             break;
//           default:
//             color = "gray";
//         }
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "ТӨЛВИЙН ОГНОО",
//       dataIndex: "statusDate",
//       key: "statusDate",
//       width: "5%",
//       render: (statusDate) => {
//         if (!statusDate) return "-";
//         return dayjs(statusDate).format("YYYY он MM сар DD өдөр");
//       },
//     },
//     {
//       title: "ҮЙЛДЭЛ",
//       key: "action",
//       fixed: "right",
//       width: "1%",
//       render: (_, record) => {
//         const { status, Id } = record;

//         const actions = [];
//         if (status === "Хадгалагдсан") {
//           actions.push(
//             <EditIcon key="edit" normId={Id} />,
//             <RemoveIcon
//               key="remove"
//               normId={Id}
//               status={status}
//               onHideNorm={handleHideNorm}
//             />,
//             <ValidateIcon
//               key="validate"
//               normId={Id}
//               norm={record}
//               status={status}
//               onValidate={handleValidateNorm}
//             />,
//             <PrintIcon
//               key="print"
//               normId={Id}
//               tableData={tableData}
//               columns={columns}
//             />
//           );
//         } else if (status === "Засварлагдсан") {
//           actions.push(
//             <EditIcon key="edit" normId={Id} />,
//             <RemoveIcon
//               key="remove"
//               normId={Id}
//               status={status}
//               onHideNorm={handleHideNorm}
//             />,
//             <ValidateIcon
//               key="validate"
//               normId={Id}
//               norm={record}
//               status={status}
//               onValidate={handleValidateNorm}
//             />,
//             <PrintIcon
//               key="print"
//               normId={Id}
//               tableData={tableData}
//               columns={columns}
//             />
//           );
//         } else if (status === "Баталгаажсан") {
//           actions.push(
//             <CancelIcon
//               key="cancel"
//               normId={Id}
//               norm={record}
//               status={status}
//               onCancel={handleCancelNorm}
//             />,
//             <PrintIcon
//               key="print"
//               normId={Id}
//               tableData={tableData}
//               columns={columns}
//             />
//           );
//         } else if (status === "Цуцлагдсан") {
//           actions.push(
//             <EditIcon key="edit" normId={Id} />,
//             <RemoveIcon
//               key="remove"
//               normId={Id}
//               status={status}
//               onHideNorm={handleHideNorm}
//             />,
//             <ValidateIcon
//               key="validate"
//               normId={Id}
//               norm={record}
//               status={status}
//               onValidate={handleValidateNorm}
//             />,
//             <PrintIcon
//               key="print"
//               normId={Id}
//               tableData={tableData}
//               columns={columns}
//             />
//           );
//         }

//         return <div style={{ display: "flex", gap: "4px" }}>{actions}</div>;
//       },
//     },
//   ];

//   const tableData = [
//     { id: 1, code: "001", productName: "Бараа 1", quantity: 5 },
//     { id: 2, code: "002", productName: "Бараа 2", quantity: 10 },
//     { id: 3, code: "003", productName: "Бараа 3", quantity: 15 },
//     { id: 4, code: "004", productName: "Бараа 4", quantity: 20 },
//     { id: 5, code: "005", productName: "Бараа 5", quantity: 25 },
//   ];

//   const handleDateRangeChange = (dates) => {
//     setDateFromFilter(dates && dates[0] ? dates[0].format("YYYY-MM-DD") : null);
//     setDateToFilter(dates && dates[1] ? dates[1].format("YYYY-MM-DD") : null);
//   };

//   const handleHideNorm = (normId) => {
//     setNormData((prevData) => prevData.filter((norm) => norm.Id !== normId));
//   };

//   const handleValidateNorm = (normId) => {
//     setNormData((prevData) =>
//       prevData.map((norm) =>
//         norm.Id === normId
//           ? {
//               ...norm,
//               status: "Баталгаажсан",
//               statusDate: new Date().toISOString(),
//             }
//           : norm
//       )
//     );
//   };
//   console.log(`normdata,: `, normData);
//   const handleCancelNorm = (normId) => {
//     setNormData((prevData) =>
//       prevData.map((norm) =>
//         norm.Id === normId
//           ? {
//               ...norm,
//               status: "Цуцлагдсан",
//               statusDate: new Date().toISOString(),
//             }
//           : norm
//       )
//     );
//   };

//   return (
//     <div>
//       <Space style={{ marginBottom: 16 }}>
//         <RangePicker
//           format="YYYY-MM-DD"
//           onChange={handleDateRangeChange}
//           allowClear
//           placeholder={["Эхлэх огноо", "Дуусах огноо"]}
//         />
//         <Input
//           placeholder="Норм үүсгэгч"
//           value={creatorFilter}
//           onChange={(e) => setCreatorFilter(e.target.value)}
//           style={{ width: 150 }}
//         />
//         <Input
//           placeholder="Баталгаажуулсан хэрэглэгч"
//           value={validatorFilter}
//           onChange={(e) => setValidatorFilter(e.target.value)}
//           style={{ width: 200 }}
//         />
//         <Select
//           placeholder="Төлөв"
//           value={validatedFilter || undefined}
//           onChange={(value) => setValidatedFilter(value || "")}
//           style={{ width: 150 }}
//           allowClear
//         >
//           <Select.Option value="Баталгаажсан">Баталгаажсан</Select.Option>
//           <Select.Option value="Хадгалагдсан">Хадгалагдсан</Select.Option>
//           <Select.Option value="Засварлагдсан">Засварлагдсан</Select.Option>
//           <Select.Option value="Цуцлагдсан">Цуцлагдсан</Select.Option>
//         </Select>
//       </Space>

//       <Table
//         columns={columns}
//         dataSource={filteredData}
//         scroll={{ x: "max-content" }}
//         rowKey="id" // Make sure your data has a unique `id` field
//         pagination={{
//           pageSizeOptions: ["10", "20", "30", "40", "50"],
//           showSizeChanger: true,
//           defaultPageSize: 10,
//           locale: {
//             items_per_page: "мөр/ хуудас",
//           },
//         }}
//       />
//     </div>
//   );
// };

// export default NormTable;

// <div>
//   <p>
//     Хадгалах: Нэмсэн нормд `ормын жагсаалт` цэс рүү орж ямар нэгэн үйлдэл
//     хийгээгүй үед төлөв `Хадгалагдсан` болж огнооны хамт харагдана .Хадгалсан
//     төлөвтэй үед `Засварлах`, `Устгах`, `Хэвлэх`, `Баталгаажуулах` товч идэвхтэй
//     байна.
//   </p>
//   <p>
//     Засварлах: Тухайн нормыг үүсгэсэн хэрэглэгч зөвхөн засварлана. Хэрвээ тухайн
//     нормыг засварласан тохиолдолд Төлөв `Засварлагдсан` болж огнооны хамт
//     харагдана. Засварласан төлөвтэй үед `Засварлах`, `Устгах`, `Хэвлэх`,
//     `Баталгаажуулах` товч идэвхтэй байна.
//   </p>
//   <p>
//     Устгах: Тухайн нормыг үүсгэсэн хэрэглэгч нормыг тэр чигт нь устгана.
//     `Цуцлагдсан`, `Засварлагдсан`, `Хадгалагдсан` төлөвтэй үед л `Устгах` товч
//     идэвхтэй байна. Баталгаажуулах: Тухайн үүсгэсэн нормыг хянах эрх бүхий
//     хэрэглэгч баталгаажуулалт хийсэн тохиолдолд `Баталгаажсан` төлөвтэй болно.
//     Нормыг үүсгэсэн хэрэглэгч баталгаажуулалт хийхгүй. Баталгаажсан тохиолдолд
//     зөвхөн `Цуцлах`, `Хэвлэх` товч идэвхтэй байна.
//   </p>

//   <p>
//     Цуцлах: Тухайн нормыг баталгаажуулсан хэрэглэгч цуцлах эрхтэй байх ба цуцлах
//     үйлдлийг гүйцэтгэсэн тохиолдолд `Цуцлагдсан` төлөвтэй болно. Цуцлагдсан
//     тохиолдолд тохиолдолд `Засварлах`, `Устгах`, `Хэвлэх`, `Баталгаажуулах`
//     товчууд идэвхтэй байна.
//   </p>
// </div>;
