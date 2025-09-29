// Datos de productos CORREGIDOS
const products = [
    {
        id: 1,
        name: "Ramo de Rosa Amarillas",
        description: "Hermosa ramo de rosa amarillas preservada que mantendrá su belleza por años. Perfecta para expresar amor eterno.",
        price: 150.00,
        category: "bouquet",
        color: "yellow",
        tiktokVideoId: "7554031113434303800",
        tiktokUsername: "eterna.felicidad"
    },
    {
        id: 2,
        name: "Ramo de tulipanes amarillas",
        description: "Elegante ramo de Tulipanes amarilas preservadas. Ideal para celebraciones especiales.",
        price: 45.00,
        category: "bouquet",
        color: "yellow",
        tiktokVideoId: "7553838665793817868",
        tiktokUsername: "eterna.felicidad"
    },
    {
        id: 3,
        name: "Ramo con 7 Roasa Amarillas",
        description: "Ramo con 7 rosas amarillas preservadas. Presentación de lujo para ocasiones especiales.",
        price: 100.00,
        category: "bouquet",
        color: "yellow",
        tiktokVideoId: "7553411287208742200",
        tiktokUsername: "eterna.felicidad"
    },
    {
        id: 4,
        name: "Caja de Rosas Amarillas y Chocolate",
        description: "Caja de rosas amarillas preservada con opción de personalización. Agrega un mensaje especial para tu ser querido.",
        price: 260.00,
        category: "box",
        color: "yellow",
        tiktokVideoId: "7552616224425921803",
        tiktokUsername: "eterna.felicidad"
    },
    {
        id: 5,
        name: "Caja de Bocadillos y dulces",
        description: "Caja de sorpesa para un dia especial. Presentación de lujo para ocasiones especiales.",
        price: 100.00,
        category: "custom",
        color: "blue",
        tiktokVideoId: "7551265983592189190",
        tiktokUsername: "eterna.felicidad"
    },
    {
        id: 6,
        name: "Ramo Mixto de Rosas",
        description: "Hermoso ramo con rosas de diferentes colores preservadas. Perfecto para cualquier ocasión.",
        price: 250.00,
        category: "bouquet",
        color: "pink",
        tiktokVideoId: "7528150894630751494",
        tiktokUsername: "eterna.felicidad"
    }
];

// Función para TikTok
function generateTikTokEmbed(videoId, username) {
    return `
        <blockquote class="tiktok-embed" 
            cite="https://www.tiktok.com/@${username}/video/${videoId}" 
            data-video-id="${videoId}" 
            style="max-width: 605px; min-width: 325px;">
            <section>
                <a target="_blank" title="@${username}" 
                   href="https://www.tiktok.com/@${username}?refer=embed">@${username}</a>
            </section>
        </blockquote>
    `;
}

// Función para mostrar productos
function displayProducts(productsToShow) {
    const catalog = document.getElementById('product-catalog');
    catalog.innerHTML = '';
    
    if (productsToShow.length === 0) {
        catalog.innerHTML = '<p class="no-products">No se encontraron productos que coincidan con los filtros seleccionados.</p>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="tiktok-embed-container">
                ${generateTikTokEmbed(product.tiktokVideoId, product.tiktokUsername)}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">Q${product.price.toFixed(2)}</div>
                <button class="btn" onclick="contactAboutProduct('${product.name}')">Consultar Disponibilidad</button>
            </div>
        `;
        catalog.appendChild(productCard);
    });
    
    // Recargar los embeds de TikTok
    if (window.tiktokEmbed && typeof window.tiktokEmbed.load === 'function') {
        window.tiktokEmbed.load();
    }
}

// Función para filtrar productos
function filterProducts() {
    const categoryFilter = document.getElementById('category').value;
    const colorFilter = document.getElementById('color').value;
    const priceFilter = document.getElementById('price').value;
    
    const filteredProducts = products.filter(product => {
        // Filtrar por categoría
        if (categoryFilter !== 'all' && product.category !== categoryFilter) {
            return false;
        }
        
        // Filtrar por color
        if (colorFilter !== 'all' && product.color !== colorFilter) {
            return false;
        }
        
        // Filtrar por precio
        if (priceFilter !== 'all') {
            if (priceFilter === 'low' && product.price >= 400) {
                return false;
            } else if (priceFilter === 'medium' && (product.price < 400 || product.price > 800)) {
                return false;
            } else if (priceFilter === 'high' && product.price <= 800) {
                return false;
            }
        }
        
        return true;
    });
    
    displayProducts(filteredProducts);
}

// Función para contactar sobre un producto
function contactAboutProduct(productName) {
    alert(`¡Gracias por tu interés en ${productName}! Por favor contáctanos al +502 4199 5025 para consultar disponibilidad y realizar tu pedido.`);
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    
    // Agregar event listeners a los filtros
    document.getElementById('category').addEventListener('change', filterProducts);
    document.getElementById('color').addEventListener('change', filterProducts);
    document.getElementById('price').addEventListener('change', filterProducts);
});
