const LOCAL_STORAGE_KEY = 'phase-10-players';

export function getLocalStorage() {
    const stringData = typeof window !== "undefined" ? localStorage.getItem(LOCAL_STORAGE_KEY) : null;

    if (stringData) {
        try {
            const { formPlayerCount, previousPlayers, phasesCount } = JSON.parse(stringData);
            return {
                formPlayerCount,
                previousPlayers,
                phasesCount
            };
        } catch {
        }
    }

    return null;
}

export function setLocalStorage(playerNames, phasesCount) {
    if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
            formPlayerCount: playerNames.length,
            previousPlayers: playerNames,
            phasesCount
        }));
    }
}