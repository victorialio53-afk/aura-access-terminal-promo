/* =========================================================
   AURA ACCESS TERMINAL
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const CORRECT_CODE = "AURA2425";

const VERIFY_DURATION = 1600;

const SUCCESS_DURATION = 3300;


/* =========================================================
   ELEMENTS
========================================================= */

const input =
  document.getElementById("codeInput");

const boxes =
  document.querySelectorAll(".code-box");

const enterButton =
  document.getElementById("enterButton");

const message =
  document.getElementById("message");

const codeWrapper =
  document.getElementById("codeWrapper");

const loadingFill =
  document.getElementById("loadingFill");


const loginScreen =
  document.getElementById("loginScreen");

const verifyScreen =
  document.getElementById("verifyScreen");

const successScreen =
  document.getElementById("successScreen");

const finalScreen =
  document.getElementById("finalScreen");


const allScreens = [
  loginScreen,
  verifyScreen,
  successScreen,
  finalScreen
];


/* =========================================================
   STATE
========================================================= */

let terminalLocked = false;

let verifyTimer = null;

let finalTimer = null;

let switchTimer = null;


/* =========================================================
   INITIAL STATE
========================================================= */

window.addEventListener(
  "load",
  () => {

    resetTerminal();

  }
);


/* =========================================================
   KEEP INPUT FOCUSED
========================================================= */

document.addEventListener(
  "click",
  () => {

    if (!terminalLocked) {

      input.focus();

    }

  }
);


/* =========================================================
   INPUT
========================================================= */

input.addEventListener(
  "input",
  () => {

    if (terminalLocked) {
      return;
    }


    let value =
      input.value
        .toUpperCase()
        .replace(
          /[^A-Z0-9]/g,
          ""
        )
        .slice(
          0,
          CORRECT_CODE.length
        );


    input.value = value;


    updateCodeBoxes(
      value
    );


    message.classList.remove(
      "error"
    );


    if (
      value.length ===
      CORRECT_CODE.length
    ) {

      message.textContent =
        "ACCESS CODE READY_";

    } else {

      message.textContent =
        "WAITING FOR ACCESS CODE_";

    }

  }
);


/* =========================================================
   CODE BOXES
========================================================= */

function updateCodeBoxes(value) {

  boxes.forEach(
    (box, index) => {

      const char =
        value[index];


      if (char) {

        box.textContent =
          char;

        box.classList.add(
          "filled"
        );

      } else {

        box.textContent =
          "";

        box.classList.remove(
          "filled"
        );

      }

    }
  );

}


/* =========================================================
   ENTER KEY
========================================================= */

input.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      event.preventDefault();

      checkCode();

    }

  }
);


/* =========================================================
   ENTER BUTTON
========================================================= */

enterButton.addEventListener(
  "click",
  event => {

    event.preventDefault();

    event.stopPropagation();

    checkCode();

  }
);


/* =========================================================
   CHECK CODE
========================================================= */

function checkCode() {

  if (terminalLocked) {
    return;
  }


  const enteredCode =
    input.value
      .trim()
      .toUpperCase();


  if (
    enteredCode ===
    CORRECT_CODE
  ) {

    startAuthorization();

  } else {

    wrongCode();

  }

}


/* =========================================================
   WRONG CODE
========================================================= */

function wrongCode() {

  message.textContent =
    "ACCESS DENIED // INVALID CODE";

  message.classList.add(
    "error"
  );


  codeWrapper.classList.remove(
    "shake"
  );


  void codeWrapper.offsetWidth;


  codeWrapper.classList.add(
    "shake"
  );


  setTimeout(
    () => {

      codeWrapper.classList.remove(
        "shake"
      );

    },
    420
  );

}


/* =========================================================
   START AUTHORIZATION
========================================================= */

function startAuthorization() {

  terminalLocked = true;


  message.textContent =
    "AUTHENTICATION STARTED_";


  showScreen(
    verifyScreen
  );


  restartLoadingAnimation();


  verifyTimer =
    setTimeout(
      () => {

        showScreen(
          successScreen
        );

      },
      VERIFY_DURATION
    );


  finalTimer =
    setTimeout(
      () => {

        showScreen(
          finalScreen
        );

      },
      VERIFY_DURATION
      +
      SUCCESS_DURATION
    );

}


/* =========================================================
   SCREEN SWITCH
========================================================= */

function showScreen(
  targetScreen
) {

  clearTimeout(
    switchTimer
  );


  allScreens.forEach(
    screen => {

      screen.classList.remove(
        "active"
      );

    }
  );


  switchTimer =
    setTimeout(
      () => {

        targetScreen.classList.add(
          "active"
        );

      },
      180
    );

}


/* =========================================================
   LOADING ANIMATION
========================================================= */

function restartLoadingAnimation() {

  loadingFill.classList.remove(
    "loading-active"
  );


  void loadingFill.offsetWidth;


  loadingFill.classList.add(
    "loading-active"
  );

}


/* =========================================================
   RESET
========================================================= */

function resetTerminal() {

  clearTimeout(
    verifyTimer
  );

  clearTimeout(
    finalTimer
  );

  clearTimeout(
    switchTimer
  );


  terminalLocked = false;


  input.value = "";


  updateCodeBoxes(
    ""
  );


  message.textContent =
    "WAITING FOR ACCESS CODE_";

  message.classList.remove(
    "error"
  );


  codeWrapper.classList.remove(
    "shake"
  );


  loadingFill.classList.remove(
    "loading-active"
  );


  allScreens.forEach(
    screen => {

      screen.classList.remove(
        "active"
      );

    }
  );


  loginScreen.classList.add(
    "active"
  );


  setTimeout(
    () => {

      input.focus();

    },
    100
  );

}


/* =========================================================
   RESET HOTKEYS
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
      ESC всегда возвращает терминал
      в начало.
    */

    if (
      event.key === "Escape"
    ) {

      event.preventDefault();

      resetTerminal();

      return;

    }


    /*
      После завершения последовательности
      клавиша R тоже делает RESET.
    */

    if (
      event.key.toLowerCase() === "r"
      &&
      terminalLocked
    ) {

      event.preventDefault();

      resetTerminal();

    }

  }
);


/* =========================================================
   DOUBLE CLICK FINAL SCREEN
========================================================= */

finalScreen.addEventListener(
  "dblclick",
  () => {

    resetTerminal();

  }
);
