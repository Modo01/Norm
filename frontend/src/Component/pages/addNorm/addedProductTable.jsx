import { useProductContext } from "../../../Provider/productContext";
import { Table, Space } from "antd";
import EditIcon from "./Icon/editIcon"; // Засварлах үйлдлийн компонент
import RemoveIcon from "./Icon/removeIcon"; // Устгах үйлдлийн компонент
import AddProductButton from "./addProductBtn"; // Бүтээгдэхүүн нэмэх товчлуурын компонент

const AddedProductTable = () => {
  // Контекстоос нэмэгдсэн бүтээгдэхүүний өгөгдөл болон функцийг авах
  const { addedProducts, handleAddProduct, handleRemoveProduct } =
    useProductContext();

  // Хүснэгтийн баганы тохиргоо
  const columnsAdded = [
    { title: "Код", dataIndex: "code", key: "code" }, // Бүтээгдэхүүний код
    { title: "Бүлэг", dataIndex: "k1", key: "k1" }, // Бүлгийн нэр
    { title: "Бага бүлэг", dataIndex: "k3", key: "k3" }, // Бага бүлгийн нэр
    { title: "Бараа бүтээгдэхүүний нэр", dataIndex: "k4", key: "k4" }, // Бүтээгдэхүүний нэр
    { title: "Марк", dataIndex: "k6", key: "k6" }, // Бүтээгдэхүүний марк
    { title: "Зургийн дугаар", dataIndex: "picNum", key: "picNum" }, // Зургийн дугаар
    { title: "Хэмжих нэгж", dataIndex: "unit", key: "unit" }, // Хэмжих нэгж
    {
      title: "Үйлдэл",
      key: "action",
      fixed: "right", // Баганыг баруун талд түгжих
      render: (text, record) => (
        <Space size="small">
          {/* Засварлах болон устгах үйлдлийн компонентууд */}
          <EditIcon productId={record.id} product={record} />
          <RemoveIcon product={record} onRemoveProduct={handleRemoveProduct} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Бүтээгдэхүүн нэмэх товчлуур */}
      <div style={{ alignSelf: "flex-end", marginBottom: "10px" }}>
        <AddProductButton onAddProduct={handleAddProduct} />
      </div>

      {/* Нэмэгдсэн бараа материалын хүснэгт */}
      <Table
        columns={columnsAdded} // Баганы тохиргоог дамжуулах
        dataSource={addedProducts} // Нэмэгдсэн бүтээгдэхүүний өгөгдөл
        scroll={{ x: "max-content" }} // Хүснэгтийн хэвтээ гүйлгүүрийг идэвхжүүлэх
        rowKey="id" // Хүснэгтийн мөрийн түлхүүр (id нь өвөрмөц байх ёстой)
      />
    </div>
  );
};

export default AddedProductTable;
