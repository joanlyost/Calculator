const newCalculator = new Calculator();

const display = document.querySelector("#display");
const equal = document.querySelector("#equal");
const opBtns = document.querySelectorAll("[data-op]");
const btns = document.querySelectorAll("[data-btn]");
const numBtns = document.querySelectorAll("[data-num]");
const fnBtns = document.querySelectorAll("[data-fn]");
const numSign = document.querySelector("[data-minus-plus]");

btns.forEach((btn) => btn.addEventListener("transitionend", removeTransition));

equal.addEventListener("click", getResult);
window.addEventListener("keydown", getResult);

numBtns.forEach((btn) => btn.addEventListener("click", inputNum));
window.addEventListener("keydown", inputNum);

opBtns.forEach((btn) => btn.addEventListener("click", inputOp));
window.addEventListener("keydown", inputOp);

fnBtns.forEach((btn) => btn.addEventListener("click", inputAction));
window.addEventListener("keydown", inputAction);

numSign.addEventListener("click", changeInput);
window.addEventListener("keydown", changeInput);

function changeInput(e) {
    let lastIndexMinus = display.value.lastIndexOf(" -");
    let lastValue = display.value[display.value.length - 1];
    const opList = ["/", "*", "+", "-", "^", "%"];
    console.log(display.value);
 
    if(lastValue !== " " && (e.type === "click" || e.key === "F9")) {
     
        if (display.value.includes(" -") && checkOp()) {
            lastIndex = display.value.lastIndexOf("-");
            display.value = display.value.slice(0, lastIndex) 
            + display.value.slice(lastIndex + 1);
            
        } else if(display.value.includes(" ") && !display.value !== "") {
            lastIndex = display.value.lastIndexOf(" ");
            display.value = display.value.slice(0, lastIndex) 
            + " -" + display.value.slice(lastIndex + 1);

        } else if(display.value[0] === "-" && !checkLastValue(opList)) {
            display.value = display.value.slice(1);

        } else if(!display.value.includes(" ") && display.value !== "") {
            display.value = "-" + display.value.slice(0);
        }
    }
    if(e.key === "F9") {
        const key = document.querySelector(`[data-minus-plus]`);
        key.classList.add("btn-temp");
    }

    function checkOp() {
        return display.value.slice(lastIndexMinus, lastIndexMinus + 3) !== " - ";
    }
    function checkLastValue(arr) {
        return arr.some((num) => {
            if(lastValue) return lastValue.includes(num)
        }); 
    }
}

function inputAction(e) {
    let lastValue = display.value[display.value.length - 1];
    
    if(e.key === "Backspace" || this.dataset?.fn === "Backspace") {
        (lastValue === " ") 
            ? display.value = display.value.slice(0, -3)
            : display.value = display.value.slice(0, -1);
    }
    if(e.key === "c" || this.dataset?.fn === "c") {
        display.value = display.value = "";
    }
    if(e.key === "Backspace" || e.key === "c") {
        const key = document.querySelector(`[data-fn="${e.key}"]`);
        (e.key === "Backspace") 
            ? key.classList.add("btn-temp-backspace")
            : key.classList.add("btn-temp");
    }
}

function inputNum(e) {
    const opList = ["/", "*", "+", "-", "^", "%"];
    let lastValue = display.value[display.value.length - 1];

    if(e.type === "click") {
        (lastValue !== " " && checkLastValue(opList)) 
            ? display.value += ` ${this.dataset.num}`
            : display.value += this.dataset.num;
    }
    if(e.type === "keydown") {
        const key = document.querySelector(`[data-num="${e.key}"]`);
        if(!key) return;
        (lastValue !== " " && checkLastValue(opList)) 
            ? display.value += ` ${key.dataset.num}`
            : display.value += key.dataset.num;
        key.classList.add("btn-temp");
    }

    function checkLastValue(arr) {
        return arr.some((num) => {
            if(lastValue) return lastValue.includes(num)
        }); 
    }
}

function inputOp(e) {
    if(e.type === "click") {
        (display.value === "") 
            ? display.value += this.dataset.op
            : display.value += ` ${this.dataset.op} `;
    }
    if(e.type === "keydown") {
        const key = document.querySelector(`[data-op="${e.key}"]`);
        if(!key) return;
        (display.value === "")
            ? display.value += key.dataset.op
            : display.value += ` ${key.dataset.op} `;
        key.classList.add("btn-temp");
    }
}

function removeTransition(e) {
    if(e.propertyName !== "transform") return;
    this.classList.remove("btn-temp");
    this.classList.remove("btn-temp-backspace");
}

function getResult (e) {
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
        "^": (a, b) => a ** b,
        "%": (a, b) => (a / b) * 100,
    };

    this.calc = function (string) {
        let op = ["opList"];
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