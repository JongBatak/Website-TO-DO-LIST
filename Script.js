function addCard(event) {
    const inputField = event.target.previousElementSibling; 
    const cardText = inputField.value.trim(); 

    if (cardText === '') {
        alert('Please enter a card description!');
        return;
    }

    const cardList = event.target.parentElement.querySelector('.card-container'); 
    const newCard = document.createElement('li'); 
    newCard.className = 'card'; 
    newCard.innerHTML = `
        <p>${cardText}</p>
        <button class="delete-card">Delete</button>
    `; 

    cardList.appendChild(newCard);
    inputField.value = ''; 
}

function deleteCard(event) {
    const card = event.target.parentElement; 
    card.remove(); 
}

document.querySelectorAll('.add-card').forEach(button => {
    button.addEventListener('click', addCard); 
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-card')) {
        deleteCard(event); 
    }
});

function addList() {
    const newList = document.createElement('li'); 
    newList.className = 'list'; 
    newList.innerHTML = `
        <h3>New List</h3>
        <ul class="card-container"></ul>
        <input type="text" placeholder="Add a new card...">
        <button class="add-card">Add Card</button>
    `; 

    document.querySelector('.list-container').appendChild(newList);
   
    newList.querySelector('.add-card').addEventListener('click', addCard);
}

document.querySelector('.add-list').addEventListener('click', addList);

// Allow dropping
function allowDrop(event) {
    event.preventDefault();
}

// Handle drag start
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

// Handle drop
function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    event.target.closest('.list').querySelector('.card-container').appendChild(draggedElement);
}

// Generate unique ID for each card
let cardIdCounter = 0;
function generateCardId() {
    return `card-${cardIdCounter++}`;
}

// Modify the addCard function to include drag attributes and unique ID
function addCard(event) {
    const inputField = event.target.previousElementSibling;
    const cardText = inputField.value.trim();

    if (cardText === '') {
        alert('Please enter a card description!');
        return;
    }

    const cardList = event.target.parentElement.querySelector('.card-container');
    const newCard = document.createElement('li');
    const cardId = generateCardId();
    newCard.className = 'card';
    newCard.draggable = true;
    newCard.id = cardId;
    newCard.setAttribute('ondragstart', 'drag(event)');
    newCard.innerHTML = `
        <p>${cardText}</p>
        <button class="delete-card">Delete</button>
    `;

    cardList.appendChild(newCard);
    inputField.value = '';
}

// Update existing cards to have drag attributes and unique IDs
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(card => {
        const cardId = generateCardId();
        card.id = cardId;
        card.setAttribute('ondragstart', 'drag(event)');
    });
});

function addList() {
    const newList = document.createElement('li'); 
    newList.className = 'list'; 
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    newList.innerHTML = `
        <h3>New List</h3>
        <ul class="card-container"></ul>
        <input type="text" placeholder="Add a new card...">
        <button class="add-card">Add Card</button>
    `; 

    document.querySelector('.list-container').appendChild(newList);
   
    newList.querySelector('.add-card').addEventListener('click', addCard);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var draggedElement = document.getElementById(data);
    var dropTarget = event.target.closest('.list');
    if (dropTarget) {
        dropTarget.querySelector('.card-container').appendChild(draggedElement);
    }
}

function addCard(event) {
    const inputField = event.target.previousElementSibling;
    const cardText = inputField.value.trim();

    if (cardText === '') {
        alert('Please enter a card description!');
        return;
    }

    const cardList = event.target.parentElement.querySelector('.card-container');
    const newCard = document.createElement('li');
    const cardId = generateCardId();
    newCard.className = 'card';
    newCard.draggable = true;
    newCard.id = cardId;
    newCard.setAttribute('ondragstart', 'drag(event)');
    newCard.innerHTML = `
        <p>${cardText}</p>
        <button class="delete-card">Delete</button>
    `;

    cardList.appendChild(newCard);
    inputField.value = '';
}

// Mode toggle functionality
const modeToggle = document.getElementById('modeToggle');
const body = document.body;

modeToggle.addEventListener('change', function() {
    if (this.checked) {
        body.classList.add('dark-mode');
        updateDeleteButtonColors('blue');
    } else {
        body.classList.remove('dark-mode');
        updateDeleteButtonColors('red');
    }
});

function updateDeleteButtonColors(color) {
    const deleteButtons = document.querySelectorAll('.delete-card');
    deleteButtons.forEach(button => {
        button.style.backgroundColor = color;
    });
}

// Update the addCard function to set the initial delete button color
function addCard(event) {
    // ... existing code ...

    const deleteButton = newCard.querySelector('.delete-card');
    deleteButton.style.backgroundColor = body.classList.contains('dark-mode') ? 'blue' : 'red';

    cardList.appendChild(newCard);
    inputField.value = '';
}

// Initial setup
updateDeleteButtonColors(body.classList.contains('dark-mode') ? 'blue' : 'red');

function addList() {
    const listName = prompt('Enter the name for the new list:', 'New List');
    
    if (listName === null) return; // If user clicks Cancel, don't create the list
    
    const newList = document.createElement('li'); 
    newList.className = 'list'; 
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    newList.innerHTML = `
        <h3>${listName}</h3>
        <ul class="card-container"></ul>
        <input type="text" placeholder="Add a new card...">
        <button class="add-card">Add Card</button>
    `; 

    document.querySelector('.list-container').appendChild(newList);
   
    newList.querySelector('.add-card').addEventListener('click', addCard);
}

function addCard(event) {
    const inputField = event.target.previousElementSibling;
    const cardText = inputField.value.trim();

    if (cardText === '') {
        alert('Please enter a card description!');
        return;
    }

    const cardList = event.target.parentElement.querySelector('.card-container');
    const newCard = document.createElement('li');
    const cardId = generateCardId();
    newCard.className = 'card';
    newCard.draggable = true;
    newCard.id = cardId;
    newCard.setAttribute('ondragstart', 'drag(event)');
    newCard.innerHTML = `
        <p>${cardText}</p>
        <button class="delete-card">Delete</button>
    `;

    const deleteButton = newCard.querySelector('.delete-card');
    deleteButton.style.backgroundColor = document.body.classList.contains('dark-mode') ? 'blue' : 'red';

    cardList.appendChild(newCard);
    inputField.value = '';
}

function addList() {
    const listName = prompt('Enter the name for the new list:');
    
    if (listName === null) {
        return; // User clicked Cancel, don't create the list
    }
    
    if (listName.trim() === '') {
        alert('Please enter a name for the new list!');
        return; // Don't create the list if the name is empty
    }
    
    const newList = document.createElement('li'); 
    newList.className = 'list'; 
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    newList.innerHTML = `
        <h3>${listName}</h3>
        <ul class="card-container"></ul>
        <input type="text" placeholder="Add a new card...">
        <button class="add-card">Add Card</button>
    `; 

    document.querySelector('.list-container').appendChild(newList);
   
    newList.querySelector('.add-card').addEventListener('click', addCard);
}

