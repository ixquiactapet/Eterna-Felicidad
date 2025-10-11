// script-logica.js - LÓGICA PRINCIPAL

// Variables globales
let currentCategory = 'all';
let currentModalProduct = null;

// Objeto principal que combina todos los datos
const productsData = {
    mesas: productsMesas || [],
    centros: productsCentros || [],
    ramos: productsRamos || [],
    tarjetas: productsTarjetas || []
};

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que todos los datos estén cargados
    if (typeof productsMesas === 'undefined' || 
        typeof productsCentros === 'undefined' ||
        typeof productsRamos === 'undefined' ||
        typeof productsTarjetas === 'undefined') {
        console.error('Error: No se cargaron todos los archivos de datos');
        return;
    }
    
    initializeNavigation();
    initializeCategoryCards();
    initializeModal();
    console.log('✅ Todos los datos cargados correctamente');
});

// Navegación entre páginas
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const homePage = document.getElementById('home-page');
    const catalogPages = document.getElementById('catalog-pages');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            
            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar página correspondiente
            if (category === 'all') {
                homePage.classList.add('active');
                catalogPages.innerHTML = '';
                currentCategory = 'all';
            } else {
                homePage.classList.remove('active');
                showCategoryCatalog(category);
                currentCategory = category;
            }
        });
    });
}

// Inicializar tarjetas de categoría
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const homePage = document.getElementById('home-page');
            const navLinks = document.querySelectorAll('.nav-link');
            
            // Actualizar navegación
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`[data-category="${category}"]`).classList.add('active');
            
            // Mostrar catálogo
            homePage.classList.remove('active');
            showCategoryCatalog(category);
            currentCategory = category;
        });
    });
}

// Mostrar catálogo de categoría
function showCategoryCatalog(category) {
    const catalogPages = document.getElementById('catalog-pages');
    const products = productsData[category] || [];
    
    // Verificar si hay productos
    if (products.length === 0) {
        catalogPages.innerHTML = `
            <div class="catalog-page active">
                <h2 class="catalog-title">${getCategoryName(category)}</h2>
                <p class="no-products">No hay productos disponibles en esta categoría.</p>
            </div>
        `;
        return;
    }
    
    const catalogHTML = `
        <div class="catalog-page active">
            <h2 class="catalog-title">${getCategoryName(category)}</h2>
            <div class="products-grid">
                ${products.map(product => `
                    <div class="product-card" onclick="openProductModal(${product.id}, '${category}')">
                        <div class="product-image">
                            <img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+No+Disponible'">
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <div class="product-price">Q${product.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    catalogPages.innerHTML = catalogHTML;
}

// Obtener nombre de categoría
function getCategoryName(category) {
    const names = {
        mesas: 'Alquiler de Mesas y Sillas',
        centros: 'Centros de Mesa',
        ramos: 'Ramos de Flores y Regalos',
        tarjetas: 'Tarjetas de Invitación'
    };
    return names[category] || category;
}

// Inicializar modal
function initializeModal() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close-modal');

    // Cerrar modal al hacer clic en X
    closeBtn.addEventListener('click', closeModal);

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Abrir modal de producto
function openProductModal(productId, category) {
    const products = productsData[category];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    currentModalProduct = product;
    
    const modalContent = document.getElementById('modal-product-content');
    modalContent.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-images">
                <div class="modal-main-image">
                    <img src="${product.images[0]}" alt="${product.name}" id="modal-main-img" onerror="this.src='https://via.placeholder.com/400x300?text=Imagen+No+Disponible'">
                </div>
                <div class="modal-thumbnails">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}')">
                            <img src="${img}" alt="Thumbnail ${index + 1}" onerror="this.src='https://via.placeholder.com/60x60?text=Imagen'">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-product-details">
                <h2>${product.name}</h2>
                <p class="modal-product-description">${product.description}</p>
                
                <div class="modal-colors">
                    <h4>Colores Disponibles:</h4>
                    <div class="color-options">
                        ${product.colors.map(color => `
                            <div class="color-option" style="background-color: ${color};" title="Color ${color}"></div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="modal-price">Q${product.price}</div>
                
                <button class="btn-whatsapp-order" onclick="orderViaWhatsApp()">
                    💬 Pedir por WhatsApp
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('product-modal').style.display = 'block';
}

// Cambiar imagen principal en modal
function changeMainImage(imageSrc) {
    const mainImg = document.getElementById('modal-main-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    mainImg.src = imageSrc;
    
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
        if (thumb.querySelector('img').src.includes(imageSrc)) {
            thumb.classList.add('active');
        }
    });
}

// Cerrar modal
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
    currentModalProduct = null;
}

// Ordenar por WhatsApp
function orderViaWhatsApp() {
    if (!currentModalProduct) return;
    
    const product = currentModalProduct;
    const message = `🛍️ *SOLICITUD DE PEDIDO* 

*Producto:* ${product.name}
*Precio:* Q${product.price}
*Categoría:* ${getCategoryName(product.category)}

¡Hola! Estoy interesado/a en este producto y me gustaría realizar un pedido.

*Información del producto:*
${product.description}

Por favor confirmen disponibilidad y procedimiento de pago.

¡Gracias!`;

    const phone = "50241995025";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    closeModal();
}

// WhatsApp Float Button
document.querySelector('.whatsapp-float').addEventListener('click', function(e) {
    if (currentCategory !== 'all') {
        e.preventDefault();
        const categoryName = getCategoryName(currentCategory);
        const message = `¡Hola! Estoy viendo su catálogo de ${categoryName} y me gustaría hacer una consulta general.`;
        const phone = "50241995025";
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }
});