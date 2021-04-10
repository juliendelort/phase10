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
    <div >
      <Head>
        <title>Phase 10</title>
        <link rel="icon" href="/favicon.ico" />
        {/* <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.37/dist/themes/base.css" />
        <script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.0.0-beta.37/dist/shoelace.js"></script> */}
      </Head>

      <main>
        <h1>
          Phase 10
        </h1>

        <form onSubmit={handleFormSubmit}>
          <label>
            Phases count
          <input name="phaseCount" placeholder="3" />
          </label>

          {[...Array(playerCount)].map((_p, index) => (
            <div key={index}>
              <label>
                {`Player ${index}`}
                <input placeholder="Enter a name" name="playerName[]" />
              </label>
            </div>
          ))}
          <button onClick={handleAddPlayer}>Add player</button>
          <button type="submit">Start game</button>
        </form>
        {phases}
        {phases.map((p, index) => {
          <div key={index}>
            {p}
          </div>
        })}

      </main>


    </div >
  )
}
