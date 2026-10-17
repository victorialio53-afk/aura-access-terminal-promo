/* =========================================================
   AURA ACCESS TERMINAL
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const CORRECT_CODE = "AURA2425";

const VERIFY_DURATION = 1450;

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
  document.querySelector(".code-wrapper");

const loadingFill =
  document.querySelector(".loading-fill");


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


/* =========================================================
   INITIAL FOCUS
========================================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {
        input.focus();
      },
      100
    );

  }
);


/* =========================================================
   CLICK ANYWHERE = INPUT FOCUS
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
   CODE INPUT
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


    updateCodeBoxes(value);


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
   DISPLAY CHARACTERS
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
   BUTTON
========================================================= */

enterButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    checkCode();

  }
);


/* =========================================================
   CHECK ACCESS CODE
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
    400
  );

}


/* =========================================================
   AUTHORIZATION SEQUENCE
========================================================= */

function startAuthorization() {

  terminalLocked = true;


  message.classList.remove(
    "error"
  );


  message.textContent =
    "AUTHENTICATION STARTED_";


  switchScreen(
    loginScreen,
    verifyScreen
  );


  restartLoadingAnimation();


  verifyTimer =
    setTimeout(
      () => {

        switchScreen(
          verifyScreen,
          successScreen
        );

      },
      VERIFY_DURATION
    );


  finalTimer =
    setTimeout(
      () => {

        switchScreen(
          successScreen,
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

function switchScreen(
  from,
  to
) {

  if (from) {

    from.classList.remove(
      "active"
    );

  }


  setTimeout(
    () => {

      allScreens.forEach(
        screen => {

          screen.classList.remove(
            "active"
          );

        }
      );


      to.classList.add(
        "active"
      );

    },
    220
  );

}


/* =========================================================
   RESTART VERIFYING BAR
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
   RESET TERMINAL
========================================================= */

function resetTerminal() {

  clearTimeout(
    verifyTimer
  );

  clearTimeout(
    finalTimer
  );


  terminalLocked = false;


  input.value = "";


  updateCodeBoxes("");


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
   HOTKEYS
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    /*
    RESET:
    Ctrl + R браузер обычно
    перезагружает страницу,
    поэтому используем просто R,
    когда курсор не стоит в поле ввода.
    */

    if (
      event.key.toLowerCase() === "r"
      &&
      terminalLocked
    ) {

      event.preventDefault();

      resetTerminal();

    }


    /*
    ESC тоже сбрасывает сайт.
    Очень удобно на съёмке.
    */

    if (
      event.key === "Escape"
    ) {

      event.preventDefault();

      resetTerminal();

    }

  }
);


/* =========================================================
   OPTIONAL:
   DOUBLE CLICK FINAL = RESET
========================================================= */

finalScreen.addEventListener(
  "dblclick",
  () => {

    resetTerminal();

  }
);
