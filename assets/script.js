'use strict';

/* ==========================================================================
   4KIDS — Front-end application
   No backend. No real payment. Cart / wishlist / recently-viewed persist
   in localStorage only (no sensitive data is ever stored there).
   ========================================================================== */

/* ---------------------------------------------------------------------- */
/* Data                                                                    */
/* ---------------------------------------------------------------------- */

const CATEGORIES = [
  { id: 'cartoon-dolls', name: 'عروسک‌های شخصیت کارتونی', icon: '🧸' },
  { id: 'silicone-dolls', name: 'عروسک‌های سیلیکونی', icon: '🐄' },
  { id: 'hair-accessories', name: 'اکسسوری مو', icon: '🎀' },
  { id: 'keychains', name: 'جاکلیدی مردانه و فانتزی', icon: '🔑' },
  { id: 'leather-bags', name: 'کیف چرم مردانه', icon: '👜' },
  { id: 'card-holders', name: 'جاکارتی', icon: '💳' },
  { id: 'pipes-lighters', name: 'پیپ و فندک', icon: '🔥', restricted: true },
  { id: 'vape', name: 'پاد و ویپ و سالت و جویس', icon: '🚭', restricted: true },
  { id: 'surprise-dolls', name: 'عروسک‌های سورپرایزی', icon: '🎁' },
  { id: 'earplugs', name: 'انواع گوش‌گیر فانتزی زنانه و دخترانه', icon: '👂' },
];

// availability: 'available' | 'soon' | 'unavailable'
const PRODUCTS = [
  {
    id: 1, name: 'گاو دونده اورجینال', category: 'silicone-dolls',
    price: 3850000, priceMax: null, image: 'assets/images/dolls/running-cow-doll.jpg',
    availability: 'available', featured: true, popularity: 98,
    description: 'عروسک گاو دونده اورجینال، مناسب هدیه و دکور اتاق.'
  },
  {
    id: 2, name: 'خرس سایز بزرگ اورجینال', category: 'silicone-dolls',
    price: 7500000, priceMax: null, image: 'assets/images/dolls/large-imported-bear-doll.jpg',
    availability: 'available', featured: true, popularity: 91,
    description: 'خرس عروسکی سایز بزرگ اورجینال، نرم و باکیفیت.'
  },
  {
    id: 3, name: 'استیچ سایز بزرگ اورجینال', category: 'cartoon-dolls',
    price: 6500000, priceMax: null, image: 'assets/images/dolls/large-stitch-doll.jpg',
    availability: 'available', featured: true, popularity: 95,
    description: 'عروسک استیچ سایز بزرگ اورجینال، شخصیت محبوب کارتونی.'
  },
  {
    id: 4, name: 'کرومی و ملودی', category: 'cartoon-dolls',
    price: 950000, priceMax: 3550000, image: 'assets/images/dolls/kuromi-melody-doll.jpg',
    availability: 'available', featured: true, popularity: 99,
    sizes: [
      { label: 'سایز ۱', price: 950000 },
      { label: 'سایز ۲', price: 1450000 },
      { label: 'سایز ۳', price: 1950000 },
      { label: 'سایز ۴', price: 2650000 },
      { label: 'سایز ۵', price: 3550000 },
    ],
    description: 'عروسک کرومی و ملودی، در ۵ سایز مختلف موجود است.'
  },

  // Placeholder / demo items for remaining categories — clearly marked as
  // configurable so the store owner can replace them with real products.
  { id: 101, name: 'نمونه محصول اکسسوری مو', category: 'hair-accessories', price: null, priceMax: null, image: 'assets/images/categories/hair-accessories.jpg', availability: 'soon', featured: false, popularity: 10, description: 'این مورد نمونه است و باید با محصول واقعی جایگزین شود.' },
  { id: 102, name: 'نمونه جاکلیدی فانتزی', category: 'keychains', price: null, priceMax: null, image: 'assets/images/categories/keychains.jpg', availability: 'soon', featured: false, popularity: 8, description: 'این مورد نمونه است و باید با محصول واقعی جایگزین شود.' },
  { id: 103, name: 'نمونه کیف چرم مردانه', category: 'leather-bags', price: null, priceMax: null, image: 'assets/images/categories/leather-bags.jpg', availability: 'soon', featured: false, popularity: 7, description: 'این مورد نمونه است و باید با محصول واقعی جایگزین شود.' },
  { id: 104, name: 'نمونه جاکارتی', category: 'card-holders', price: null, priceMax: null, image: 'assets/images/categories/card-holders.jpg', availability: 'soon', featured: false, popularity: 6, description: 'این مورد نمونه است و باید با محصول واقعی جایگزین شود.' },
  { id: 105, name: 'نمونه عروسک سورپرایزی', category: 'surprise-dolls', price: null, priceMax: null, image: 'assets/images/categories/surprise-dolls.jpg', availability: 'soon', featured: false, popularity: 12, description: 'این مورد نمونه است و باید با محصول واقعی جایگزین شود.' },
  { id: 106, name: 'نمونه گوش‌گیر فانتزی', category: 'earplugs', price: null, priceMax: null, image: 'assets/images/categories/earplugs.jpg', availability: 'soon', featured: false, popularity: 5, description: 'این مورد نمونه است و باید با محصول واقعی جایگزین شود.' },

  // Age/legally restricted categories — informational only, never purchasable here.
  { id: 201, name: 'محصولات پیپ و فندک', category: 'pipes-lighters', price: null, priceMax: null, image: 'assets/images/categories/pipes-lighters.jpg', availability: 'unavailable', featured: false, popularity: 1, restricted: true, description: 'عرضه این دسته منوط به قوانین و محدودیت سنی است و از طریق سایت قابل خرید نیست.' },
  { id: 202, name: 'محصولات پاد، ویپ، سالت و جویس', category: 'vape', price: null, priceMax: null, image: 'assets/images/categories/vape.jpg', availability: 'unavailable', featured: false, popularity: 1, restricted: true, description: 'عرضه این دسته منوط به قوانین و محدودیت سنی است و از طریق سایت قابل خرید نیست.' },
];

