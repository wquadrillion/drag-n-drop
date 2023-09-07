// Function to create initial boxes
function createInitialBoxes() {
    const table = document.getElementById("dragTable");
    let boxNumber = 100;

    for (let row = 0; row < 3; row++) {
        const newRow = table.insertRow(row);
        
        for (let col = 0; col < 3; col++) {
            const newCell = newRow.insertCell(col);
            const newBox = document.createElement("div");
            
            newBox.id = boxNumber.toString();
            newBox.className = "box";
            newBox.textContent = boxNumber;
            newBox.draggable = true; // Enable draggability
            newBox.addEventListener("dragstart", handleDragStart);
            newCell.appendChild(newBox);
            
            boxNumber += 100; // Increment the box number by 100
        }
    }
}
// Call the function to create initial boxes
createInitialBoxes();

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const new_boxes = document.querySelectorAll(".box");
new_boxes.forEach(box => {
    box.style.backgroundColor = getRandomColor();
});

// Initialize variables
let sourceBox = null;
const undoStack = [];

// Function to handle drag start
function handleDragStart(event) {
    sourceBox = event.target;

    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";

    sourceBox.classList.add("dragging");
}

// Function to handle drag over
function handleDragOver(event) {
    event.preventDefault();
}

// Function to handle drop
function handleDrop(event) {
    event.preventDefault();
    const targetBox = event.target;

    // Check if the source and target boxes are different
    if (sourceBox !== targetBox) {
        // Swap the innerHTML and IDs of the source and target boxes
        const sourceHTML = sourceBox.innerHTML;
        const sourceID = sourceBox.id;
        sourceBox.innerHTML = targetBox.innerHTML;
        sourceBox.id = targetBox.id;
        targetBox.innerHTML = sourceHTML;
        targetBox.id = sourceID;

        // Swap the background colors of the source and target boxes
        const sourceColor = window.getComputedStyle(sourceBox).backgroundColor;
        const targetColor = window.getComputedStyle(targetBox).backgroundColor;
        sourceBox.style.backgroundColor = targetColor;
        targetBox.style.backgroundColor = sourceColor;

        // Add the undo action to the stack        
        undoStack.push({
            source: sourceBox,
            target: targetBox,
            sourceContent: sourceHTML,
            targetContent: targetBox.innerHTML,
            sourceBackgroundColor: sourceColor,
            targetBackgroundColor: targetColor
        });

    }

    // Reset the transform property for smooth movement animation
    sourceBox.style.transition = "transform 0.3s ease";
    sourceBox.style.transform = "translate(-50%, -50%)"; // Reset transform

    sourceBox.classList.remove("dragging");
}


// Function to undo the last action
function undoLastAction() {
    if (undoStack.length > 0) {
        const lastAction = undoStack.pop();
        const source = lastAction.source;
        const target = lastAction.target;
        const sourceID = lastAction.source.id;
        const targetID = lastAction.target.id;
        const targetBG = lastAction.targetBackgroundColor;
        const sourceBG= lastAction.sourceBackgroundColor;

        // Swap the innerHTML and IDs back to their original positions
        lastAction.source.innerHTML = targetID;
        lastAction.source.id = targetID;
        lastAction.target.innerHTML = sourceID;
        lastAction.target.id = sourceID;

        source.style.backgroundColor = sourceBG;
        target.style.backgroundColor = targetBG;
    }
}

// Function to add a new row to the table
function addRow() {
    const table = document.getElementById("dragTable");
    const newRow = table.insertRow(table.rows.length);

    // Find the ID of the last box in the table
    const lastBox = table.querySelector(".box:last-child");
    //const lastBoxID = parseInt(lastBox.id);

    const lastBoxID = (table.rows.length - 1) * 3  * 100;
    // Calculate the starting ID for the new row
    let startingID = lastBoxID + 100;

    for (let i = 0; i < 3; i++) {
        const newCell = newRow.insertCell(i);
        const newBox = document.createElement("div");
        const newBoxID = startingID + i * 100;
        newBox.id = newBoxID.toString();
        newBox.className = "box";
        newBox.textContent = newBoxID;
        newBox.draggable = true;
        newBox.addEventListener("dragstart", handleDragStart);
        newCell.appendChild(newBox);

        // Set a random background color for the new box
        newBox.style.backgroundColor = getRandomColor();

        // Add drag and drop listeners to the new boxes
        newBox.addEventListener("dragover", handleDragOver);
        newBox.addEventListener("drop", handleDrop);
    }
}



// Event listeners
const boxes = document.querySelectorAll(".box");
boxes.forEach(box => {
    box.addEventListener("dragstart", handleDragStart);
});

const tableCells = document.querySelectorAll("td");
tableCells.forEach(cell => {
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("drop", handleDrop);
});

const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", undoLastAction);

const addRowButton = document.getElementById("addRowButton");
addRowButton.addEventListener("click", addRow);
