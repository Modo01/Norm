/**
 * EditIcon компонент нь норм засварлах зориулалттай.
 * Нормын мэдээлэл болон нэмэгдсэн бүтээгдэхүүнүүдийг татаж харуулна.
 * Мөн, нэмэгдсэн бүтээгдэхүүнүүдийг засварлах, устгах, болон хадгалах боломжтой.
 */

import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Space,
  Tooltip,
  message,
  Input,
  Table,
  Descriptions,
} from "antd";
import { EditFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
import axios from "axios";
import RemoveIcon from "./removeIcon";
import EditableCell from "./editTableCell";

const EditIcon = ({ normId, onEditNorm }) => {
  // State-үүд
  const [visible, setVisible] = useState(false); // Модал харуулах/нуух
  const [addedProducts, setAddedProducts] = useState([]); // Нэмэгдсэн бүтээгдэхүүнүүд
  const [filteredProducts, setFilteredProducts] = useState([]); // Шүүлтүүртэй бүтээгдэхүүнүүд
  const [searchTexts, setSearchTexts] = useState({}); // Хайлтын текстүүд
  const [loading, setLoading] = useState(false); // Ачаалалтай байдал
  const [normData, setNormData] = useState(null); // Нормын мэдээлэл

  // Бүтээгдэхүүнүүдийг татах
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://172.30.30.14:3001/addedProducts"
        );
        setAddedProducts(
          response.data.map((item, index) => ({ key: index, ...item }))
        );
      } catch (error) {
        console.error("Бүтээгдэхүүн татахад алдаа гарлаа:", error);
        message.error("Бүтээгдэхүүн татахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Нормын дэлгэрэнгүй мэдээлэл татах
  const fetchNormDetails = async () => {
    try {
      const response = await axios.get(`http://172.30.30.14:3001/norms`);
      const norms = response.data.data;
      const selectedNorm = norms.find((norm) => norm.Id === normId);

      if (selectedNorm) {
        setNormData(selectedNorm);
      } else {
        message.error("Тухайн ID бүхий норм олдсонгүй.");
      }
    } catch (error) {
      console.error("Нормын дэлгэрэнгүй татахад алдаа гарлаа:", error);
      message.error("Нормын дэлгэрэнгүй татахад алдаа гарлаа.");
    }
  };

  // Нормын бүтээгдэхүүнүүдийг шүүх
  const filterProductsByNormId = () => {
    const products = addedProducts.filter(
      (product) => product.normId === normId
    );
    setFilteredProducts(products);
  };

  // Модал харуулах
  const showModal = async () => {
    await fetchNormDetails();
    filterProductsByNormId();
    setVisible(true);
  };

  // Хайлт хийх
  const handleSearch = (value, dataIndex) => {
    setSearchTexts((prev) => ({ ...prev, [dataIndex]: value }));
  };

  // Тоо хэмжээ өөрчлөх үед
  const handleQuantityChange = (value, key) => {
    const updatedProducts = filteredProducts.map((item) => {
      if (item.key === key) {
        const updatedNetPrice = (item.price || 0) * value;
        const updatedNewNetPrice = (item.newPrice || 0) * value;
        return {
          ...item,
          quantity: value,
          netPrice: updatedNetPrice,
          newNetPrice: updatedNewNetPrice,
        };
      }
      return item;
    });
    //Тоо хэмжээ өөрчлөгдөх үед нийт үнийг шинэчлэх
    setFilteredProducts(updatedProducts);
    //Тоо хэмжээний өөрчлөлтийг хадгалах үед нийт үнийг шинэчлэх
    setAddedProducts(updatedProducts);
    //Тоо хэмжээ өөрчлөгдөх үед нормын нийт үнийг шинэчлэх
    updateNormTotalNetPrice(updatedProducts);
  };

  // Шинэ үнийг өөрчлөх үед
  const handlePriceChange = (value, key) => {
    console.log("Fitlered Products:", filteredProducts);
    console.log("Filtered Table Data:", filteredTableData);
    const updatedProducts = filteredProducts.map((item) => {
      if (item.key === key) {
        const updatedNewNetPrice = value * (item.quantity || 0);
        return { ...item, newPrice: value, newNetPrice: updatedNewNetPrice };
      }
      return item;
    });
    setFilteredProducts(updatedProducts);
    setAddedProducts(updatedProducts);
    updateNormTotalNetPrice(updatedProducts);
  };

  // Нормын нийт үнийг шинэчлэх
  const updateNormTotalNetPrice = (products) => {
    const totalNetPrice = products.reduce(
      (sum, product) => sum + (product.newNetPrice || 0),
      0
    );
    setNormData((prev) => ({
      ...prev,
      netPrice: totalNetPrice,
    }));
  };

  // Бүтээгдэхүүн устгах
  const handleDelete = (deletedProductId) => {
    const updatedProducts = addedProducts.filter(
      (product) => product.Id !== deletedProductId
    );
    setAddedProducts(updatedProducts);
    updateNormTotalNetPrice(updatedProducts);
  };

  // Өөрчлөлт хадгалах
  const handleOk = async () => {
    setVisible(false);
    try {
      await axios.put(
        `http://172.30.30.14:3001/updateAddedProducts/${normId}`,
        {
          products: filteredProducts,
          normId,
          user: "currentUser",
          netPrice: normData.netPrice,
        }
      );
      message.success("Амжилттай хадгалагдлаа.");
      if (onEditNorm) {
        onEditNorm(normId, {
          status: "Засварлагдсан",
          netPrice: normData.netPrice,
        });
      }
    } catch (error) {
      console.error("Өөрчлөлт хадгалахад алдаа гарлаа:", error);
      message.error("Өөрчлөлт хадгалахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  // Модал хаах
  const handleCancel = () => {
    setVisible(false);
  };

  // Шүүлтүүртэй өгөгдөл
  const filteredTableData = filteredProducts.filter((record) =>
    Object.keys(searchTexts).every((dataIndex) => {
      const searchText = searchTexts[dataIndex];
      if (!searchText) return true;
      const recordValue = record[dataIndex];
      return (
        recordValue &&
        recordValue.toString().toLowerCase().includes(searchText.toLowerCase())
      );
    })
  );

  const headerInput = (placeholder, dataIndex) => (
    <Input
      placeholder={placeholder}
      value={searchTexts[dataIndex] || ""}
      onChange={(e) => handleSearch(e.target.value, dataIndex)}
      style={{ width: "100%", padding: "0" }}
      variant="borderless"
    />
  );

  const columns = [
    {
      title: "Д.д",
      key: "number",
      fixed: "left",
      render: (_, __, index) => index + 1,
      width: "4%",
    },
    {
      title: headerInput("Код", "code"),
      dataIndex: "code",
      key: "code",
    },
    {
      title: headerInput("Бараа материалын нэр", "productName"),
      dataIndex: "productName",
      key: "productName",
      width: "15%",
    },
    {
      title: headerInput("Зургийн дугаар", "picNum"),
      dataIndex: "picNum",
      key: "picNum",
    },
    {
      title: "Хэмжих нэгж",
      children: [
        {
          title: "Үндсэн",
          dataIndex: "unit",
          key: "unit",
          width: "8%",
        },
        {
          title: "Бүртгэл",
          dataIndex: "productUnit",
          key: "productUnit",
          width: "8%",
        },
      ],
    },
    {
      title: "Нэг бүрийн үнэ",
      children: [
        {
          title: "Өмнө",
          dataIndex: "price",
          key: "price",
          width: "8%",
        },
        {
          title: "Шинэ",
          dataIndex: "newPrice",
          key: "newPrice",
          width: "8%",
          render: (text, record) => (
            <EditableCell
              value={record.newPrice}
              onSave={(value) => handlePriceChange(value, record.key)}
              style={{ color: "lightgray" }}
              isNumeric={true}
            />
          ),
        },
      ],
    },
    {
      title: "Тоо хэмжээ",
      dataIndex: "quantity",
      key: "quantity",
      width: "8%",
      render: (text, record) => (
        <EditableCell
          value={record.quantity}
          onSave={(value) => handleQuantityChange(value, record.key)}
          style={{ color: "lightgray" }}
          isNumeric={true}
        />
      ),
    },
    {
      title: "Нийт үнэ",
      children: [
        {
          title: "Өмнө",
          dataIndex: "netPrice",
          key: "netPrice",
          width: "8%",
        },
        {
          title: "Шинэ",
          dataIndex: "newNetPrice",
          key: "newNetPrice",
          width: "8%",
        },
      ],
    },
    {
      title: "Үйлдэл",
      key: "action",
      fixed: "right",
      width: "5%",
      render: (text, record) => (
        <Space size="small">
          <RemoveIcon productId={record.Id} onDelete={handleDelete} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space>
        <Tooltip title="Норм засварлах">
          <EditFilled
            onClick={showModal}
            style={{ fontSize: "20px", color: "#ffd500" }}
          />
        </Tooltip>
      </Space>
      <Modal
        title={
          <h3 style={{ textAlign: "center", width: "100%" }}>
            [Салбар нэгжийн нэр]-н үүсгэсэн норм
          </h3>
        }
        open={visible}
        width={1500}
        onCancel={handleCancel}
        footer={[
          <Button key="save" type="primary" onClick={handleOk}>
            Хадгалах
          </Button>,
          <Button key="cancel" type="primary" danger onClick={handleCancel}>
            Гарах
          </Button>,
        ]}
      >
        {normData && (
          <Descriptions bordered layout="horizontal" column={1}>
            <Descriptions.Item label="Нормын төрөл">
              {normData.normType}
            </Descriptions.Item>
            <Descriptions.Item label="Нормын ангилал">
              {normData.category}
            </Descriptions.Item>
            <Descriptions.Item label="Засварын төрөл">
              {normData.repairType}
            </Descriptions.Item>
            <Descriptions.Item label="Тоо хэмжээ">
              {normData.quantity}
            </Descriptions.Item>
          </Descriptions>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredTableData}
            rowKey="key"
            pagination={{
              pageSizeOptions: ["5", "10", "15", "20", "25"],
              showSizeChanger: true,
              defaultPageSize: 5,
              locale: {
                items_per_page: "мөр/ хуудас",
              },
            }}
          />
        )}
      </Modal>
    </>
  );
};

EditIcon.propTypes = {
  normId: PropTypes.number.isRequired,
  onEditNorm: PropTypes.func,
};

export default EditIcon;