const REVIEWS = [
  { name: 'مریم .ح', stars: 5, text: 'کیفیت عروسک واقعا خوب بود و بسته‌بندی تمیز بود.' },
  { name: 'زهرا ک.', stars: 5, text: 'ارسال به موقع رسید، خیلی خوشحال شدم.' },
  { name: 'فاطمه ر.', stars: 4, text: 'محصول همون چیزی بود که توی عکس دیده بودم.' },
];

const FAQ_ITEMS = [
  { q: 'آیا به سراسر کشور ارسال دارید؟', a: 'بله، سفارش‌ها به تمام نقاط ایران ارسال می‌شود.' },
  { q: 'چگونه می‌توانم محصول موردنظر خود را پیدا کنم؟', a: 'از بخش جست‌وجو در بالای صفحه یا فیلترهای بخش محصولات استفاده کنید.' },
  { q: 'چگونه می‌توانم محصولی را به سبد خرید اضافه کنم؟', a: 'روی دکمه «افزودن به سبد خرید» در کارت محصول یا صفحه جزئیات بزنید.' },
  { q: 'آیا محصولات ناموجود دوباره موجود می‌شوند؟', a: 'بسته به محصول متفاوت است؛ این بخش به‌زودی به‌روزرسانی می‌شود.' },
  { q: 'چگونه می‌توانم با فروشگاه تماس بگیرم؟', a: 'از طریق شماره تماس، واتس‌اپ یا اینستاگرام در بخش «تماس با ما».' },
  { q: 'شرایط بازگشت یا تعویض کالا چیست؟', a: 'این بخش هنوز نهایی نشده و به‌زودی تکمیل می‌شود.' },
];

const STORAGE_KEYS = { cart: '4kids_cart', wishlist: '4kids_wishlist', recent: '4kids_recent' };

