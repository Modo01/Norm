import { useProductContext } from "../../../Provider/productContext"; // Контекстыг импортлох
import { Table, Button, Input, Spin } from "antd"; // Ant Design компонентуудыг ашиглах
import PropTypes from "prop-types"; // PropTypes ашиглан төрлийг шалгах
import { useState, useMemo } from "react"; // React hooks ашиглах

function AllProductTable() {
  // Контекстоос өгөгдөл болон функцуудыг авах
  const { data, handleAddProduct, loading, error } = useProductContext();

  // Хайлт хийхэд ашиглах төлөвийг тодорхойлох
  const [searchTexts, setSearchTexts] = useState({});

  // Хайлт хийх утгыг тохируулах функц
  const handleSearch = (value, dataIndex) => {
    setSearchTexts((prev) => ({ ...prev, [dataIndex]: value }));
  };

  // Өгөгдлийг шүүхэд ашиглах (Memo ашиглан гүйцэтгэлийг сайжруулах)
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return []; // Өгөгдөл массив эсэхийг шалгах
    return data.filter((record) =>
      Object.keys(searchTexts).every((dataIndex) => {
        const searchText = searchTexts[dataIndex];
        if (!searchText) return true; // Хайлт байхгүй бол бүх өгөгдлийг буцаах
        const recordValue = record[dataIndex];
        return (
          recordValue &&
          recordValue
            .toString()
            .toLowerCase()
            .includes(searchText.toLowerCase())
        );
      })
    );
  }, [data, searchTexts]);

  // Хүснэгтийн хайлт хийх боломжтой багана үүсгэх функц
  const createColumn = (placeholder, dataIndex, key) => ({
    title: (
      <Input
        placeholder={placeholder} // Хайлт хийх талбарын текст
        value={searchTexts[dataIndex] || ""} // Одоогийн хайлтын утга
        onChange={(e) => handleSearch(e.target.value, dataIndex)} // Хайлт хийх үед дуудагдах функц
        style={{ width: "100%", padding: 0 }}
        variant="borderless"
      />
    ),
    dataIndex,
    key,
    width: 150,
  });

  // Хүснэгтийн багануудын тодорхойлолт
  const columnsAll = [
    {
      title: "",
      key: "add",
      fixed: "left",
      width: 100,
      render: (text, record) => (
        <Button type="primary" onClick={() => handleAddProduct(record)}>
          Нэмэх
        </Button>
      ),
    },
    createColumn("Код", "code", "code"), // Код багана
    createColumn("Бүлэг", "k1", "k1"), // Бүлэг багана
    createColumn("Бага бүлэг", "k3", "k3"), // Бага бүлэг багана
    createColumn("Бараа бүтээгдэхүүний нэр", "k4", "k4"), // Бүтээгдэхүүний нэр багана
    createColumn("Марк", "k6", "k6"), // Марк багана
    createColumn("Зургийн дугаар", "picNum", "picNum"), // Зургийн дугаар багана
    createColumn("Хэмжих нэгж", "unit", "unit"), // Хэмжих нэгж багана
    createColumn("Үнэ", "price"), // Үнэ багана
  ];

  // Ачаалж байгаа эсэхийг шалгаж Spin харуулах
  if (loading) {
    return <Spin size="large" />;
  }

  // Алдаа гарсан тохиолдолд алдааны мессеж харуулах
  if (error) {
    return <div>Өгөгдөл ачааллахад алдаа гарлаа</div>;
  }

  return (
    // Хүснэгт
    <Table
      columns={columnsAll} // Багануудыг дамжуулах
      dataSource={filteredData} // Шүүгдсэн өгөгдлийг харуулах
      rowKey="code"
      scroll={{ x: 1000 }}
      pagination={{
        pageSizeOptions: ["10", "20", "30", "40", "50"], // Хуудасны хэмжээ сонгох боломж
        showSizeChanger: true, // Хуудасны хэмжээ өөрчлөх товч харагдах
        defaultPageSize: 10, // Анхны хуудасны хэмжээ
        locale: {
          items_per_page: "мөр/ хуудас",
        },
      }}
    />
  );
}

AllProductTable.propTypes = {
  onAddProduct: PropTypes.func.isRequired, // onAddProduct функц заавал байх шаардлагатай
};

export default AllProductTable;
