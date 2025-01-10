import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Button,
  Space,
  Input,
  Row,
  Col,
  Descriptions,
  Select,
  Form,
  message,
} from "antd";
import { EditFilled } from "@ant-design/icons";
import { useProductContext } from "../../../../Provider/productContext";
import axios from "axios";

function EditIcon({ productId }) {
  // Бүтээгдэхүүний өгөгдлийг контекстоос авна
  const { addedProducts, handleUpdateProduct } = useProductContext();

  // Төлөвүүдийг тодорхойлох
  const [open, setOpen] = useState(false); // Модалын нээгдэх төлөв
  const [quantity, setQuantity] = useState(0); // Тоо хэмжээ
  const [newPrice, setNewPrice] = useState(0); // Шинэ үнэ
  const [price, setPrice] = useState(0); // Нэг бүрийн үнэ
  const [netPrice, setNetPrice] = useState(0); // Нийт үнэ
  const [newNetPrice, setNewNetPrice] = useState(0); // Шинэ нийт үнэ
  const [selectedUnit, setSelectedUnit] = useState(""); // Хэмжих нэгжийн сонголт
  const [unitOptions, setUnitOptions] = useState([]); // Хэмжих нэгжийн жагсаалт
  const [loading, setLoading] = useState(true); // Ачаалалын төлөв

  // `units` хүснэгтээс хэмжих нэгжийн өгөгдлийг авах
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axios.get("http://172.30.30.14:3001/units");
        setUnitOptions(response.data); // Өгөгдлийг жагсаалтад хадгалах
      } catch (error) {
        console.error("Хэмжих нэгж татахад алдаа гарлаа:", error);
      } finally {
        setLoading(false); // Ачаалалт дууссан төлөв
      }
    };

    fetchUnits();
  }, []);

  // Бүтээгдэхүүнийг `addedProducts`-оос олох
  const product = addedProducts.find((prod) => prod.id === productId);

  // Модал нээх үед утгуудыг төлөвт ачаалах
  const showModal = () => {
    setQuantity(product.quantity); // Тоо хэмжээг тохируулах
    setPrice(product.price || 0); // Үнэ тохируулах
    setNetPrice(product.netPrice || 0); // Нийт үнийг тохируулах
    setNewNetPrice(product.newNetPrice || 0); // Шинэ нийт үнийг тохируулах
    setSelectedUnit(product.formUnit || ""); // Сонгогдсон хэмжих нэгж

    setOpen(true); // Модал нээх
  };

  // Модал хаах
  const handleCancel = () => {
    setOpen(false);
  };

  // Нормд нэмсэн бараа материалын мэдээллийг хадгалах
  const handleSave = () => {
    if (!quantity || quantity <= 0) {
      message.error("Тоо хэмжээг зөв оруулна уу!");
      return;
    }
    if (!newPrice || newPrice <= 0) {
      message.error("Шинэ үнийг зөв оруулна уу!");
      return;
    }
    if (!selectedUnit) {
      message.error("Хэмжих нэгж сонгоно уу!");
      return;
    }

    // Бараа материалыг шинэчлэх
    const updatedProduct = {
      ...product,
      quantity,
      price,
      newPrice,
      netPrice,
      newNetPrice,
      formUnit: selectedUnit, // Сонгосон хэмжих нэгжийг хадгалах
    };

    handleUpdateProduct(updatedProduct); // Контекстод шинэчлэх
    setOpen(false);
  };

  // Тоо хэмжээ өөрчлөх
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(value); // Тоо хэмжээг шинэчлэх
    setNetPrice(value * price); // Нийт үнийг тооцоолох
    setNewNetPrice(value * newPrice); // Шинэ нийт үнийг тооцоолох
  };

  // Үнэ өөрчлөх
  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setNewPrice(value); // Шинэ үнийг шинэчлэх
    setNewNetPrice(quantity * value); // Шинэ нийт үнийг тооцоолох
  };

  // Хэмжих нэгж өөрчлөх
  const handleUnitChange = (value) => {
    setSelectedUnit(value); // Сонгосон хэмжих нэгжийг шинэчлэх
  };

  return (
    <>
      {/* Засварлах дүрс дээр дарахад модал нээх */}
      <Space>
        <EditFilled
          onClick={showModal}
          style={{ fontSize: "20px", color: "#ffd500" }}
        />
      </Space>

      {/* Бараа материалын мэдээлэл засах модал */}
      <Modal
        width={"60vh"}
        open={open}
        title="Бараа материалын бүртгэл"
        onCancel={handleCancel}
        footer={[
          <Button key="save" type="primary" onClick={handleSave}>
            Хадгалах
          </Button>,
          <Button key="cancel" onClick={handleCancel}>
            Гарах
          </Button>,
        ]}
      >
        <Row>
          {/* Бараа материалын дэлгэрэнгүй мэдээлэл */}
          <Descriptions
            layout="horizontal"
            column={1}
            style={{
              padding: "16px",
              height: "200px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              marginBottom: "10px",
            }}
          >
            <Descriptions.Item label="Код">{product.code}</Descriptions.Item>
            <Descriptions.Item label="Бараа материалын нэр">
              {product.k4}
            </Descriptions.Item>
            <Descriptions.Item label="Марк">{product.k6}</Descriptions.Item>
            <Descriptions.Item label="Зургийн дугаар">
              {product.picNum}
            </Descriptions.Item>
            <Descriptions.Item label="Хэмжих нэгж">
              {product.unit} {/* Анхны хэмжих нэгжийг харуулах */}
            </Descriptions.Item>
          </Descriptions>

          <Col span={12} style={{ paddingRight: "15px" }}>
            <p>
              <strong>Зарчим:</strong>
              <Input disabled value={product.rule} />
            </p>
            <p>
              <strong>Нэг бүрийн үнэ:</strong>
              <Input
                disabled
                type="number"
                value={price}
                min={0}
                placeholder="Enter unit price"
              />
            </p>
            <p>
              <strong>Нийт үнэ:</strong>
              <Input disabled value={netPrice} />
            </p>
          </Col>

          <Col span={12}>
            <Form.Item name="units" style={{ paddingTop: 14 }}>
              <strong>Шинэ хэмжих нэгж сонгох:</strong>
              <Select
                loading={loading}
                onChange={handleUnitChange}
                placeholder="Хэмжих нэгж сонгох"
              >
                {unitOptions.map((unitOption) => (
                  <Select.Option key={unitOption.Id} value={unitOption.unit}>
                    {unitOption.unit}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <p>
              <strong>Тоо хэмжээ:</strong>
              <Input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={0}
                placeholder="Тоо хэмжээг оруулна уу"
              />
            </p>
            <p>
              <strong>Нэг бүрийн үнэ /шинээр/:</strong>
              <Input
                type="number"
                onChange={handlePriceChange}
                min={0}
                placeholder="Шинэ нэгж үнийг оруулна уу"
              />
            </p>
            <p>
              <strong>Нийт үнэ /шинээр/:</strong>
              <Input disabled value={newNetPrice} />
            </p>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

EditIcon.propTypes = {
  productId: PropTypes.number.isRequired,
};

export default EditIcon;