/* ---------------------------------------------------------------------- */
/* Utilities                                                               */
/* ---------------------------------------------------------------------- */

function formatPrice(value) {
  if (value === null || value === undefined) return 'قیمت به‌زودی';
  return value.toLocaleString('fa-IR') + ' تومان';
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function categoryName(catId) {
  const c = CATEGORIES.find(c => c.id === catId);
  return c ? c.name : catId;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* localStorage may be unavailable (private mode, quota) — fail silently */
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => { toast.hidden = true; }, 2400);
}

/* Safe element creation helpers — avoids innerHTML with dynamic/user data */
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* ---------------------------------------------------------------------- */
/* State                                                                   */
/* ---------------------------------------------------------------------- */

let cart = readStorage(STORAGE_KEYS.cart, []); // [{id, qty, sizeLabel, unitPrice}]
let wishlist = readStorage(STORAGE_KEYS.wishlist, []); // [id]
let recentlyViewed = readStorage(STORAGE_KEYS.recent, []); // [id]

/* ---------------------------------------------------------------------- */
/* Product card rendering                                                  */
/* ---------------------------------------------------------------------- */

function statusLabel(availability) {
  if (availability === 'available') return 'موجود';
  if (availability === 'soon') return 'به‌زودی';
  return 'ناموجود';
}

function buildProductCard(product) {
  const card = el('article', 'product-card');
  card.dataset.id = product.id;

  const media = el('div', 'product-media');
  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  img.loading = 'lazy';
  img.width = 400; img.height = 400;
  img.onerror = () => { img.style.display = 'none'; };
  media.appendChild(img);

  if (!product.restricted) {
    const favBtn = el('button', 'product-fav');
    favBtn.setAttribute('aria-label', 'افزودن به علاقه‌مندی‌ها');
    favBtn.setAttribute('aria-pressed', wishlist.includes(product.id) ? 'true' : 'false');
    favBtn.textContent = wishlist.includes(product.id) ? '♥' : '♡';
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWishlist(product.id);
    });
    media.appendChild(favBtn);
  }

  const status = el('span', `product-status status-${product.availability}`, statusLabel(product.availability));
  media.appendChild(status);
  card.appendChild(media);

  const info = el('div', 'product-info');
  info.appendChild(el('span', 'product-category', categoryName(product.category)));
  info.appendChild(el('h3', 'product-name', product.name));

  const priceEl = el('p', 'product-price');
  if (product.priceMax) {
    priceEl.textContent = `${formatPrice(product.price)} تا ${formatPrice(product.priceMax)}`;
  } else {
    priceEl.textContent = formatPrice(product.price);
  }
  info.appendChild(priceEl);
  card.appendChild(info);

  const actions = el('div', 'product-actions');
  const viewBtn = el('button', 'btn btn-ghost', 'مشاهده محصول');
  viewBtn.addEventListener('click', () => openProductModal(product.id));
  actions.appendChild(viewBtn);

  if (!product.restricted && product.availability === 'available' && !product.sizes) {
    const addBtn = el('button', 'btn btn-primary', 'افزودن به سبد');
    addBtn.addEventListener('click', () => addToCart(product.id, 1));
    actions.appendChild(addBtn);
  }
  card.appendChild(actions);

  return card;
}

function renderGrid(containerId, products, emptyMessage) {
  const container = document.getElementById(containerId);
  container.textContent = '';
  if (!products.length) {
    container.appendChild(el('p', 'empty-state', emptyMessage || 'محصولی یافت نشد.'));
    return;
  }
  const frag = document.createDocumentFragment();
  products.forEach(p => frag.appendChild(buildProductCard(p)));
  container.appendChild(frag);
}

function renderBestsellers() {
  const items = PRODUCTS.filter(p => p.featured);
  renderGrid('bestsellerGrid', items);
}

function renderRecentlyViewed() {
  const section = document.getElementById('recentlyViewedSection');
  const items = recentlyViewed.map(getProduct).filter(Boolean);
  if (!items.length) { section.hidden = true; return; }
  section.hidden = false;
  renderGrid('recentGrid', items);
}

