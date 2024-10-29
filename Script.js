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
