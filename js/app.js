/**
 * Lógica interactiva para la web de AMY Disfraces y Accesorios
 * - Catálogo reactivo con selector de tallas
 * - Actualización dinámica de precios según la talla seleccionada
 * - Indicadores visuales de stock y disponibilidad en tiempo real
 * - Integración con WhatsApp directa y contextual
 * - Buscador en vivo y filtros avanzados
 * - Modal de vista rápida y ficha de medidas
 */

(function () {
  // Estado global de la aplicación
  const state = {
    selectedCategory: "all",
    selectedAudience: "all",
    onlyInStock: false,
    searchQuery: "",
    // Guarda el índice de variante seleccionada por producto { [productId]: variantIndex }
    selectedVariants: {},
    modalProduct: null,
    modalVariantIndex: 0
  };

  // Inicializar variantes por defecto (la primera variante de cada producto)
  CATALOG_PRODUCTS.forEach(product => {
    state.selectedVariants[product.id] = 0;
  });

  // Elementos DOM
  const gridContainer = document.getElementById("catalog-grid");
  const searchInput = document.getElementById("catalog-search");
  const headerSearchInput = document.getElementById("header-search");
  const categoryPillsContainer = document.getElementById("category-pills");
  const audienceFilters = document.querySelectorAll("[data-audience-filter]");
  const stockToggle = document.getElementById("stock-toggle");
  const productCountEl = document.getElementById("product-count");

  // Modal DOM
  const modal = document.getElementById("product-modal");
  const modalBackdrop = document.getElementById("modal-backdrop");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalImage = document.getElementById("modal-image");
  const modalBadge = document.getElementById("modal-badge");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalDescription = document.getElementById("modal-description");
  const modalIncludes = document.getElementById("modal-includes");
  const modalVariantsContainer = document.getElementById("modal-variants");
  const modalPrice = document.getElementById("modal-price");
  const modalRentPrice = document.getElementById("modal-rent-price");
  const modalStockBadge = document.getElementById("modal-stock-badge");
  const modalWhatsappBtn = document.getElementById("modal-whatsapp-btn");

  /**
   * Genera el enlace de WhatsApp con mensaje personalizado
   */
  function createWhatsAppUrl(product, variant) {
    const isAvailable = variant.status !== "out";
    let message = `¡Hola AMY Disfraces! 👋\nMe interesa consultar sobre:\n👗 *${product.name}*\n📏 *Talla:* ${variant.size}\n💰 *Precio Venta:* $${variant.priceSale} MXN`;
    
    if (variant.priceRent) {
      message += `\n🎭 *Opción Renta:* $${variant.priceRent} MXN`;
    }
    
    if (!isAvailable) {
      message += `\n⚠️ (Veo que está agotado, ¿se puede confeccionar sobre pedido o para qué fecha llega?)`;
    } else {
      message += `\n¿Tienen entrega inmediata o puedo apartarlo para mi evento?`;
    }

    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Renderiza el badge de stock
   */
  function getStockBadgeHtml(variant) {
    if (variant.status === "available") {
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Disponible (${variant.stock} en stock)
        </span>
      `;
    } else if (variant.status === "low") {
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          ¡Últimas ${variant.stock} piezas!
        </span>
      `;
    } else {
      return `
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span class="w-2 h-2 rounded-full bg-rose-500"></span>
          Agotado (Sobre pedido)
        </span>
      `;
    }
  }

  /**
   * Renderiza las tarjetas del catálogo
   */
  function renderCatalog() {
    if (!gridContainer) return;

    // Filtrar productos
    const query = state.searchQuery.toLowerCase().trim();
    const filtered = CATALOG_PRODUCTS.filter(product => {
      // Filtro de categoría
      if (state.selectedCategory !== "all" && product.category !== state.selectedCategory) {
        return false;
      }
      // Filtro de público
      if (state.selectedAudience !== "all") {
        if (state.selectedAudience === "infantil" && product.audience === "adulto") return false;
        if (state.selectedAudience === "adulto" && product.audience === "infantil") return false;
      }
      // Filtro de solo disponibles
      if (state.onlyInStock) {
        const hasAvailable = product.variants.some(v => v.status !== "out");
        if (!hasAvailable) return false;
      }
      // Filtro de texto
      if (query) {
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchInc = product.includes.toLowerCase().includes(query);
        const matchCat = product.category.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchInc && !matchCat) return false;
      }

      return true;
    });

    // Actualizar contador
    if (productCountEl) {
      productCountEl.textContent = `${filtered.length} disfraz${filtered.length === 1 ? "" : "es"} encontrado${filtered.length === 1 ? "" : "s"}`;
    }

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-full py-16 text-center bg-white rounded-2xl p-8 border border-surface-container shadow-sm">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-[32px]">search_off</span>
          </div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface mb-2">No encontramos disfraces con esos filtros</h3>
          <p class="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mb-6">
            Intenta cambiar los términos de búsqueda o selecciona otra categoría. ¡Recuerda que también hacemos diseños personalizados por WhatsApp!
          </p>
          <button id="reset-filters-btn" class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md hover:bg-primary-container transition-all">
            <span class="material-symbols-outlined text-[18px]">restart_alt</span>
            <span>Restablecer Filtros</span>
          </button>
        </div>
      `;

      const resetBtn = document.getElementById("reset-filters-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          state.selectedCategory = "all";
          state.selectedAudience = "all";
          state.onlyInStock = false;
          state.searchQuery = "";
          if (searchInput) searchInput.value = "";
          if (headerSearchInput) headerSearchInput.value = "";
          if (stockToggle) stockToggle.checked = false;
          updateFilterButtonsUI();
          renderCatalog();
        });
      }
      return;
    }

    gridContainer.innerHTML = filtered.map(product => {
      const selectedIndex = state.selectedVariants[product.id] || 0;
      const currentVariant = product.variants[selectedIndex] || product.variants[0];
      const waUrl = createWhatsAppUrl(product, currentVariant);

      // Render de botones de tallas
      const sizePillsHtml = product.variants.map((variant, idx) => {
        const isSelected = idx === selectedIndex;
        const isOut = variant.status === "out";

        let btnClasses = isSelected
          ? "bg-primary text-white shadow-sm ring-2 ring-primary/40 font-semibold"
          : isOut
          ? "bg-gray-100 text-gray-400 line-through hover:bg-gray-200"
          : "bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary";

        return `
          <button
            type="button"
            class="size-pill text-[11px] px-2.5 py-1 rounded-lg transition-all duration-200 ${btnClasses}"
            data-product-id="${product.id}"
            data-variant-idx="${idx}"
            title="${variant.size} - $${variant.priceSale} MXN (${isOut ? 'Agotado' : variant.stock + ' disp.'})"
          >
            ${variant.label}
          </button>
        `;
      }).join("");

      // Badges
      let badgeBg = "bg-primary text-white";
      if (product.badgeColor === "secondary") badgeBg = "bg-secondary text-white";
      if (product.badgeColor === "tertiary") badgeBg = "bg-tertiary text-white";

      return `
        <div class="product-card group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-product-id="${product.id}">
          <!-- Imagen y etiquetas -->
          <div class="relative w-full aspect-square bg-slate-100 overflow-hidden cursor-pointer" onclick="window.amyApp.openQuickView('${product.id}')">
            <img 
              src="${product.image}" 
              alt="${product.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            
            <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              <span class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm ${badgeBg}">
                ${product.badge}
              </span>
              <span class="text-[10px] font-medium bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-0.5 rounded-full shadow-sm capitalize">
                ${product.season}
              </span>
            </div>

            <button 
              type="button" 
              onclick="event.stopPropagation(); window.amyApp.openQuickView('${product.id}')" 
              class="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full shadow-md backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              title="Vista rápida"
            >
              <span class="material-symbols-outlined text-[20px] block">visibility</span>
            </button>
          </div>

          <!-- Contenido de la tarjeta -->
          <div class="p-5 flex flex-col flex-1 justify-between gap-4">
            <div>
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-[11px] uppercase tracking-wider font-semibold text-primary/80">
                  ${getCategoryLabel(product.category)}
                </span>
                <span class="text-[11px] font-medium text-slate-500 capitalize">
                  ${product.audience === "ambos" ? "Niños & Adultos" : product.audience}
                </span>
              </div>

              <h3 
                class="font-headline-sm text-[18px] leading-snug font-bold text-slate-900 group-hover:text-primary transition-colors cursor-pointer" 
                onclick="window.amyApp.openQuickView('${product.id}')"
              >
                ${product.name}
              </h3>

              <p class="text-[13px] text-slate-500 mt-1 line-clamp-2">
                ${product.includes}
              </p>

              <!-- SELECTOR DE TALLAS CON PRECIOS Y STOCK -->
              <div class="mt-3.5 pt-3 border-t border-slate-100">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-[11px] font-bold uppercase tracking-wide text-slate-500">Selecciona Talla:</span>
                  <span class="text-[11px] text-primary font-semibold" id="size-label-${product.id}">
                    ${currentVariant.size}
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-1.5" id="size-container-${product.id}">
                  ${sizePillsHtml}
                </div>
              </div>
            </div>

            <!-- Precios y Botón de WhatsApp -->
            <div class="pt-3 border-t border-slate-100 flex flex-col gap-3">
              <div class="flex items-end justify-between">
                <div>
                  <span class="text-[11px] text-slate-500 block font-medium">Precio Venta</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-[22px] font-bold text-primary font-headline-lg tracking-tight" id="price-sale-${product.id}">
                      $${currentVariant.priceSale}
                    </span>
                    <span class="text-[12px] font-semibold text-slate-500">MXN</span>
                  </div>
                  ${currentVariant.priceRent ? `
                    <span class="text-[11px] text-secondary font-medium block" id="price-rent-${product.id}">
                      Renta: $${currentVariant.priceRent} MXN
                    </span>
                  ` : ''}
                </div>

                <div class="text-right" id="stock-container-${product.id}">
                  ${getStockBadgeHtml(currentVariant)}
                </div>
              </div>

              <a 
                href="${waUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                id="wa-btn-${product.id}"
                class="w-full inline-flex items-center justify-center gap-2 bg-secondary hover:bg-on-secondary-container text-white font-label-md py-2.5 px-4 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 group/btn"
              >
                <span class="material-symbols-outlined text-[18px]">chat</span>
                <span>Pedir esta Talla por WhatsApp</span>
                <span class="material-symbols-outlined text-[16px] group-hover/btn:translate-x-0.5 transition-transform">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Agregar listeners a los botones de tallas
    const sizePills = gridContainer.querySelectorAll(".size-pill");
    sizePills.forEach(pill => {
      pill.addEventListener("click", e => {
        e.stopPropagation();
        const productId = pill.getAttribute("data-product-id");
        const variantIdx = parseInt(pill.getAttribute("data-variant-idx"), 10);
        updateProductSelectedVariant(productId, variantIdx);
      });
    });
  }

  /**
   * Actualiza la variante activa para un producto específico
   */
  function updateProductSelectedVariant(productId, variantIdx) {
    state.selectedVariants[productId] = variantIdx;
    const product = CATALOG_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const variant = product.variants[variantIdx];
    if (!variant) return;

    // Actualizar precio de venta
    const priceSaleEl = document.getElementById(`price-sale-${productId}`);
    if (priceSaleEl) {
      priceSaleEl.textContent = `$${variant.priceSale}`;
    }

    // Actualizar precio de renta si existe
    const priceRentEl = document.getElementById(`price-rent-${productId}`);
    if (priceRentEl) {
      if (variant.priceRent) {
        priceRentEl.textContent = `Renta: $${variant.priceRent} MXN`;
        priceRentEl.style.display = "block";
      } else {
        priceRentEl.style.display = "none";
      }
    }

    // Actualizar etiqueta de talla seleccionada
    const sizeLabelEl = document.getElementById(`size-label-${productId}`);
    if (sizeLabelEl) {
      sizeLabelEl.textContent = variant.size;
    }

    // Actualizar stock badge
    const stockContainer = document.getElementById(`stock-container-${productId}`);
    if (stockContainer) {
      stockContainer.innerHTML = getStockBadgeHtml(variant);
    }

    // Actualizar botón de WhatsApp
    const waBtn = document.getElementById(`wa-btn-${productId}`);
    if (waBtn) {
      waBtn.href = createWhatsAppUrl(product, variant);
    }

    // Actualizar estilos activos de los botones de talla
    const sizeContainer = document.getElementById(`size-container-${productId}`);
    if (sizeContainer) {
      const pills = sizeContainer.querySelectorAll(".size-pill");
      pills.forEach((p, idx) => {
        const isSelected = idx === variantIdx;
        const v = product.variants[idx];
        const isOut = v.status === "out";

        p.className = `size-pill text-[11px] px-2.5 py-1 rounded-lg transition-all duration-200 ${
          isSelected
            ? "bg-primary text-white shadow-sm ring-2 ring-primary/40 font-semibold"
            : isOut
            ? "bg-gray-100 text-gray-400 line-through hover:bg-gray-200"
            : "bg-surface-container-low text-on-surface hover:bg-surface-container hover:text-primary"
        }`;
      });
    }
  }

  /**
   * Abre el Modal de Detalle / Ficha Rápida
   */
  function openQuickView(productId) {
    const product = CATALOG_PRODUCTS.find(p => p.id === productId);
    if (!product || !modal) return;

    state.modalProduct = product;
    state.modalVariantIndex = state.selectedVariants[productId] || 0;

    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalBadge.textContent = product.badge;
    modalTitle.textContent = product.name;
    modalCategory.textContent = `${getCategoryLabel(product.category)} • ${product.season.toUpperCase()}`;
    modalDescription.textContent = product.description;
    modalIncludes.textContent = product.includes;

    renderModalVariants();
    updateModalPricing();

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function renderModalVariants() {
    const product = state.modalProduct;
    if (!product || !modalVariantsContainer) return;

    modalVariantsContainer.innerHTML = product.variants.map((v, idx) => {
      const isSelected = idx === state.modalVariantIndex;
      const isOut = v.status === "out";

      const activeClass = isSelected
        ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
        : isOut
        ? "border-gray-200 bg-gray-50 text-gray-400 opacity-60"
        : "border-slate-200 hover:border-primary/50 text-slate-700";

      return `
        <button
          type="button"
          class="modal-size-btn flex items-center justify-between p-3 rounded-xl border transition-all text-left ${activeClass}"
          data-idx="${idx}"
        >
          <div>
            <span class="block text-[13px] font-semibold">${v.size}</span>
            <span class="block text-[11px] ${isOut ? 'text-rose-500' : 'text-slate-500'}">
              ${isOut ? 'Agotado' : (v.stock <= 2 ? '¡Pocas piezas!' : 'Disponible')}
            </span>
          </div>
          <div class="text-right">
            <span class="text-[14px] font-bold text-primary">$${v.priceSale}</span>
            <span class="text-[10px] text-slate-500 block">Venta</span>
          </div>
        </button>
      `;
    }).join("");

    const buttons = modalVariantsContainer.querySelectorAll(".modal-size-btn");
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.getAttribute("data-idx"), 10);
        state.modalVariantIndex = idx;
        // sincronizar con la tarjeta
        state.selectedVariants[product.id] = idx;
        renderModalVariants();
        updateModalPricing();
        updateProductSelectedVariant(product.id, idx);
      });
    });
  }

  function updateModalPricing() {
    const product = state.modalProduct;
    const variant = product.variants[state.modalVariantIndex];
    if (!product || !variant) return;

    modalPrice.textContent = `$${variant.priceSale} MXN`;
    if (modalRentPrice) {
      if (variant.priceRent) {
        modalRentPrice.textContent = `Opción de renta: $${variant.priceRent} MXN (+ depósito en garantía)`;
        modalRentPrice.style.display = "block";
      } else {
        modalRentPrice.style.display = "none";
      }
    }

    modalStockBadge.innerHTML = getStockBadgeHtml(variant);
    modalWhatsappBtn.href = createWhatsAppUrl(product, variant);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function getCategoryLabel(category) {
    const map = {
      fantasia: "Fantasía & Princesas",
      superheroes: "Superhéroes & Cómics",
      halloween: "Halloween & Terror",
      navidad: "Navidad & Reyes",
      escolar: "Festivales Escolares",
      carnaval: "Carnaval & Fiestas",
      accesorios: "Accesorios & Pelucas"
    };
    return map[category] || category;
  }

  function updateFilterButtonsUI() {
    if (!categoryPillsContainer) return;
    const buttons = categoryPillsContainer.querySelectorAll(".category-pill");
    buttons.forEach(b => {
      const cat = b.getAttribute("data-category");
      if (cat === state.selectedCategory) {
        b.className = "category-pill shrink-0 px-4 py-2 rounded-full font-label-md text-sm font-semibold bg-primary text-white shadow-sm transition-all";
      } else {
        b.className = "category-pill shrink-0 px-4 py-2 rounded-full font-label-md text-sm text-slate-600 bg-surface-container hover:bg-surface-container-high transition-all";
      }
    });

    audienceFilters.forEach(b => {
      const aud = b.getAttribute("data-audience-filter");
      if (aud === state.selectedAudience) {
        b.className = "px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary text-white shadow-sm transition-all";
      } else {
        b.className = "px-3.5 py-1.5 rounded-full text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all";
      }
    });
  }

  // Event Listeners para Filtros y Búsqueda
  if (categoryPillsContainer) {
    categoryPillsContainer.addEventListener("click", e => {
      const btn = e.target.closest(".category-pill");
      if (!btn) return;
      state.selectedCategory = btn.getAttribute("data-category");
      updateFilterButtonsUI();
      renderCatalog();
    });
  }

  audienceFilters.forEach(btn => {
    btn.addEventListener("click", () => {
      state.selectedAudience = btn.getAttribute("data-audience-filter");
      updateFilterButtonsUI();
      renderCatalog();
    });
  });

  if (stockToggle) {
    stockToggle.addEventListener("change", e => {
      state.onlyInStock = e.target.checked;
      renderCatalog();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", e => {
      state.searchQuery = e.target.value;
      renderCatalog();
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener("input", e => {
      state.searchQuery = e.target.value;
      if (searchInput) searchInput.value = e.target.value;
      // Scroll hacia el catálogo si no está a la vista
      const catalogEl = document.getElementById("catalogo");
      if (catalogEl && window.scrollY < catalogEl.offsetTop - 200) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
      renderCatalog();
    });
  }

  // Modal event listeners
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });

  // Exponer métodos globales para callbacks HTML
  window.amyApp = {
    openQuickView,
    filterByCategory: (cat) => {
      state.selectedCategory = cat;
      updateFilterButtonsUI();
      renderCatalog();
      const catSection = document.getElementById("catalogo");
      if (catSection) catSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Render inicial al cargar
  document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();
    updateFilterButtonsUI();
  });

  // Ejecutar de inmediato por si el DOM ya cargó
  if (document.readyState === "interactive" || document.readyState === "complete") {
    renderCatalog();
    updateFilterButtonsUI();
  }
})();
