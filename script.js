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

document.addEventListener("DOMContentLoaded", () => {
    paymentModal.style.display = "none"; // Ensure modal is hidden on load
});

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateOrder();
    });
});

function updateOrder() {
    orderItemsEl.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const li = document.createElement("li");
        li.classList.add("order-item");
        li.innerHTML = `
            ${item.name} x${item.quantity} <span>$${item.price * item.quantity}</span>
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
    paymentModal.style.display = "flex";
});

// Close modal when "Cancel" is clicked
closeModalBtn.addEventListener("click", () => {
    paymentModal.style.display = "none";
});

// Handle form submission and show confirmation message
paymentForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent page reload

    // Get form values
    const name = document.getElementById("card-name").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const cvv = document.getElementById("card-cvv").value.trim();

    if (!name || !cardNumber || !cvv) {
        alert("Please fill in all card details.");
        return;
    }

    // Update the confirmation message with the customer's name
    customerNameEl.textContent = name;

    // Hide order section & modal, show confirmation message
    paymentModal.style.display = "none";
    orderConfirmation.style.display = "block"; // Show success message

    // Clear cart, update UI, and hide order section immediately
    cart = [];
    updateOrder();
    orderSection.classList.add("hidden"); // ✅ Hides order section immediately
    paymentForm.reset();
});
