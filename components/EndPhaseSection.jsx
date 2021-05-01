import React from 'react';
import { useForm } from "react-hook-form";


// Form to end phase (points, who made it)
export function EndPhaseSection({ players, onEndPhase }) {
    // const [formData, setFormData] = React.useState(initFormData);
    const { register, handleSubmit, watch } = useForm();

    const handleEndPhase = (data) => {
        onEndPhase({ ...data });
    };

    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

    // Disabled if no "move to next phase" checkbox is checked
    const submitDisabled = !Object.values(watchAllFields).some(p => p.moveToNextPhase);

    return (
        <section>
            <h2>End of phase</h2>
            <form onSubmit={handleSubmit(handleEndPhase)}>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th className="whitespace-nowrap">Made it</th>
                            <th className="w-16 text-center">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(players).map((p) => (
                            <tr key={p.name}>
                                <td>{p.name}</td>
                                <td className="text-center">
                                    <input type="checkbox" {...register(`${p.name}[moveToNextPhase]`)} aria-label="made it" />
                                </td>
                                <td className="w-16 text-center">
                                    <input type="number" min="0"  {...register(`${p.name}[points]`, { setValueAs: v => v ? parseInt(v) : 0 })} arial-label="score" className="w-16" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit" className="primary w-full mt-4" disabled={submitDisabled}>End phase</button>
            </form>
        </section>)
}

