import { getCommentsApi, postCommentsApi } from "./api.js";
import { renderComments } from "./renderComment.js";
import { getEvent } from "./events.js";
import { authComponent } from "./autorization.js";

const container = document.querySelector(".container");
let display = "none";
let isAuthorized = false;

// ===== FUNCTIONS =====
const renderApp = () => {
  container.innerHTML = `
  ${
    display === "none"
      ? `<ul class="comments">
  </ul>
  <img class="preloader" src="./image/preloader.gif" alt="preloader">`
      : ""
  }
  ${
    isAuthorized
      ? `
      <div class="add-form">
        <input
          type="text"
          class="add-form-name"
          placeholder="Введите ваше имя"
        />
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
  ${authComponent()}
  `;
};

const getComments = () => {
  preloader.classList.add("--ON");
  if (isAuthorized) {
    addFormBox.classList.remove("--ON");
  } else {
    tipsWrap.classList.remove("--ON");
  }
  getCommentsApi()
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
  if (!inputName.value.trim().length || !inputText.value.trim().length) return;

  preloader.classList.add("--ON");
  addFormBox.classList.remove("--ON");

  postCommentsApi(inputName, inputText)
    .then((data) => {
      if (data.result === "ok") {
        getComments();
        inputName.value = "";
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
  if (inputName.value.trim().length && inputText.value.trim().length) {
    buttonAdd.classList.add("active");
    buttonAdd.classList.remove("inactive");
  } else {
    buttonAdd.classList.add("inactive");
    buttonAdd.classList.remove("active");
  }
};

const getElementAndEvent = () => {
  if (isAuthorized) {
    inputName = document.querySelector(".add-form-name");
    inputText = document.querySelector(".add-form-text");
    buttonAdd = document.querySelector(".add-form-button");
    addFormBox = document.querySelector(".add-form");

    buttonAdd.addEventListener("click", sendComment);
    inputName.addEventListener("keyup", (key) => {
      if (key.code === "Enter") {
        key.preventDefault();
        inputText.focus();
      }
    });
    inputText.addEventListener("keydown", (key) => {
      if (key.code === "Enter") {
        // чтобы не срабатывал enter
        key.preventDefault();
        sendComment();
      }
    });
    inputText.addEventListener("input", switchButton);
    inputName.addEventListener("input", switchButton);

    document.querySelector('.logout').addEventListener("click", () => setAuthorized(false))
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
  renderApp();
  getElementAndEvent();
  getComments();
}

// ====== START =====
renderApp();

// получение статичных элементов и эвентов для них
let addFormBox = null;
let tipsWrap = null;
let inputName = null;
let inputText = null;
let buttonAdd = null;
getElementAndEvent();

const preloader = document.querySelector(".preloader");

// масив комментариев, тут хранятся все комментарии
let arrComments = [];

getComments();

export { arrComments, display, isAuthorized };
