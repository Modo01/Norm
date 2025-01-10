import "./Login.css";
import email_icon from "/public/Assets/email.png";
import password_icon from "/public/Assets/password.png";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container">
      <div className="header">
        <div className="text">Нэвтрэх</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={email_icon} alt="" />
          <input type="email" placeholder="Цахим шуудан" />
        </div>
        <div className="input">
          <img src={password_icon} alt="" />
          <input type="password" placeholder="Нууц үг" />
        </div>
      </div>
      <div className="submit-container">
        <Link to="/home">
          <button>Нэвтрэх</button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
