// Глобальная переменная для хранения корзины
let cart = [];

//функция для подсчета общей суммы
const calculateTotal = () => cart.reduce((total, item) => total + item.price, 0);

//функция для перерисовки корзины
const renderCart = () => {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    // Очищаем текущий список корзины
    if (cartItems) cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<li>Cart is empty</li>';
        if (totalPrice) totalPrice.textContent = 'Total: 0 ₽';
        return;
    }
    
    // Перебираем товары в корзине и отображаем их
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - ${item.price} ₽
            <button class="remove-from-cart" data-index="${index}">Remove</button>
        `;
        if (cartItems) cartItems.appendChild(li);
    });
    
    // Обновляем общую сумму
    const total = calculateTotal();
    if (totalPrice) totalPrice.textContent = `Total: ${total} ₽`;
    
    // Добавляем обработчики для кнопок удаления
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            removeFromCart(index);
        });
    });
};

//функция для удаления товара из корзины
const removeFromCart = (index) => {
    cart.splice(index, 1);
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart));  // localStorage: сохраняем корзину
};

//функция для добавления товара в корзину
const addToCart = (productName, productPrice) => {
    cart.push({
        name: productName,
        price: productPrice
    });
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart));  // localStorage: сохраняем корзину
};

//функция для очистки корзины
const clearCart = () => {
    cart = [];
    renderCart();
    localStorage.setItem('cart', JSON.stringify(cart));  // localStorage: сохраняем корзину
};

//функция для оплаты
const payCart = () => {
    if (cart.length === 0) {
        alert('Cart is empty! Please add items before checkout.');
    } else {
        alert('Payment successful! Thank you for your purchase!');
        clearCart();
    }
};

//функция для обработки добавления товара
const handleAddToCart = (button) => {
    const productCard = button.closest('.product-card');
    
    // Получаем данные о товаре из data-атрибутов
    let productName = productCard.dataset.name;
    let productPrice = Number(productCard.dataset.price);
    
    addToCart(productName, productPrice);
};

//функция для фильтрации товаров
const filterItems = () => {
    const filterSelect = document.getElementById('filter');
    if (!filterSelect) return;
    
    const selectedCategory = filterSelect.value;
    const items = document.querySelectorAll('.item');
    
    items.forEach(item => {
        const itemCategories = item.dataset.category;
        
        if (selectedCategory === 'all') {
            item.style.display = 'block';
        } else if (itemCategories && itemCategories.includes(selectedCategory)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // localStorage: пытаемся загрузить сохранённую корзину
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    // localStorage: конец загрузки
    // новые изменения для изменений
    // Настройка фильтра
    const filterSelect = document.getElementById('filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterItems);
        filterItems(); // Применяем фильтр "All" при загрузке
    }
    
    // Находим все кнопки "Добавить в корзину" и добавляем обработчики
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', () => handleAddToCart(button));
    });
    
    // Настройка кнопки "Очистить корзину"
    const clearCartButton = document.getElementById('clearCart');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }
    
    // Настройка кнопки "Оплатить"
    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.addEventListener('click', payCart);
    }
    
    // Инициализируем корзину (отображаем загруженные данные)
    renderCart();
});