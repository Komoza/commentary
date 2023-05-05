import { display, isAuthorized } from "./script.js";

const login = {
  login: "maxim",
  password: "",
  token: "bgc0b8awbwas6g5g5k5o5s5w606g37w3cc3bo3b83k39s3co3c83c03ck",
};

const authComponent = () => {
  return `
    ${`
    <div class="auth-btn-wrap">
    ${
      isAuthorized
        ? `
            <div>Вы вошли как ${login.login},</div> 
            <button class="logout">выйти</button>
        `
        : `   
            <button class="auth-btn auth-btn-login">Вход</button>
            <button class="auth-btn auth-btn-register">Регистрация</button>
        `
    }
    </div> 
    `}
 
    ${
      display !== "none"
        ? `
    <div class="authorization">
        <div class="auth-wrap">
            <p class="auth-status"> ${
              display == "login" ? "Вход" : "Регистрация"
            }</p>
            ${
              display == "registration"
                ? '<input class="auth-name" type="text" placeholder="Введите имя">'
                : ""
            }
            <input class="auth-login" type="text" placeholder="Введите логин">
            <input class="auth-pass" type="password" placeholder="Введите пароль">
            <button class="auth-login-btn inactive">${
              display == "login" ? "Войти" : "Зарегистрироваться"
            }</button>
            <button class="auth-switch">${
              display == "login" ? "Еще нет аккаунта?" : "Уже есть аккаунт?"
            }</button>
        </div>
    </div>
    `
        : ""
    }

    `;
};

// document.querySelector('.auth-btn-login').addEventListener("click", () => display = 'login');

export {login, authComponent };
