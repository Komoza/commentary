import { getCommentsApi, postCommentsApi } from "./api.js";
import { renderComments } from "./renderComment.js";
import { getEvent } from "./events.js";

const container = document.querySelector(".container");

// ===== FUNCTIONS =====
const renderApp = () => {
  container.innerHTML = ` 
  <ul class="comments">
  </ul>
  <img class="preloader" src="./image/preloader.gif" alt="preloader">
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
  </div>`;
};

const getComments = () => {
  preloader.classList.add("--ON");
  addFormBox.classList.remove("--ON");
  getCommentsApi()
    .then((data) => {
      arrComments = [...data.comments];
      renderComments();
      getEvent();
      preloader.classList.remove("--ON");
      addFormBox.classList.add("--ON");
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
}

const switchButton = () => {
  if (inputName.value.trim().length && inputText.value.trim().length) {
    buttonAdd.classList.add("active");
    buttonAdd.classList.remove("inactive");
  } else {
    buttonAdd.classList.add("inactive");
    buttonAdd.classList.remove("active");
  }
}


// ====== START =====
renderApp();

// получение статичных элементов и эвентов для них
const inputName = document.querySelector(".add-form-name");
const inputText = document.querySelector(".add-form-text");
const buttonAdd = document.querySelector(".add-form-button");
const addFormBox = document.querySelector(".add-form");
const preloader = document.querySelector(".preloader");

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

// масив комментариев, тут хранятся все комментарии
let arrComments = [];

getComments();



export {arrComments };
