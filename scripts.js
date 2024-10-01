let history = [];
let historyIndex = -1;
let currentText = null;
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Add text to the container
function addText() {
    const textInput = document.getElementById("textInput").value;
    if (textInput !== "") {
        const textContainer = document.getElementById("textContainer");
        
        currentText = document.createElement("div");
        currentText.className = "text";
        currentText.textContent = textInput;

        // Add mouse events for dragging
        currentText.addEventListener("mousedown", startDrag);
        textContainer.appendChild(currentText);

        saveState();
    }
}

// Start dragging the text
function startDrag(event) {
    isDragging = true;
    offsetX = event.clientX - currentText.getBoundingClientRect().left;
    offsetY = event.clientY - currentText.getBoundingClientRect().top;

    document.addEventListener("mousemove", dragText);
    document.addEventListener("mouseup", stopDrag);
}

// Dragging the text
function dragText(event) {
    if (!isDragging) return;
    
    const container = document.getElementById("textContainer");
    const containerRect = container.getBoundingClientRect();
    
    // Constrain within the container boundaries
    const newX = Math.min(containerRect.width - currentText.offsetWidth, Math.max(0, event.clientX - containerRect.left - offsetX));
    const newY = Math.min(containerRect.height - currentText.offsetHeight, Math.max(0, event.clientY - containerRect.top - offsetY));

    currentText.style.left = `${newX}px`;
    currentText.style.top = `${newY}px`;

    saveState();
}

// Stop dragging the text
function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", dragText);
    document.removeEventListener("mouseup", stopDrag);
}

// Change the style of the text
function changeStyle() {
    if (currentText) {
        const fontSize = document.getElementById("fontSize").value;
        const color = document.getElementById("color").value;

        currentText.style.fontSize = `${fontSize}px`;
        currentText.style.color = color;

        saveState();
    }
}

// Save the current state for undo/redo
function saveState() {
    // Remove future states if undo was used
    history = history.slice(0, historyIndex + 1);
    
    const state = document.getElementById("textContainer").innerHTML;
    history.push(state);
    historyIndex++;
}

// Undo the last change
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        document.getElementById("textContainer").innerHTML = history[historyIndex];
        restoreCurrentText();
    }
}

// Redo the undone change
function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        document.getElementById("textContainer").innerHTML = history[historyIndex];
        restoreCurrentText();
    }
}

// Restore the reference to the current text element after undo/redo
function restoreCurrentText() {
    const textContainer = document.getElementById("textContainer");
    currentText = textContainer.querySelector(".text");

    if (currentText) {
        currentText.addEventListener("mousedown", startDrag); // Reattach drag events
    }
}
