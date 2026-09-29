/**
 * LemonMind Administration Dashboard Logic
 * Pure Vanilla JS, Token-based Auth via HttpOnly Cookies
 */

// State
let currentUser = null;
let cards = [];
let editingCardId = null;
let confirmActionCallback = null;
let currentFilter = 'all';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const cardModal = document.getElementById('card-modal');
const confirmModal = document.getElementById('confirm-modal');
const cardForm = document.getElementById('card-form');
const formError = document.getElementById('form-error');

// ============================================================
// Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupLoginForm();
});

// ============================================================
// Authentication
// ============================================================
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      currentUser = data.user;
      showDashboard();
    } else {
      showLogin();
    }
  } catch (err) {
    showLogin();
  }
}

function setupLoginForm() {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.hidden = true;
    const submitBtn = document.getElementById('login-btn');
    submitBtn.disabled = true;

    const formData = new FormData(loginForm);
    const body = {
      username: formData.get('username'),
      password: formData.get('password')
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (res.ok) {
        currentUser = data.user;

        // Visual success state on submit button
        submitBtn.classList.add('is-success');
        submitBtn.innerHTML = `
          <span>Accès autorisé...</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:18px;height:18px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;

        // Trigger luxury propulsion animation towards cards
        loginScreen.classList.add('is-propelling');
        const loginCard = document.querySelector('.login-card');
        if (loginCard) loginCard.classList.add('is-propelling');

        setTimeout(() => {
          showDashboard(true); // propel into digital cards view
          submitBtn.classList.remove('is-success');
          submitBtn.innerHTML = `<span>Se connecter</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
        }, 460);
      } else {
        loginError.textContent = data.error || 'Erreur de connexion';
        loginError.hidden = false;
        submitBtn.disabled = false;
      }
    } catch (err) {
      loginError.textContent = 'Impossible de contacter le serveur';
      loginError.hidden = false;
      submitBtn.disabled = false;
    }
  });
}

async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {}
  currentUser = null;
  showLogin();
}

function showLogin() {
  dashboard.hidden = true;
  dashboard.style.display = 'none';

  loginScreen.hidden = false;
  loginScreen.style.display = 'flex';
  loginScreen.classList.remove('is-propelling');
  const loginCard = document.querySelector('.login-card');
  if (loginCard) loginCard.classList.remove('is-propelling');
}

function showDashboard(propelToCards = false) {
  loginScreen.hidden = true;
  loginScreen.style.display = 'none';
  loginScreen.classList.remove('is-propelling');
  const loginCard = document.querySelector('.login-card');
  if (loginCard) loginCard.classList.remove('is-propelling');

  dashboard.hidden = false;
  dashboard.style.display = 'flex';
  document.getElementById('sidebar-username').textContent = (currentUser && currentUser.username) ? currentUser.username : 'admin';
  loadStats();
  loadCards();

  if (propelToCards) {
    dashboard.classList.add('dashboard-entrance-propel');
    switchView('cards');
    showToast('Bienvenue dans la gestion des cartes digitales', 'success');
    setTimeout(() => {
      dashboard.classList.remove('dashboard-entrance-propel');
    }, 900);
  }
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  } else {
    input.type = 'password';
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  }
}

// ============================================================
// Navigation & Views
// ============================================================
function switchView(viewName) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const viewEl = document.getElementById(`view-${viewName}`);
  const navEl = document.querySelector(`.nav-item[data-view="${viewName}"]`);

  if (viewEl) viewEl.classList.add('active');
  if (navEl) navEl.classList.add('active');

  const sidebar = document.getElementById('sidebar');
  sidebar.classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============================================================
// Data Loading
// ============================================================
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) return;
    const stats = await res.json();
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-published').textContent = stats.published;
    document.getElementById('stat-draft').textContent = stats.draft;
    document.getElementById('stat-departments').textContent = stats.departments.length;
  } catch (err) {
    console.error('Failed to load stats', err);
  }
}

async function loadCards() {
  try {
    const res = await fetch('/api/cards');
    if (!res.ok) return;
    cards = await res.json();
    renderCards();
    renderRecentCards();
  } catch (err) {
    showToast('Erreur lors du chargement des cartes', 'error');
  }
}

