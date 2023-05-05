import { getCommentsApi, postCommentsApi } from "./api.js";
import { renderComments } from "./renderComment.js";
import { getEvent } from "./events.js";
import { authComponent, registerApi, loginApi } from "./autorization.js";

const container = document.querySelector(".container");
const login = !localStorage.getItem("login")
  ? {
      login: "",
      password: "",
      token: "",
      name: "",
    }
  : JSON.parse(localStorage.getItem("login"));

let display = "none";

let isAuthorized = Boolean(localStorage.getItem("isAuthorized") === "true");

// ===== FUNCTIONS =====
const renderApp = () => {
  container.innerHTML = `
  <img class="preloader" src="./image/preloader.gif" alt="preloader">
  ${display === "none" ? `<ul class="comments"></ul>` : ""}
  ${
    isAuthorized
      ? `
      <div class="add-form">
        <div class="add-form-name">${login.name}</div>
        <textarea
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш комментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button class="add-form-button inactive">Написать</button>
        </div>
      </div>
    `
      : `  
      <div class="tips-wrap">
        <div>Чтобы добавить комментарий,</div>
        <buttun class="tips-auth">авторизуйтесь</button>
      </div>
    `
  }
  ${authComponent(login)}
  `;
};

const getComments = () => {
  preloader.classList.add("--ON");
  if (isAuthorized) {
    addFormBox.classList.remove("--ON");
  } else {
    tipsWrap.classList.remove("--ON");
  }
  getCommentsApi(login)
    .then((data) => {
      arrComments = [...data.comments];
      renderComments();
      isAuthorized && getEvent();
      preloader.classList.remove("--ON");
      if (isAuthorized) {
        addFormBox.classList.add("--ON");
      } else {
        tipsWrap.classList.add("--ON");
      }
    })
    .catch(() => {
      alert("Упс, кажется что-то пошло не так...");
      // тут должен быть код для записи ошибки в логи
    });
};

const sendComment = () => {
  // проверка на пустые поля
  if (!inputText.value.trim().length) return;

  preloader.classList.add("--ON");
  addFormBox.classList.remove("--ON");

  postCommentsApi(login.name, inputText.value)
    .then((data) => {
      if (data.result === "ok") {
        getComments();
        inputText.value = "";
        switchButton();
      }
    })
    .catch((error) => {
      if (error.message !== "500") {
        if (error.message !== "400") {
          alert("Упс, кажется что-то пошло не так...");
        }
        // тут должен быть код для записи ошибки в логи
        preloader.classList.remove("--ON");
        addFormBox.classList.add("--ON");
      } else {
        sendComment();
      }
    });
};

const switchButton = () => {
  if (inputText.value.trim().length) {
    buttonAdd.classList.add("active");
    buttonAdd.classList.remove("inactive");
  } else {
    buttonAdd.classList.add("inactive");
    buttonAdd.classList.remove("active");
  }
};

const switchButtonAuth = () => {
  const authLogin = document.querySelector(".auth-login");
  const authPass = document.querySelector(".auth-pass");
  const btnAuth = document.querySelector(".auth-login-btn");

  if (authLogin.value.length && authPass.value.length) {
    btnAuth.classList.add("active");
    btnAuth.classList.remove("inactive");
  } else {
    btnAuth.classList.add("inactive");
    btnAuth.classList.remove("active");
  }
};

const applicationLogin = () => {
  login.login = document.querySelector(".auth-login").value;
  login.password = document.querySelector(".auth-pass").value;
  loginApi(login)
    .then((data) => {
      login.name = data.user.name;
      login.token = data.user.token;
      setDisplay("none");
      setAuthorized(true);
      localStorage.setItem("login", JSON.stringify(login));
    })
    .catch((error) => {
      if (error.message === "400") {
        console.log('неправильный логин или пароль');
        // TODO: сообщить пользователю что он ввел неправильный логин или пароль
      } else {
        alert("Упс, кажется что-то пошло не так...");
      }
    });
};

