const LOCAL_STORAGE_KEY = 'phase-10-players';

export function getLocalStorage() {
    const stringData = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;

    if (stringData) {
        try {
            const { playersNames, phasesCount } = JSON.parse(stringData);
            if (playersNames && phasesCount) {
                return { playersNames, phasesCount };
            }
        } catch {
        }
    }

    return null;
}

export function setLocalStorage(playersNames, phasesCount) {
    if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            playersNames,
            phasesCount
        }));
    }
}