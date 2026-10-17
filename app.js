// ===============================
// НАСТРОЙКИ
// ===============================

const CORRECT_CODE = "AURA2425";


// ===============================
// ЭЛЕМЕНТЫ
// ===============================

const input = document.getElementById("codeInput");

const boxes = document.querySelectorAll(".code-box");

const enterButton = document.getElementById("enterButton");

const message = document.getElementById("message");

const loginScreen = document.getElementById("loginScreen");

const verifyScreen = document.getElementById("verifyScreen");

const successScreen = document.getElementById("successScreen");

const finalScreen = document.getElementById("finalScreen");

const codeWrapper = document.querySelector(".code-wrapper");


// ===============================
// ФОКУС
// ===============================

document.addEventListener("click", () => {
  input.focus();
});

window.addEventListener("load", () => {
  input.focus();
});


// ===============================
// ВВОД КОДА
// ===============================

input.addEventListener("input", () => {

  let value = input.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 8);

  input.value = value;

  boxes.forEach((box, index) => {

    const char = value[index];

    box.textContent = char || "";

    if (char) {
      box.classList.add("filled");
    } else {
      box.classList.remove("filled");
    }

  });

  message.textContent =
    value.length === 8
      ? "ACCESS CODE READY_"
      : "WAITING FOR ACCESS CODE_";

  message.classList.remove("error");
});


// ===============================
// ENTER
// ===============================

input.addEventListener("keydown", (event) => {

  if (event.key === "Enter") {
    checkCode();
  }

});

enterButton.addEventListener("click", checkCode);


// ===============================
// ПРОВЕРКА
// ===============================

function checkCode() {

  const enteredCode =
    input.value.trim().toUpperCase();

  if (enteredCode === CORRECT_CODE) {

    startAuthorization();

  } else {

    wrongCode();

  }

}


// ===============================
// НЕВЕРНЫЙ КОД
// ===============================

function wrongCode() {

  message.textContent =
    "ACCESS DENIED // INVALID CODE";

  message.classList.add("error");

  codeWrapper.classList.remove("shake");

  void codeWrapper.offsetWidth;

  codeWrapper.classList.add("shake");

}


// ===============================
// ПРАВИЛЬНЫЙ КОД
// ===============================

function startAuthorization() {

  switchScreen(
    loginScreen,
    verifyScreen
  );

  // VERIFYING
  setTimeout(() => {

    switchScreen(
      verifyScreen,
      successScreen
    );

  }, 1200);


  // SUCCESS -> FINAL
  setTimeout(() => {

    switchScreen(
      successScreen,
      finalScreen
    );

  }, 4300);

}


// ===============================
// СМЕНА ЭКРАНА
// ===============================

function switchScreen(from, to) {

  from.classList.remove("active");

  setTimeout(() => {

    to.classList.add("active");

  }, 250);

}


// ===============================
// RESET ДЛЯ ПОВТОРНОЙ СЪЁМКИ
// КЛАВИША R
// ===============================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key.toLowerCase() === "r"
      &&
      document.activeElement !== input
    ) {

      resetTerminal();

    }

  }
);


function resetTerminal() {

  [
    loginScreen,
    verifyScreen,
    successScreen,
    finalScreen
  ]
  .forEach(screen => {
    screen.classList.remove("active");
  });

  input.value = "";

  boxes.forEach(box => {

    box.textContent = "";

    box.classList.remove("filled");

  });

  message.textContent =
    "WAITING FOR ACCESS CODE_";

  message.classList.remove("error");

  loginScreen.classList.add("active");

  input.focus();
}
