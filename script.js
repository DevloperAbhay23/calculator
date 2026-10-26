
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";
let finished = false;

function updateDisplay() {
    display.value = expression || "0";
}

function calculate() {
    if (!expression) return;

    try {
        // Only allow calculator characters.
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (!Number.isFinite(result)) {
            throw new Error("Invalid result");
        }

        expression = String(
            Number(result.toPrecision(12))
        );
        finished = true;
        updateDisplay();
    } catch {
        display.value = "Error";
        expression = "";
        finished = false;
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
        expression = "";
        finished = false;
        updateDisplay();
        return;
    }

    if (action === "delete") {
        expression = expression.slice(0, -1);
        finished = false;
        updateDisplay();
        return;
    }

    if (action === "calculate") {
        calculate();
        return;
    }

    if (value !== undefined) {
        if (finished) {
            expression = /[0-9.]/.test(value[0])
                ? ""
                : expression;
            finished = false;
        }

        expression += value;
        updateDisplay();
    }
});
