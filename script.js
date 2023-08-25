const newCalculator = new Calculator();

const display = document.querySelector("#display");
const equal = document.querySelector("#equal");
const opBtns = document.querySelectorAll("[data-op]");
const btns = document.querySelectorAll(".btn");

btns.forEach((btn) => btn.addEventListener("transitionend", removeTransition));
opBtns.forEach((btn) => btn.addEventListener("click", opClickInput));
equal.addEventListener("click", result);
window.addEventListener("keydown", result);
window.addEventListener("keydown", opKeyInput);

function opClickInput () {
    if(display.value === "") {
        display.value += this.dataset.op;
    } else {
    display.value += ` ${this.dataset.op} `;
    }
}

function opKeyInput(e) {
    const key = document.querySelector(`[data-op="${e.key}"]`);
    if(!key) return;
    if(display.value === "") {
        display.value += key.dataset.op;
    } else {
        display.value += ` ${key.dataset.op} `;
    }
    key.classList.add("btn-temp");
}

function removeTransition(e) {
    if(e.propertyName !== "transform") return;
    this.classList.remove("btn-temp");
}

function result (e) {
    if(e.type === "keydown") {
        const key = document.querySelector(`[data-eq="${e.key}"]`);
        if(!key) return;
        key.classList.add("btn-temp");
    }
    display.value = newCalculator.calc(display.value);
}


function Calculator() {
    this.methods = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => a / b,
        "**": (a, b) => a ** b,
    };

    this.calc = function (string) {
        let op = ["operators"];
        return  string.split(" ")
                .map(item => {
                if (isNaN(+item)) {op.push(item); return item;};
                return item;})
                .filter(item => !isNaN(+item))
                .reduce((curr, item,index) => 
                this.methods[op[index]](+curr, +item));
    };

    this.addMethod = function(name, func) {
        this.methods[name] = func;
    }
}