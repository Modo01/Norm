import { useState, useRef } from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { Button, Modal, Space, Table } from "antd";
import { PrinterFilled } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";

const PrintIcon = ({ tableData, columns }) => {
  const [open, setOpen] = useState(false);
  const printRef = useRef();

  const showModal = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => {
      console.log("Printed successfully");
    },
  });

  return (
    <>
      <Space>
        <PrinterFilled
          onClick={showModal}
          style={{ fontSize: "20px", color: "#1e96fc" }}
        />
      </Space>
      <Modal
        title={<div style={{ textAlign: "center" }}>Принтлэх</div>}
        open={open}
        onCancel={handleCancel}
        footer={[
          <Button type="primary" onClick={handlePrint} key="print">
            Тийм, принтлэх
          </Button>,
          <Button type="primary" danger onClick={handleCancel} key="cancel">
            Үгүй
          </Button>,
        ]}
      >
        <div ref={printRef} style={{ padding: "16px" }}>
          <h3 style={{ textAlign: "center", marginBottom: "16px" }}>
            Нормын дэлгэрэнгүй
          </h3>
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={false}
            bordered
          />
        </div>
      </Modal>
    </>
  );
};

PrintIcon.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PrintIcon;
