export function getNameInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatWorkingDays(workingDays: string): string {
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = workingDays
        .split(',')
        .map(Number)
        .sort((a, b) => a - b);

    if (days.length === 7) return 'Every day';

    const ranges: string[] = [];
    let start = days[0];
    let prev = days[0];

    for (let i = 1; i <= days.length; i++) {
        const current = days[i];
        if (current !== prev + 1) {
            ranges.push(start === prev ? DAY_LABELS[start] : `${DAY_LABELS[start]}-${DAY_LABELS[prev]}`);
            start = current;
        }
        prev = current;
    }

    return ranges.join(', ');
}
