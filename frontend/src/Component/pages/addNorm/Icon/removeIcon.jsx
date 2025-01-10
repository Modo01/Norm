import { useState } from "react";
import { Button, Modal, Space, Tooltip } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import PropTypes from "prop-types";
function RemoveIcon({ product, onRemoveProduct }) {
  // Модалын харагдах төлөв
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Модал нээх функц
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Модалын OK товчлуур дээр дарахад гүйцэтгэх функц
  const handleOk = () => {
    setIsModalVisible(false); // Модал хаах
    onRemoveProduct(product.id); // Эцэг функц руу бүтээгдэхүүний ID-ийг илгээх
  };

  // Модалын Cancel товчлуур дээр дарахад гүйцэтгэх функц
  const handleCancel = () => {
    setIsModalVisible(false); // Модал хаах
  };

  return (
    <>
      {/* Устгах товчлуур */}
      <Space>
        <Tooltip title="Бараа материал хасах">
          <DeleteFilled
            onClick={showModal} // Модал нээх
            style={{ fontSize: "20px", color: "red" }} // Устгах товчийн өнгө болон хэмжээ
          />
        </Tooltip>
      </Space>

      <Modal
        title="Нормын жагсаалтаас хасах гэж байна!"
        open={isModalVisible} // Модалын харагдах төлөв
        onCancel={handleCancel} // Хаах функц
        footer={[
          <Button key="confirm" type="primary" onClick={handleOk}>
            Тийм, устгах
          </Button>,
          <Button key="cancel" type="primary" danger onClick={handleCancel}>
            Үгүй
          </Button>,
        ]}
      >
        {/* Бараа материалын дэлгэрэнгүй мэдээлэл */}
        {product && (
          <p>
            {`${product.code} кодтой бараа материалын бүртгэлийг устгах гэж байна.`}
            Хэрэв та итгэлтэй байгаа бол `Тийм, устгах` товчлуурыг дарна уу!
          </p>
        )}
      </Modal>
    </>
  );
}

RemoveIcon.propTypes = {
  product: PropTypes.shape({
    code: PropTypes.string.isRequired, // Бүтээгдэхүүний код
    k1: PropTypes.string.isRequired, // Хамааралтай өгөгдөл (жишээ нь k1)
    k3: PropTypes.string.isRequired, // Жишээ өгөгдөл
    k4: PropTypes.string.isRequired, // Барааны нэр
    k6: PropTypes.string.isRequired, // Марк
    picNum: PropTypes.string.isRequired, // Зургийн дугаар
    unit: PropTypes.string.isRequired, // Хэмжих нэгж
    id: PropTypes.number.isRequired, // Бүтээгдэхүүний ID
  }).isRequired, // Бүтээгдэхүүний объект заавал байх шаардлагатай

  onRemoveProduct: PropTypes.func.isRequired, // onRemoveProduct функц заавал байх шаардлагатай
};

export default RemoveIcon;
