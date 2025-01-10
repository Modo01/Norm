import { Outlet } from "react-router-dom";
import { Card } from "antd";
function Content() {
  return (
    <div
      style={{
        width: "90%",
        height: "calc(100vh - [headerHeight])",
        overflow: "auto",
        marginLeft: "5%",
      }}
    >
      <Card
        bordered={false}
        style={{
          body: { padding: "20px" },
          height: "100%",
          width: "100%",
        }}
      >
        <Outlet />
      </Card>
    </div>
  );
}

export default Content;
