import { login } from "./autorization.js";

const url = "https://webdev-hw-api.vercel.app/api/v2/Maxim_Komoza";

const getCommentsApi = () => {
  return fetch(url + '/comments', {
    method: "GET",
    Authorization: login.token,
  }).then((response) => response.json());
};

const postCommentsApi = (inputName, inputText) => {
  return fetch(url + '/comments', {
    method: "POST",
    body: JSON.stringify({
      name: inputName.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
      text: inputText.value
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("[BEGIN_QUOTE]", "<div class='quote'>")
        .replaceAll("[END_QUOTE]", "</div>"),
      forceError: true,
    }),
  }).then((response) => {
    if (response.status === 201) {
      return response.json();
    } else if (response.status === 400) {
      response.json().then((data) => {
        const alertText = data.error
          .replace("name", "Имя")
          .replace("text", "Комментарий");
        alert(alertText);
      });
      throw Error("400");

      // тут должен быть код для записи ошибки в логи
    } else if (response.status === 500) {
      throw Error("500");
    } else {
      throw Error();
    }
  });
};

export { getCommentsApi, postCommentsApi };
