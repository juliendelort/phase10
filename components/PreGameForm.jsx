import React from 'react';
import { setLocalStorage, getLocalStorage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

// Inital form with name of players and number of phases
export function PreGameForm({ onStartGame }) {
    const [{ players, phasesCount }, setState] = React.useState(() => {
        // Fetch data from local storage
        const data = getLocalStorage();

        if (!data) {
            // No saved player, generate 2 default players with 3 phases
            return {
                players: [{ id: uuidv4(), name: '' }, { id: uuidv4(), name: '' }],
                phasesCount: 3
            };
        } else {
            const { playersNames, phasesCount } = data;

            // Convert playerNames to players with ids
            return {
                players: playersNames.map(n => ({ id: uuidv4(), name: n })),
                phasesCount
            }
        }
    });

    const handleAddPlayer = () => {
        setState(d => ({
            ...d,
            players: [...players, { id: uuidv4(), name: '' }]
        }));
    };

    /**
   * Submit initial player form: generate the phases and initialize game
   */
    const handleStartGame = (event) => {
        event.preventDefault();

        const playersNames = players.filter(p => !!p.name).map(p => p.name);

        const uniqueNamesNonEmpty = [...new Set(playersNames)].filter(n => !!n);

        if (uniqueNamesNonEmpty.length < 2) {
            alert('At least 2 unique player names are required!')
        } else {
            // Save & start game
            setLocalStorage(uniqueNamesNonEmpty, phasesCount);
            onStartGame(uniqueNamesNonEmpty, phasesCount);
        }
    }

    const handlePhasesCountChange = (e) => {
        const value = e.currentTarget.value;

        setState(d => ({
            ...d,
            phasesCount: parseInt(value)
        }));
    }

    const handlePlayerNameChange = (id) => (e) => {
        const value = e.currentTarget.value;
        setState(d => {
            return { ...d, players: d.players.map(p => p.id === id ? { id, name: value } : p) };
        });
    }

    return (
        <form onSubmit={handleStartGame} className="inline-block">
            <label>
                <span>Phases</span>
                <input type="number" min="1" name="phaseCount" placeholder="3" defaultValue={phasesCount} onKeyUp={handlePhasesCountChange} onChange={handlePhasesCountChange} />
            </label>
            <div className="my-4">
                {players.map((p, index) => (
                    <label key={p.id} className="mb-2">
                        <span>{`Player ${index}`}</span>
                        <input type="text" placeholder="Enter a name" name="playerName" defaultValue={players[index].name || ''} onChange={handlePlayerNameChange(p.id)} onKeyUp={handlePlayerNameChange(p.id)} />
                    </label>
                ))}
                <button type="button" onClick={handleAddPlayer} className="small mb-4 float-right">Add player</button>
            </div>
            <button className="block w-full primary" type="submit">Start game</button>
        </form>
    )
};
