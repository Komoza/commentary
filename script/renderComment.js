import { arrComments } from "./script.js";

const getFormatDate = date => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const renderComment = (comment, index) => {
  return ` 
          <li class="comment" data-index="${index}">
              <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${getFormatDate(new Date(comment.date))}</div>
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
  const comments = document.querySelector('.comments');
  comments.innerHTML = "";

  arrComments.forEach((comment, index) => {
    comments.innerHTML += renderComment(comment, index);
  });
};


