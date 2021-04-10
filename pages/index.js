import Head from 'next/head'
import React from 'react';
import { getNPhases } from '../utils/phases';



export default function Home() {
  const [playerCount, setPlayerCount] = React.useState(2);

  const [phases, setPhases] = React.useState([]);

  const handleAddPlayer = () => {
    // setPlayers(players => [...players, {
    //   name: `Player ${players.length + 1}`
    // }]);

    setPlayerCount((c) => c + 1);
  };

  const handlePlayerNameChange = (index) => (e) => {
    console.log(e);
    setPlayers(players => players.map((p, i) => i === index ? { name: e.target.value } : p));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const phasesCount = data.get('phaseCount');
    const players = data.getAll('playerName[]');

    const phases = getNPhases(phasesCount);
    console.log(phases);
    setPhases(phases);
  }
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

        <form onSubmit={handleFormSubmit} className="inline-block">
          <label className="block" >
            <span>Phases</span>
            <input type="number" min="1" name="phaseCount" placeholder="3" defaultValue="3" />
          </label>
          <div className="my-4">
            {[...Array(playerCount)].map((_p, index) => (
              <label key={index} className="block mb-2">
                <span>{`Player ${index}`}</span>
                <input type="text" placeholder="Enter a name" name="playerName[]" />
              </label>
            ))}
            <button onClick={handleAddPlayer} className="mb-4 float-right">Add player</button>
          </div>
          <button className="block w-full" type="submit">Start game</button>
        </form>

        <section >
          <h2>Phases</h2>
          <ul className="inline-block text-left">
            {phases.map((p, index) => (
              <li key={index}>
                {p}
              </li>
            ))}
          </ul>
        </section>

      </main>

    </div >
  )
}
