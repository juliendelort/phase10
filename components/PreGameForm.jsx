import React from 'react';
import { setLocalStorage, getLocalStorage } from '../utils/storage';
import { useForm, useFieldArray } from "react-hook-form";


// Inital form with name of players and number of phases
export function PreGameForm({ onStartGame }) {
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm();

    const { fields: playerFields, append: addPlayer } = useFieldArray({
        control,
        name: "players",
    });

    React.useEffect(() => {
        const data = getLocalStorage();

        if (!data) {
            // No saved player, generate 2 default players with 3 phases
            reset({
                players: [{ name: '' }, { name: '' }],
                phasesCount: 3
            })
        } else {
            const { playersNames, phasesCount } = data;

            // Convert playerNames to players
            reset({
                players: playersNames.map(name => ({ name })),
                phasesCount
            });
        }
    }, [reset])

    const handleAddPlayer = () => {
        addPlayer({ name: '' });
    };

    /**
   * Submit initial player form: generate the phases and initialize game
   */
    const handleStartGame = ({ players, phasesCount }) => {

        const playersNames = players.filter(p => !!p.name).map(p => p.name);

        const uniqueNamesNonEmpty = [...new Set(playersNames)].filter(n => !!n);

        if (uniqueNamesNonEmpty.length < 2) {
            alert('At least 2 unique player names are required!')
        } else {
            // Save & start game
            setLocalStorage(uniqueNamesNonEmpty, phasesCount);
            onStartGame(uniqueNamesNonEmpty, phasesCount);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleStartGame)} className="inline-block">
                <label>
                    <span>Phases</span>
                    <input type="number" min="1" placeholder="3" {...register('phasesCount', { required: true, min: 1, valueAsNumber: true })} />
                </label>

                <div className="my-4">
                    {playerFields.map((p, index) => (
                        <label key={p.id} className="mb-2">
                            <span>{`Player ${index}`}</span>
                            <input type="text" placeholder="Enter a name" defaultValue={p.name} {...register(`players.${index}.name`)} />
                        </label>
                    ))}
                    <button type="button" onClick={handleAddPlayer} className="small mb-4 float-right">Add player</button>
                </div>
                <button className="block w-full primary" type="submit">Start game</button>
            </form>
            {errors.phasesCount && <span role="alert" className="block text-red-600 text-sm mt-4">Phases count is required with a minimum of 1!</span>}
        </>
    )
};