const applicationRegister = () => {
  login.name = document.querySelector('.auth-name').value;
  login.login = document.querySelector(".auth-login").value;
  login.password = document.querySelector(".auth-pass").value;
  registerApi(login).then(data => {
    login.login = data.user.login;
    login.password = data.user.password;
    login.name = data.user.name;
    login.token = data.user.token;
    setDisplay("none");
    setAuthorized(true);
    localStorage.setItem("login", JSON.stringify(login));
  }).catch((error) => {
    if (error.message === '400') {
      console.log('такой пользователь уже есть в базе');
       // TODO: сообщить пользователю что такой ник уже есть в базе
    } else {
      alert("Упс, кажется что-то пошло не так...");
    }
  })
}

const logout = () => {
  login.login = "";
  login.password = "";
  login.token = "";
  login.name = "";
  localStorage.setItem("login", JSON.stringify(login));
  setAuthorized(false);
};

const getElementAndEvent = () => {
  if (isAuthorized) {
    inputText = document.querySelector(".add-form-text");
    buttonAdd = document.querySelector(".add-form-button");
    addFormBox = document.querySelector(".add-form");

    buttonAdd.addEventListener("click", sendComment);
    inputText.addEventListener("keydown", (key) => {
      if (key.code === "Enter") {
        // чтобы не срабатывал enter
        key.preventDefault();
        sendComment();
      }
    });
    inputText.addEventListener("input", switchButton);

    document.querySelector(".logout").addEventListener("click", () => {
      logout();
    });
  } else {
    tipsWrap = document.querySelector(".tips-wrap");

    document
      .querySelector(".auth-btn-login")
      .addEventListener("click", () => setDisplay("login"));
    document
      .querySelector(".auth-btn-register")
      .addEventListener("click", () => setDisplay("registration"));
    document
      .querySelector(".tips-auth")
      .addEventListener("click", () => setDisplay("login"));

    if (display !== "none") {
      document
        .querySelector(".auth-switch")
        .addEventListener("click", () =>
          setDisplay(`${display === "login" ? "registration" : "login"}`)
        );
      const authLogin = document.querySelector(".auth-login");
      const authPass = document.querySelector(".auth-pass");
      const authLoginBtn = document.querySelector(".auth-login-btn");
      authLogin.addEventListener("keydown", (key) => {
        if (key.code === "Enter") {
          key.preventDefault();
          authPass.focus();
        }
      });
      if (display === "login") {
        authLoginBtn.addEventListener("click", () => {
          applicationLogin();
        });

        authPass.addEventListener("keydown", (key) => {
          if (key.code === "Enter") {
            key.preventDefault();
            applicationLogin();
          }
        });

        // Смена цвета кнопки входа
        authLogin.addEventListener("input", switchButtonAuth);
        authPass.addEventListener("input", switchButtonAuth);
      }
      if (display === "registration") {
        const authName = document.querySelector(".auth-name");
        authName.addEventListener("keydown", (key) => {
          if (key.code === "Enter") {
            key.preventDefault();
            authLogin.focus();
          }
        });
        authLoginBtn.addEventListener("click", () => {
          applicationRegister();
        });

        authPass.addEventListener("keydown", (key) => {
          if (key.code === "Enter") {
            key.preventDefault();
            applicationRegister();
          }
        });
      }
    }
  }
};

const setDisplay = (status) => {
  display = status;
  renderApp();
  getElementAndEvent();
};

const setAuthorized = (status) => {
  isAuthorized = status;
  localStorage.setItem("isAuthorized", status.toString());
  renderApp();
  getElementAndEvent();
  getComments();
};

// ====== START =====
renderApp();
const preloader = document.querySelector(".preloader");

// получение статичных элементов и эвентов для них
let addFormBox = null;
let tipsWrap = null;
let inputText = null;
let buttonAdd = null;
getElementAndEvent();

// масив комментариев, тут хранятся все комментарии
let arrComments = [];

getComments();

export { arrComments, display, isAuthorized };
