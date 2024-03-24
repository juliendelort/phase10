const LOCAL_STORAGE_KEY = 'phase-10-players';

export function getLocalStorage() {
    const stringData = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;

    if (stringData) {
        try {
            const { playersNames, phasesCount } = /** @type {{playersNames: string[], phasesCount: number}} */(JSON.parse(stringData));
            if (playersNames && phasesCount) {
                return { playersNames, phasesCount };
            }
        } catch {
        }
    }

    return null;
}

/**
 * 
 * @param {string[]} playersNames 
 * @param {number} phasesCount 
 */
export function setLocalStorage(playersNames, phasesCount) {
    if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            playersNames,
            phasesCount
        }));
    }
}
