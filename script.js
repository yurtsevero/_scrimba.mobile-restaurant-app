"use strict";
import { menuArray } from "./data.js";
import { basket } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const menu = document.getElementById("item-container");
const order = document.getElementById("order");
const orderDetail = document.getElementById("order-container");
const totalPriceText = document.getElementById("total-price");
const form = document.getElementById("form-pay");
const successMessage = document.getElementById("success-message");

document.addEventListener("click", (e) => {
  if (e.target.dataset.addName) {
    addToBasket(e.target.dataset.addName);
  } else if (e.target.dataset.uuid) {
    removeFromBasket(e.target.dataset.uuid);
  } else if (e.target.dataset.complete) {
    completeOrder();
  } else if (!e.target.closest(".modal-container")) {
    showHideModal("hide", "modal-pay");
  }
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formdata = new FormData(form);
  pay(formdata.get("name"));
});

function pay(name) {
  showHideModal("hide", "modal-pay");
  showHideModal("hide", "order");
  successMessage.innerHTML = `Thanks ${name}! Your order is on its way!`;
  showHideModal("show", "success");
  setTimeout(() => {
    showHideModal("hide", "success");
  }, 3000);
  basket.length = 0;
}
function showHideModal(action, elementId) {
  if (action === "show")
    document.getElementById(`${elementId}`).classList.remove("hidden");
  if (action === "hide")
    document.getElementById(`${elementId}`).classList.add("hidden");
}
function calculateTotalPrice() {
  let totalPrice = 0;
  basket.forEach((item) => (totalPrice += item.price));
  return totalPrice;
}
function completeOrder() {
  showHideModal("show", "modal-pay");
}
function removeFromBasket(uuid) {
  let deleteIndex;
  basket.forEach((item, idx) => {
    if (item.id === uuid) {
      deleteIndex = idx;
    }
  });
  basket.splice(deleteIndex, 1);
  if (basket.length === 0) showHideModal("hide", "order");
  render();
}
function addToBasket(name) {
  order.classList.remove("hidden");
  const item = menuArray.filter((item) => {
    return item.name === name;
  })[0];
  item.id = uuidv4();
  basket.push(item);
  render();
}
function render() {
  let itemsHTML = "";
  menuArray.forEach((item) => {
    itemsHTML += `<section class="item">
        <div class="item__icon">${item.emoji}</div>
        <div class="item__detail">
          <div class="item__detail__name">${item.name}</div>
          <div class="item__detail__ingredients">
          ${item.ingredients.join(",")}
          </div>
          <div class="item__detail__price" id="item-price">$${item.price}</div>
        </div>
        <div 
        class="item__add" ><i class="fa-solid fa-plus" data-add-name="${
          item.name
        }"></i></div>
        </section>
        <hr />`;
  });
  menu.innerHTML = itemsHTML;

  let basketHTML = "";
  basket.forEach((item) => {
    basketHTML += ` <div class="order__detail" id="order-detail">
    <div class="order__detail__item">${item.name}</div>
    <button class="order__detail__btn-remove" id="btn-remove" data-uuid="${item.id}">remove</button>
    <div class="order__detail__price">$${item.price}</div>
    </div>`;
  });
  orderDetail.innerHTML = basketHTML;
  totalPriceText.innerText = `$${calculateTotalPrice()}`;
}

render();
