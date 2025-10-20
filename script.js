const suppliers = [
  {
    id: 'outback-grocer',
    name: 'Outback Grocer',
    location: 'Alice Springs, NT',
    price: '$',
    averageBasket: 24.5,
    distance: 12,
    surplus: true,
    delivery: true,
    co2: 8,
    freshness: 8,
    description: 'Family-run grocer partnering with remote community hubs for surplus distribution.',
    items: [
      {
        id: 'outback-hamper',
        name: 'Remote Essentials Hamper',
        price: 24.5,
        servings: 4,
        savings: 12,
        co2Saved: 2.1,
        meals: 4,
        notes: 'Staples rescued from metro surplus: oats, long-life milk, bush herbs, seasonal produce.'
      }
    ]
  },
  {
    id: 'green-market',
    name: 'Green Market',
    location: 'Broken Hill, NSW',
    price: '$$',
    averageBasket: 32.0,
    distance: 5,
    surplus: false,
    delivery: true,
    co2: 6,
    freshness: 9,
    description: 'Hydroponic growers delivering weekly produce boxes using solar-powered vans.',
    items: [
      {
        id: 'green-harvest',
        name: 'Hydro Harvest Pack',
        price: 32,
        servings: 5,
        savings: 8,
        co2Saved: 1.3,
        meals: 5,
        notes: 'Leafy greens, tomatoes, and herbs grown with recycled water.'
      }
    ]
  },
  {
    id: 'remote-foods',
    name: 'Remote Foods',
    location: 'Katherine, NT',
    price: '$',
    averageBasket: 22.0,
    distance: 30,
    surplus: true,
    delivery: true,
    co2: 5,
    freshness: 7,
    description: 'Community co-op aggregating surplus produce from regional farms.',
    items: [
      {
        id: 'remote-hamper',
        name: 'Community Pantry Box',
        price: 22,
        servings: 3,
        savings: 9,
        co2Saved: 2.5,
        meals: 3,
        notes: 'Tinned beans, root vegetables, fresh bread, and pantry staples.'
      }
    ]
  },
  {
    id: 'bush-bites',
    name: 'Bush Bites Collective',
    location: 'Dubbo, NSW',
    price: '$$',
    averageBasket: 29.5,
    distance: 18,
    surplus: true,
    delivery: true,
    co2: 7,
    freshness: 8,
    description: 'Aboriginal-owned collective sharing culturally significant produce and meals.',
    items: [
      {
        id: 'bush-share',
        name: 'Bush Tucker Share Pack',
        price: 29.5,
        servings: 4,
        savings: 10,
        co2Saved: 1.9,
        meals: 4,
        notes: 'Kangaroo stew, lemon myrtle damper, native greens, and seasonal fruit.'
      }
    ]
  },
  {
    id: 'sunrise-co',
    name: 'Sunrise Co-Op',
    location: 'Longreach, QLD',
    price: '$$$',
    averageBasket: 38.0,
    distance: 22,
    surplus: false,
    delivery: true,
    co2: 9,
    freshness: 9,
    description: 'Solar chilled trucks delivering protein-rich hampers to cattle stations.',
    items: [
      {
        id: 'sunrise-protein',
        name: 'Protein Boost Crate',
        price: 38,
        servings: 6,
        savings: 5,
        co2Saved: 0.8,
        meals: 6,
        notes: 'Free-range eggs, legumes, yoghurt, and seasonal fruit.'
      }
    ]
  }
];

const trackingStages = [
  {
    id: 'preparing',
    title: 'Preparing hamper',
    detail: 'Volunteers are sorting surplus produce and packing your box.'
  },
  {
    id: 'driver',
    title: 'Driver assigned',
    detail: 'Jade (EV van) is collecting items from the supplier hub.'
  },
  {
    id: 'enroute',
    title: 'On the way',
    detail: 'Shared route to your community hub. 2.4 km remaining.'
  },
  {
    id: 'delivered',
    title: 'Delivered',
    detail: 'Hamper left in the community cool locker. Enjoy!'
  }
];

const state = {
  activeView: 'home-view',
  cart: [],
  trackingTimer: null,
  trackingIndex: 0,
  orderPlaced: false,
  totals: {
    savings: 0,
    co2Saved: 0,
    meals: 0
  }
};

const elements = {};

function init() {
  cacheElements();
  bindNavigation();
  bindFilters();
  bindCheckout();
  bindTrackingControls();
  renderSupplierFilters();
  renderSuppliers(suppliers);
  populateComparisonSelectors();
  updateComparison();
  updateCartUI();
  renderTrackingSteps();
  updateTrackingUI();
  switchView(state.activeView);
}

