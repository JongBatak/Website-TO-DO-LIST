const listContainer = document.querySelector('.list-container');
const addListButton = document.querySelector('.add-list');
const modeToggle = document.getElementById('modeToggle');

let draggedCard = null;

document.addEventListener('DOMContentLoaded', loadData);
window.addEventListener('unload', storeData);
modeToggle.addEventListener('change', toggleDarkMode);
addListButton.addEventListener('click', addList);

initializeExistingElements();

function initializeExistingElements() {
    document.querySelectorAll('.delete-card').forEach(button => {
        button.addEventListener('click', () => deleteCard(button.parentElement));
    });

    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            if (input.value.trim()) {
                addCard(button.closest('.list'), input.value);
                input.value = '';
            }
        });
    });

    document.querySelectorAll('.card').forEach(card => {
        addDragEvents(card);
    });
}


function addDragEvents(card) {
    card.addEventListener('dragstart', (e) => {
        draggedCard = card;
        e.dataTransfer.setData('text/plain', '');
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        draggedCard = null;
    });
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const list = event.target.closest('.list');
    if (list && draggedCard) {
        const cardContainer = list.querySelector('.card-container');
        cardContainer.appendChild(draggedCard);
        storeData();
    }
}

function addCard(list, text) {
    const cardContainer = list.querySelector('.card-container');
    const newCard = document.createElement('li');
    newCard.className = 'card';
    newCard.draggable = true;
    newCard.innerHTML = `
        <p>${text}</p>
        <button class="delete-card">Delete</button>
    `;

    addDragEvents(newCard);
    newCard.querySelector('.delete-card').addEventListener('click', () => deleteCard(newCard));
    
    cardContainer.appendChild(newCard);
    storeData();
}

function deleteCard(card) {
    card.remove();
    storeData();
}

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

    const addCardButton = newList.querySelector('.add-card');
    const input = newList.querySelector('input');

    addCardButton.addEventListener('click', () => {
        if (input.value.trim()) {
            addCard(newList, input.value);
            input.value = '';
        }
    });

    listContainer.appendChild(newList);
    storeData();
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    storeData();
}

function storeData() {
    const lists = [];
    document.querySelectorAll('.list').forEach(list => {
        const cards = [];
        list.querySelectorAll('.card').forEach(card => {
            cards.push({
                text: card.querySelector('p').textContent
            });
        });
        lists.push({
            title: list.querySelector('.list-title').textContent,
            cards: cards
        });
    });

    const data = {
        lists: lists,
        darkMode: document.body.classList.contains('dark-mode')
    };

    localStorage.setItem('todoListData', JSON.stringify(data));
}

function addList() {
    const listName = prompt("Enter the name for the new list:");
    if (listName === null) return; // User canceled the prompt
    if (listName.trim() === "") {
        alert("List name cannot be empty!");
        return;
    }

    const newList = document.createElement('li');
    newList.className = 'list';
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    
    newList.innerHTML = `
        <h3>
            <span class="list-title">${listName}</span>
            <button class="edit-list-title">Edit</button>
        </h3>
        <ul class="card-container"></ul>
        <input type="text" placeholder="Add a new card...">
        <button class="add-card">Add Card</button>
        <button class="delete-list">Delete List</button>
    `;

    const addCardButton = newList.querySelector('.add-card');
    const input = newList.querySelector('input');
    const deleteListButton = newList.querySelector('.delete-list');
    const editListTitleButton = newList.querySelector('.edit-list-title');

    addCardButton.addEventListener('click', () => addCard(newList));
    deleteListButton.addEventListener('click', () => deleteList(newList));
    editListTitleButton.addEventListener('click', () => editListTitle(newList));

    listContainer.appendChild(newList);
    storeData();
}

function addCard(list) {
    const input = list.querySelector('input[type="text"]');
    const text = input.value.trim();
    
    // Only proceed if there's actual text
    if (text) {
        const cardContainer = list.querySelector('.card-container');
        const newCard = document.createElement('li');
        newCard.className = 'card';
        newCard.draggable = true;
        
        // Create the card HTML structure
        newCard.innerHTML = `
            <p>${text}</p>
            <button class="edit-card">Edit</button>
            <button class="delete-card">Delete</button>
        `;

        // Add event listeners to the new card
        newCard.querySelector('.delete-card').addEventListener('click', () => deleteCard(newCard));
        newCard.querySelector('.edit-card').addEventListener('click', () => editCard(newCard));
        
        // Add drag functionality
        addDragEvents(newCard);
        
        // Add the card to the container
        cardContainer.appendChild(newCard);
        
        // Clear the input field
        input.value = '';
        
        // Save the updated state
        storeData();
    }
}

