(function() {
    function hasSerialHeader(table) {
        const firstHeader = table.querySelector('thead tr th:first-child');
        return firstHeader && firstHeader.textContent.trim() === '#';
    }

    function normalizeClass(className, fallback, extra) {
        const source = (className || fallback || '').split(/\s+/).filter(Boolean);
        const filtered = source.filter((cls) => {
            if (/^w-/.test(cls)) return false;
            if (/^min-w-/.test(cls)) return false;
            if (/^max-w-/.test(cls)) return false;
            if (/^text-(left|right|center)$/.test(cls)) return false;
            return true;
        });
        extra.split(/\s+/).filter(Boolean).forEach((cls) => {
            if (!filtered.includes(cls)) filtered.push(cls);
        });
        return filtered.join(' ');
    }

    function createSerialHeader(referenceHeader) {
        const th = document.createElement('th');
        th.className = normalizeClass(referenceHeader && referenceHeader.className, 'px-4 py-4 font-medium align-top', 'w-12 text-left');
        th.textContent = '#';
        return th;
    }

    function serialCellHtml(index) {
        return '<span class="font-medium text-gray-400">' + index + '</span>';
    }

    function createSerialCell(index, referenceCell) {
        const td = document.createElement('td');
        td.className = normalizeClass(referenceCell && referenceCell.className, 'px-4 py-4 align-top', 'w-12 text-left');
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
                row.insertBefore(createSerialCell(index + 1, firstCell), row.firstElementChild);
            }
        });
    }

    function adoptExistingSerialRows(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        Array.from(tbody.querySelectorAll(':scope > tr')).forEach((row, index) => {
            const firstCell = row.querySelector(':scope > td:first-child');
            const secondCell = row.querySelector(':scope > td:nth-child(2)');
            if (!firstCell) return;
            firstCell.className = normalizeClass(secondCell && secondCell.className, firstCell.className || 'px-4 py-4 align-top', 'w-12 text-left');
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
            const firstHeader = headerRow.querySelector(':scope > th:first-child');
            headerRow.insertBefore(createSerialHeader(firstHeader), headerRow.firstElementChild);
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