/* ---------------------------------------------------------------------- */
/* Categories                                                              */
/* ---------------------------------------------------------------------- */

function renderCategories() {
  const grid = document.getElementById('categoryGrid');
  grid.textContent = '';
  CATEGORIES.forEach(cat => {
    const card = el('button', 'category-card');
    card.type = 'button';
    card.appendChild(el('span', 'category-icon', cat.icon));
    card.appendChild(el('span', 'cat-name', cat.name));
    card.addEventListener('click', () => {
      document.getElementById('filterCategory').value = cat.id;
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
      renderCatalog();
    });
    grid.appendChild(card);
  });

  const select = document.getElementById('filterCategory');
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

/* ---------------------------------------------------------------------- */
/* Catalog: filter + sort                                                  */
/* ---------------------------------------------------------------------- */

function effectivePrice(product) {
  if (product.price === null) return null;
  return product.price;
}

function renderCatalog() {
  const category = document.getElementById('filterCategory').value;
  const availability = document.getElementById('filterAvailability').value;
  const priceRange = document.getElementById('filterPrice').value;
  const sortBy = document.getElementById('sortBy').value;

  let list = PRODUCTS.slice();

  if (category !== 'all') list = list.filter(p => p.category === category);
  if (availability !== 'all') list = list.filter(p => p.availability === availability);
  if (priceRange !== 'all') {
    const [min, max] = priceRange.split('-').map(Number);
    list = list.filter(p => {
      const price = effectivePrice(p);
      if (price === null) return false;
      return price >= min && price <= max;
    });
  }

  switch (sortBy) {
    case 'cheapest':
      list.sort((a, b) => (effectivePrice(a) ?? Infinity) - (effectivePrice(b) ?? Infinity));
      break;
    case 'expensive':
      list.sort((a, b) => (effectivePrice(b) ?? -Infinity) - (effectivePrice(a) ?? -Infinity));
      break;
    case 'popular':
      list.sort((a, b) => b.popularity - a.popularity);
      break;
    default: // newest
      list.sort((a, b) => b.id - a.id);
  }

  document.getElementById('catalogStatus').textContent = `${list.length.toLocaleString('fa-IR')} محصول یافت شد`;
  renderGrid('catalogGrid', list, 'با این فیلترها محصولی پیدا نشد. فیلترها را تغییر دهید.');
}

['filterCategory', 'filterAvailability', 'filterPrice', 'sortBy'].forEach(id => {
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById(id).addEventListener('change', renderCatalog);
  });
});

/* ---------------------------------------------------------------------- */
/* Search                                                                   */
/* ---------------------------------------------------------------------- */

function runSearch(query) {
  const q = query.trim().toLowerCase();
  const status = document.getElementById('searchStatus');
  const results = document.getElementById('searchResults');
  const clearBtn = document.getElementById('searchClear');
  results.textContent = '';
  clearBtn.hidden = q.length === 0;

  if (!q) { status.textContent = ''; return; }

  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || categoryName(p.category).toLowerCase().includes(q)
  );

  if (!matches.length) {
    status.textContent = 'نتیجه‌ای یافت نشد.';
    return;
  }
  status.textContent = `${matches.length.toLocaleString('fa-IR')} نتیجه`;

  const frag = document.createDocumentFragment();
  matches.forEach(p => {
    const item = el('button', 'search-result-item');
    item.type = 'button';
    const img = document.createElement('img');
    img.src = p.image; img.alt = ''; img.loading = 'lazy';
    img.onerror = () => { img.style.display = 'none'; };
    item.appendChild(img);
    const meta = el('div', 'sr-meta');
    meta.appendChild(el('div', '', p.name));
    meta.appendChild(el('div', 'sr-price', formatPrice(p.price)));
    item.appendChild(meta);
    item.addEventListener('click', () => {
      toggleSearchPanel(false);
      openProductModal(p.id);
    });
    frag.appendChild(item);
  });
  results.appendChild(frag);
}

