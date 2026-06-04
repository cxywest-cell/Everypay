(function() {
    function hasSerialHeader(table) {
        const firstHeader = table.querySelector('thead tr th:first-child');
        return firstHeader && firstHeader.textContent.trim() === '#';
    }

    function createSerialHeader() {
        const th = document.createElement('th');
        th.className = 'px-4 py-4 w-12 font-medium align-top';
        th.textContent = '#';
        return th;
    }

    function serialCellHtml(index) {
        return '<div class="flex items-center gap-2"><span class="font-medium text-gray-400">' + index + '</span></div>';
    }

    function createSerialCell(index) {
        const td = document.createElement('td');
        td.className = 'px-4 py-4 align-top';
        td.setAttribute('data-serial-cell', 'true');
        td.innerHTML = serialCellHtml(index);
        return td;
    }

    function renumberRows(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        Array.from(tbody.querySelectorAll(':scope > tr')).forEach((row, index) => {
            const firstCell = row.querySelector(':scope > td:first-child');
            if (firstCell && firstCell.getAttribute('data-serial-cell') === 'true') {
                firstCell.innerHTML = serialCellHtml(index + 1);
            } else {
                row.insertBefore(createSerialCell(index + 1), row.firstElementChild);
            }
        });
    }

    function adoptExistingSerialRows(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        Array.from(tbody.querySelectorAll(':scope > tr')).forEach((row, index) => {
            const firstCell = row.querySelector(':scope > td:first-child');
            if (!firstCell) return;
            firstCell.className = firstCell.className || 'px-4 py-4 align-top';
            firstCell.setAttribute('data-serial-cell', 'true');
            firstCell.innerHTML = serialCellHtml(index + 1);
        });
    }

    function applySerialColumn(table) {
        if (!table || table.dataset.serialized === 'true') return;

        if (hasSerialHeader(table)) {
            table.dataset.serialized = 'true';
            adoptExistingSerialRows(table);
            observeRows(table);
            return;
        }

        const headerRow = table.querySelector('thead tr');
        if (headerRow) {
            headerRow.insertBefore(createSerialHeader(), headerRow.firstElementChild);
        }

        table.dataset.serialized = 'true';
        renumberRows(table);
        observeRows(table);
    }

    function observeRows(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody || tbody.dataset.serialObserver === 'true') return;
        tbody.dataset.serialObserver = 'true';

        const observer = new MutationObserver(() => renumberRows(table));
        observer.observe(tbody, { childList: true });
    }

    function applyAllSerialColumns() {
        document.querySelectorAll('table').forEach(applySerialColumn);
    }

    function observeNewTables() {
        if (!document.body || document.body.dataset.tableSerialObserver === 'true') return;
        document.body.dataset.tableSerialObserver = 'true';

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    if (node.matches && node.matches('table')) applySerialColumn(node);
                    node.querySelectorAll && node.querySelectorAll('table').forEach(applySerialColumn);
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function initSerialColumns() {
        applyAllSerialColumns();
        observeNewTables();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSerialColumns);
    } else {
        initSerialColumns();
    }
})();
