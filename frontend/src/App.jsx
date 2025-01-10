import NormRoutes from "./routes";
import { ProductProvider } from "./Provider/productContext";

function App() {
  return (
    <ProductProvider>
      <NormRoutes />
    </ProductProvider>
  );
}

export default App;
