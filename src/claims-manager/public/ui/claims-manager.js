(function () {
  'use strict';

  const API_BASE = '/api/claims-mgr';

  let rootEl = null;
  let refreshTimer = null;
  let state = {
    claims: [],
    loading: false,
    error: '',
    filter: 'submitted',
    selectedClaim: null,
    detailLoading: false,
    detailError: '',
    modalAction: null,
    modalComment: '',
    modalBusy: false,
  };

  /* ── Styles ──────────────────────────────────────────────────────────── */

  function injectStyles() {
    if (document.getElementById('claims-mgr-styles')) return;
    const style = document.createElement('style');
    style.id = 'claims-mgr-styles';
    style.textContent = `
      .claims-mgr-root {
        padding: 1rem;
        font-family: var(--font-mono, monospace);
        color: var(--text, #e0e0e8);
        max-width: 72rem;
        margin: 0 auto;
      }
      .claims-mgr-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .claims-mgr-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--accent-light, #a29bfe);
      }
      .claims-mgr-filters {
        display: flex;
        gap: 0.25rem;
      }
      .claims-mgr-filter-btn {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        color: var(--text-dim, #8888a0);
        padding: 0.375rem 0.75rem;
        border-radius: 0.25rem;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.8125rem;
        transition: background 0.15s, color 0.15s;
      }
      .claims-mgr-filter-btn:hover {
        background: var(--surface2, #1a1a26);
      }
      .claims-mgr-filter-btn.active {
        background: var(--accent, #6c5ce7);
        color: var(--text, #e0e0e8);
        border-color: var(--accent, #6c5ce7);
      }
      .claims-mgr-count {
        font-size: 0.75rem;
        color: var(--text-dim, #8888a0);
        margin-left: 0.25rem;
      }
      .claims-mgr-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8125rem;
      }
      .claims-mgr-table th {
        text-align: left;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--border, #2a2a3a);
        color: var(--text-dim, #8888a0);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.6875rem;
        letter-spacing: 0.05em;
      }
      .claims-mgr-table td {
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--border, #2a2a3a);
        vertical-align: middle;
      }
      .claims-mgr-table tr:hover {
        background: var(--surface2, #1a1a26);
      }
      .claims-mgr-table tr {
        cursor: pointer;
      }
      .claims-mgr-amount {
        font-variant-numeric: tabular-nums;
        text-align: right;
      }
      .claims-mgr-badge {
        display: inline-block;
        padding: 0.125rem 0.5rem;
        border-radius: 0.75rem;
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
      }
      .claims-mgr-badge-draft { background: var(--surface2, #1a1a26); color: var(--text-dim, #8888a0); }
      .claims-mgr-badge-submitted { background: color-mix(in srgb, var(--warn, #fdcb6e) 20%, transparent); color: var(--warn, #fdcb6e); }
      .claims-mgr-badge-approved { background: color-mix(in srgb, var(--success, #00b894) 20%, transparent); color: var(--success, #00b894); }
      .claims-mgr-badge-rejected { background: color-mix(in srgb, var(--danger, #ff6b9d) 20%, transparent); color: var(--danger, #ff6b9d); }
      .claims-mgr-badge-paid { background: color-mix(in srgb, var(--accent, #6c5ce7) 20%, transparent); color: var(--accent, #6c5ce7); }
      .claims-mgr-empty {
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-dim, #8888a0);
        font-style: italic;
      }
      .claims-mgr-error {
        background: color-mix(in srgb, var(--danger, #ff6b9d) 10%, var(--surface, #12121a));
        border: 1px solid var(--danger, #ff6b9d);
        color: var(--danger, #ff6b9d);
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        margin-bottom: 1rem;
      }
      .claims-mgr-loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-dim, #8888a0);
      }

      /* Detail panel */
      .claims-mgr-detail {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.5rem;
        padding: 1.25rem;
        margin-top: 1rem;
      }
      .claims-mgr-detail-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        margin-bottom: 1rem;
        gap: 1rem;
      }
      .claims-mgr-detail-title {
        font-size: 1.125rem;
        color: var(--accent-light, #a29bfe);
        margin: 0 0 0.25rem 0;
      }
      .claims-mgr-detail-meta {
        color: var(--text-dim, #8888a0);
        font-size: 0.75rem;
      }
      .claims-mgr-detail-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
      }
      .claims-mgr-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.8125rem;
        font-weight: 600;
        transition: opacity 0.15s;
      }
      .claims-mgr-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .claims-mgr-btn-approve {
        background: var(--success, #00b894);
        color: #000;
      }
      .claims-mgr-btn-reject {
        background: var(--danger, #ff6b9d);
        color: #000;
      }
      .claims-mgr-btn-back {
        background: var(--surface2, #1a1a26);
        color: var(--text, #e0e0e8);
        border: 1px solid var(--border, #2a2a3a);
      }
      .claims-mgr-section-title {
        font-size: 0.75rem;
        color: var(--text-dim, #8888a0);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin: 1rem 0 0.5rem 0;
        font-weight: 600;
      }
      .claims-mgr-line-items {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.8125rem;
      }
      .claims-mgr-line-items th {
        text-align: left;
        padding: 0.375rem 0.5rem;
        border-bottom: 1px solid var(--border, #2a2a3a);
        color: var(--text-dim, #8888a0);
        font-weight: 600;
        font-size: 0.6875rem;
        text-transform: uppercase;
      }
      .claims-mgr-line-items td {
        padding: 0.375rem 0.5rem;
        border-bottom: 1px solid var(--border, #2a2a3a);
      }
      .claims-mgr-history {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      .claims-mgr-history li {
        padding: 0.375rem 0;
        font-size: 0.75rem;
        color: var(--text-dim, #8888a0);
        border-bottom: 1px solid color-mix(in srgb, var(--border, #2a2a3a) 50%, transparent);
      }
      .claims-mgr-history-action {
        font-weight: 600;
        color: var(--text, #e0e0e8);
      }
      .claims-mgr-desc {
        margin: 0.5rem 0 0 0;
        color: var(--text, #e0e0e8);
        font-size: 0.8125rem;
        line-height: 1.5;
      }

      /* Modal */
      .claims-mgr-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .claims-mgr-modal {
        background: var(--surface, #12121a);
        border: 1px solid var(--border, #2a2a3a);
        border-radius: 0.5rem;
        padding: 1.25rem;
        min-width: 20rem;
        max-width: 28rem;
      }
      .claims-mgr-modal h3 {
        margin: 0 0 0.75rem 0;
        font-size: 1rem;
        color: var(--accent-light, #a29bfe);
      }
      .claims-mgr-modal textarea {
        width: 100%;
        min-height: 4rem;
        background: var(--surface2, #1a1a26);
        border: 1px solid var(--border, #2a2a3a);
        color: var(--text, #e0e0e8);
        font-family: inherit;
        font-size: 0.8125rem;
        padding: 0.5rem;
        border-radius: 0.25rem;
        resize: vertical;
        box-sizing: border-box;
      }
      .claims-mgr-modal-btns {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        margin-top: 0.75rem;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Helpers ─────────────────────────────────────────────────────────── */

  const { ctx } = window.tmpclaw;

  function esc(s) {
    return ctx.escapeHtml(String(s ?? ''));
  }

  function fmtAmount(amount, currency) {
    var n = parseFloat(amount);
    if (isNaN(n)) return esc(amount);
    return esc(currency || 'USD') + '&nbsp;' + n.toFixed(2);
  }

  function statusBadge(status) {
    return '<span class="claims-mgr-badge claims-mgr-badge-' + esc(status) + '" data-testid="claims-mgr-badge-' + esc(status) + '">' + esc(status) + '</span>';
  }

  /* ── API ──────────────────────────────────────────────────────────────── */

  async function fetchClaims() {
    state.loading = true;
    state.error = '';
    render();
    try {
      var res = await fetch(API_BASE + '/claims');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      state.claims = data.claims || [];
      state.error = '';
    } catch (err) {
      state.error = 'Failed to load claims: ' + (err instanceof Error ? err.message : String(err));
    }
    state.loading = false;
    render();
  }

  async function fetchClaimDetail(id) {
    state.detailLoading = true;
    state.detailError = '';
    render();
    try {
      var res = await fetch(API_BASE + '/claims/' + encodeURIComponent(id));
      if (!res.ok) throw new Error('HTTP ' + res.status);
      state.selectedClaim = await res.json();
      state.detailError = '';
    } catch (err) {
      state.detailError = 'Failed to load claim: ' + (err instanceof Error ? err.message : String(err));
    }
    state.detailLoading = false;
    render();
  }

  async function performAction(claimId, action, comment) {
    // Use a fixed manager actor for now — in production this comes from auth context
    var body = {
      action: action,
      actor_id: 'b0b00000-0000-4000-8000-000000000001',
      comment: comment || '',
    };

    var res = await fetch(API_BASE + '/claims/' + encodeURIComponent(claimId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      var errData;
      try { errData = await res.json(); } catch (_e) { errData = {}; }
      throw new Error(errData.error || 'HTTP ' + res.status);
    }
    return res.json();
  }

  /* ── Render: list view ───────────────────────────────────────────────── */

  function filteredClaims() {
    if (state.filter === 'all') return state.claims;
    return state.claims.filter(function (c) { return c.status === state.filter; });
  }

  function countByStatus(status) {
    if (status === 'all') return state.claims.length;
    return state.claims.filter(function (c) { return c.status === status; }).length;
  }

  function renderList() {
    var filtered = filteredClaims();
    var filters = ['submitted', 'approved', 'rejected', 'paid', 'draft', 'all'];
    var filterLabels = { submitted: 'Submitted', approved: 'Approved', rejected: 'Rejected', paid: 'Paid', draft: 'Draft', all: 'All' };

    var html = '<div class="claims-mgr-root">';
    html += '<div class="claims-mgr-header">';
    html += '<h2>Claims Manager</h2>';
    html += '<div class="claims-mgr-filters" data-testid="claims-mgr-filters">';
    for (var i = 0; i < filters.length; i++) {
      var f = filters[i];
      var cnt = countByStatus(f);
      html += '<button class="claims-mgr-filter-btn' + (state.filter === f ? ' active' : '') + '"'
        + ' data-action="filter" data-filter="' + esc(f) + '"'
        + ' data-testid="claims-mgr-btn-filter-' + esc(f) + '"'
        + ' tabindex="0" role="button" aria-label="Filter by ' + esc(filterLabels[f]) + '">'
        + esc(filterLabels[f])
        + '<span class="claims-mgr-count">' + cnt + '</span>'
        + '</button>';
    }
    html += '</div></div>';

    if (state.error) {
      html += '<div class="claims-mgr-error" data-testid="claims-mgr-error">' + esc(state.error) + '</div>';
    }

    if (state.loading) {
      html += '<div class="claims-mgr-loading">Loading claims...</div>';
    } else if (filtered.length === 0) {
      html += '<div class="claims-mgr-empty" data-testid="claims-mgr-empty">No ' + (state.filter === 'all' ? '' : esc(state.filter) + ' ') + 'claims found.</div>';
    } else {
      html += '<table class="claims-mgr-table" data-testid="claims-mgr-table-claims">';
      html += '<thead><tr>';
      html += '<th>Title</th><th>Submitter</th><th>Status</th><th style="text-align:right">Amount</th><th>Items</th><th>Submitted</th>';
      html += '</tr></thead><tbody>';
      for (var j = 0; j < filtered.length; j++) {
        var c = filtered[j];
        var submitted = c.submitted_at ? ctx.timeAgo(c.submitted_at) : '-';
        html += '<tr data-action="select" data-claim-id="' + esc(c.id) + '" data-testid="claims-mgr-row-claim-' + esc(c.id) + '">';
        html += '<td>' + esc(c.title) + '</td>';
        html += '<td>' + esc(c.submitter_name || c.submitter_username || '-') + '</td>';
        html += '<td>' + statusBadge(c.status) + '</td>';
        html += '<td class="claims-mgr-amount">' + fmtAmount(c.total_amount, c.currency) + '</td>';
        html += '<td>' + (c.line_item_count || 0) + '</td>';
        html += '<td>' + esc(submitted) + '</td>';
        html += '</tr>';
      }
      html += '</tbody></table>';
    }
    html += '</div>';
    return html;
  }

  /* ── Render: detail view ─────────────────────────────────────────────── */

  function renderDetail() {
    var claim = state.selectedClaim;
    if (!claim) return '';

    var html = '<div class="claims-mgr-root">';
    html += '<div class="claims-mgr-detail" data-testid="claims-mgr-card-claim-' + esc(claim.id) + '">';

    // Header
    html += '<div class="claims-mgr-detail-header">';
    html += '<div>';
    html += '<h3 class="claims-mgr-detail-title">' + esc(claim.title) + '</h3>';
    html += '<div class="claims-mgr-detail-meta">';
    html += 'By ' + esc(claim.submitter_name || claim.submitter_username || '-');
    html += ' &middot; ' + statusBadge(claim.status);
    html += ' &middot; ' + fmtAmount(claim.total_amount, claim.currency);
    if (claim.approver_name || claim.approver_username) html += ' &middot; Reviewed by ' + esc(claim.approver_name || claim.approver_username);
    html += '</div></div>';

    // Action buttons
    html += '<div class="claims-mgr-detail-actions">';
    html += '<button class="claims-mgr-btn claims-mgr-btn-back" data-action="back" data-testid="claims-mgr-btn-back" tabindex="0" role="button" aria-label="Back to list">Back</button>';
    if (claim.status === 'submitted') {
      html += '<button class="claims-mgr-btn claims-mgr-btn-approve" data-action="open-modal" data-modal-action="approve" data-testid="claims-mgr-btn-approve-' + esc(claim.id) + '" tabindex="0" role="button" aria-label="Approve claim">Approve</button>';
      html += '<button class="claims-mgr-btn claims-mgr-btn-reject" data-action="open-modal" data-modal-action="reject" data-testid="claims-mgr-btn-reject-' + esc(claim.id) + '" tabindex="0" role="button" aria-label="Reject claim">Reject</button>';
    }
    html += '</div></div>';

    // Description
    if (claim.description) {
      html += '<p class="claims-mgr-desc">' + esc(claim.description) + '</p>';
    }

    // Line items
    var lineItems = claim.line_items || [];
    html += '<div class="claims-mgr-section-title">Line Items (' + lineItems.length + ')</div>';
    if (lineItems.length) {
      html += '<table class="claims-mgr-line-items" data-testid="claims-mgr-table-line-items">';
      html += '<thead><tr><th>Description</th><th>Category</th><th style="text-align:right">Amount</th><th>Date</th></tr></thead><tbody>';
      for (var i = 0; i < lineItems.length; i++) {
        var li = lineItems[i];
        html += '<tr data-testid="claims-mgr-row-line-item-' + esc(li.id) + '">';
        html += '<td>' + esc(li.description) + '</td>';
        html += '<td>' + esc(li.category || 'other') + '</td>';
        html += '<td class="claims-mgr-amount">' + fmtAmount(li.amount, li.currency) + '</td>';
        html += '<td>' + esc(li.incurred_on || '-') + '</td>';
        html += '</tr>';
      }
      html += '</tbody></table>';
    } else {
      html += '<div class="claims-mgr-empty">No line items.</div>';
    }

    // History
    var history = claim.history || [];
    if (history.length) {
      html += '<div class="claims-mgr-section-title">History</div>';
      html += '<ul class="claims-mgr-history" data-testid="claims-mgr-list-history">';
      for (var h = 0; h < history.length; h++) {
        var ev = history[h];
        html += '<li data-testid="claims-mgr-row-history-' + esc(ev.id) + '">';
        html += '<span class="claims-mgr-history-action">' + esc(ev.action) + '</span>';
        html += ' by ' + esc(ev.actor_username || '-');
        if (ev.from_status) html += ' (' + esc(ev.from_status) + ' &rarr; ' + esc(ev.to_status) + ')';
        if (ev.comment) html += ' &mdash; ' + esc(ev.comment);
        html += ' &middot; ' + ctx.timeAgo(ev.created_at);
        html += '</li>';
      }
      html += '</ul>';
    }

    html += '</div>';

    // Modal
    if (state.modalAction) {
      var actionLabel = state.modalAction === 'approve' ? 'Approve' : 'Reject';
      var btnClass = state.modalAction === 'approve' ? 'claims-mgr-btn-approve' : 'claims-mgr-btn-reject';
      html += '<div class="claims-mgr-modal-overlay" data-action="close-modal" data-testid="claims-mgr-modal-' + esc(state.modalAction) + '-confirm">';
      html += '<div class="claims-mgr-modal" data-action="stop-propagation">';
      html += '<h3>' + esc(actionLabel) + ' Claim</h3>';
      html += '<label style="display:block;font-size:0.75rem;color:var(--text-dim,#8888a0);margin-bottom:0.25rem">Comment (optional)</label>';
      html += '<textarea data-testid="claims-mgr-input-modal-comment" placeholder="Add a comment...">' + esc(state.modalComment) + '</textarea>';
      html += '<div class="claims-mgr-modal-btns">';
      html += '<button class="claims-mgr-btn claims-mgr-btn-back" data-action="close-modal" data-testid="claims-mgr-btn-modal-cancel" tabindex="0" role="button" aria-label="Cancel">Cancel</button>';
      html += '<button class="claims-mgr-btn ' + btnClass + '" data-action="confirm-action" data-testid="claims-mgr-btn-modal-confirm"'
        + (state.modalBusy ? ' disabled' : '')
        + ' tabindex="0" role="button" aria-label="Confirm ' + esc(actionLabel) + '">'
        + (state.modalBusy ? 'Processing...' : esc(actionLabel))
        + '</button>';
      html += '</div></div></div>';
    }

    html += '</div>';
    return html;
  }

  /* ── Main render ─────────────────────────────────────────────────────── */

  function render() {
    if (!rootEl) return;
    if (state.modalAction) {
      // When modal is open, only update via patchHtml to preserve textarea
      ctx.patchHtml(rootEl, state.selectedClaim ? renderDetail() : renderList());
      // Focus the textarea in modal
      var ta = rootEl.querySelector('[data-testid="claims-mgr-input-modal-comment"]');
      if (ta && document.activeElement !== ta) ta.focus();
      return;
    }

    if (state.selectedClaim && !state.detailLoading) {
      ctx.patchHtml(rootEl, renderDetail());
    } else if (state.detailLoading) {
      ctx.patchHtml(rootEl, '<div class="claims-mgr-root"><div class="claims-mgr-loading">Loading claim details...</div></div>');
    } else {
      ctx.patchHtml(rootEl, renderList());
    }

    // Set badge count to number of submitted claims awaiting review
    var submittedCount = countByStatus('submitted');
    ctx.setBadge('claims-manager', submittedCount);
  }

  /* ── Event handling (delegation) ─────────────────────────────────────── */

  function handleClick(e) {
    var target = e.target;
    while (target && target !== rootEl) {
      var action = target.getAttribute('data-action');
      if (action === 'stop-propagation') {
        e.stopPropagation();
        return;
      }
      if (action === 'filter') {
        state.filter = target.getAttribute('data-filter') || 'submitted';
        render();
        return;
      }
      if (action === 'select') {
        var claimId = target.getAttribute('data-claim-id');
        if (claimId) fetchClaimDetail(claimId);
        return;
      }
      if (action === 'back') {
        state.selectedClaim = null;
        state.detailError = '';
        state.modalAction = null;
        state.modalComment = '';
        render();
        return;
      }
      if (action === 'open-modal') {
        state.modalAction = target.getAttribute('data-modal-action');
        state.modalComment = '';
        state.modalBusy = false;
        render();
        return;
      }
      if (action === 'close-modal') {
        state.modalAction = null;
        state.modalComment = '';
        render();
        return;
      }
      if (action === 'confirm-action') {
        if (state.modalBusy) return;
        // Read comment from textarea
        var textarea = rootEl.querySelector('[data-testid="claims-mgr-input-modal-comment"]');
        var comment = textarea ? textarea.value : state.modalComment;
        var currentAction = state.modalAction;
        var currentClaimId = state.selectedClaim ? state.selectedClaim.id : null;
        if (!currentClaimId || !currentAction) return;

        state.modalBusy = true;
        render();

        performAction(currentClaimId, currentAction, comment)
          .then(function () {
            state.modalAction = null;
            state.modalComment = '';
            state.modalBusy = false;
            // Refresh detail and list
            fetchClaimDetail(currentClaimId);
            fetchClaims();
          })
          .catch(function (err) {
            state.modalBusy = false;
            state.detailError = 'Action failed: ' + (err instanceof Error ? err.message : String(err));
            state.modalAction = null;
            render();
          });
        return;
      }
      target = target.parentElement;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && state.modalAction) {
      state.modalAction = null;
      state.modalComment = '';
      render();
      return;
    }
    // Enter/Space on buttons
    if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('data-action')) {
      e.preventDefault();
      e.target.click();
    }
  }

  /* ── Registration ────────────────────────────────────────────────────── */

  window.tmpclaw.register({
    name: 'claims-manager',
    label: 'Claims Manager',
    order: 35,
    mode: 'tab',

    init: function (container) {
      rootEl = container;
      injectStyles();
      rootEl.addEventListener('click', handleClick);
      rootEl.addEventListener('keydown', handleKeydown);
      render();
    },

    activate: function () {
      fetchClaims();
      refreshTimer = setInterval(fetchClaims, 30000);
    },

    deactivate: function () {
      if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
      }
    },
  });
})();