/* ---------------------------------------------------------------------- */
/* Wishlist                                                                 */
/* ---------------------------------------------------------------------- */

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('به علاقه‌مندی‌ها اضافه شد');
  } else {
    wishlist.splice(idx, 1);
    showToast('از علاقه‌مندی‌ها حذف شد');
  }
  writeStorage(STORAGE_KEYS.wishlist, wishlist);
  updateWishlistBadge();
  renderBestsellers();
  renderCatalog();
  renderRecentlyViewed();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  badge.textContent = wishlist.length;
  badge.hidden = wishlist.length === 0;
}

/* ---------------------------------------------------------------------- */
/* Recently viewed                                                          */
/* ---------------------------------------------------------------------- */

function trackRecentlyViewed(id) {
  recentlyViewed = recentlyViewed.filter(x => x !== id);
  recentlyViewed.unshift(id);
  recentlyViewed = recentlyViewed.slice(0, 8);
  writeStorage(STORAGE_KEYS.recent, recentlyViewed);
  renderRecentlyViewed();
}

/* ---------------------------------------------------------------------- */
/* Cart                                                                      */
/* ---------------------------------------------------------------------- */

function addToCart(productId, qty, sizeLabel) {
  const product = getProduct(productId);
  if (!product || product.restricted || product.availability !== 'available') return;

  const unitPrice = sizeLabel && product.sizes
    ? product.sizes.find(s => s.label === sizeLabel).price
    : product.price;

  const existing = cart.find(item => item.id === productId && item.sizeLabel === (sizeLabel || null));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty, sizeLabel: sizeLabel || null, unitPrice });
  }
  writeStorage(STORAGE_KEYS.cart, cart);
  updateCartBadge();
  renderCart();
  showToast('به سبد خرید اضافه شد');
}

function changeCartQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(index, 1);
  writeStorage(STORAGE_KEYS.cart, cart);
  updateCartBadge();
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  writeStorage(STORAGE_KEYS.cart, cart);
  updateCartBadge();
  renderCart();
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = count;
  badge.hidden = count === 0;
}

function renderCart() {
  const body = document.getElementById('cartBody');
  body.textContent = '';

  if (!cart.length) {
    body.appendChild(el('p', 'cart-empty', 'سبد خرید شما خالی است.'));
  } else {
    cart.forEach((item, index) => {
      const product = getProduct(item.id);
      if (!product) return;
      const row = el('div', 'cart-item');
      const img = document.createElement('img');
      img.src = product.image; img.alt = product.name;
      img.onerror = () => { img.style.display = 'none'; };
      row.appendChild(img);

      const info = el('div', 'cart-item-info');
      info.appendChild(el('span', 'cart-item-name', product.name + (item.sizeLabel ? ` — ${item.sizeLabel}` : '')));
      info.appendChild(el('span', 'cart-item-price', formatPrice(item.unitPrice)));

      const qtyControl = el('div', 'qty-control');
      const minusBtn = el('button', '', '−');
      minusBtn.setAttribute('aria-label', 'کاهش تعداد');
      minusBtn.addEventListener('click', () => changeCartQty(index, -1));
      const qtyLabel = el('span', '', String(item.qty));
      const plusBtn = el('button', '', '+');
      plusBtn.setAttribute('aria-label', 'افزایش تعداد');
      plusBtn.addEventListener('click', () => changeCartQty(index, 1));
      qtyControl.append(minusBtn, qtyLabel, plusBtn);
      info.appendChild(qtyControl);

      const removeBtn = el('button', 'cart-item-remove', 'حذف');
      removeBtn.addEventListener('click', () => removeCartItem(index));
      info.appendChild(removeBtn);

      row.appendChild(info);
      body.appendChild(row);
    });
  }

  document.getElementById('cartSubtotal').textContent = formatPrice(cartTotal());
  document.getElementById('cartCheckout').disabled = cart.length === 0;
}

/* ---------------------------------------------------------------------- */
/* Product modal                                                            */
/* ---------------------------------------------------------------------- */

