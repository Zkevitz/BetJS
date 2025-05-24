const ItemList = [];
let StartList = [];
let expected_value = 0;

document.addEventListener("DOMContentLoaded", function () {
    fetch('item.json')
    .then(response => {
        if(!response.ok){
            throw new Error('Error fetching JSON');}
        return response.json();
    })
    .then(data => {
        console.log('Donnees recuperees :', data);
        process_items(data);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });
});

function process_items(data){
    // Vider la liste avant de la reconstruire
    ItemList.length = 0;
    
    const items = [];
    for (const item of data.items){
        if(item.quantity > 0){
            items.push(item);
        }
    }
    const total_quantity = items.reduce((total, item) => total + item.quantity, 0);
    for(const item of items){
        const probability = item.quantity / total_quantity;
        ItemList.push({name: item.name, price: item.price, quantity: item.quantity, probability: ((probability * 100).toFixed(2))});
        console.log(item.name, item.price, item.quantity);
        if(item.quantity > 0){
            expected_value += item.price * probability;
        }
    }
    StartList = [...ItemList];
    console.log(expected_value);
    console.log("Le DOM est entièrement chargé et analysé !");
    console.log("COUCOU")
    updateUI();
}

function calculateProbabilities(){
    expected_value = 0;
    const total_quantity = ItemList.reduce((total, item) => total + item.quantity, 0);
    for (const item of ItemList){
        const probability = item.quantity / total_quantity;
        item.probability = ((probability * 100).toFixed(2));
        if(item.quantity > 0){
            expected_value += item.price * probability;
        }
    }
}

// Fonction séparée pour mettre à jour l'interface
function updateUI() {

    const app_container = document.getElementById('app-container');
    app_container.innerHTML = "<h2>Expected value : " + expected_value.toFixed(2) + "€</h2>";
    app_container.innerHTML += ItemList.map(item =>
        `<div class="carte"><p class="item-name">${item.name} => </p>
        <p class="item-price">${item.price}€</p>
        <p class="item-quantity">${item.quantity}qty.</p>
        <p class="item-probability">${item.probability}%</p>
        <button data-name="${item.name}" class="remove-item-button">Remove one</button></div>`).join('');
    
    // Ajouter les event listeners après avoir mis à jour le DOM
    calculateProbabilities();
    addEventListeners();
}

function addEventListeners() {
    const buttons = document.querySelectorAll('.remove-item-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-name');
            const item = ItemList.find(item => item.name === itemName);
            if (item) {
                item.quantity--;
                console.log(`Quantité réduite à: ${item.quantity}`);
                
                if(item.quantity <= 0){
                    item.quantity = 0;
                    const index = ItemList.findIndex(i => i.name === item.name);
                    if (index !== -1) {
                        ItemList.splice(index, 1);
                    }
                }
                
                // Mettre à jour l'interface après modification
                updateUI();
            }
        });
    });
}