// Make sure the event listeners are properly set up
function initializeExistingElements() {
    // Add card functionality
    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', function() {
            const list = this.closest('.list');
            addCard(list);
        });
    });

    // Add enter key functionality for inputs
    document.querySelectorAll('.list input[type="text"]').forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const list = this.closest('.list');
                addCard(list);
            }
        });
    });

    // Other existing event listeners...
}

function editListTitle(list) {
    const titleSpan = list.querySelector('.list-title');
    const newTitle = prompt("Enter new list title:", titleSpan.textContent);
    if (newTitle === null) return; // User canceled the prompt
    if (newTitle.trim() === "") {
        alert("List title cannot be empty!");
        return;
    }
    titleSpan.textContent = newTitle;
    storeData();
}

function editCard(card) {
    const paragraph = card.querySelector('p');
    const newText = prompt("Enter new card text:", paragraph.textContent);
    if (newText === null) return; // User canceled the prompt
    if (newText.trim() === "") {
        alert("Card text cannot be empty!");
        return;
    }
    paragraph.textContent = newText;
    storeData();
}

function deleteList(list) {
    if (confirm("Are you sure you want to delete this list?")) {
        list.remove();
        storeData();
    }
}

function initializeExistingElements() {
    // Delete card buttons
    document.querySelectorAll('.delete-card').forEach(button => {
        button.addEventListener('click', () => deleteCard(button.closest('.card')));
    });

    // Edit card buttons
    document.querySelectorAll('.edit-card').forEach(button => {
        button.addEventListener('click', () => editCard(button.closest('.card')));
    });

    // Add card buttons
    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', () => addCard(button.closest('.list')));
    });

    // Edit list title buttons
    document.querySelectorAll('.edit-list-title').forEach(button => {
        button.addEventListener('click', () => editListTitle(button.closest('.list')));
    });

    // Delete list buttons
    document.querySelectorAll('.delete-list').forEach(button => {
        button.addEventListener('click', () => deleteList(button.closest('.list')));
    });

    // Drag events for cards
    document.querySelectorAll('.card').forEach(card => {
        addDragEvents(card);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeExistingElements();

    // Add event listener for the Reset All button
    document.getElementById('resetButton').addEventListener('click', resetAll);
});



function initializeExistingElements() {
    // Delete card buttons
    document.querySelectorAll('.delete-card').forEach(button => {
        button.addEventListener('click', () => deleteCard(button.closest('.card')));
    });

    // Edit card buttons
    document.querySelectorAll('.edit-card').forEach(button => {
        button.addEventListener('click', () => editCard(button.closest('.card')));
    });

    // Add card buttons
    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', () => addCard(button.closest('.list')));
    });

    // Edit list title buttons
    document.querySelectorAll('.edit-list-title').forEach(button => {
        button.addEventListener('click', () => editListTitle(button.closest('.list')));
    });

    // Delete list buttons
    document.querySelectorAll('.delete-list').forEach(button => {
        button.addEventListener('click', () => deleteList(button.closest('.list')));
    });

    // Drag events for cards
    document.querySelectorAll('.card').forEach(card => {
        addDragEvents(card);
    });
}

function resetAll() {
    if (confirm('Are you sure you want to reset everything? This action cannot be undone.')) {
        const listContainer = document.querySelector('.list-container');
        listContainer.innerHTML = `
            <!-- To-Do List -->
            <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
                <h3>
                    <span class="list-title">To-Do</span>
                    <button class="edit-list-title">Edit</button>
                </h3>
                <button class="delete-list">Delete List</button>
                <ul class="card-container">
                </ul>
                <input type="text" placeholder="Add a new card...">
                <button class="add-card">Add Card</button>
            </li>

            <!-- In-Progress List -->
            <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
                <h3>
                    <span class="list-title">In-Progress</span>
                    <button class="edit-list-title">Edit</button>
                </h3>
                <button class="delete-list">Delete List</button>
                <ul class="card-container">
                </ul>
                <input type="text" placeholder="Add a new card...">
                <button class="add-card">Add Card</button>
            </li>

            <!-- Done List -->
            <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
                <h3>
                    <span class="list-title">Done</span>
                    <button class="edit-list-title">Edit</button>
                </h3>
                <button class="delete-list">Delete List</button>
                <ul class="card-container">
                </ul>
                <input type="text" placeholder="Add a new card...">
                <button class="add-card">Add Card</button>
            </li>
        `;
        
        // Reinitialize event listeners for the new elements
        initializeExistingElements();
        // Save the reset state
        storeData();
    }
}



