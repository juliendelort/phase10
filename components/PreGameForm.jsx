import React from 'react';
import { setLocalStorage, getLocalStorage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

// Inital form with name of players and number of phases
export function PreGameForm({ onStartGame }) {
    const [{ players, phasesCount }, setData] = React.useState(() => {
        // Fetch data from local storage
        const savedData = getLocalStorage();
        if (savedData) {
            const { previousPlayers, phasesCount } = savedData;
            return {
                players: previousPlayers.map(n => ({ id: uuidv4(), name: n })),
                phasesCount: phasesCount.toString()
            };
        }

        // No saved player, generate 2 default players
        return {
            players: [{ id: uuidv4(), name: '' }, { id: uuidv4(), name: '' }],
            phasesCount: "3"
        };
    });

    console.log('***players', players)

    // const [{ formPlayerCount, previousPlayers, phasesCount }, setData] = React.useState(() => {
    //     // Fetch data from local storage
    //     const savedData = getLocalStorage();
    //     if (savedData) {
    //         return savedData;
    //     }

    //     return {
    //         formPlayerCount: 2,
    //         previousPlayers: [],
    //         phasesCount: 3
    //     };
    // });

    const handleAddPlayer = () => {
        setData(d => ({
            ...d,
            players: [...players, { id: uuidv4(), name: '' }]
        }));
    };

    /**
   * Submit initial player form: generate the phases and initialize game
   */
    const handleStartGame = (event) => {
        event.preventDefault();

        const phasesCountParsed = parseInt(phasesCount);
        const playerNames = players.filter(p => !!p.name).map(p => p.name);

        console.log({ phasesCount, playerNames, phasesCountParsed });
        setLocalStorage(playerNames, phasesCountParsed);
        onStartGame(phasesCountParsed, playerNames);

    }

    const handlePhasesCountChange = (e) => {
        const value = e.currentTarget.value;

        setData(d => ({
            ...d,
            phasesCount: value
        }));
    }

    const handlePlayerNameChange = (id) => (e) => {
        const value = e.currentTarget.value;
        setData(d => {
            return { ...d, players: d.players.map(p => p.id === id ? { id, name: value } : p) };
        });
    }

    return (
        <form onSubmit={handleStartGame} className="inline-block">
            <label>
                <span>Phases</span>
                <input type="number" min="1" name="phaseCount" placeholder="3" value={phasesCount} onKeyUp={handlePhasesCountChange} onChange={handlePhasesCountChange} />
            </label>
            <div className="my-4">
                {players.map((p, index) => (
                    <label key={p.id} className="mb-2">
                        <span>{`Player ${index}`}</span>
                        <input type="text" placeholder="Enter a name" name="playerName" value={players[index].name || ''} onChange={handlePlayerNameChange(p.id)} onKeyUp={handlePlayerNameChange(p.id)} />
                    </label>
                ))}
                <button type="button" onClick={handleAddPlayer} className="small mb-4 float-right">Add player</button>
            </div>
            <button className="block w-full primary" type="submit">Start game</button>
        </form>
    )
};