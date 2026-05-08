/**
 * Everypay Prototype — Shared Sidebar Layout
 * Replaces <aside> content with shared navigation. Auto-highlights active page.
 *
 * Usage on each page:
 *   1. Replace entire <aside>...</aside> with: <aside id="ep-sidebar"></aside>
 *   2. Add <script src="assets/layout.js"></script> before </body>
 */

(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';

  var navItems = [
    { label: 'Overview', href: 'index.html', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { label: 'Payments', href: 'console-payments.html', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Collection', href: 'console-collection.html', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Business Activities', href: 'console-activities.html', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Partners', href: 'console-partners.html', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { label: 'Team', href: 'console-team.html', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  ];

  function svg(path) {
    return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="' + path + '"></path></svg>';
  }

  function linkClasses(active) {
    return active
      ? 'flex items-center gap-3 px-3 py-2 text-sm font-medium text-everypay-700 bg-everypay-50 rounded-lg'
      : 'flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg';
  }

  var html = '';

  // Default hidden state for onboarding-gated sections
  html += '<style>#ep-nav-post-onboard,#ep-nav-compliance{display:none}</style>';

  // Logo
  html += '<div class="h-16 flex items-center px-6 border-b border-gray-100">';
  html += '<div class="w-8 h-8 bg-everypay-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">E</div>';
  html += '<span class="text-xl font-bold text-slate-800 tracking-tight">Everypay</span>';
  html += '</div>';

  // Nav
  html += '<div class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">';
  navItems.forEach(function (item) {
    html += '<a href="' + item.href + '" class="' + linkClasses(page === item.href) + '">';
    html += svg(item.icon);
    html += item.label;
    html += '</a>';
  });

  // Pre-Onboarding: "+ Onboard" button (hidden once onboarded)
  html += '<div id="ep-nav-pre-onboard" class="pt-4 mt-4 border-t border-gray-100 px-3">';
  html += '<a href="console-onboard.html" class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-dashed border-gray-300 transition-colors">';
  html += '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>';
  html += '<span>Onboard</span>';
  html += '</a>';
  html += '</div>';

  // Post-Onboarding: OSN Settlement section (hidden before onboarding)
  html += '<div id="ep-nav-post-onboard" class="pt-4 mt-4 border-t border-gray-100">';

  // Crypto Treasury
  var cryptoActive = page === 'console-crypto.html';
  html += '<a href="console-crypto.html" class="' + (cryptoActive ? 'flex items-center gap-3 px-3 py-2 text-sm font-medium text-everypay-700 bg-everypay-50 rounded-lg' : 'flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-gray-50 rounded-lg') + '">';
  html += '<div class="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-[10px] font-bold">C</div>';
  html += '<span>Crypto Treasury</span>';
  html += '<span class="ml-auto w-2 h-2 rounded-full bg-green-500"></span>';
  html += '</a>';
  html += '</div>';

  // Compliance (hidden before onboarding)
  var compActive = page === 'console-compliance.html';
  html += '<div id="ep-nav-compliance" class="pt-4 mt-4 border-t border-gray-100">';
  html += '<a href="console-compliance.html" class="' + linkClasses(compActive) + '">';
  html += svg('M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z');
  html += 'Compliance';
  html += '</a>';
  html += '</div>';

  // Close nav container (flex-1) so footer stays pinned at bottom
  html += '</div>';

  // User footer (outside flex-1 container)
  html += '<div class="p-4 border-t border-gray-200">';
  html += '<div class="flex items-center justify-between">';
  html += '<div class="flex items-center gap-3">';
  html += '<div class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">JD</div>';
  html += '<div><div class="text-sm font-medium text-slate-800">John Doe</div>';
  html += '<div class="text-xs text-gray-500">Acme Trading Corp</div></div>';
  html += '</div>';
  html += '<div class="flex items-center gap-2">';
  // Reset demo state
  html += '<button onclick="localStorage.removeItem(\'everypay-onboarded\');localStorage.removeItem(\'everypay-bank-info\');localStorage.removeItem(\'everypay-crypto-mgmt\');location.reload()" class="text-[10px] text-gray-300 hover:text-red-400 transition-colors" title="Reset to pre-onboard state">Reset</button>';
  html += '<a href="website.html" class="text-gray-400 hover:text-red-500">';
  html += '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>';
  html += '</a>';
  html += '</div>';
  html += '</div>';

  // Inject
  var sidebar = document.getElementById('ep-sidebar');
  if (sidebar) {
    sidebar.innerHTML = html;

    // Toggle pre/post onboarding state based on localStorage
    var onboarded = localStorage.getItem('everypay-onboarded') === 'true';
    var preEl = document.getElementById('ep-nav-pre-onboard');
    var postEl = document.getElementById('ep-nav-post-onboard');
    var compEl = document.getElementById('ep-nav-compliance');
    if (preEl && postEl) {
      preEl.style.display = onboarded ? 'none' : 'block';
      postEl.style.display = onboarded ? 'block' : 'none';
    }
    if (compEl) {
      compEl.style.display = onboarded ? 'block' : 'none';
    }
  }

  // ============ Header Right Menu (shared across pages) ============
  var headerRight = document.getElementById('ep-header-right');
  if (headerRight) {
    headerRight.innerHTML = '' +
      '<div class="flex items-center gap-4">' +
        '<a href="console-team.html" class="text-gray-300 hover:text-gray-500 transition-colors" title="Team">' +
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>' +
        '</a>' +
        '<button class="text-gray-300 hover:text-gray-500 transition-colors" title="Board Authority">' +
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>' +
        '</button>' +
        '<button class="text-gray-300 hover:text-gray-500 transition-colors" title="Fee Center">' +
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>' +
        '</button>' +
        '<button class="text-gray-300 hover:text-gray-500 transition-colors" title="Tasks">' +
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>' +
        '</button>' +
        '<button class="text-gray-300 hover:text-gray-500 transition-colors" title="Help">' +
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' +
        '</button>' +
        '<button class="text-gray-300 hover:text-gray-500 relative" title="Notifications">' +
          '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>' +
          '<span class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">2</span>' +
        '</button>' +
        '<div class="h-8 w-px bg-gray-200 mx-1"></div>' +
        '<div class="relative">' +
          '<button id="ep-user-menu-btn" onclick="document.getElementById(\'ep-user-dropdown\').classList.toggle(\'hidden\')" class="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-xl transition-colors relative z-50 cursor-pointer">' +
            '<div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">JD</div>' +
            '<div class="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">' +
              '<div class="w-2 h-2 bg-green-500 rounded-full"></div>' +
              '<span class="text-xs font-mono text-gray-600">0x285c...3f024f</span>' +
              '<span class="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded font-medium">Bound</span>' +
            '</div>' +
            '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>' +
          '</button>' +
          '<div id="ep-user-dropdown" class="hidden absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]">' +
            '<div class="px-3 py-2.5 bg-gray-50 border-b border-gray-100">' +
              '<div class="text-sm font-bold text-gray-900">John Doe</div>' +
              '<div class="text-xs text-gray-500">Administrator</div>' +
            '</div>' +
            '<div class="p-1">' +
              '<a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">' +
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>' +
                'Reset Personal Key' +
              '</a>' +
              '<a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">' +
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-4 4h8"></path></svg>' +
                'Reset Password' +
              '</a>' +
              '<a href="#" class="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">' +
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' +
                'Authenticator App' +
              '</a>' +
              '<div class="my-1 border-t border-gray-100"></div>' +
              '<a href="website.html" class="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">' +
                '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>' +
                'Sign out' +
              '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
})();
