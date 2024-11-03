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
            title: list.querySelector('h3').textContent,
            cards: cards
        });
    });

    const data = {
        lists: lists,
        darkMode: document.body.classList.contains('dark-mode')
    };

    localStorage.setItem('todoListData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('todoListData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
 
        listContainer.innerHTML = '';


        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            modeToggle.checked = true;
        }


        data.lists.forEach(listData => {
            const newList = document.createElement('li');
            newList.className = 'list';
            newList.setAttribute('ondragover', 'allowDrop(event)');
            newList.setAttribute('ondrop', 'drop(event)');
            
            newList.innerHTML = `
                <h3>${listData.title}</h3>
                <ul class="card-container"></ul>
                <input type="text" placeholder="Add a new card...">
                <button class="add-card">Add Card</button>
            `;

            const cardContainer = newList.querySelector('.card-container');
            listData.cards.forEach(cardData => {
                const card = document.createElement('li');
                card.className = 'card';
                card.draggable = true;
                card.innerHTML = `
                    <p>${cardData.text}</p>
                    <button class="delete-card">Delete</button>
                `;
                addDragEvents(card);
                card.querySelector('.delete-card').addEventListener('click', () => deleteCard(card));
                cardContainer.appendChild(card);
            });

            const addCardButton = newList.querySelector('.add-card');
            const input = newList.querySelector('input');

            addCardButton.addEventListener('click', () => {
                if (input.value.trim()) {
                    addCard(newList, input.value);
                    input.value = '';
                }
            });

            listContainer.appendChild(newList);
        });
    }
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
    const input = list.querySelector('input');
    const text = input.value.trim();
    if (text === "") {
        alert("Card text cannot be empty!");
        return;
    }

    const cardContainer = list.querySelector('.card-container');
    const newCard = document.createElement('li');
    newCard.className = 'card';
    newCard.draggable = true;
    newCard.innerHTML = `
        <p>${text}</p>
        <button class="edit-card">Edit</button>
        <button class="delete-card">Delete</button>
    `;

    addDragEvents(newCard);
    newCard.querySelector('.delete-card').addEventListener('click', () => deleteCard(newCard));
    newCard.querySelector('.edit-card').addEventListener('click', () => editCard(newCard));
    
    cardContainer.appendChild(newCard);
    input.value = '';
    storeData();
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
    document.querySelectorAll('.delete-card').forEach(button => {
        button.addEventListener('click', () => deleteCard(button.closest('.card')));
    });

    document.querySelectorAll('.edit-card').forEach(button => {
        button.addEventListener('click', () => editCard(button.closest('.card')));
    });

    document.querySelectorAll('.add-card').forEach(button => {
        button.addEventListener('click', () => addCard(button.closest('.list')));
    });

    document.querySelectorAll('.edit-list-title').forEach(button => {
        button.addEventListener('click', () => editListTitle(button.closest('.list')));
    });

    document.querySelectorAll('.delete-list').forEach(button => {
        button.addEventListener('click', () => deleteList(button.closest('.list')));
    });

    document.querySelectorAll('.card').forEach(card => {
        addDragEvents(card);
    });
}

document.getElementById('resetButton').addEventListener('click', function() {
    if (confirm('Are you sure you want to reset everything? This action cannot be undone.')) {
        // Reset all lists to their default state
        const listContainer = document.querySelector('.list-container');
        listContainer.innerHTML = ''; // Clear all lists
        
        // Optionally, reload the page to restore default state
        location.reload();
    }
});

