import React from 'react';


// Form to end phase (points, who made it)
export function EndPhaseSection({ players, onEndPhase }) {
    const [formData, setFormData] = React.useState(initFormData);

    function initFormData() {
        const result = {};
        Object.values(players).forEach(p => {
            result[p.name] = { moveToNextPhase: false, points: 0 }
        });

        return result;
    }

    const handleMoveToNextPhaseChange = (playerName) => (e) => {
        const moveToNextPhase = e.currentTarget.checked;

        setFormData(data => ({ ...data, [playerName]: { ...data[playerName], moveToNextPhase } }))
    };

    const handlePointsChange = (playerName) => (e) => {
        const points = parseInt(e.currentTarget.value || '0');
        setFormData(data => ({ ...data, [playerName]: { ...data[playerName], points } }))
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.currentTarget.reset();
        onEndPhase({ ...formData });

        setFormData(initFormData);
    };

    // Disabled if no "move to next phase" checkbox is checked
    const submitDisabled = !Object.values(formData).some(p => p.moveToNextPhase);


    return (
        <section>
            <h2>End of phase</h2>
            <form onSubmit={handleSubmit}>
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
                                    <input type="checkbox" name={`${p.name}[move]`} aria-label="made it" onChange={handleMoveToNextPhaseChange(p.name)} />
                                </td>
                                <td className="w-16 text-center">
                                    <input type="number" min="0" name={`${p.name}[points]`} arial-label="score" className="w-16" onChange={handlePointsChange(p.name)} defaultValue={0} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit" className="primary w-full mt-4" disabled={submitDisabled}>End phase</button>
            </form>
        </section>)
}

