import * as React from 'react';
import { useForm } from "react-hook-form";


// Form to end phase (points, who made it)
export function EndPhaseSection({ players, onEndPhase, onReset }) {
    // const [formData, setFormData] = React.useState(initFormData);
    const { register, handleSubmit, watch, reset } = useForm();

    const handleEndPhase = (data) => {
        reset();
        onEndPhase({ ...data });
    };

    const watchAllFields = watch(); // when pass nothing as argument, you are watching everything

    // Disabled if no "move to next phase" checkbox is checked
    const submitDisabled = !Object.values(watchAllFields).some(p => p.moveToNextPhase);

    return (
        <section>
            <div className="flex items-center gap-4">
                <h2>End of phase</h2>
                <button className="small bg-red-500 hover:bg-red-600" onClick={onReset}>Reset</button>
            </div>

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

                <button type="submit" className="primary mt-4 w-full" disabled={submitDisabled}>End phase</button>
            </form>
        </section>)
}
