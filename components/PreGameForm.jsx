import React, { useRef } from 'react';
import { setLocalStorage, getLocalStorage } from '../utils/storage';


/**  Inital form with name of players and number of phases
 * @param {{onStartGame: (players: string[], phasesCount: number)=>void}} props
 */
export function PreGameForm({ onStartGame }) {
    const [playersCount, setPlayersCount] = React.useState(2);
    /** @type {React.RefObject<HTMLFormElement>} */
    const formRef = useRef(null);
    React.useEffect(() => {
        const data = getLocalStorage();

        if (data) {
            const { playersNames, phasesCount } = data;
            setPlayersCount(playersNames.length);
            if (formRef.current) {
                formRef.current.phasesCount.value = phasesCount;
                [...formRef.current.player].forEach((input, index) => {
                    input.value = playersNames[index] || '';
                });
            }
        }
    }, [])

    const handleAddPlayer = () => {
        setPlayersCount(playersCount + 1);
    };

    /**
   * Submit initial player form: generate the phases and initialize game
   * @param {React.FormEvent<HTMLFormElement>} e
   */
    const handleStartGame = (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const players = Array.from(new Set(/** @type {string[]} */(formData.getAll('player')).filter(p => !!p)));
        const phasesCount = parseInt(/** @type {string} */(formData.get('phasesCount')));

        if (players.length < 2) {
            alert('At least 2 unique player names are required!');
            return;
        }

        setLocalStorage(players, phasesCount);
        onStartGame(players, phasesCount);
    };

    return (
        <>
            <form onSubmit={handleStartGame} className="inline-block" ref={formRef}>
                <label>
                    <span>Phases</span>
                    <input type="number" min="1" placeholder="3" name="phasesCount" required defaultValue={3} />
                </label>

                <div className="my-4">
                    {Array(playersCount).fill(0).map((_p, index) => (
                        <label key={index} className="mb-2">
                            <span>{`Player ${index}`}</span>
                            <input type="text" placeholder="Enter a name" name="player" />
                        </label>
                    ))}
                    <button type="button" onClick={handleAddPlayer} className="small float-right mb-4">Add player</button>
                </div>
                <button className="primary block w-full" type="submit">Start game</button>
            </form>
        </>
    )
};
