// import { data } from "./emoji.js";

const API_URL = "http://api.codeoverdose.space/api/emoji/v1";
let abortController = null;

const getData = async (url, query = "") => {
  try {
    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();
    const res = await fetch(url + query, {
      signal: abortController.signal,
    });
    console.log(res);
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

const data = await getData(API_URL);

const container = document.querySelector(".emoji-wrapper");
const input = document.querySelector(".search-input");

function renderEmojiCard({ title, symbol, keywords }) {
  const emojiCard = document.createElement("div");
  emojiCard.classList.add("emoji-card");

  emojiCard.innerHTML = `
    <p class="emoji-symbol">${symbol}</p>
    <p class="emoji-title">${title}</p>
    <p class="emoji-keywords">${getUniqueString(keywords)}</p>
  `;

  return emojiCard;
}

function getUniqueString(keywords) {
  return Array.from(new Set(keywords.split(" "))).join(" ");
}

function filterEmojiCards(event) {
  const inputValue = event.target.value;

  getData(API_URL, `/find/?query=${inputValue.toLowerCase()}`)
    .then((data) => {
      renderEmojiCardAll(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

input.addEventListener("input", filterEmojiCards);

function renderEmojiCardAll(data) {
  container.innerHTML = "";
  data.forEach((emoji) => {
    const emojiCard = renderEmojiCard(emoji);
    container.append(emojiCard);
  });
}

renderEmojiCardAll(data);
