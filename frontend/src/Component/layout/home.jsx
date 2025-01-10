import "../layout/super.css";
import NormHeader from "./header";
import NormContent from "./content";
import { Layout, theme } from "antd";

const home = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
    >
      <NormHeader />
      <Layout>
        <style>height</style>

        <Layout
          style={{
            padding: "0 24px 24px",
            background: colorBgContainer,
          }}
        >
          <NormContent />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default home;
