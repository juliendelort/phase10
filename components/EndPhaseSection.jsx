import * as React from 'react';


/**
 * Form to end phase (points, who made it)
 * @param {{
 *  players: Record<string, import('../pages/index').Player>
 *  onEndPhase: (phaseData: Record<string, {moveToNextPhase:Boolean, points: number}>)=>void
 *  onReset: () => void
 * }} param0 
 * @returns 
 */
export function EndPhaseSection({ players, onEndPhase, onReset }) {

    /**
     * 
     * @param {React.FormEvent<HTMLFormElement>} e 
     */
    const handleEndPhase = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        onEndPhase(Object.keys(players).reduce((acc, name) => {
            acc[name] = {
                moveToNextPhase: !!formData.get(`${name}-moveToNextPhase`),
                points: parseInt(/** @type {string} */(formData.get(`${name}-points`) || '0'))
            };
            return acc;
        }, /** @type {Record<string, {moveToNextPhase:Boolean, points: number}>} */({})));
    };


    return (
        <section>
            <div className="flex items-center gap-4">
                <h2>End of phase</h2>
                <button className="small bg-red-500 hover:bg-red-600" onClick={onReset}>Reset</button>
            </div>

            <form onSubmit={handleEndPhase}>
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
                                    <input type="checkbox" name={`${p.name}-moveToNextPhase`} aria-label="made it" />
                                </td>
                                <td className="w-16 text-center">
                                    <input type="number" min="0" name={`${p.name}-points`} arial-label="score" className="w-16" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="submit" className="primary mt-4 w-full">End phase</button>
            </form>
        </section>)
}