function resetAll() {
    const listContainer = document.querySelector('.list-container');
    listContainer.innerHTML = `
        <!-- To-Do List -->
        <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
            <h3>
                <span class="list-title">To-Do</span>
                <button class="edit-list-title">Edit</button>
            </h3>
            <button class="delete-list">Delete List</button>
            <ul class="card-container">
            </ul>
            <input type="text" placeholder="Add a new card...">
            <button class="add-card">Add Card</button>
        </li>

        <!-- In-Progress List -->
        <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
            <h3>
                <span class="list-title">In-Progress</span>
                <button class="edit-list-title">Edit</button>
            </h3>
            <button class="delete-list">Delete List</button>
            <ul class="card-container">
            </ul>
            <input type="text" placeholder="Add a new card...">
            <button class="add-card">Add Card</button>
        </li>

        <!-- Done List -->
        <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
            <h3>
                <span class="list-title">Done</span>
                <button class="edit-list-title">Edit</button>
            </h3>
            <button class="delete-list">Delete List</button>
            <ul class="card-container">
            </ul>
            <input type="text" placeholder="Add a new card...">
            <button class="add-card">Add Card</button>
        </li>
    `;
    
    // Reinitialize event listeners for the new elements
    initializeExistingElements();
    // Save the reset state
    storeData();
}

// Add this function to check for the edit button format
function checkEditButtonFormat() {
    const editButtons = document.querySelectorAll('.edit-list-title');
    let hasError = false;

    editButtons.forEach(button => {
        // Check if it's actually a button element and has the correct format
        if (!(button instanceof HTMLButtonElement) || 
            !button.classList.contains('edit-list-title') ||
            button.tagName.toLowerCase() !== 'button') {
            hasError = true;
        }
    });

    if (hasError) {
        alert("There's an error with the list format. Please press Reset All to fix the issue.");
        return true;
    }
    return false;
}

// Modify your DOMContentLoaded event listener to include this check
document.addEventListener('DOMContentLoaded', function() {
    try {
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        
        if (!hasVisited) {
            // Simple alert without forcing any action
            alert("If the website appears empty, please press the Reset All button to get started.");
            localStorage.setItem('hasVisitedBefore', 'true');
        }
        
        loadData();
        initializeExistingElements();
        document.getElementById('resetButton').addEventListener('click', resetAll);
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Also add the check to the loadData function

// Make sure your resetAll function creates the correct button format
function resetAll() {
    const listContainer = document.querySelector('.list-container');
    listContainer.innerHTML = `
        <!-- To-Do List -->
        <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
            <h3>
                <span class="list-title">To-Do</span>
                <button class="edit-list-title">Edit</button>
            </h3>
            <button class="delete-list">Delete List</button>
            <ul class="card-container">
            </ul>
            <input type="text" placeholder="Add a new card...">
            <button class="add-card">Add Card</button>
        </li>

        <!-- In-Progress List -->
        <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
            <h3>
                <span class="list-title">In-Progress</span>
                <button class="edit-list-title">Edit</button>
            </h3>
            <button class="delete-list">Delete List</button>
            <ul class="card-container">
            </ul>
            <input type="text" placeholder="Add a new card...">
            <button class="add-card">Add Card</button>
        </li>

        <!-- Done List -->
        <li class="list" ondragover="allowDrop(event)" ondrop="drop(event)">
            <h3>
                <span class="list-title">Done</span>
                <button class="edit-list-title">Edit</button>
            </h3>
            <button class="delete-list">Delete List</button>
            <ul class="card-container">
            </ul>
            <input type="text" placeholder="Add a new card...">
            <button class="add-card">Add Card</button>
        </li>
    `;
    
    // Reinitialize event listeners for the new elements
    initializeExistingElements();
    // Save the reset state
    storeData();
}

// Function to check if the website is empty
function checkEmptyWebsite() {
    // Check if we've already shown the alert in this session
    if (sessionStorage.getItem('emptyAlertShown')) {
        return false;
    }

    const lists = document.querySelectorAll('.list');
    if (lists.length === 0) {
        alert("The website is empty. Press the Reset All button or Add List to get started.");
        // Mark that we've shown the alert
        sessionStorage.setItem('emptyAlertShown', 'true');
        return true;
    }
    return false;
}



// Modify loadData function

// Remove the empty website check from these functions since we only want it on initial load
function deleteList(list) {
    if (confirm("Are you sure you want to delete this list?")) {
        list.remove();
        storeData();
    }
}




function loadData() {
    const savedData = localStorage.getItem('todoListData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        listContainer.innerHTML = ''; // Clear existing lists

        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            modeToggle.checked = true;
        }

        data.lists.forEach(listData => {
            const newList = document.createElement('li');
            newList.className = 'list';
            newList.setAttribute('ondragover', 'allowDrop(event)');
            newList.setAttribute('ondrop', 'drop(event)');
            
            // Create list header
            const listHeader = document.createElement('div');
            listHeader.className = 'list-header';

            const listTitle = document.createElement('h3');
            listTitle.className = 'list-title';
            listTitle.textContent = listData.title;

            const editButton = document.createElement('button');
            editButton.className = 'edit-list-title';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editListTitle(newList));

            listHeader.appendChild(listTitle);
            listHeader.appendChild(editButton);

            // Create delete list button
            const deleteListButton = document.createElement('button');
            deleteListButton.className = 'delete-list';
            deleteListButton.textContent = 'Delete List';
            deleteListButton.addEventListener('click', () => deleteList(newList));

            // Create card container
            const cardContainer = document.createElement('ul');
            cardContainer.className = 'card-container';

            // Create input for new cards
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Add a new card...';

            // Create add card button
            const addCardButton = document.createElement('button');
            addCardButton.className = 'add-card';
            addCardButton.textContent = 'Add Card';
            addCardButton.addEventListener('click', () => addCard(newList));

            // Append all elements to the list
            newList.appendChild(listHeader);
            newList.appendChild(deleteListButton);
            newList.appendChild(cardContainer);
            newList.appendChild(input);
            newList.appendChild(addCardButton);

            // Create cards
            listData.cards.forEach(cardData => {
                const card = createCardElement(cardData.text);
                cardContainer.appendChild(card);
            });

            listContainer.appendChild(newList);
        });

        // Re-initialize event listeners for all buttons
        initializeExistingElements(); 
    }
}

function createCardElement(text) {
    const card = document.createElement('li');
    card.className = 'card';
    card.draggable = true;

    const cardText = document.createElement('p');
    cardText.textContent = text;

    const editButton = document.createElement('button');
    editButton.className = 'edit-card';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editCard(card));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-card';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteCard(card));

    card.appendChild(cardText);
    card.appendChild(editButton);
    card.appendChild(deleteButton);

    addDragEvents(card);

    return card;
}

