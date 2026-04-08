(function () {
  'use strict';
  var ctx = window.tmpclaw.ctx;

  // --- State ---
  var rootEl = null;
  var claims = [];
  var loading = false;
  var errorMsg = '';
  var refreshTimer = null;
  var REFRESH_MS = 30000;
  var statusFilter = 'all';
  var sortField = 'created_at';
  var sortDir = 'desc';
  var searchText = '';

  var API_BASE = '/api/claims';

  var STATUS_LABELS = {
    draft: 'Draft',
    submitted: 'Submitted',
    approved: 'Approved',
    rejected: 'Rejected',
    paid: 'Paid'
  };

  var CATEGORIES = ['other', 'travel', 'meals', 'lodging', 'transport', 'supplies', 'equipment', 'software', 'services', 'training'];

  var CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'];

  // --- Form state ---
  var showForm = false;
  var formSubmitting = false;
  var formError = '';
  var formData = { title: '', description: '', currency: 'USD' };
  var formLineItems = [];
  var uploadingLineItemIdx = -1;

  function resetForm() {
    showForm = false;
    formSubmitting = false;
    formError = '';
    formData = { title: '', description: '', currency: 'USD' };
    formLineItems = [{ description: '', category: 'other', amount: '', currency: 'USD', incurred_on: todayStr() }];
    uploadingLineItemIdx = -1;
  }

  function todayStr() {
    var d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + mm + '-' + dd;
  }

  // --- Styles ---
  function injectStyles() {
    if (document.getElementById('claims-ui-styles')) return;
    var style = document.createElement('style');
    style.id = 'claims-ui-styles';
    style.textContent = [
      /* layout */
      '.clm-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem; }',
      '.clm-title { font-size:1.1rem; font-weight:600; color:var(--text); }',
      '.clm-toolbar { display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; }',
      '.clm-search { background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:0.25rem; padding:0.25rem 0.5rem; font-family:var(--font-mono); font-size:0.85rem; min-width:10rem; }',
      '.clm-search::placeholder { color:var(--text-dim); }',

      /* filter tabs */
      '.clm-filters { display:flex; gap:0; border:1px solid var(--border); border-radius:0.25rem; overflow:hidden; margin-bottom:0.75rem; }',
      '.clm-filter-btn { background:none; border:none; padding:0.25rem 0.75rem; font-family:var(--font-mono); font-size:0.85rem; color:var(--text-dim); cursor:pointer; white-space:nowrap; }',
      '.clm-filter-btn:hover { background:var(--surface); }',
      '.clm-filter-btn.active { background:var(--accent); color:var(--bg-primary, #1a1a2e); font-weight:600; }',

      /* summary cards */
      '.clm-summary { display:grid; grid-template-columns:repeat(auto-fit, minmax(8rem, 1fr)); gap:0.75rem; margin-bottom:1rem; }',
      '.clm-stat-card { background:var(--surface); border:1px solid var(--border); border-radius:0.375rem; padding:0.75rem; text-align:center; }',
      '.clm-stat-value { font-size:1.25rem; font-weight:700; color:var(--text); }',
      '.clm-stat-label { font-size:0.75rem; color:var(--text-dim); margin-top:0.125rem; }',

      /* table */
      '.clm-table { width:100%; border-collapse:collapse; font-size:0.85rem; }',
      '.clm-table th { text-align:left; padding:0.375rem 0.5rem; border-bottom:1px solid var(--border); color:var(--text-dim); font-weight:500; cursor:pointer; user-select:none; white-space:nowrap; }',
      '.clm-table th:hover { color:var(--text); }',
      '.clm-table th .clm-sort-arrow { margin-left:0.25rem; font-size:0.7rem; }',
      '.clm-table td { padding:0.375rem 0.5rem; border-bottom:1px solid var(--border); color:var(--text); }',
      '.clm-table tr:hover td { background:var(--surface); }',
      '.clm-title-cell { max-width:18rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:inline-block; }',

      /* status badges — colour-coded */
      '.clm-badge { display:inline-block; font-size:0.7rem; font-weight:600; padding:0.125rem 0.5rem; border-radius:0.75rem; white-space:nowrap; text-transform:uppercase; letter-spacing:0.03em; }',
      '.clm-badge-draft { background:color-mix(in srgb, var(--text-dim, #999) 20%, transparent); color:var(--text-dim, #999); }',
      '.clm-badge-submitted { background:color-mix(in srgb, var(--warning, #f1c40f) 20%, transparent); color:var(--warning, #f1c40f); }',
      '.clm-badge-approved { background:color-mix(in srgb, var(--success, #00b894) 20%, transparent); color:var(--success, #00b894); }',
      '.clm-badge-rejected { background:color-mix(in srgb, var(--danger, #e74c3c) 20%, transparent); color:var(--danger, #e74c3c); }',

      /* amount */
      '.clm-amount { font-variant-numeric:tabular-nums; white-space:nowrap; }',

      /* empty / error */
      '.clm-empty { color:var(--text-dim); padding:1.5rem; text-align:center; }',
      '.clm-error { color:var(--danger); padding:0.75rem; background:var(--surface); border:1px solid var(--danger); border-radius:0.25rem; margin-bottom:0.75rem; }',
      '.clm-loading { color:var(--text-dim); padding:1.5rem; text-align:center; }',

      /* detail view */
      '.clm-detail-back { background:none; border:1px solid var(--border); color:var(--accent); border-radius:0.25rem; padding:0.25rem 0.625rem; cursor:pointer; font-family:var(--font-mono); font-size:0.85rem; }',
      '.clm-detail-back:hover { background:var(--surface); }',
      '.clm-detail-header { margin-bottom:0.75rem; }',
      '.clm-detail-title { font-size:1.1rem; font-weight:600; color:var(--text); display:flex; align-items:center; gap:0.5rem; }',
      '.clm-detail-meta { font-size:0.8rem; color:var(--text-dim); margin-top:0.25rem; display:flex; gap:0.75rem; flex-wrap:wrap; }',
      '.clm-line-items-title { font-size:0.9rem; font-weight:600; color:var(--text); margin:0.75rem 0 0.375rem; }',
      '.clm-li-table { width:100%; border-collapse:collapse; font-size:0.85rem; }',
      '.clm-li-table th { text-align:left; padding:0.375rem 0.5rem; border-bottom:1px solid var(--border); color:var(--text-dim); font-weight:500; }',
      '.clm-li-table td { padding:0.375rem 0.5rem; border-bottom:1px solid var(--border); color:var(--text); }',

      /* paid badge */
      '.clm-badge-paid { background:color-mix(in srgb, var(--accent, #3498db) 20%, transparent); color:var(--accent, #3498db); }',

      /* buttons */
      '.clm-btn { background:var(--accent); color:var(--bg-primary, #1a1a2e); border:none; border-radius:0.25rem; padding:0.25rem 0.75rem; font-family:var(--font-mono); font-size:0.85rem; cursor:pointer; font-weight:600; }',
      '.clm-btn:hover { filter:brightness(1.1); }',
      '.clm-btn:disabled { opacity:0.5; cursor:not-allowed; }',
      '.clm-btn-secondary { background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:0.25rem; padding:0.25rem 0.75rem; font-family:var(--font-mono); font-size:0.85rem; cursor:pointer; }',
      '.clm-btn-secondary:hover { background:var(--border); }',
      '.clm-btn-danger { background:none; color:var(--danger, #e74c3c); border:1px solid var(--danger, #e74c3c); border-radius:0.25rem; padding:0.125rem 0.5rem; font-family:var(--font-mono); font-size:0.8rem; cursor:pointer; }',
      '.clm-btn-danger:hover { background:color-mix(in srgb, var(--danger, #e74c3c) 10%, transparent); }',
      '.clm-btn-upload { background:none; color:var(--accent); border:1px solid var(--accent); border-radius:0.25rem; padding:0.125rem 0.5rem; font-family:var(--font-mono); font-size:0.8rem; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem; }',
      '.clm-btn-upload:hover { background:color-mix(in srgb, var(--accent) 10%, transparent); }',
      '.clm-btn-upload:disabled { opacity:0.5; cursor:not-allowed; }',
      '.clm-btn-approve { background:var(--success, #00b894); color:var(--bg-primary, #1a1a2e); }',
      '.clm-btn-approve:hover:not(:disabled) { filter:brightness(1.1); }',
      '.clm-btn-reject { background:var(--danger, #e74c3c); color:var(--bg-primary, #1a1a2e); }',
      '.clm-btn-reject:hover:not(:disabled) { filter:brightness(1.1); }',

      /* form */
      '.clm-form { background:var(--surface); border:1px solid var(--border); border-radius:0.375rem; padding:1rem; margin-bottom:1rem; }',
      '.clm-form-title { font-size:1rem; font-weight:600; color:var(--text); margin-bottom:0.75rem; }',
      '.clm-form-row { display:flex; gap:0.5rem; margin-bottom:0.5rem; flex-wrap:wrap; }',
      '.clm-form-field { display:flex; flex-direction:column; gap:0.125rem; }',
      '.clm-form-field.grow { flex:1; min-width:8rem; }',
      '.clm-form-label { font-size:0.75rem; color:var(--text-dim); font-weight:500; }',
      '.clm-form-input { background:var(--bg-primary, #1a1a2e); color:var(--text); border:1px solid var(--border); border-radius:0.25rem; padding:0.25rem 0.5rem; font-family:var(--font-mono); font-size:0.85rem; }',
      '.clm-form-input:focus { outline:1px solid var(--accent); border-color:var(--accent); }',
      '.clm-form-select { background:var(--bg-primary, #1a1a2e); color:var(--text); border:1px solid var(--border); border-radius:0.25rem; padding:0.25rem 0.5rem; font-family:var(--font-mono); font-size:0.85rem; }',
      '.clm-form-select:focus { outline:1px solid var(--accent); border-color:var(--accent); }',
      '.clm-form-textarea { background:var(--bg-primary, #1a1a2e); color:var(--text); border:1px solid var(--border); border-radius:0.25rem; padding:0.25rem 0.5rem; font-family:var(--font-mono); font-size:0.85rem; resize:vertical; min-height:2.5rem; }',
      '.clm-form-textarea:focus { outline:1px solid var(--accent); border-color:var(--accent); }',
      '.clm-form-actions { display:flex; gap:0.5rem; margin-top:0.75rem; justify-content:flex-end; }',

      /* line item form rows */
      '.clm-li-form-section { margin-top:0.75rem; border-top:1px solid var(--border); padding-top:0.75rem; }',
      '.clm-li-form-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; }',
      '.clm-li-form-header-title { font-size:0.9rem; font-weight:600; color:var(--text); }',
      '.clm-li-row { background:var(--bg-primary, #1a1a2e); border:1px solid var(--border); border-radius:0.25rem; padding:0.5rem; margin-bottom:0.375rem; }',
      '.clm-li-row-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.375rem; }',
      '.clm-li-row-num { font-size:0.75rem; color:var(--text-dim); font-weight:600; }',

      /* receipt indicator */
      '.clm-receipt-indicator { display:inline-flex; align-items:center; gap:0.25rem; font-size:0.75rem; color:var(--success, #00b894); }',
      '.clm-receipt-count { font-size:0.75rem; color:var(--text-dim); margin-left:0.25rem; }',

      /* review actions panel */
      '.clm-review-panel { background:var(--surface); border:1px solid var(--border); border-radius:0.375rem; padding:0.75rem; margin-top:0.75rem; }',
      '.clm-review-title { font-size:0.9rem; font-weight:600; color:var(--text); margin-bottom:0.5rem; }',
      '.clm-review-comment { width:100%; min-height:3.5rem; background:var(--bg-primary, #1a1a2e); color:var(--text); border:1px solid var(--border); border-radius:0.25rem; padding:0.375rem 0.5rem; font-family:var(--font-mono); font-size:0.85rem; resize:vertical; box-sizing:border-box; }',
      '.clm-review-comment::placeholder { color:var(--text-dim); }',
      '.clm-review-actions { display:flex; gap:0.5rem; margin-top:0.5rem; }',
      '.clm-review-feedback { font-size:0.8rem; margin-top:0.375rem; padding:0.25rem 0.5rem; border-radius:0.25rem; }',
      '.clm-review-feedback.success { color:var(--success, #00b894); }',
      '.clm-review-feedback.error { color:var(--danger, #e74c3c); }',

      /* history section */
      '.clm-history-title { font-size:0.9rem; font-weight:600; color:var(--text); margin:0.75rem 0 0.375rem; }',
      '.clm-history-list { list-style:none; margin:0; padding:0; }',
      '.clm-history-item { padding:0.375rem 0; border-bottom:1px solid var(--border); font-size:0.8rem; color:var(--text-dim); }',
      '.clm-history-item:last-child { border-bottom:none; }',
      '.clm-history-action { font-weight:600; color:var(--text); text-transform:capitalize; }',
      '.clm-history-comment { color:var(--text); font-style:italic; margin-top:0.125rem; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  // --- Detail view state ---
  var selectedClaimId = null;
  var selectedClaim = null;
  var claimLineItems = [];
  var claimHistory = [];
  var detailLoading = false;
  var reviewComment = '';
  var reviewSubmitting = false;
  var reviewFeedback = '';

  // --- Helpers ---
  function badgeHtml(status) {
    var label = STATUS_LABELS[status] || ctx.escapeHtml(status);
    return '<span class="clm-badge clm-badge-' + ctx.escapeHtml(status) + '" data-testid="claims-badge-' + ctx.escapeHtml(status) + '">' + label + '</span>';
  }

  function formatAmount(amount, currency) {
    var num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    return (currency || 'USD') + ' ' + num.toFixed(2);
  }

  function sortArrow(field) {
    if (sortField !== field) return '';
    return '<span class="clm-sort-arrow">' + (sortDir === 'asc' ? '&#9650;' : '&#9660;') + '</span>';
  }

  function getFilteredClaims() {
    var filtered = claims;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(function (c) { return c.status === statusFilter; });
    }
    if (searchText) {
      var q = searchText.toLowerCase();
      filtered = filtered.filter(function (c) {
        return (c.title || '').toLowerCase().indexOf(q) !== -1 ||
               (c.submitter_name || '').toLowerCase().indexOf(q) !== -1 ||
               (c.submitter_username || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    filtered = filtered.slice().sort(function (a, b) {
      var av = a[sortField];
      var bv = b[sortField];
      if (sortField === 'total_amount') {
        av = parseFloat(av) || 0;
        bv = parseFloat(bv) || 0;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }

  function categoryOptions(selected) {
    var html = '';
    for (var i = 0; i < CATEGORIES.length; i++) {
      var c = CATEGORIES[i];
      html += '<option value="' + ctx.escapeHtml(c) + '"' + (c === selected ? ' selected' : '') + '>' + ctx.escapeHtml(c.charAt(0).toUpperCase() + c.slice(1)) + '</option>';
    }
    return html;
  }

  function currencyOptions(selected) {
    var html = '';
    for (var i = 0; i < CURRENCIES.length; i++) {
      var c = CURRENCIES[i];
      html += '<option value="' + ctx.escapeHtml(c) + '"' + (c === selected ? ' selected' : '') + '>' + ctx.escapeHtml(c) + '</option>';
    }
    return html;
  }

  // --- Summary stats ---
  function renderSummary() {
    var total = claims.length;
    var counts = { draft: 0, submitted: 0, approved: 0, rejected: 0 };
    var totalAmount = 0;
    for (var i = 0; i < claims.length; i++) {
      var s = claims[i].status;
      if (counts[s] !== undefined) counts[s]++;
      totalAmount += parseFloat(claims[i].total_amount) || 0;
    }
    return '<div class="clm-summary" data-testid="claims-container-summary">' +
      '<div class="clm-stat-card" data-testid="claims-card-totalClaims"><div class="clm-stat-value">' + total + '</div><div class="clm-stat-label">Total Claims</div></div>' +
      '<div class="clm-stat-card" data-testid="claims-card-draft"><div class="clm-stat-value">' + counts.draft + '</div><div class="clm-stat-label">Draft</div></div>' +
      '<div class="clm-stat-card" data-testid="claims-card-submitted"><div class="clm-stat-value">' + counts.submitted + '</div><div class="clm-stat-label">Submitted</div></div>' +
      '<div class="clm-stat-card" data-testid="claims-card-approved"><div class="clm-stat-value">' + counts.approved + '</div><div class="clm-stat-label">Approved</div></div>' +
      '<div class="clm-stat-card" data-testid="claims-card-rejected"><div class="clm-stat-value">' + counts.rejected + '</div><div class="clm-stat-label">Rejected</div></div>' +
      '<div class="clm-stat-card" data-testid="claims-card-totalAmount"><div class="clm-stat-value">' + formatAmount(totalAmount, 'USD') + '</div><div class="clm-stat-label">Total Amount</div></div>' +
    '</div>';
  }

  // --- New Claim Form ---
  function renderForm() {
    var html = '<div class="clm-form" data-testid="claims-container-form">';
    html += '<div class="clm-form-title">New Claim</div>';

    if (formError) {
      html += '<div class="clm-error" data-testid="claims-container-formError">' + ctx.escapeHtml(formError) + '</div>';
    }

    /* claim-level fields */
    html += '<div class="clm-form-row">';
    html += '<div class="clm-form-field grow"><label class="clm-form-label">Title *</label>';
    html += '<input class="clm-form-input" data-action="form-field" data-field="title" value="' + ctx.escapeHtml(formData.title) + '" placeholder="Expense claim title" data-testid="claims-input-formTitle" /></div>';
    html += '<div class="clm-form-field"><label class="clm-form-label">Currency</label>';
    html += '<select class="clm-form-select" data-action="form-field" data-field="currency" data-testid="claims-select-formCurrency">' + currencyOptions(formData.currency) + '</select></div>';
    html += '</div>';

    html += '<div class="clm-form-row">';
    html += '<div class="clm-form-field grow"><label class="clm-form-label">Description</label>';
    html += '<textarea class="clm-form-textarea" data-action="form-field" data-field="description" placeholder="Optional description" data-testid="claims-textarea-formDescription">' + ctx.escapeHtml(formData.description) + '</textarea></div>';
    html += '</div>';

    /* line items section */
    html += '<div class="clm-li-form-section" data-testid="claims-container-lineItemsForm">';
    html += '<div class="clm-li-form-header">';
    html += '<div class="clm-li-form-header-title">Line Items (' + formLineItems.length + ')</div>';
    html += '<button class="clm-btn-secondary" data-action="add-line-item" data-testid="claims-button-addLineItem" tabindex="0" role="button" aria-label="Add line item">+ Add Item</button>';
    html += '</div>';

    for (var i = 0; i < formLineItems.length; i++) {
      var li = formLineItems[i];
      html += '<div class="clm-li-row" data-testid="claims-container-lineItemRow-' + i + '">';
      html += '<div class="clm-li-row-header">';
      html += '<span class="clm-li-row-num">Item ' + (i + 1) + '</span>';
      if (formLineItems.length > 1) {
        html += '<button class="clm-btn-danger" data-action="remove-line-item" data-li-idx="' + i + '" data-testid="claims-button-removeLineItem-' + i + '" tabindex="0" role="button" aria-label="Remove line item ' + (i + 1) + '">Remove</button>';
      }
      html += '</div>';

      html += '<div class="clm-form-row">';
      html += '<div class="clm-form-field grow"><label class="clm-form-label">Description *</label>';
      html += '<input class="clm-form-input" data-action="li-field" data-li-idx="' + i + '" data-field="description" value="' + ctx.escapeHtml(li.description) + '" placeholder="What was purchased" data-testid="claims-input-liDescription-' + i + '" /></div>';
      html += '<div class="clm-form-field"><label class="clm-form-label">Category</label>';
      html += '<select class="clm-form-select" data-action="li-field" data-li-idx="' + i + '" data-field="category" data-testid="claims-select-liCategory-' + i + '">' + categoryOptions(li.category) + '</select></div>';
      html += '</div>';

      html += '<div class="clm-form-row">';
      html += '<div class="clm-form-field"><label class="clm-form-label">Amount *</label>';
      html += '<input class="clm-form-input" data-action="li-field" data-li-idx="' + i + '" data-field="amount" type="number" step="0.01" min="0" value="' + ctx.escapeHtml(String(li.amount)) + '" placeholder="0.00" data-testid="claims-input-liAmount-' + i + '" /></div>';
      html += '<div class="clm-form-field"><label class="clm-form-label">Currency</label>';
      html += '<select class="clm-form-select" data-action="li-field" data-li-idx="' + i + '" data-field="currency" data-testid="claims-select-liCurrency-' + i + '">' + currencyOptions(li.currency) + '</select></div>';
      html += '<div class="clm-form-field"><label class="clm-form-label">Date *</label>';
      html += '<input class="clm-form-input" data-action="li-field" data-li-idx="' + i + '" data-field="incurred_on" type="date" value="' + ctx.escapeHtml(li.incurred_on) + '" data-testid="claims-input-liDate-' + i + '" /></div>';
      html += '</div>';
      html += '</div>';
    }
    html += '</div>';

    /* form actions */
    html += '<div class="clm-form-actions">';
    html += '<button class="clm-btn-secondary" data-action="cancel-form" data-testid="claims-button-cancelForm" tabindex="0" role="button" aria-label="Cancel new claim">Cancel</button>';
    html += '<button class="clm-btn" data-action="submit-form"' + (formSubmitting ? ' disabled' : '') + ' data-testid="claims-button-submitForm" tabindex="0" role="button" aria-label="Create claim">' + (formSubmitting ? 'Creating...' : 'Create Claim') + '</button>';
    html += '</div>';
    html += '</div>';
    return html;
  }

  // --- Claims list rendering ---
  function renderList() {
    var html = '';

    /* header */
    html += '<div class="clm-header" data-testid="claims-container-header">';
    html += '<div class="clm-title">My Claims</div>';
    html += '<div class="clm-toolbar">';
    html += '<input class="clm-search" data-action="search" placeholder="Search claims..." value="' + ctx.escapeHtml(searchText) + '" data-testid="claims-input-search" />';
    if (!showForm) {
      html += '<button class="clm-btn" data-action="new-claim" data-testid="claims-button-newClaim" tabindex="0" role="button" aria-label="Create new claim">+ New Claim</button>';
    }
    html += '</div>';
    html += '</div>';

    /* new claim form */
    if (showForm) {
      html += renderForm();
    }

    /* summary cards */
    html += renderSummary();

    /* filter tabs */
    html += '<div class="clm-filters" data-testid="claims-container-filters">';
    var statuses = ['all', 'draft', 'submitted', 'approved', 'rejected'];
    for (var i = 0; i < statuses.length; i++) {
      var s = statuses[i];
      var label = s === 'all' ? 'All' : STATUS_LABELS[s];
      var count = s === 'all' ? claims.length : claims.filter(function (c) { return c.status === s; }).length;
      html += '<button class="clm-filter-btn' + (statusFilter === s ? ' active' : '') + '" data-action="filter" data-status="' + s + '" data-testid="claims-button-filter-' + s + '">' + label + ' (' + count + ')</button>';
    }
    html += '</div>';

    if (errorMsg) {
      html += '<div class="clm-error" data-testid="claims-container-error">' + ctx.escapeHtml(errorMsg) + '</div>';
    }

    if (loading && !claims.length) {
      html += '<div class="clm-loading" data-testid="claims-container-loading">Loading claims...</div>';
      return html;
    }

    var filtered = getFilteredClaims();

    if (!filtered.length) {
      html += '<div class="clm-empty" data-testid="claims-container-empty">' + (claims.length ? 'No claims match the current filters.' : 'No claims yet.') + '</div>';
      return html;
    }

    /* table */
    html += '<table class="clm-table" data-testid="claims-table-claims">';
    html += '<thead><tr>';
    html += '<th data-action="sort" data-field="title" data-testid="claims-th-sort-title">Title' + sortArrow('title') + '</th>';
    html += '<th data-action="sort" data-field="status" data-testid="claims-th-sort-status">Status' + sortArrow('status') + '</th>';
    html += '<th data-action="sort" data-field="total_amount" data-testid="claims-th-sort-total-amount">Amount' + sortArrow('total_amount') + '</th>';
    html += '<th data-action="sort" data-field="line_item_count" data-testid="claims-th-sort-line-item-count">Items' + sortArrow('line_item_count') + '</th>';
    html += '<th data-action="sort" data-field="created_at" data-testid="claims-th-sort-created-at">Created' + sortArrow('created_at') + '</th>';
    html += '<th data-action="sort" data-field="updated_at" data-testid="claims-th-sort-updated-at">Updated' + sortArrow('updated_at') + '</th>';
    html += '</tr></thead>';
    html += '<tbody>';

    for (var j = 0; j < filtered.length; j++) {
      var c = filtered[j];
      html += '<tr data-action="view-claim" data-claim-id="' + ctx.escapeHtml(c.id) + '" tabindex="0" role="button" aria-label="View claim ' + ctx.escapeHtml(c.title) + '" data-testid="claims-row-claim-' + j + '">';
      html += '<td><span class="clm-title-cell">' + ctx.escapeHtml(c.title) + '</span></td>';
      html += '<td>' + badgeHtml(c.status) + '</td>';
      html += '<td><span class="clm-amount">' + formatAmount(c.total_amount, c.currency) + '</span></td>';
      html += '<td>' + (c.line_item_count || 0) + '</td>';
      html += '<td>' + ctx.timeAgo(c.created_at) + '</td>';
      html += '<td>' + ctx.timeAgo(c.updated_at) + '</td>';
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  // --- Claim detail rendering ---
  function renderDetail() {
    var html = '';
    html += '<button class="clm-detail-back" data-action="back" data-testid="claims-button-back" tabindex="0" role="button" aria-label="Back to claims list">&#8592; Back</button>';

    if (detailLoading) {
      html += '<div class="clm-loading" data-testid="claims-container-detailLoading">Loading claim details...</div>';
      return html;
    }

    if (!selectedClaim) {
      html += '<div class="clm-empty">Claim not found.</div>';
      return html;
    }

    var c = selectedClaim;
    html += '<div class="clm-detail-header" data-testid="claims-container-detail">';
    html += '<div class="clm-detail-title">' + ctx.escapeHtml(c.title) + ' ' + badgeHtml(c.status) + '</div>';
    html += '<div class="clm-detail-meta">';
    html += '<span>Amount: <strong>' + formatAmount(c.total_amount, c.currency) + '</strong></span>';
    html += '<span>Submitter: ' + ctx.escapeHtml(c.submitter_name || c.submitter_username || 'Unknown') + '</span>';
    html += '<span>Created: ' + ctx.timeAgo(c.created_at) + '</span>';
    if (c.submitted_at) html += '<span>Submitted: ' + ctx.timeAgo(c.submitted_at) + '</span>';
    if (c.approved_at) html += '<span>Approved: ' + ctx.timeAgo(c.approved_at) + '</span>';
    if (c.rejected_at) html += '<span>Rejected: ' + ctx.timeAgo(c.rejected_at) + '</span>';
    html += '</div>';
    if (c.description) {
      html += '<div style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-dim)">' + ctx.escapeHtml(c.description) + '</div>';
    }
    html += '</div>';

    /* line items */
    html += '<div class="clm-line-items-title" data-testid="claims-container-lineItems">Line Items (' + claimLineItems.length + ')</div>';
    if (!claimLineItems.length) {
      html += '<div class="clm-empty">No line items.</div>';
    } else {
      html += '<table class="clm-li-table" data-testid="claims-table-lineItems">';
      html += '<thead><tr>';
      html += '<th>Description</th><th>Category</th><th>Amount</th><th>Currency</th><th>Date</th><th>Receipt</th>';
      html += '</tr></thead><tbody>';
      for (var i = 0; i < claimLineItems.length; i++) {
        var li = claimLineItems[i];
        var receiptCount = (li.receipts && li.receipts.length) || 0;
        html += '<tr data-testid="claims-row-lineItem-' + i + '">';
        html += '<td>' + ctx.escapeHtml(li.description) + '</td>';
        html += '<td>' + ctx.escapeHtml(li.category || 'other') + '</td>';
        html += '<td><span class="clm-amount">' + formatAmount(li.amount, li.currency) + '</span></td>';
        html += '<td>' + ctx.escapeHtml(li.currency || 'USD') + '</td>';
        html += '<td>' + ctx.escapeHtml(li.incurred_on || '') + '</td>';
        html += '<td>';
        if (receiptCount > 0) {
          html += '<span class="clm-receipt-indicator" data-testid="claims-indicator-receipt-' + i + '">';
          html += '&#128206; ' + receiptCount;
          html += '</span> ';
        }
        html += '<button class="clm-btn-upload" data-action="upload-receipt" data-line-item-id="' + ctx.escapeHtml(li.id) + '" data-li-idx="' + i + '" data-testid="claims-button-uploadReceipt-' + i + '" tabindex="0" role="button" aria-label="Upload receipt for ' + ctx.escapeHtml(li.description) + '"' + (uploadingLineItemIdx === i ? ' disabled' : '') + '>';
        html += (uploadingLineItemIdx === i ? 'Uploading...' : '&#128206; Upload');
        html += '</button>';
        html += '</td>';
        html += '</tr>';
      }
      html += '</tbody></table>';
    }

    /* review actions — show for submitted claims */
    if (c.status === 'submitted') {
      html += '<div class="clm-review-panel" data-testid="claims-container-reviewPanel">';
      html += '<div class="clm-review-title">Manager Review</div>';
      html += '<textarea class="clm-review-comment" data-action="review-comment" placeholder="Add a comment (optional)..." data-testid="claims-textarea-reviewComment">' + ctx.escapeHtml(reviewComment) + '</textarea>';
      html += '<div class="clm-review-actions">';
      html += '<button class="clm-btn clm-btn-approve" data-action="approve" data-testid="claims-button-approve"' + (reviewSubmitting ? ' disabled' : '') + ' tabindex="0" role="button" aria-label="Approve claim">Approve</button>';
      html += '<button class="clm-btn clm-btn-reject" data-action="reject" data-testid="claims-button-reject"' + (reviewSubmitting ? ' disabled' : '') + ' tabindex="0" role="button" aria-label="Reject claim">Reject</button>';
      html += '</div>';
      if (reviewFeedback) {
        var fbClass = reviewFeedback.indexOf('successfully') !== -1 ? 'success' : 'error';
        html += '<div class="clm-review-feedback ' + fbClass + '" data-testid="claims-container-reviewFeedback">' + ctx.escapeHtml(reviewFeedback) + '</div>';
      }
      html += '</div>';
    }

    /* history section */
    if (claimHistory.length) {
      html += '<div class="clm-history-title" data-testid="claims-container-historyTitle">History (' + claimHistory.length + ')</div>';
      html += '<ul class="clm-history-list" data-testid="claims-list-history">';
      for (var h = 0; h < claimHistory.length; h++) {
        var entry = claimHistory[h];
        html += '<li class="clm-history-item" data-testid="claims-item-history-' + h + '">';
        html += '<span class="clm-history-action">' + ctx.escapeHtml(entry.action) + '</span>';
        if (entry.from_status && entry.to_status) {
          html += ' ' + ctx.escapeHtml(entry.from_status) + ' &rarr; ' + ctx.escapeHtml(entry.to_status);
        } else if (entry.to_status) {
          html += ' &rarr; ' + ctx.escapeHtml(entry.to_status);
        }
        if (entry.actor_username) {
          html += ' by <strong>' + ctx.escapeHtml(entry.actor_username) + '</strong>';
        }
        html += ' <span style="color:var(--text-dim)">' + ctx.timeAgo(entry.created_at) + '</span>';
        if (entry.comment) {
          html += '<div class="clm-history-comment">&ldquo;' + ctx.escapeHtml(entry.comment) + '&rdquo;</div>';
        }
        html += '</li>';
      }
      html += '</ul>';
    }

    return html;
  }

  // --- Render orchestrator ---
  function renderAll() {
    if (!rootEl) return;
    var html = selectedClaimId ? renderDetail() : renderList();
    ctx.patchHtml(rootEl, html);
  }

  // --- Data fetching ---
  function fetchClaims() {
    loading = true;
    renderAll();
    fetch(API_BASE)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to fetch claims: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        claims = Array.isArray(data) ? data : (data.claims || []);
        errorMsg = '';
        loading = false;
        renderAll();
      })
      .catch(function (err) {
        errorMsg = err.message || 'Failed to load claims';
        loading = false;
        renderAll();
      });
  }

  function fetchClaimDetail(id) {
    detailLoading = true;
    selectedClaimId = id;
    selectedClaim = null;
    claimLineItems = [];
    claimHistory = [];
    reviewComment = '';
    reviewSubmitting = false;
    reviewFeedback = '';
    renderAll();

    /* Try to find claim from already-fetched list for instant display */
    var found = null;
    for (var i = 0; i < claims.length; i++) {
      if (claims[i].id === id) { found = claims[i]; break; }
    }
    if (found) {
      selectedClaim = found;
    }

    /* Fetch full detail from individual claim endpoint to get line_items */
    fetch(API_BASE + '/' + encodeURIComponent(id))
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to fetch claim details: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        selectedClaim = data;
        claimLineItems = data.line_items || [];
        claimHistory = data.history || [];
        /* Also fetch receipts for each line item */
        return fetchLineItemReceipts();
      })
      .then(function () {
        detailLoading = false;
        renderAll();
      })
      .catch(function (err) {
        errorMsg = err.message || 'Failed to load claim details';
        detailLoading = false;
        renderAll();
      });
  }

  function fetchLineItemReceipts() {
    if (!claimLineItems.length) return Promise.resolve();
    var promises = [];
    for (var i = 0; i < claimLineItems.length; i++) {
      (function (idx) {
        var li = claimLineItems[idx];
        promises.push(
          fetch('/api/line-items/' + encodeURIComponent(li.id) + '/receipts')
            .then(function (res) {
              if (!res.ok) return { receipts: [] };
              return res.json();
            })
            .then(function (data) {
              claimLineItems[idx].receipts = data.receipts || [];
            })
            .catch(function () {
              claimLineItems[idx].receipts = [];
            })
        );
      })(i);
    }
    return Promise.all(promises);
  }

  // --- Review actions ---
  function submitReviewAction(action) {
    if (reviewSubmitting || !selectedClaimId) return;
    reviewSubmitting = true;
    reviewFeedback = '';
    renderAll();

    var body = { action: action };
    if (reviewComment.trim()) body.comment = reviewComment.trim();

    fetch(API_BASE + '/' + encodeURIComponent(selectedClaimId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (d) {
            throw new Error(d.error || 'Failed to ' + action + ' claim');
          });
        }
        return res.json();
      })
      .then(function (updated) {
        selectedClaim = updated;
        reviewComment = '';
        reviewSubmitting = false;
        reviewFeedback = action === 'approve' ? 'Claim approved successfully.' : 'Claim rejected.';
        /* Re-fetch detail to get updated history */
        fetch(API_BASE + '/' + encodeURIComponent(selectedClaimId))
          .then(function (res) { return res.ok ? res.json() : null; })
          .then(function (data) {
            if (data) {
              selectedClaim = data;
              claimLineItems = data.line_items || [];
              claimHistory = data.history || [];
            }
            renderAll();
          })
          .catch(function () { renderAll(); });
      })
      .catch(function (err) {
        reviewSubmitting = false;
        reviewFeedback = err.message || 'Action failed';
        renderAll();
      });
  }

  // --- Form submission ---
  function submitClaim() {
    /* Validate */
    if (!formData.title.trim()) {
      formError = 'Title is required';
      renderAll();
      return;
    }
    for (var i = 0; i < formLineItems.length; i++) {
      var li = formLineItems[i];
      if (!li.description.trim()) {
        formError = 'Line item ' + (i + 1) + ': description is required';
        renderAll();
        return;
      }
      var amt = parseFloat(li.amount);
      if (isNaN(amt) || amt < 0) {
        formError = 'Line item ' + (i + 1) + ': amount must be a non-negative number';
        renderAll();
        return;
      }
      if (!li.incurred_on) {
        formError = 'Line item ' + (i + 1) + ': date is required';
        renderAll();
        return;
      }
    }

    formSubmitting = true;
    formError = '';
    renderAll();

    var payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      currency: formData.currency,
      line_items: formLineItems.map(function (li) {
        return {
          description: li.description.trim(),
          category: li.category,
          amount: li.amount,
          currency: li.currency,
          incurred_on: li.incurred_on
        };
      })
    };

    fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (data) {
            throw new Error(data.error || 'Failed to create claim: ' + res.status);
          });
        }
        return res.json();
      })
      .then(function (data) {
        resetForm();
        /* Navigate to the new claim detail */
        fetchClaims();
        if (data && data.id) {
          fetchClaimDetail(data.id);
        }
      })
      .catch(function (err) {
        formError = err.message || 'Failed to create claim';
        formSubmitting = false;
        renderAll();
      });
  }

  // --- Receipt upload ---
  function triggerReceiptUpload(lineItemId, idx) {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf';
    input.style.display = 'none';
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      uploadReceipt(lineItemId, idx, file);
      document.body.removeChild(input);
    });
    document.body.appendChild(input);
    input.click();
  }

  function uploadReceipt(lineItemId, idx, file) {
    uploadingLineItemIdx = idx;
    renderAll();

    fetch('/api/line-items/' + encodeURIComponent(lineItemId) + '/receipts', {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
        'X-Filename': file.name
      },
      body: file
    })
      .then(function (res) {
        if (!res.ok) {
          return res.json().then(function (data) {
            throw new Error(data.error || 'Upload failed: ' + res.status);
          });
        }
        return res.json();
      })
      .then(function () {
        uploadingLineItemIdx = -1;
        /* Refresh detail to show updated receipt count */
        if (selectedClaimId) {
          fetchClaimDetail(selectedClaimId);
        }
      })
      .catch(function (err) {
        uploadingLineItemIdx = -1;
        errorMsg = err.message || 'Receipt upload failed';
        renderAll();
      });
  }

  // --- Event handling (delegation) ---
  function handleClick(e) {
    var target = e.target;
    while (target && target !== rootEl) {
      var action = target.getAttribute('data-action');
      if (action === 'filter') {
        statusFilter = target.getAttribute('data-status') || 'all';
        renderAll();
        return;
      }
      if (action === 'sort') {
        var field = target.getAttribute('data-field');
        if (field) {
          if (sortField === field) {
            sortDir = sortDir === 'asc' ? 'desc' : 'asc';
          } else {
            sortField = field;
            sortDir = field === 'total_amount' ? 'desc' : 'asc';
          }
          renderAll();
        }
        return;
      }
      if (action === 'view-claim') {
        var claimId = target.getAttribute('data-claim-id');
        if (claimId) fetchClaimDetail(claimId);
        return;
      }
      if (action === 'approve') {
        submitReviewAction('approve');
        return;
      }
      if (action === 'reject') {
        submitReviewAction('reject');
        return;
      }
      if (action === 'back') {
        selectedClaimId = null;
        selectedClaim = null;
        claimLineItems = [];
        claimHistory = [];
        detailLoading = false;
        reviewComment = '';
        reviewSubmitting = false;
        reviewFeedback = '';
        renderAll();
        return;
      }
      if (action === 'new-claim') {
        resetForm();
        showForm = true;
        renderAll();
        return;
      }
      if (action === 'cancel-form') {
        resetForm();
        renderAll();
        return;
      }
      if (action === 'submit-form') {
        submitClaim();
        return;
      }
      if (action === 'add-line-item') {
        formLineItems.push({ description: '', category: 'other', amount: '', currency: formData.currency, incurred_on: todayStr() });
        renderAll();
        return;
      }
      if (action === 'remove-line-item') {
        var removeIdx = parseInt(target.getAttribute('data-li-idx'), 10);
        if (!isNaN(removeIdx) && formLineItems.length > 1) {
          formLineItems.splice(removeIdx, 1);
          renderAll();
        }
        return;
      }
      if (action === 'upload-receipt') {
        var liId = target.getAttribute('data-line-item-id');
        var liIdx = parseInt(target.getAttribute('data-li-idx'), 10);
        if (liId && !isNaN(liIdx)) {
          triggerReceiptUpload(liId, liIdx);
        }
        return;
      }
      target = target.parentElement;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var target = e.target;
      var action = target.getAttribute('data-action');
      if (action === 'view-claim' || action === 'back' || action === 'approve' || action === 'reject' ||
          action === 'new-claim' || action === 'cancel-form' || action === 'submit-form' ||
          action === 'add-line-item' || action === 'remove-line-item' || action === 'upload-receipt') {
        e.preventDefault();
        handleClick(e);
      }
    }
  }

  function handleInput(e) {
    var target = e.target;
    var action = target.getAttribute('data-action');
    if (action === 'search') {
      searchText = target.value;
      renderAll();
      return;
    }
    if (action === 'form-field') {
      var field = target.getAttribute('data-field');
      if (field) {
        formData[field] = target.value;
      }
      return;
    }
    if (action === 'li-field') {
      var liIdx = parseInt(target.getAttribute('data-li-idx'), 10);
      var liField = target.getAttribute('data-field');
      if (!isNaN(liIdx) && liField && formLineItems[liIdx]) {
        formLineItems[liIdx][liField] = target.value;
      }
      return;
    }
  }

  function handleChange(e) {
    var target = e.target;
    var action = target.getAttribute('data-action');
    if (action === 'form-field' || action === 'li-field') {
      handleInput(e);
    }
    if (target.getAttribute('data-action') === 'review-comment') {
      reviewComment = target.value;
    }
  }

  // --- MFE Registration ---
  window.tmpclaw.register({
    name: 'claims',
    label: 'Claims',
    order: 7,
    mode: 'tab',

    init: function (container) {
      rootEl = container;
      injectStyles();
      rootEl.addEventListener('click', handleClick);
      rootEl.addEventListener('keydown', handleKeydown);
      rootEl.addEventListener('input', handleInput);
      rootEl.addEventListener('change', handleChange);
    },

    activate: function () {
      fetchClaims();
      refreshTimer = setInterval(function () {
        if (!showForm) fetchClaims();
      }, REFRESH_MS);
    },

    deactivate: function () {
      if (refreshTimer) clearInterval(refreshTimer);
      refreshTimer = null;
    }
  });
})();
