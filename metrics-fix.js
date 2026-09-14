function isFreshMetricDataset(data) {
    if (!data?.updatedAt) return false;
    const age = Date.now() - new Date(data.updatedAt).getTime();
    return Number.isFinite(age) && age >= 0 && age <= 3 * 60 * 60 * 1000;
}

function verifiedMetricValue(metric, datasetFresh) {
    if (!datasetFresh || !metric || metric.status !== 'live') return 0;
    return Number.isFinite(metric.value) ? metric.value : 0;
}

function verifiedMetricDisplay(metric, datasetFresh) {
    const value = verifiedMetricValue(metric, datasetFresh);
    if (!value) return 'View profile';
    if (metric.display) return metric.display;
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function verifiedCompact(value) {
    return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function coreMetricsAvailable(data, group, datasetFresh) {
    const required = group === 'gaming' ? ['youtube', 'tiktok', 'twitch'] : ['youtube', 'tiktok'];
    return required.every((platform) => verifiedMetricValue(data.metrics?.[group]?.[platform], datasetFresh) > 0);
}

async function loadStats() {
    const metricNodes = document.querySelectorAll('[data-stat]');
    if (!metricNodes.length) return;

    try {
        const response = await fetch(`/assets/stats.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`Stats request failed: ${response.status}`);
        const data = await response.json();
        const datasetFresh = isFreshMetricDataset(data);

        metricNodes.forEach((node) => {
            const [group, platform] = node.dataset.stat.split('.');
            const metric = data.metrics?.[group]?.[platform];
            const value = verifiedMetricValue(metric, datasetFresh);
            node.textContent = verifiedMetricDisplay(metric, datasetFresh);
            if (value) {
                node.title = `${new Intl.NumberFormat('en-US').format(value)} ${metric?.unit || ''}`.trim();
            } else {
                node.removeAttribute('title');
            }
            node.closest('.social-card')?.classList.toggle('metric-unavailable', !value);
        });

        document.querySelectorAll('[data-group-total]').forEach((node) => {
            const group = node.dataset.groupTotal;
            const completeEnough = coreMetricsAvailable(data, group, datasetFresh);
            const total = completeEnough
                ? Object.values(data.metrics?.[group] || {}).reduce((sum, metric) => sum + verifiedMetricValue(metric, datasetFresh), 0)
                : 0;
            const valueNode = node.querySelector('strong');
            if (valueNode) valueNode.textContent = total ? verifiedCompact(total) : '—';
            node.title = total
                ? `${new Intl.NumberFormat('en-US').format(total)} verified tracked followers and subscribers`
                : 'Core live metrics are not currently available';
        });

        const totalNode = document.querySelector('[data-total-audience]');
        if (totalNode) {
            // The creator-wide number is a verified lower bound. It is shown only when
            // the three core gaming accounts are available, and never guesses missing platforms.
            const coreReady = coreMetricsAvailable(data, 'gaming', datasetFresh);
            const total = coreReady
                ? Object.values(data.metrics || {})
                    .flatMap((group) => Object.values(group || {}))
                    .reduce((sum, metric) => sum + verifiedMetricValue(metric, datasetFresh), 0)
                : 0;
            totalNode.textContent = total ? `${verifiedCompact(total)}+` : 'Live metrics';
        }

        const updated = document.querySelector('[data-stats-updated]');
        if (updated) {
            if (datasetFresh) {
                const date = new Date(data.updatedAt);
                updated.textContent = `Verified public metrics · refreshed ${new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date)}`;
            } else {
                updated.textContent = 'Live metrics temporarily unavailable';
            }
        }
    } catch (error) {
        console.error('Verified metric loading failed:', error);
        metricNodes.forEach((node) => { node.textContent = 'View profile'; });
        document.querySelectorAll('[data-group-total] strong').forEach((node) => { node.textContent = '—'; });
        const totalNode = document.querySelector('[data-total-audience]');
        if (totalNode) totalNode.textContent = 'Live metrics';
        const updated = document.querySelector('[data-stats-updated]');
        if (updated) updated.textContent = 'Live metrics temporarily unavailable';
    }
}
