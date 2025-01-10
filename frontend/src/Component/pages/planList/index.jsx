import PrintIcon from "./icon/printIcon";
import PlanTable from "./planTable";

const Index = () => {
  return (
    <div
      style={{
        color: "rgb(25,25,132)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        <h1>Төлөвлөх</h1>
        <PrintIcon />
      </div>

      <PlanTable />
      <div
        style={{
          width: "500px",
          marginLeft: "5vh",
        }}
      >
        {/* <p>
          Жич: Тухайн нормыг үүсгэсэн ХЭРЭГЛЭГЧ засварлах, устгах эрхтэй байна.
          Хэвлэх эрх тухайн эормыг үүсгэсэн, баталаажуулсан ХЭРЭГЛЭГЧ нарт
          байна. Баталгаажуулах эрхийг тусад нь олгоно.
        </p> */}
      </div>
    </div>
  );
};

export default Index;
