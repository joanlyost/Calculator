const newCalculator = new Calculator();

const display = document.querySelector("#display");
const equal = document.querySelector("#equal");
const opBtns = document.querySelectorAll("[data-op]");
const btns = document.querySelectorAll("[data-btn]");
const numBtns = document.querySelectorAll("[data-num]");
const fnBtns = document.querySelectorAll("[data-fn]");
const numSign = document.querySelector("[data-minus-plus]");


btns.forEach((btn) => btn.addEventListener("transitionend", removeTransition));

equal.addEventListener("click", result);
window.addEventListener("keydown", result);

numBtns.forEach((btn) => btn.addEventListener("click", numInput));
window.addEventListener("keydown", numInput);

opBtns.forEach((btn) => btn.addEventListener("click", opInput));
window.addEventListener("keydown", opInput);

fnBtns.forEach((btn) => btn.addEventListener("click", fnInput));
window.addEventListener("keydown", fnInput);

numSign.addEventListener("click", changeInput);
window.addEventListener("keydown", changeInput);

function changeInput(e) {
    let index = display.value.lastIndexOf(" -");
    let lastValue = display.value[display.value.length - 1];
 
    if(lastValue !== " " && (e.type === "click" || e.key === "F9")) {
        if(display.value[0] === "-") {
            display.value = display.value.slice(1);
        } else if (display.value.includes(" -") && 
            display.value.slice(index, index + 3) !== " - ") {
            let lastIndex = display.value.lastIndexOf("-");
            display.value = display.value.slice(0, lastIndex) 
            + display.value.slice(lastIndex + 1);
        } else if(!display.value.includes(" ")) {
            display.value = "-" + display.value.slice(0);
        } else {
            let lastIndex = display.value.lastIndexOf(" ");
            display.value = display.value.slice(0, lastIndex) 
            + " -" + display.value.slice(lastIndex + 1);
        }
    }
    if(e.key === "F9") {
        const key = document.querySelector(`[data-minus-plus]`);
        key.classList.add("btn-temp");
    }
}

function fnInput(e) {
    let lastValue = display.value[display.value.length - 1];
    
    if(e.key === "Backspace" || this.dataset.fn === "Backspace") {
        (lastValue === " ") 
            ? display.value = display.value.slice(0, -3)
            : display.value = display.value.slice(0, -1);
    }
    // if(e.type === "keydown" && e.key === "Backspace") {
    //     const key = document.querySelector(`[data-fn="${e.key}"]`);
    //     if(!key) return;
    //     (lastValue === " ") 
    //         ? display.value = display.value.slice(0, -3)
    //         : display.value = display.value.slice(0, -1);
    //     key.classList.add("btn-temp-backspace");
    // }

    if(e.type === "click" && this.dataset.fn === "c") 
        display.value = display.value = "";
    if(e.type === "keydown" && e.key === "c") {
        const key = document.querySelector(`[data-fn="${e.key}"]`);
        if(!key) return;
        display.value = display.value = "";
        key.classList.add("btn-temp");
    }

    if(e.key === "Backspace" || e.key === "c") {
        const key = document.querySelector(`[data-fn="${e.key}"]`);
        (e.key === "Backspace") 
            ? key.classList.add("btn-temp-backspace")
            : key.classList.add("btn-temp");
    }
}

function numInput(e) {
    const operators = ["/", "*", "+", "-", "^", "%"];
    let lastValue = display.value[display.value.length - 1];

    if(e.type === "click") {
        (lastValue !== " " && mySome(operators)) 
            ? display.value += ` ${this.dataset.num}`
            : display.value += this.dataset.num;
    }
    if(e.type === "keydown") {
        const key = document.querySelector(`[data-num="${e.key}"]`);
        if(!key) return;
        (lastValue !== " " && mySome(operators)) 
            ? display.value += ` ${key.dataset.num}`
            : display.value += key.dataset.num;
        key.classList.add("btn-temp");
    }

    function mySome(arr) {
        return arr.some((num) => {
            if(lastValue) return lastValue.includes(num)
        }); 
    }
}

function opInput(e) {
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
        "^": (a, b) => a ** b,
        "%": (a, b) => (a / b) * 100,
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