document.addEventListener('DOMContentLoaded', init);

function cacheElements() {
  elements.app = document.getElementById('app');
  elements.navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  elements.views = Array.from(document.querySelectorAll('.view'));

  elements.searchInput = document.getElementById('search-input');
  elements.priceFilter = document.getElementById('price-filter');
  elements.distanceFilter = document.getElementById('distance-filter');
  elements.distanceOutput = document.getElementById('distance-output');
  elements.surplusToggle = document.getElementById('surplus-toggle');
  elements.deliveryToggle = document.getElementById('delivery-toggle');
  elements.supplierGrid = document.getElementById('supplier-grid');

  elements.compareA = document.getElementById('compare-a');
  elements.compareB = document.getElementById('compare-b');
  elements.compareNameA = document.getElementById('compare-name-a');
  elements.compareNameB = document.getElementById('compare-name-b');
  elements.compareMetrics = {
    priceA: document.querySelector('[data-metric="price-a"]'),
    priceB: document.querySelector('[data-metric="price-b"]'),
    freshnessA: document.querySelector('[data-metric="freshness-a"]'),
    freshnessB: document.querySelector('[data-metric="freshness-b"]'),
    co2A: document.querySelector('[data-metric="co2-a"]'),
    co2B: document.querySelector('[data-metric="co2-b"]'),
    distanceA: document.querySelector('[data-metric="distance-a"]'),
    distanceB: document.querySelector('[data-metric="distance-b"]'),
    surplusA: document.querySelector('[data-metric="surplus-a"]'),
    surplusB: document.querySelector('[data-metric="surplus-b"]')
  };

  elements.cartList = document.getElementById('cart-list');
  elements.cartEmpty = document.getElementById('cart-empty');
  elements.cartTotal = document.getElementById('cart-total');
  elements.placeOrder = document.getElementById('place-order');
  elements.orderStatus = document.getElementById('order-status');
  elements.goToTracking = document.getElementById('go-to-tracking');

  elements.reportSavings = document.getElementById('report-savings');
  elements.reportCo2 = document.getElementById('report-co2');
  elements.reportMeals = document.getElementById('report-meals');

  elements.trackingSteps = document.getElementById('tracking-steps');
  elements.progressIndicator = document.getElementById('progress-indicator');
  elements.resetTracking = document.getElementById('reset-tracking');
}

function bindNavigation() {
  elements.navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      switchView(target);
    });
  });
}

function bindFilters() {
  elements.searchInput.addEventListener('input', handleFilterChange);
  elements.priceFilter.addEventListener('change', handleFilterChange);
  elements.distanceFilter.addEventListener('input', (event) => {
    const value = Number(event.target.value);
    elements.distanceOutput.textContent = `${value} km`;
    handleFilterChange();
  });
  elements.surplusToggle.addEventListener('change', handleFilterChange);
  elements.deliveryToggle.addEventListener('change', handleFilterChange);
}

function bindCheckout() {
  elements.placeOrder.addEventListener('click', handlePlaceOrder);
  elements.goToTracking.addEventListener('click', () => {
    switchView('tracking-view');
  });
}

function bindTrackingControls() {
  elements.resetTracking.addEventListener('click', () => {
    resetTracking();
    startTracking();
  });
}

function switchView(targetId) {
  state.activeView = targetId;
  elements.views.forEach((section) => {
    const isTarget = section.id === targetId;
    section.hidden = !isTarget;
    section.classList.toggle('active', isTarget);
  });

  elements.navButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });

  window.requestAnimationFrame(() => {
    elements.app.focus();
  });

  if (targetId === 'tracking-view' && state.orderPlaced) {
    startTracking();
  }
}

function handleFilterChange() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const price = elements.priceFilter.value;
  const maxDistance = Number(elements.distanceFilter.value);
  const surplusOnly = elements.surplusToggle.checked;
  const deliveryOnly = elements.deliveryToggle.checked;

  const filtered = suppliers.filter((supplier) => {
    const matchesQuery = supplier.name.toLowerCase().includes(query) || supplier.location.toLowerCase().includes(query);
    const matchesPrice = price === 'all' || supplier.price === price;
    const matchesDistance = supplier.distance <= maxDistance;
    const matchesSurplus = !surplusOnly || supplier.surplus;
    const matchesDelivery = !deliveryOnly || supplier.delivery;
    return matchesQuery && matchesPrice && matchesDistance && matchesSurplus && matchesDelivery;
  });

  renderSuppliers(filtered);
}