// ============================================================
// Rendering
// ============================================================
function renderCards() {
  const tbody = document.getElementById('cards-table-body');
  const emptyState = document.getElementById('no-cards');
  const search = document.getElementById('search-cards').value.toLowerCase();

  let filtered = cards.filter(c => {
    const matchesFilter = currentFilter === 'all' || c.status === currentFilter;
    const matchesSearch = !search || 
      (c.fullName && c.fullName.toLowerCase().includes(search)) ||
      (c.jobTitle && c.jobTitle.toLowerCase().includes(search)) ||
      (c.department && c.department.toLowerCase().includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search));
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  tbody.innerHTML = filtered.map(card => {
    const photoUrl = card.photo ? `/assets${card.photo}` : '../assets/logo-header.png';
    const isPublished = card.status === 'published';

    return `
      <tr>
        <td class="th-photo">
          <img src="${photoUrl}" alt="${card.fullName}" class="table-photo" onerror="this.src='../assets/logo-header.png'">
        </td>
        <td>
          <div class="table-user-cell">
            <span class="table-user-name">${card.fullName || `${card.firstName} ${card.lastName}`}</span>
            <span class="table-user-slug">/equipe/${card.slug}</span>
            ${card.email ? `<span class="table-user-email">✉️ ${card.email}</span>` : ''}
          </div>
        </td>
        <td class="hide-mobile">${card.jobTitle || '—'}</td>
        <td class="hide-mobile">${card.department || '—'}</td>
        <td>
          <span class="status-badge ${card.status}">
            ${card.status === 'published' ? 'Publiée' : 'Brouillon'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            ${isPublished ? `
              <a href="/equipe/${card.slug}.html" target="_blank" class="action-btn" title="Voir la carte publique">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <button class="action-btn" onclick="togglePublish('${card.id}', false)" title="Dépublier">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
              </button>
            ` : `
              <button class="action-btn" onclick="togglePublish('${card.id}', true)" title="Publier">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l5 5L20 7"/></svg>
              </button>
            `}
            <button class="action-btn" onclick="openEditModal('${card.id}')" title="Modifier">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
            </button>
            <button class="action-btn delete" onclick="confirmDeleteCard('${card.id}', '${card.fullName || card.slug}')" title="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderRecentCards() {
  const container = document.getElementById('recent-cards-grid');
  const recent = [...cards].slice(0, 4);

  if (recent.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucune carte créée pour le moment.</p>';
    return;
  }

  container.innerHTML = recent.map(card => {
    const photoUrl = card.photo ? `/assets${card.photo}` : '../assets/logo-header.png';
    return `
      <div class="mini-card">
        <div class="mini-card-top">
          <img src="${photoUrl}" alt="${card.fullName}" class="mini-card-photo" onerror="this.src='../assets/logo-header.png'">
          <div class="mini-card-meta">
            <div class="mini-card-name">${card.fullName || `${card.firstName} ${card.lastName}`}</div>
            <div class="mini-card-role">${card.profession || card.jobTitle || 'Membre'}</div>
          </div>
        </div>
        <div class="mini-card-bottom">
          <span class="status-badge ${card.status}">
            ${card.status === 'published' ? 'Publiée' : 'Brouillon'}
          </span>
          <button class="btn btn-ghost btn-sm" onclick="openEditModal('${card.id}')">Gérer</button>
        </div>
      </div>
    `;
  }).join('');
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-pills .pill').forEach(p => {
    p.classList.toggle('active', p.dataset.filter === filter);
  });
  renderCards();
}

function filterCards() {
  renderCards();
}

// ============================================================
// Modal & Card CRUD Operations
// ============================================================
function openCreateModal() {
  editingCardId = null;
  document.getElementById('modal-title').textContent = 'Nouvelle carte';
  document.getElementById('modal-submit-btn').innerHTML = '<span>Créer la carte</span>';
  cardForm.reset();
  formError.hidden = true;
  
  const previewImg = document.getElementById('photo-preview-img');
  previewImg.src = '';
  previewImg.hidden = true;

  emailManuallyEdited = false;

  // Defaults: published immediately, not featured
  const statusToggle = document.getElementById('card-status-toggle');
  if (statusToggle) statusToggle.checked = true;
  const featuredToggle = document.getElementById('card-featured-toggle');
  if (featuredToggle) featuredToggle.checked = false;

  cardModal.hidden = false;
}

function openEditModal(id) {
  const card = cards.find(c => c.id === id);
  if (!card) return;

  editingCardId = id;
  emailManuallyEdited = true;
  document.getElementById('modal-title').textContent = `Modifier: ${card.fullName || card.slug}`;
  document.getElementById('modal-submit-btn').innerHTML = '<span>Enregistrer</span>';
  formError.hidden = true;

  document.getElementById('card-firstName').value = card.firstName || '';
  document.getElementById('card-lastName').value = card.lastName || '';
  document.getElementById('card-profession').value = card.profession || '';
  document.getElementById('card-jobTitle').value = card.jobTitle || '';
  document.getElementById('card-badge').value = card.badge || '';
  document.getElementById('card-department').value = card.department || '';
  document.getElementById('card-phone').value = card.phone || '';
  document.getElementById('card-whatsapp').value = card.whatsapp || '';
  document.getElementById('card-email').value = card.email || '';
  document.getElementById('card-location').value = card.location || '';
  document.getElementById('card-linkedin').value = card.linkedin || '';
  document.getElementById('card-slug').value = card.slug || '';

  const statusToggle = document.getElementById('card-status-toggle');
  if (statusToggle) statusToggle.checked = card.status === 'published';
  const featuredToggle = document.getElementById('card-featured-toggle');
  if (featuredToggle) featuredToggle.checked = !!card.featured;

  const previewImg = document.getElementById('photo-preview-img');
  if (card.photo) {
    previewImg.src = `/assets${card.photo}`;
    previewImg.hidden = false;
  } else {
    previewImg.src = '';
    previewImg.hidden = true;
  }

  cardModal.hidden = false;
}

function closeModal() {
  cardModal.hidden = true;
  editingCardId = null;
}

function previewPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewImg = document.getElementById('photo-preview-img');
      previewImg.src = e.target.result;
      previewImg.hidden = false;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

async function saveCard(e) {
  e.preventDefault();
  formError.hidden = true;
  const submitBtn = document.getElementById('modal-submit-btn');
  submitBtn.disabled = true;

  const statusToggle = document.getElementById('card-status-toggle');
  const featuredToggle = document.getElementById('card-featured-toggle');

  const payload = {
    firstName: document.getElementById('card-firstName').value.trim(),
    lastName: document.getElementById('card-lastName').value.trim(),
    profession: document.getElementById('card-profession').value.trim(),
    jobTitle: document.getElementById('card-jobTitle').value.trim(),
    badge: document.getElementById('card-badge').value.trim(),
    department: document.getElementById('card-department').value.trim(),
    phone: document.getElementById('card-phone').value.trim(),
    whatsapp: document.getElementById('card-whatsapp').value.trim(),
    email: document.getElementById('card-email').value.trim(),
    location: document.getElementById('card-location').value.trim(),
    linkedin: document.getElementById('card-linkedin').value.trim(),
    slug: document.getElementById('card-slug').value.trim(),
    status: statusToggle && statusToggle.checked ? 'published' : 'draft',
    featured: featuredToggle ? featuredToggle.checked : false
  };

  try {
    let url = '/api/cards';
    let method = 'POST';

    if (editingCardId) {
      url = `/api/cards/${editingCardId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      formError.textContent = data.error || 'Erreur lors de la sauvegarde';
      formError.hidden = false;
      submitBtn.disabled = false;
      return;
    }

    const savedCardId = data.id;

    // Handle photo upload if any
    const photoInput = document.getElementById('photo-input');
    if (photoInput.files && photoInput.files[0]) {
      const photoData = new FormData();
      photoData.append('photo', photoInput.files[0]);

      await fetch(`/api/cards/${savedCardId}/photo`, {
        method: 'POST',
        body: photoData
      });
    }

    closeModal();
    showToast(editingCardId ? 'Carte mise à jour avec succès' : 'Carte créée avec succès', 'success');
    loadCards();
    loadStats();
  } catch (err) {
    formError.textContent = 'Erreur réseau';
    formError.hidden = false;
  } finally {
    submitBtn.disabled = false;
  }
}

async function togglePublish(id, publish) {
  const endpoint = publish ? 'publish' : 'unpublish';
  try {
    const res = await fetch(`/api/cards/${id}/${endpoint}`, { method: 'POST' });
    if (res.ok) {
      showToast(publish ? 'Carte publiée avec succès' : 'Carte dépubliée', 'success');
      loadCards();
      loadStats();
    } else {
      const data = await res.json();
      showToast(data.error || 'Erreur', 'error');
    }
  } catch (err) {
    showToast('Erreur réseau', 'error');
  }
}

function confirmDeleteCard(id, name) {
  openConfirm(
    'Supprimer la carte',
    `Êtes-vous sûr de vouloir supprimer définitivement la carte de <strong>${name}</strong> ?<br><br><span style="color:var(--danger)">⚠️ Si cette carte est liée à un tag NFC physique, il cessera immédiatement de fonctionner.</span>`,
    async () => {
      try {
        const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showToast('Carte supprimée', 'success');
          loadCards();
          loadStats();
        } else {
          showToast('Erreur lors de la suppression', 'error');
        }
      } catch (err) {
        showToast('Erreur réseau', 'error');
      }
    }
  );
}

// ============================================================
// Settings & Maintenance
// ============================================================
async function changePassword(e) {
  e.preventDefault();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const errorEl = document.getElementById('password-error');
  const successEl = document.getElementById('password-success');

  errorEl.hidden = true;
  successEl.hidden = true;

  if (newPassword !== confirmPassword) {
    errorEl.textContent = 'Les mots de passe ne correspondent pas';
    errorEl.hidden = false;
    return;
  }

  try {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (res.ok) {
      successEl.textContent = 'Mot de passe mis à jour avec succès';
      successEl.hidden = false;
      document.getElementById('change-password-form').reset();
    } else {
      errorEl.textContent = data.error || 'Erreur lors de la modification';
      errorEl.hidden = false;
    }
  } catch (err) {
    errorEl.textContent = 'Erreur réseau';
    errorEl.hidden = false;
  }
}

async function regenerateAll() {
  try {
    const res = await fetch('/api/regenerate', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      showToast(`${data.regenerated} pages NFC régénérées`, 'success');
    } else {
      showToast('Erreur lors de la régénération', 'error');
    }
  } catch (err) {
    showToast('Erreur réseau', 'error');
  }
}

// ============================================================
// Confirmation Dialog Helper
// ============================================================
function openConfirm(title, message, onConfirm) {
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').innerHTML = message;
  confirmActionCallback = onConfirm;
  confirmModal.hidden = false;
}

function closeConfirm() {
  confirmModal.hidden = true;
  confirmActionCallback = null;
}

function executeConfirmAction() {
  if (confirmActionCallback) confirmActionCallback();
  closeConfirm();
}

// ============================================================
// Toast Notifications
// ============================================================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const iconSvg = type === 'success'
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  toast.innerHTML = `${iconSvg}<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Auto slug helper on name input
function generateSlugFromName(text) {
  return text.toString().toLowerCase().trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const firstNameInput = document.getElementById('card-firstName');
const lastNameInput = document.getElementById('card-lastName');
const slugInput = document.getElementById('card-slug');

function updateAutoSlug() {
  if (editingCardId) return;
  const fn = firstNameInput ? firstNameInput.value : '';
  const ln = lastNameInput ? lastNameInput.value : '';
  if (slugInput) {
    slugInput.value = generateSlugFromName(`${fn} ${ln}`);
  }
}

if (firstNameInput) firstNameInput.addEventListener('input', updateAutoSlug);
if (lastNameInput) lastNameInput.addEventListener('input', updateAutoSlug);

const emailInput = document.getElementById('card-email');
let emailManuallyEdited = false;

if (emailInput) {
  emailInput.addEventListener('input', () => {
    emailManuallyEdited = true;
  });
}

function updateAutoEmail() {
  if (editingCardId || emailManuallyEdited) return;
  const fn = firstNameInput ? firstNameInput.value.trim().toLowerCase() : '';
  if (emailInput && fn) {
    const cleanFn = fn.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    emailInput.value = cleanFn ? `${cleanFn}@lemonmind.agency` : '';
  }
}

if (firstNameInput) firstNameInput.addEventListener('input', updateAutoEmail);


