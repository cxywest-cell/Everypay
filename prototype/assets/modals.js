/**
 * Everypay Prototype — Shared Modal Injector
 * Injects shared modals into the page DOM at load time.
 * Load this after Tailwind config, before </head>.
 */

(function() {
    const modals = {
        'add-partner-modal': `    <div id="add-partner-modal" class="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-everypay-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-everypay-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New Partner</h3>
                            <div class="mt-4 space-y-4">                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Select Partner</label>
                                    <select id="partner-select" onchange="onPartnerSelectChange()" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm">
                                        <option value="">Select a partner...</option>
                                        <option value="alpha">Alpha Supplies</option>
                                        <option value="beta">Beta Services</option>
                                        <option value="gamma">Gamma Retail</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Partner Type</label>
                                    <input type="text" id="partner-type" readonly class="mt-1 block w-full border border-gray-300 rounded-md bg-gray-50 text-gray-500 shadow-sm py-2 px-3 focus:outline-none cursor-not-allowed sm:text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input type="text" id="partner-name" readonly class="mt-1 block w-full border border-gray-300 rounded-md bg-gray-50 text-gray-500 shadow-sm py-2 px-3 focus:outline-none cursor-not-allowed sm:text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Contact Person</label>
                                    <input type="text" id="partner-contact" readonly class="mt-1 block w-full border border-gray-300 rounded-md bg-gray-50 text-gray-500 shadow-sm py-2 px-3 focus:outline-none cursor-not-allowed sm:text-sm">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="partner-email" readonly class="mt-1 block w-full border border-gray-300 rounded-md bg-gray-50 text-gray-500 shadow-sm py-2 px-3 focus:outline-none cursor-not-allowed sm:text-sm">
                                </div>
                            </div>
                        </div>
                    </div>

 
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onclick="savePartner()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-everypay-600 text-base font-medium text-white hover:bg-everypay-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-everypay-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Save Partner
                    </button>
                    <button type="button" onclick="closeAddPartnerModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Signing Plug-in (Banking Document Style) -->`,
        'signing-modal': `    <div id="signing-modal" class="hidden fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <!-- Backdrop -->
            <div class="fixed inset-0 bg-slate-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <!-- Modal Panel -->
            <div class="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-5xl sm:w-full border-t-4 border-cregis-gold relative">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                    <!-- Left Column: Device -->
                    <div class="relative bg-white flex flex-col h-full">
                        <!-- Header -->
                        <div class="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="text-[#D4AF37]">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                </div>
                                <span class="text-sm font-bold text-slate-800">Cregis Custody Device</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded text-xs font-mono font-medium text-slate-600 border border-gray-200">
                                    <svg class="w-3 h-3 text-slate-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                                    0x785F...ABd3
                                </div>
                            </div>
                        </div>
                        <!-- Device Content -->
                        <div class="p-5 flex-1 overflow-y-auto bg-[#f0f2f5]">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-lg font-bold text-blue-600">Transfer</h2>
                                <div class="px-3 py-1 bg-[#8b5cf6] text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    2d:08h:32m
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-[#4b5563] p-3 rounded-lg shadow-sm">
                                    <div class="flex items-center gap-1 text-white text-xs mb-1 font-medium">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                        Command
                                    </div>
                                    <div class="text-[#fca5a5] font-mono text-sm font-medium">transfer</div>
                                </div>
                                <div class="bg-[#4b5563] p-3 rounded-lg shadow-sm device-item-hover" onmouseenter="highlightDocSection('doc-valid-time')" onmouseleave="removeHighlight('doc-valid-time')">
                                    <div class="flex items-center gap-1 text-white text-xs mb-1 font-medium">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        Valid Time
                                    </div>
                                    <div class="text-[#86efac] font-mono text-xs leading-tight">2025-06-20<br>10:02:30 UTC+8</div>
                                </div>
                                <div class="bg-[#4b5563] p-3 rounded-lg shadow-sm device-item-hover" onmouseenter="highlightDocSection('doc-contract-line')" onmouseleave="removeHighlight('doc-contract-line')">
                                    <div class="flex items-center gap-1 text-white text-xs mb-1 font-medium">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        Network
                                    </div>
                                    <div class="text-white font-bold text-sm">TRON (TRC-20)</div>
                                </div>
                                <div class="bg-[#4b5563] p-3 rounded-lg shadow-sm device-item-hover" onmouseenter="highlightDocSection('doc-contract-line')" onmouseleave="removeHighlight('doc-contract-line')">
                                    <div class="flex items-center gap-1 text-white text-xs mb-1 font-medium">
                                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v2m0-8c-1.11 0-2.08-.402-2.599-1M12 8V7m0 1v8m0 0v2"></path></svg>
                                        Token
                                    </div>
                                    <div class="text-white font-bold text-sm">USDT</div>
                                </div>
                            </div>
                            <div class="mt-4 bg-[#4b5563] p-4 rounded-lg shadow-sm">
                                <div class="text-white text-xs mb-1 font-medium">Amount</div>
                                <div class="text-[#fca5a5] font-mono text-xl font-bold">$50,000.00</div>
                                <div class="text-gray-400 text-xs mt-1">50,000.00 USDT</div>
                            </div>
                            <div class="mt-4 flex gap-3">
                                <button onclick="closeSigningModal()" class="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">Cancel</button>
                                <button onclick="confirmSigning()" class="flex-1 py-2 px-4 bg-everypay-600 text-white rounded-lg text-sm font-medium hover:bg-everypay-700 transition-colors">Confirm & Sign</button>
                            </div>
                        </div>
                    </div>
                    <!-- Right Column: Document -->
                    <div class="relative bg-white flex flex-col h-full border-l border-gray-200">
                        <div class="bg-slate-50 px-6 py-4 border-b border-gray-200">
                            <h3 class="text-sm font-bold text-slate-800">Transaction Document</h3>
                        </div>
                        <div class="p-6 flex-1 overflow-y-auto">
                            <div class="space-y-4">
                                <div class="border-b border-dashed border-gray-300 pb-3">
                                    <div class="flex justify-between items-center">
                                        <span class="text-xs text-gray-500 font-mono">Contract Address</span>
                                    </div>
                                    <div id="doc-contract-line" class="text-xs text-gray-500 font-mono mt-1 p-1 rounded transition-colors" title="TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t">TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t</div>
                                </div>
                                <div id="doc-amount-row" class="flex justify-between items-end border-b border-dashed border-gray-300 pb-3 p-1 rounded transition-colors">
                                    <div>
                                        <div class="text-xs text-gray-500">Amount</div>
                                        <div class="text-lg font-bold text-gray-900">50,000.00 USDT</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs text-gray-500">Equivalent</div>
                                        <div class="text-lg font-bold text-everypay-600">$50,000.00</div>
                                    </div>
                                </div>
                                <div id="doc-source-box" class="bg-white border border-gray-200 p-3 rounded transition-colors">
                                    <div class="text-xs text-gray-500 mb-1">Source Address</div>
                                    <div class="text-xs font-mono text-gray-700">TXkF3q...9dGh</div>
                                </div>
                                <div id="doc-target-box" class="bg-white border border-gray-200 p-3 rounded transition-colors">
                                    <div class="text-xs text-gray-500 mb-1">Target Address</div>
                                    <div class="text-xs font-mono text-gray-700">TQn9Yw...sE2X</div>
                                </div>
                                <div id="doc-valid-time" class="mt-4 pt-4 border-t border-dashed border-gray-200 flex justify-between items-center p-1 rounded transition-colors">
                                    <div>
                                        <div class="text-xs text-gray-500">Valid From</div>
                                        <div class="text-xs font-mono text-gray-700">2025-06-20 10:02:30 UTC+8</div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs text-gray-500">Expires</div>
                                        <div class="text-xs font-mono text-gray-700">2025-06-22 18:35:00 UTC+8</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Footer -->
                <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                    <div class="text-xs text-gray-500">Powered by Cregis Custody Protocol</div>
                    <button onclick="closeSigningModal()" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Close</button>
                </div>
            </div>
        </div>
    </div>`,
        'plan-modal': `    <div id="plan-modal" class="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-everypay-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg class="h-6 w-6 text-everypay-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-lg leading-6 font-medium text-gray-900" id="plan-modal-title">Payment Plan Details</h3>
                            <div class="mt-4">
                                <p class="text-sm text-gray-500 mb-4">View and manage the payment phases for this activity.</p>
                                <div id="plan-phases-container" class="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
                                    <!-- Phases will be injected here by JS -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onclick="closePlanModal()" class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>`,
        'new-activity-modal': `<div id="new-activity-modal" class="hidden fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="closeNewActivityModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">New Business Activity</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Activity Type</label>
                            <select id="new-activity-type" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm">
                                <option value="procurement">Procurement (Outbound Payment)</option>
                                <option value="sales">Sales (Inbound Collection)</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Counterparty</label>
                            <select id="new-activity-partner" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm">
                                <option value="Acme Supplies Ltd.">Acme Supplies Ltd.</option>
                                <option value="TechSource Inc.">TechSource Inc.</option>
                                <option value="Global Trade Partners">Global Trade Partners</option>
                            </select>
                        </div>
                         <div class="grid grid-cols-3 gap-4">
                             <div>
                                <label class="block text-sm font-medium text-gray-700">Asset (Network)</label>
                                <select id="new-activity-asset" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm">
                                    <option value="USDT (TRC20)">USDT (TRC20)</option>
                                    <option value="USDC (ERC20)">USDC (ERC20)</option>
                                    <option value="BTC (Bitcoin)">BTC (Bitcoin)</option>
                                </select>
                            </div>
                             <div>
                                <label class="block text-sm font-medium text-gray-700">Amount</label>
                                <div class="mt-1 relative rounded-md shadow-sm">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span class="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input type="number" id="new-activity-amount" class="focus:ring-everypay-500 focus:border-everypay-500 block w-full pl-7 sm:text-sm border-gray-300 rounded-md" placeholder="0.00">
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Incoterms</label>
                                <select id="new-activity-incoterms" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm">
                                    <option value="CIF">CIF</option>
                                    <option value="FOB">FOB</option>
                                    <option value="DDP">DDP</option>
                                    <option value="EXW">EXW</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Description</label>
                            <textarea id="new-activity-desc" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm" placeholder="e.g. Q3 Supply Order"></textarea>
                        </div>
                         <div>
                            <label class="block text-sm font-medium text-gray-700">Expiry Date (Optional)</label>
                            <input type="date" id="new-activity-expiry" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-everypay-500 focus:border-everypay-500 sm:text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Documents (Optional)</label>
                            <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div class="flex flex-col items-center justify-center pt-2 pb-2">
                                    <svg class="w-6 h-6 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3"></path></svg>
                                    <p class="text-xs text-gray-500">Click to upload files</p>
                                </div>
                                <input type="file" id="activity-documents-input" class="hidden" multiple onchange="addActivityDocuments(event)" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx">
                            </label>
                            <div id="activity-documents-list" class="mt-2 space-y-1"></div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button type="button" onclick="createNewActivity()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-everypay-600 text-base font-medium text-white hover:bg-everypay-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                        Create Activity
                    </button>
                    <button type="button" onclick="closeNewActivityModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
                        Cancel
                    </button>
                </div>
            </div>
        </div>`
    };

    // Inject modals into document.body after DOM is ready
    function injectModals() {
        for (const [id, html] of Object.entries(modals)) {
            if (!document.getElementById(id)) {
                const container = document.createElement('div');
                container.innerHTML = html;
                const modal = container.firstElementChild;
                if (modal) {
                    document.body.appendChild(modal);
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectModals);
    } else {
        injectModals();
    }
})();