function renderSupplierFilters() {
  elements.distanceOutput.textContent = `${elements.distanceFilter.value} km`;
}

function renderSuppliers(list) {
  if (!elements.supplierGrid) {
    return;
  }

  if (list.length === 0) {
    elements.supplierGrid.innerHTML = '<p class="empty-state">No suppliers match your filters. Try widening the distance or price band.</p>';
    return;
  }

  const markup = list
    .map((supplier) => {
      const badge = supplier.surplus ? '<span class="badge">Surplus rescue</span>' : '';
      const deliveryText = supplier.delivery ? 'Delivery available' : 'Pickup only';
      const compareLabel = 'Compare supplier';
      const item = supplier.items[0];
      return `
        <article class="supplier-card" data-supplier="${supplier.id}">
          <div class="supplier-header">
            <div>
              <h3 class="supplier-name">${supplier.name}</h3>
              <p class="supplier-location">${supplier.location}</p>
            </div>
            ${badge}
          </div>
          <p>${supplier.description}</p>
          <div class="supplier-meta">
            <span>Price band: ${supplier.price}</span>
            <span>${supplier.distance} km away</span>
            <span>Freshness score: ${supplier.freshness}/10</span>
            <span>Delivery CO2: ${supplier.co2} kg</span>
          </div>
          <div class="hamper-summary">
            <h4>${item.name}</h4>
            <p>${item.notes}</p>
            <p><strong>$${item.price.toFixed(2)}</strong> &middot; Feeds ${item.servings} &middot; Saves $${item.savings.toFixed(2)}</p>
          </div>
          <div class="action-row">
            <button class="primary-btn" data-action="add-cart" data-supplier="${supplier.id}" data-item="${item.id}">Add hamper to cart</button>
            <button class="secondary-btn" data-action="compare" data-supplier="${supplier.id}">${compareLabel}</button>
          </div>
          <p class="supplier-footnote">${deliveryText}</p>
        </article>
      `;
    })
    .join('');

  elements.supplierGrid.innerHTML = markup;

  elements.supplierGrid.querySelectorAll('[data-action="add-cart"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const supplierId = event.currentTarget.dataset.supplier;
      const itemId = event.currentTarget.dataset.item;
      addToCart(supplierId, itemId);
    });
  });

  elements.supplierGrid.querySelectorAll('[data-action="compare"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const supplierId = event.currentTarget.dataset.supplier;
      prepareComparison(supplierId);
    });
  });
}

function addToCart(supplierId, itemId) {
  const supplier = suppliers.find((entry) => entry.id === supplierId);
  const item = supplier?.items.find((entry) => entry.id === itemId);
  if (!supplier || !item) {
    return;
  }

  state.cart.push({
    supplierId,
    itemId,
    supplierName: supplier.name,
    price: item.price,
    servings: item.servings,
    savings: item.savings,
    co2Saved: item.co2Saved,
    meals: item.meals
  });

  updateCartUI();
  switchView('checkout-view');
  elements.orderStatus.textContent = 'Hamper added. Review the details, then place your order.';
}

function updateCartUI() {
  const total = state.cart.reduce((sum, entry) => sum + entry.price, 0);
  if (state.cart.length === 0) {
    elements.cartList.innerHTML = '';
    elements.cartEmpty.hidden = false;
    elements.placeOrder.disabled = true;
    state.orderPlaced = false;
    elements.goToTracking.hidden = true;
    elements.orderStatus.textContent = '';
  } else {
    const markup = state.cart
      .map((entry, index) => {
        return `
          <li class="cart-item">
            <div class="cart-item-info">
              <strong>${entry.supplierName}</strong>
              <span>${entry.servings} servings &middot; Saves $${entry.savings.toFixed(2)} &middot; CO2 avoided ${entry.co2Saved.toFixed(1)} kg</span>
            </div>
            <div class="cart-item-actions">
              <span>$${entry.price.toFixed(2)}</span>
              <button class="ghost-btn" type="button" aria-label="Remove hamper" data-index="${index}">Remove</button>
            </div>
          </li>
        `;
      })
      .join('');

    elements.cartList.innerHTML = markup;
    elements.cartEmpty.hidden = true;
    elements.placeOrder.disabled = false;

    elements.cartList.querySelectorAll('[data-index]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const itemIndex = Number(event.currentTarget.dataset.index);
        removeCartItem(itemIndex);
      });
    });
  }

  elements.cartTotal.textContent = `$${total.toFixed(2)}`;
  state.totals.savings = state.cart.reduce((sum, entry) => sum + entry.savings, 0);
  state.totals.co2Saved = state.cart.reduce((sum, entry) => sum + entry.co2Saved, 0);
  state.totals.meals = state.cart.reduce((sum, entry) => sum + entry.meals, 0);
  updateReport();
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  updateCartUI();
}

