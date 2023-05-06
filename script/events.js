import { arrComments } from "./script.js";
import { renderComments } from "./renderComment.js";
import { postLikeApi } from "./api.js";

const delay = (interval = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

const eventLike = (comments, token) => {
  comments.forEach((comment) => {
    const button = comment.querySelector(".like-button");
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      arrComments.forEach((itemComment) => {
        if (itemComment.id == comment.dataset.id) {
          button.classList.add("-loading-like");
          postLikeApi(itemComment.id, token)
            .then((data) => {
              delay(2000).then(() => {
                itemComment.likes = data.result.likes;
                itemComment.isLiked = data.result.isLiked;
                renderComments();
                getEvent();
              });
            })
            .catch(() => {
              alert("Упс, кажется что-то пошло не так...");
            });
        }
      });
    });
  });
};

const eventReply = (comments, inputText) => {
  comments.forEach((comment) => {
    comment.addEventListener("click", () => {
      arrComments.forEach((itemComment) => {
        if (itemComment.id == comment.dataset.id) {
          let str = itemComment.text;

          // в случае если у нас будет реплай на реплай, мы оставим только ответ
          // цикл на случай, если будет несколько реплаев
          while (str.indexOf("<div class='quote'>") !== -1) {
            const substr = str.substring(
              0,
              str.indexOf("</div>") + "</div>".length
            );
            str = str.replace(substr, "");
          }
          inputText.value += `[BEGIN_QUOTE]${str} - ${itemComment.author.name}[END_QUOTE]\n\n`;

          // переносим пользователя в поле ввода текста
          inputText.focus();
        }
      });
    });
  });
};

// Нет API для редактирования коммента, отключил
/*
const eventEdit = () => {
  document.querySelectorAll(".edit-button").forEach((button, key) => {
    button.addEventListener("click", (event) => {
      // отменяем всплытие
      event.stopPropagation();

      const objComment = arrComments[button.dataset.index];
      if (objComment.isEdit) {
        if (objComment.text.trim() === "") return; // в случае, если человек сотрет полностью комментарий кнопка сохранить станет неактивна;
        button.innerHTML = "Редактировать";
        objComment.isEdit = false;
      } else {
        button.innerHTML = "Сохранить";
        objComment.isEdit = true;
      }
      renderComments();
      getEvent();
    });
  });
};

const eventEditInput = () => {
  document.querySelectorAll(".input-text").forEach((input) => {
    input.addEventListener("keyup", (key) => {
      const objComment = arrComments[input.dataset.index];
      objComment.text = input.value;
    });
    input.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  });
};
*/

export function getEvent() {
  const comments = document.querySelectorAll(".comment");
  const inputText = document.querySelector(".add-form-text");
  const login = !localStorage.getItem("login")
    ? {
        login: "",
        password: "",
        token: "",
        name: "",
      }
    : JSON.parse(localStorage.getItem("login"));

  eventLike(comments, login.token);
  eventReply(comments, inputText);
}
