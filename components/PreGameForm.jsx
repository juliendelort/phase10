import React from 'react';
import { setLocalStorage, getLocalStorage } from '../utils/storage';

// Inital form with name of players and number of phases
export function PreGameForm({ onStartGame }) {

    const [{ formPlayerCount, previousPlayers, phasesCount }, setData] = React.useState(() => {
        // Fetch data from local storage
        const savedData = getLocalStorage();
        if (savedData) {
            return savedData;
        }

        return {
            formPlayerCount: 2,
            previousPlayers: [],
            phasesCount: 3
        };
    });

    const handleAddPlayer = () => {
        setData(d => ({
            ...d,
            formPlayerCount: formPlayerCount + 1
        }));
    };

    /**
   * Submit initial player form: generate the phases and initialize game
   */
    const handleStartGame = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const phasesCount = parseInt(formData.get('phaseCount'));

        const playerNames = formData.getAll('playerName').filter(name => !!name);

        setLocalStorage(playerNames, phasesCount);
        onStartGame(phasesCount, playerNames);

    }

    return (
        <form onSubmit={handleStartGame} className="inline-block">
            <label>
                <span>Phases</span>
                <input type="number" min="1" name="phaseCount" placeholder="3" defaultValue={phasesCount} />
            </label>
            <div className="my-4">
                {[...Array(formPlayerCount)].map((_p, index) => (
                    <label key={index} className="mb-2">
                        <span>{`Player ${index}`}</span>
                        <input type="text" placeholder="Enter a name" name="playerName" defaultValue={`${previousPlayers[index] || ''}`} />
                    </label>
                ))}
                <button type="button" onClick={handleAddPlayer} className="small mb-4 float-right">Add player</button>
            </div>
            <button className="block w-full primary" type="submit">Start game</button>
        </form>
    )
};