function addList() {
    const listName = prompt("Enter the name for the new list:");
    if (listName === null) return; // User canceled the prompt
    if (listName.trim() === "") {
        alert("List name cannot be empty!");
        return;
    }

    const newList = document.createElement('li');
    newList.className = 'list';
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    
    // Create list header
    const listHeader = document.createElement('div');
    listHeader.className = 'list-header';

    const listTitle = document.createElement('h3');
    listTitle.className = ' list-title';
    listTitle.textContent = listName;

    const editButton = document.createElement('button');
    editButton.className = 'edit-list-title';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editListTitle(newList));

    listHeader.appendChild(listTitle);
    listHeader.appendChild(editButton);

    // Create delete list button
    const deleteListButton = document.createElement('button');
    deleteListButton.className = 'delete-list';
    deleteListButton.textContent = 'Delete List';
    deleteListButton.addEventListener('click', () => deleteList(newList));

    // Create card container
    const cardContainer = document.createElement('ul');
    cardContainer.className = 'card-container';

    // Create input for new cards
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a new card...';

    // Create add card button
    const addCardButton = document.createElement('button');
    addCardButton.className = 'add-card';
    addCardButton.textContent = 'Add Card';
    addCardButton.addEventListener('click', () => addCard(newList));

    // Append all elements to the list
    newList.appendChild(listHeader);
    newList.appendChild(deleteListButton);
    newList.appendChild(cardContainer);
    newList.appendChild(input);
    newList.appendChild(addCardButton);

    listContainer.appendChild(newList);
    initializeExistingElements();
    storeData();
}

function createCardElement(text) {
    const card = document.createElement('li');
    card.className = 'card';
    card.draggable = true;

    const cardText = document.createElement('p');
    cardText.textContent = text;

    const editButton = document.createElement('button');
    editButton.className = 'edit-card';
    editButton.textContent = 'Edit';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-card';
    deleteButton.textContent = 'Delete';

    card.appendChild(cardText);
    card.appendChild(editButton);
    card.appendChild(deleteButton);

    addDragEvents(card);

    return card;
}