function handlePlaceOrder() {
  if (state.cart.length === 0) {
    return;
  }

  state.orderPlaced = true;
  elements.orderStatus.textContent = 'Order placed! Tracking has started with a shared EV route.';
  elements.goToTracking.hidden = false;
  elements.placeOrder.disabled = true;
}

function populateComparisonSelectors() {
  const options = suppliers
    .map((supplier) => `<option value="${supplier.id}">${supplier.name}</option>`)
    .join('');
  elements.compareA.innerHTML = options;
  elements.compareB.innerHTML = options;
  elements.compareA.selectedIndex = 0;
  elements.compareB.selectedIndex = 1;

  elements.compareA.addEventListener('change', updateComparison);
  elements.compareB.addEventListener('change', updateComparison);
}

function prepareComparison(supplierId) {
  const currentA = elements.compareA.value;
  const currentB = elements.compareB.value;

  if (supplierId === currentA || supplierId === currentB) {
    switchView('compare-view');
    updateComparison();
    return;
  }

  elements.compareB.value = supplierId;

  switchView('compare-view');
  updateComparison();
}

function updateComparison() {
  const supplierA = suppliers.find((entry) => entry.id === elements.compareA.value) || suppliers[0];
  const supplierB = suppliers.find((entry) => entry.id === elements.compareB.value) || suppliers[1];

  elements.compareNameA.textContent = supplierA.name;
  elements.compareNameB.textContent = supplierB.name;

  elements.compareMetrics.priceA.textContent = `${supplierA.price} (avg $${supplierA.averageBasket.toFixed(2)})`;
  elements.compareMetrics.priceB.textContent = `${supplierB.price} (avg $${supplierB.averageBasket.toFixed(2)})`;
  elements.compareMetrics.freshnessA.textContent = `${supplierA.freshness}/10`;
  elements.compareMetrics.freshnessB.textContent = `${supplierB.freshness}/10`;
  elements.compareMetrics.co2A.textContent = `${supplierA.co2} kg`;
  elements.compareMetrics.co2B.textContent = `${supplierB.co2} kg`;
  elements.compareMetrics.distanceA.textContent = `${supplierA.distance} km`;
  elements.compareMetrics.distanceB.textContent = `${supplierB.distance} km`;
  elements.compareMetrics.surplusA.textContent = supplierA.surplus ? 'Yes' : 'No';
  elements.compareMetrics.surplusB.textContent = supplierB.surplus ? 'Yes' : 'No';
}

function startTracking() {
  resetTracking();
  state.trackingIndex = 0;
  updateTrackingUI();
  state.trackingTimer = window.setInterval(() => {
    state.trackingIndex += 1;
    if (state.trackingIndex >= trackingStages.length) {
      clearInterval(state.trackingTimer);
      state.trackingTimer = null;
      state.trackingIndex = trackingStages.length - 1;
    }
    updateTrackingUI();
  }, 3000);
}

function resetTracking() {
  if (state.trackingTimer) {
    clearInterval(state.trackingTimer);
    state.trackingTimer = null;
  }
  state.trackingIndex = 0;
  updateTrackingUI();
}

function renderTrackingSteps() {
  const markup = trackingStages
    .map((stage) => {
      return `
        <li class="tracking-step" data-stage="${stage.id}">
          <span>${stage.title}</span>
          <span class="tracking-detail">${stage.detail}</span>
        </li>
      `;
    })
    .join('');
  elements.trackingSteps.innerHTML = markup;
}

function updateTrackingUI() {
  const steps = Array.from(elements.trackingSteps.querySelectorAll('.tracking-step'));
  steps.forEach((step, index) => {
    step.classList.toggle('active', index <= state.trackingIndex);
  });

  const progress = (state.trackingIndex / (trackingStages.length - 1)) * 100;
  elements.progressIndicator.style.width = `${progress}%`;
}

function updateReport() {
  elements.reportSavings.textContent = `$${state.totals.savings.toFixed(2)}`;
  elements.reportCo2.textContent = `${state.totals.co2Saved.toFixed(1)} kg`;
  elements.reportMeals.textContent = `${state.totals.meals}`;
}
