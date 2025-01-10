import "../layout/super.css";
import { NavLink, useNavigate } from "react-router-dom";

import { UserOutlined } from "@ant-design/icons";

import { Layout, Menu, theme, Avatar, Space } from "antd";
const { Header } = Layout;

const items = [
  {
    key: "1",
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Норм</span>
      </div>
    ),

    children: [
      {
        key: "11",
        label: <NavLink to="/normList">Нормын жагсаалт</NavLink>,
      },
      {
        key: "12",
        label: <NavLink to="/addNorm">Норм нэмэх</NavLink>,
      },
    ],
  },
  {
    key: "2",
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Төлөвлөлт</span>
      </div>
    ),
    children: [
      {
        key: "21",
        label: <NavLink to="/planList">Төлөвлөлтийн жагсаалт</NavLink>,
      },
      {
        key: "22",
        label: <NavLink to="/planning">Төлөвлөх</NavLink>,
      },
    ],
  },
  {
    key: "3",
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Гүйцэтгэл</span>
      </div>
    ),
    children: [
      {
        key: "31",
        label: "сонголтууд",
      },
    ],
  },
  {
    key: "4",
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Тайлан</span>
      </div>
    ),
    children: [
      {
        key: "41",
        label: "сонголтууд",
      },
    ],
  },
  {
    key: "5",
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Судалгаа</span>
      </div>
    ),
    children: [
      {
        key: "51",
        label: "сонголтууд",
      },
    ],
  },
  {
    key: "6",
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span>Админ</span>
      </div>
    ),
    children: [
      {
        key: "61",
        label: <NavLink to="/register">Хэрэглэгч нэмэх</NavLink>,
      },
    ],
  },
  {
    key: "7",
    label: (
      <Space>
        <Avatar size={40} shape="square" icon={<UserOutlined />} />
      </Space>
    ),
    children: [
      {
        key: "71",
        label: <NavLink to="/login">Гарах</NavLink>,
      },
    ],
  },
];

function AppHeader() {
  const navigate = useNavigate();
  const imageClick = () => {
    navigate("/home");
  };
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header
      width={200}
      style={{
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/Assets/logo4.png"
          alt="Logo"
          style={{ height: 150, cursor: "pointer" }}
          onClick={imageClick}
        />
      </div>
      <Menu
        mode="horizontal"
        className="custom-menu"
        style={{
          fontSize: "16px",
          height: "100%",
          flex: 1,
          minWidth: 0,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        items={items}
      />
    </Header>
  );
}

export default AppHeader;
