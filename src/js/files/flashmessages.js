export function showflashMessages() {
  if (!document.getElementById("flash")) return;
  const msgContainer = document.getElementById("flash");

  if (!msgContainer.querySelectorAll(".flash-messages__item")) return;
  const msges = msgContainer.querySelectorAll(".flash-messages__item");

  if (msges.length > 0) {
    for (let i = 0; i < msges.length; i++) {
        setTimeout(
          (function (j) {
              return function () {
                flashFadein(msges[j]);
                setTimeout(
                      (function (k) {
                          return function () {
                            flashFadeout(msges[k]);
                            removeMessege(msges[k]);
                          }
                    })(j),
                    10000 + 1000 * (j + 1)
                );
              };
          })(i),
          1000 * (i + 1)
        );
    }
  }
}

export function createFlashMessage(type, msg) {
  if (!document.getElementById("flash")) return;

  const msgContainer = document.getElementById("flash");
  const msgItem = document.createElement('div');
  msgItem.classList.add("flash-messages__item");

  let p = document.createElement('p');
  p.classList = "flash-messages__text";
  p.textContent = msg;
  msgItem.append(p);

  let btn = document.createElement("button");
  btn.classList = "flash-messages__close _icon-close";
  msgItem.append(btn);

  if (type === 'error') {
    msgItem.classList.add("error");
  }
  else if (type === 'success') {
    msgItem.classList.add("success");
  }
  else if (type === 'warning') {
    msgItem.classList.add("warning");
  }
  else if (type === 'info') {
    msgItem.classList.add("info");
  }

  msgContainer.prepend(msgItem);

  setTimeout(flashFadein.bind(this, msgItem), 100);
  setTimeout(function () {
    flashFadeout(msgItem);
    removeMessege(msgItem);
  }, 10000);
}

function flashFadein(el) {
  el.classList.add("fadein");
}

function flashFadeout(el) {
  el.classList.remove("fadein");
  el.classList.add("fadeout");
  el.style.display = "none";
}

function removeMessege(el) {
  el.parentNode.removeChild(el);
}

document.addEventListener("click", function (e) {
  if (e.target.closest('.flash-messages__close')) {
    flashFadeout(e.target.parentNode);
  }
});
