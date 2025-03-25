document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById("menu");

    // 🔥 Menu items array
    const menuItems = [
        { name: "Pizza", description: "Pepperoni, mushroom, mozzarella", price: 14, imgSrc: "./assets/images/pizza.png" },
        { name: "Hamburger", description: "Beef, cheese, lettuce", price: 12, imgSrc: "./assets/images/burger.png" },
        { name: "Beer", description: "Grain, hops, yeast, water", price: 12, imgSrc: "./assets/images/beer.png" }
    ];

    // 🔥 Render menu items dynamically
    function renderMenu() {
        menuContainer.innerHTML = ""; // Clear existing menu

        menuItems.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");

            menuItem.innerHTML = `
                <img src="${item.imgSrc}" alt="${item.name}">
                <div class="details">
                    <h2>${item.name}</h2>
                    <p>${item.description}</p>
                    <span class="price">$${item.price}</span>
                </div>
                <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}">+</button>
            `;

            menuContainer.appendChild(menuItem);
        });

        // 🔥 Attach event listeners after rendering
        attachAddToCartListeners();
    }

    // 🔥 Attach event listeners to dynamically created buttons
    function attachAddToCartListeners() {
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", () => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                addToCart(name, price);
            });
        });
    }

    // Call the render function on page load
    renderMenu();
});

let cart = [];
const orderSection = document.getElementById("order-section");
const orderItemsEl = document.getElementById("order-items");
const totalPriceEl = document.getElementById("total-price");
const completeOrderBtn = document.getElementById("complete-order");
const paymentModal = document.getElementById("payment-modal");
const closeModalBtn = document.getElementById("close-modal");
const paymentForm = document.getElementById("payment-form");
const orderConfirmation = document.getElementById("order-confirmation");
const customerNameEl = document.getElementById("customer-name");

// Function to add items to the cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateOrder();
}

// Function to update the order UI
function updateOrder() {
    orderItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.classList.add("order-item");
        li.innerHTML = `
            ${item.name} x${item.quantity} <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">remove</button>
        `;
        orderItemsEl.appendChild(li);
    });

    totalPriceEl.textContent = total.toFixed(2);
    orderSection.classList.toggle("hidden", cart.length === 0); // Hide if cart is empty

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            cart.splice(index, 1);
            updateOrder();
        });
    });
}

// Show payment modal when "Complete Order" is clicked
completeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty! Add items before proceeding.");
        return;
    }
    paymentModal.style.display = "flex";
});

// Close modal when "Cancel" is clicked
closeModalBtn.addEventListener("click", () => {
    paymentModal.style.display = "none";
});

// Handle payment form submission
paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("card-name").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();

    if (!name || !cardNumber || !cvv) {
        alert("Please fill in all card details.");
        return;
    }

    // Update confirmation message
    customerNameEl.textContent = name;

    // Reset everything
    paymentModal.style.display = "none";
    orderConfirmation.style.display = "block";
    cart = [];
    updateOrder();
    orderSection.classList.add("hidden");
    paymentForm.reset();
});