function openProductModal(id) {
  const product = getProduct(id);
  if (!product) return;
  trackRecentlyViewed(id);

  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('productModal');
  const content = document.getElementById('modalContent');
  content.textContent = '';

  let selectedSize = product.sizes ? product.sizes[0] : null;
  let qty = 1;

  const imageWrap = el('div', 'modal-image');
  const img = document.createElement('img');
  img.src = product.image; img.alt = product.name;
  img.onerror = () => { img.style.display = 'none'; };
  imageWrap.appendChild(img);
  content.appendChild(imageWrap);

  const details = el('div', 'modal-details');
  details.appendChild(el('h2', '', product.name));
  details.id = 'modalTitleWrap';
  const heading = details.querySelector('h2');
  heading.id = 'modalTitle';
  details.appendChild(el('p', 'product-category', categoryName(product.category)));

  const priceEl = el('p', 'modal-price');
  details.appendChild(priceEl);

  function updatePrice() {
    if (selectedSize) priceEl.textContent = formatPrice(selectedSize.price);
    else if (product.priceMax) priceEl.textContent = `${formatPrice(product.price)} تا ${formatPrice(product.priceMax)}`;
    else priceEl.textContent = formatPrice(product.price);
  }
  updatePrice();

  if (product.sizes) {
    const sizeWrap = el('div', 'size-options');
    product.sizes.forEach(size => {
      const btn = el('button', 'size-option', size.label);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', size === selectedSize ? 'true' : 'false');
      btn.addEventListener('click', () => {
        selectedSize = size;
        sizeWrap.querySelectorAll('.size-option').forEach(b => b.setAttribute('aria-pressed', 'false'));
        btn.setAttribute('aria-pressed', 'true');
        updatePrice();
      });
      sizeWrap.appendChild(btn);
    });
    details.appendChild(sizeWrap);
  }

  details.appendChild(el('p', '', product.description || ''));
  details.appendChild(el('p', 'product-status status-' + product.availability, statusLabel(product.availability)));

  if (!product.restricted && product.availability === 'available') {
    const qtyRow = el('div', 'qty-row');
    qtyRow.appendChild(el('span', '', 'تعداد:'));
    const control = el('div', 'qty-control');
    const minus = el('button', '', '−');
    const qtyLabel = el('span', '', String(qty));
    const plus = el('button', '', '+');
    minus.addEventListener('click', () => { if (qty > 1) { qty--; qtyLabel.textContent = qty; } });
    plus.addEventListener('click', () => { qty++; qtyLabel.textContent = qty; });
    control.append(minus, qtyLabel, plus);
    qtyRow.appendChild(control);
    details.appendChild(qtyRow);

    const addBtn = el('button', 'btn btn-primary btn-block', 'افزودن به سبد خرید');
    addBtn.addEventListener('click', () => {
      addToCart(product.id, qty, selectedSize ? selectedSize.label : null);
    });
    details.appendChild(addBtn);
  } else if (product.restricted) {
    details.appendChild(el('p', 'demo-note', 'این دسته از محصولات مشمول محدودیت سنی/قانونی است و امکان خرید آنلاین ندارد.'));
  } else {
    details.appendChild(el('p', 'demo-note', 'این محصول در حال حاضر قابل افزودن به سبد نیست.'));
  }

  content.appendChild(details);

  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  if (related.length) {
    const relatedWrap = el('div', 'modal-related');
    relatedWrap.appendChild(el('h3', '', 'محصولات مرتبط'));
    const list = el('div', 'related-list');
    related.forEach(p => list.appendChild(buildProductCard(p)));
    relatedWrap.appendChild(list);
    content.appendChild(relatedWrap);
  }

  modal.setAttribute('aria-labelledby', 'modalTitle');
  overlay.hidden = false;
  modal.hidden = false;
  requestAnimationFrame(() => { overlay.style.opacity = '1'; });
  document.getElementById('modalClose').focus();
}

