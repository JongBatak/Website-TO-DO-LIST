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