function initializeExistingElements() {
    // Delete card buttons
    document.querySelectorAll('.delete-card').forEach(button => {
        button.addEventListener('click', () => deleteCard(button.closest('.card')));
    });

    // Edit card buttons
    document.querySelectorAll('.edit-card').forEach(button => {
        button.addEventListener('click', () => editCard(button.closest('.card')));
    });

    // Add card buttons
    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', () => addCard(button.closest('.list')));
    });

    // Edit list title buttons
    document.querySelectorAll('.edit-list-title').forEach(button => {
        button.addEventListener('click', () => editListTitle(button.closest('.list')));
    });

    // Delete list buttons
    document.querySelectorAll('.delete-list').forEach(button => {
        button.addEventListener('click', () => deleteList(button.closest('.list')));
    });

    // Drag events for cards
    document.querySelectorAll('.card').forEach(card => {
        addDragEvents(card);
    });
}

function addList() {
    const listName = prompt("Enter the name for the new list:");
    if (listName === null) return; // User canceled the prompt
    if (listName.trim() === "") {
        alert("List name cannot be empty!");
        return;
    }

    const newList = document.createElement('li');
    newList.className = 'list';
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    
    // Create list header
    const listHeader = document.createElement('div');
    listHeader.className = 'list-header';

    const listTitle = document.createElement('h3');
    listTitle.className = 'list-title';
    listTitle.textContent = listName;

    const editButton = document.createElement('button');
    editButton.className = 'edit-list-title';
    editButton.textContent = 'Edit';

    listHeader.appendChild(listTitle);
    listHeader.appendChild(editButton);

    // Create delete list button
    const deleteListButton = document.createElement('button');
    deleteListButton.className = 'delete-list';
    deleteListButton.textContent = 'Delete List';

    // Create card container
    const cardContainer = document.createElement('ul');
    cardContainer.className = 'card-container';

    // Create input for new cards
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Add a new card...';

    // Create add card button
    const addCardButton = document.createElement('button');
    addCardButton.className = 'add-card';
    addCardButton.textContent = 'Add Card';

    // Append all elements to the list
    newList.appendChild(listHeader);
    newList.appendChild(deleteListButton);
    newList.appendChild(cardContainer);
    newList.appendChild(input);
    newList.appendChild(addCardButton);

    listContainer.appendChild(newList);
    initializeExistingElements();
    storeData();
}
function addList() {
    const listName = prompt("Enter the name for the new list:");
    if (listName === null) return; // User canceled the prompt
    if (listName.trim() === "") {
        alert("List name cannot be empty!");
        return;
    }

    const newList = document.createElement('li');
    newList.className = 'list';
    newList.setAttribute('ondragover', 'allowDrop(event)');
    newList.setAttribute('ondrop', 'drop(event)');
    
    newList.innerHTML = `
        <div class="list-header">
            <h3 class="list-title">${listName}</h3>
            <button class="edit-list-title">Edit</button>
        </div>
        <button class="delete-list">Delete List</button>
        <ul class="card-container"></ul>
        <input type="text" placeholder="Add a new card...">
        <button class="add-card">Add Card</button>
    `;

    listContainer.appendChild(newList);
    initializeExistingElements();
    storeData();
}

function editListTitle(list) {
    const titleElement = list.querySelector('.list-title');
    const newTitle = prompt("Enter new list title:", titleElement.textContent);
    if (newTitle === null) return; // User canceled the prompt
    if (newTitle.trim() === "") {
        alert("List title cannot be empty!");
        return;
    }
    titleElement.textContent = newTitle;
    storeData();
}

function setResponsiveDesign() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function handleScreenChange(e) {
        if (e.matches) {
            document.querySelectorAll('.list').forEach(list => {
                list.style.width = '100%';
                list.style.marginBottom = '20px';
            });

            document.querySelectorAll('.list-container').forEach(container => {
                container.style.flexDirection = 'column';
            });

            document.querySelector('.nav2').style.flexDirection = 'column';
            document.querySelector('.mode-toggle').style.flexDirection = 'column';
        } else {
            document.querySelectorAll('.list').forEach(list => {
                list.style.width = 'auto';
                list.style.marginBottom = '0';
            });

            document.querySelectorAll('.list-container').forEach(container => {
                container.style.flexDirection = 'row';
            });

            document.querySelector('.nav2').style.flexDirection = 'row';
            document.querySelector('.mode-toggle').style.flexDirection = 'row';
        }
    }

    mediaQuery.addListener(handleScreenChange);
    handleScreenChange(mediaQuery);
}

document.addEventListener('DOMContentLoaded', setResponsiveDesign);