function closeProductModal() {
  document.getElementById('modalOverlay').hidden = true;
  document.getElementById('productModal').hidden = true;
}

/* ---------------------------------------------------------------------- */
/* FAQ accordion                                                            */
/* ---------------------------------------------------------------------- */

function renderFAQ() {
  const container = document.getElementById('faqAccordion');
  container.textContent = '';
  FAQ_ITEMS.forEach((item, i) => {
    const wrap = el('div', 'accordion-item');
    const trigger = el('button', 'accordion-trigger', item.q);
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.id = `faqTrigger${i}`;
    trigger.setAttribute('aria-controls', `faqPanel${i}`);
    const plus = el('span', 'plus', '+');
    trigger.appendChild(plus);

    const panel = el('div', 'accordion-panel');
    panel.id = `faqPanel${i}`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', trigger.id);
    panel.appendChild(el('p', '', item.a));

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      // close all
      container.querySelectorAll('.accordion-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
      container.querySelectorAll('.accordion-panel').forEach(p => { p.style.maxHeight = null; });
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });

    wrap.append(trigger, panel);
    container.appendChild(wrap);
  });
}

/* ---------------------------------------------------------------------- */
/* Reviews                                                                   */
/* ---------------------------------------------------------------------- */

function renderReviews() {
  const grid = document.getElementById('reviewGrid');
  grid.textContent = '';
  REVIEWS.forEach(r => {
    const card = el('div', 'review-card');
    card.appendChild(el('div', 'review-stars', '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars)));
    card.appendChild(el('p', '', r.text));
    card.appendChild(el('span', 'review-name', r.name));
    grid.appendChild(card);
  });
}

/* ---------------------------------------------------------------------- */
/* Header interactions (mobile menu, search panel, cart drawer)             */
/* ---------------------------------------------------------------------- */

function toggleMobileMenu(force) {
  const nav = document.getElementById('mobileNav');
  const btn = document.getElementById('menuToggle');
  const open = force !== undefined ? force : nav.hidden;
  nav.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
}

function toggleSearchPanel(force) {
  const panel = document.getElementById('searchPanel');
  const btn = document.getElementById('searchToggle');
  const open = force !== undefined ? force : panel.hidden;
  panel.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  if (open) document.getElementById('searchInput').focus();
}

function toggleCartDrawer(force) {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('overlay');
  const btn = document.getElementById('cartToggle');
  const open = force !== undefined ? force : !drawer.classList.contains('open');
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  overlay.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
  if (open) renderCart();
}

/* ---------------------------------------------------------------------- */
/* Init                                                                       */
/* ---------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderBestsellers();
  renderCatalog();
  renderRecentlyViewed();
  renderReviews();
  renderFAQ();
  updateCartBadge();
  updateWishlistBadge();

  document.getElementById('menuToggle').addEventListener('click', () => toggleMobileMenu());
  document.getElementById('searchToggle').addEventListener('click', () => toggleSearchPanel());
  document.getElementById('cartToggle').addEventListener('click', () => toggleCartDrawer());
  document.getElementById('cartClose').addEventListener('click', () => toggleCartDrawer(false));
  document.getElementById('overlay').addEventListener('click', () => {
    toggleCartDrawer(false);
    closeProductModal();
  });
  document.getElementById('modalOverlay').addEventListener('click', closeProductModal);
  document.getElementById('modalClose').addEventListener('click', closeProductModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProductModal();
      toggleCartDrawer(false);
    }
  });

  document.getElementById('searchInput').addEventListener('input', (e) => runSearch(e.target.value));
  document.getElementById('searchClear').addEventListener('click', () => {
    const input = document.getElementById('searchInput');
    input.value = '';
    runSearch('');
    input.focus();
  });

  document.getElementById('cartCheckout').addEventListener('click', () => {
    showToast('پرداخت آنلاین هنوز فعال نشده است.');
  });

  // Close mobile nav after choosing a link
  document.getElementById('mobileNav').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') toggleMobileMenu(false);
  });
});
