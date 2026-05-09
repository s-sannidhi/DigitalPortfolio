(async function loadLeetCode() {
    const username = 's-sannidhi';
    const widget = document.getElementById('leetcode-widget');
    if (!widget) return;

    async function fetchStats() {
        try {
            const r = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            if (r.ok) {
                const d = await r.json();
                if (d && typeof d.totalSolved === 'number') return {
                    totalSolved: d.totalSolved,
                    easySolved: d.easySolved,
                    mediumSolved: d.mediumSolved,
                    hardSolved: d.hardSolved,
                    easyTotal: d.totalEasy,
                    mediumTotal: d.totalMedium,
                    hardTotal: d.totalHard,
                };
            }
        } catch (_) {}

        // Fallback: LeetCode GraphQL
        try {
            const q = {
                query: `query getUserProfile($username: String!) {
                    allQuestionsCount { difficulty count }
                    matchedUser(username: $username) {
                        submitStatsGlobal { acSubmissionNum { difficulty count submissions } }
                    }
                }`,
                variables: { username }
            };
            const r2 = await fetch('https://leetcode.com/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(q)
            });
            if (r2.ok) {
                const j = await r2.json();
                const counts = j?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
                const all = j?.data?.allQuestionsCount || [];
                const solved = Object.fromEntries(counts.map(c => [c.difficulty.toLowerCase(), c.count]));
                const totals = Object.fromEntries(all.map(c => [c.difficulty.toLowerCase(), c.count]));
                return {
                    totalSolved: solved.all || 0,
                    easySolved: solved.easy || 0,
                    mediumSolved: solved.medium || 0,
                    hardSolved: solved.hard || 0,
                    easyTotal: totals.easy || 0,
                    mediumTotal: totals.medium || 0,
                    hardTotal: totals.hard || 0,
                };
            }
        } catch (_) {}

        return null;
    }

    function setRing(circle, solved, total) {
        const circumference = 2 * Math.PI * parseFloat(circle.getAttribute('r'));
        const pct = total > 0 ? Math.max(0, Math.min(1, solved / total)) : 0;
        circle.setAttribute('stroke-dasharray', `${pct * circumference} ${circumference}`);
    }

    try {
        const data = await fetchStats();
        if (!data) throw new Error('no data');
        const { totalSolved, easySolved, mediumSolved, hardSolved, easyTotal, mediumTotal, hardTotal } = data;
        document.getElementById('lc-total').textContent = totalSolved;
        document.getElementById('lc-easy').textContent = `${easySolved} / ${easyTotal}`;
        document.getElementById('lc-medium').textContent = `${mediumSolved} / ${mediumTotal}`;
        document.getElementById('lc-hard').textContent = `${hardSolved} / ${hardTotal}`;
        setRing(document.getElementById('lc-ring-easy'), easySolved, easyTotal);
        setRing(document.getElementById('lc-ring-medium'), mediumSolved, mediumTotal);
        setRing(document.getElementById('lc-ring-hard'), hardSolved, hardTotal);
    } catch (_) {
        const err = document.getElementById('lc-error');
        if (err) err.classList.remove('hidden');
    }
})();
