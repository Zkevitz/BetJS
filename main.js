let ItemList = [];
let StartList = [];
let expected_value = 0;

document.addEventListener("DOMContentLoaded", function () {
    let running = localStorage.getItem("running");
    if(running == null){
        localStorage.setItem("running", true);
        fetch_ItemJson();}
    else{
        updateUI();}
});

function fetch_ItemJson(){
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
    })
}
function get_ItemList_from_storage(){
    data = localStorage.getItem("on_work");
    console.log(data)
    if(data)
        ItemList = JSON.parse(data);
    return ItemList;
}

function get_expected_value_from_storage(){
    data = localStorage.getItem("expected_value");
    if(data)
        expected_value = parseFloat(data);
    return expected_value;
}
function process_items(data){
    
    const total_quantity = data.items.reduce((total, item) => total + item.quantity, 0);
    for(const item of data.items){
        const probability = item.quantity / total_quantity;
        ItemList.push({name: item.name, price: item.price, quantity: item.quantity, probability: ((probability * 100).toFixed(2))});
        console.log(item.name, item.price, item.quantity);
        if(item.quantity > 0){
            expected_value += item.price * probability;
        }
    }
    localStorage.setItem("on_work", JSON.stringify(ItemList));
    localStorage.setItem("expected_value", expected_value.toFixed(2));
    updateUI();
}

function calculateProbabilities(){
    ItemList = get_ItemList_from_storage();
    expected_value = 0;
    const total_quantity = ItemList.reduce((total, item) => total + item.quantity, 0);
    for (const item of ItemList){
        const probability = item.quantity / total_quantity;
        item.probability = ((probability * 100).toFixed(2));
        if(item.quantity > 0){
            expected_value += item.price * probability;
        }
    }
    localStorage.setItem("expected_value", expected_value.toFixed(2));
    localStorage.setItem("on_work", JSON.stringify(ItemList));
}

// Fonction séparée pour mettre à jour l'interface
function updateUI() {
    calculateProbabilities();
    ItemList = get_ItemList_from_storage();
    expected_value = get_expected_value_from_storage();
    const app_container = document.getElementById('app-container');
    app_container.innerHTML = "";
    app_container.innerHTML += `
        <button class = "reset-button" id="reset-button">Reset</button>
        <h2>Expected value : ${expected_value.toFixed(2)}€</h2>
        ${ItemList.map(item => `
            <div class="carte">
                <p class="item-name">${item.name} => </p>
                <p class="item-price">${item.price}€</p>
                <p class="item-quantity">${item.quantity}qty.</p>
                <p class="item-probability">${item.probability}%</p>
                <button data-name="${item.name}" class="remove-item-button">Remove one</button>
            </div>
        `).join('')}
    `;
    document.getElementById('reset-button').addEventListener('click', () => {
        localStorage.removeItem("on_work");
        localStorage.removeItem("expected_value");
        localStorage.removeItem("running");
        location.reload();
        updateUI(); 
    });
    // Ajouter les event listeners après avoir mis à jour le DOM
    addEventListeners();
}

function addEventListeners() {
    const buttons = document.querySelectorAll('.remove-item-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            ItemList = get_ItemList_from_storage();
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
                localStorage.setItem("on_work", JSON.stringify(ItemList));
                // Mettre à jour l'interface après modification
                updateUI();
            }
        });
    });
}