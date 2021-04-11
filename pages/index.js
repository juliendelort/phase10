import Head from 'next/head'
import React from 'react';
import { getNPhases } from '../utils/phases';



export default function Home() {
  const [formPlayerCount, setPlayerCount] = React.useState(2);

  const [phases, setPhases] = React.useState([]);

  const [players, setPlayers] = React.useState({});

  const handleAddPlayer = () => {
    setPlayerCount((c) => c + 1);
  };


  const handlePlayersSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const phasesCount = data.get('phaseCount');
    const playerNames = data.getAll('playerName');
    const phases = getNPhases(phasesCount);
    setPhases(phases);

    const players = {};
    playerNames.forEach(name => players[name] = { name, points: 0, currentPhase: 1 });
    setPlayers(players);
  }

  const handleScoresSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const updates = {};

    setPlayers(players => {
      const newValues = { ...players };

      Object.values(players).forEach((p) => {
        const move = !!data.get(`${p.name}[move]`);
        const points = parseInt(data.get(`${p.name}[points]`) || 0);
        if (move) {
          newValues[p.name].currentPhase++;
        }
        newValues[p.name].points += points;
      });
      return newValues;

    });
  }
  const playersByPhase = [];
  Object.values(players).forEach(p => playersByPhase[p.currentPhase] = [...(playersByPhase[p.currentPhase] || []), p.name]);
  return (
    <div className="font-sans" >
      <Head>
        <title>Phase 10</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.37/dist/themes/base.css" />
        <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.37/dist/shoelace.js"></script> */}
      </Head>

      <main>
        <h1 >
          Phase 10
        </h1>



        {!phases.length ? <form onSubmit={handlePlayersSubmit} className="inline-block">
          <label  >
            <span>Phases</span>
            <input type="number" min="1" name="phaseCount" placeholder="3" defaultValue="3" />
          </label>
          <div className="my-4">
            {[...Array(formPlayerCount)].map((_p, index) => (
              <label key={index} className="block mb-2">
                <span>{`Player ${index}`}</span>
                <input type="text" placeholder="Enter a name" name="playerName" defaultValue={`${index ? "Cyril" : "Julien"}`} />
              </label>
            ))}
            <button type="button" onClick={handleAddPlayer} className="mb-4 float-right">Add player</button>
          </div>
          <button className="block w-full" type="submit">Start game</button>
        </form> : <>
          <section >
            <h2>Phases</h2>
            <ol className="inline-block text-left">
              {phases.map((p, index) => (
                <li key={index}>
                  {p} - <b>{(playersByPhase[index + 1] || []).join(',')}</b>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2>Scores</h2>
            <ul className="inline-block text-left">
              {Object.values(players).map((p) => (<li key={p.name}>
                {p.name}: phase {p.currentPhase}/{phases.length} - {p.points} pts
              </li>
              ))}
            </ul>
          </section>
          <section>
            <h2>End of phase</h2>
            <form onSubmit={handleScoresSubmit}>
              <table >
                <th></th>
                <th className="whitespace-nowrap">Made it</th>
                <th>Score</th>
                {Object.values(players).map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>
                      <input type="checkbox" name={`${p.name}[move]`} aria-label="made it" />
                    </td>
                    <td>
                      <input type="number" min="0" name={`${p.name}[points]`} arial-label="score" />
                    </td>
                  </tr>
                ))}
              </table>

              <button type="submit" className="w-full mt-4" >End phase</button>
            </form>
          </section>
        </>}
      </main>

    </div >
  )
}
