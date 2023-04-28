import { getDate, arrComments } from "./script.js";

const comments = document.querySelector(".comments");

const renderComment = (comment, index) => {
  console.log(comment);
  comments.innerHTML += ` 
          <li class="comment" data-index="${index}">
              <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${getDate(new Date(comment.date))}</div>
              </div>
              <div class="comment-body">
                  ${
                    comment.isEdit
                      ? `<textArea data-index="${index}" class="input-text">${comment.text}</textArea>`
                      : `<div class="comment-text">${comment.text}</div>`
                  }
                  <button data-index="${index}" class="edit-button">${
    comment.isEdit ? "Сохранить" : "Редактировать"
  }</button>
              </div>
              <div class="comment-footer">
              <div class="likes">
                  <span class="likes-counter">${comment.likes}</span>
                  <button data-index="${index}" class="like-button ${
    comment.isLiked ? "-active-like" : ""
  }"></button>
              </div>
              </div>
          </li>
      `;
};

export const renderComments = () => {
  // перед рендером удаляем все комменты которые были, чтобы они не дублировались
  comments.innerHTML = "";

  arrComments.forEach((comment, index) =>
    // id не передаю - он поломанный
    renderComment(comment, index)
  );
};
