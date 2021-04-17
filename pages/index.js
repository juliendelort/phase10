import Head from 'next/head'
import React from 'react';
import { generateNPhases } from '../utils/phases';
import { setLocalStorage, getLocalStorage } from '../utils/storage';


export default function Home() {
  const [phases, setPhases] = React.useState([]);
  const [players, setPlayers] = React.useState({});


  /**
   * Starting the game
   */
  const handleStartGame = (phasesCount, playerNames) => {
    const phases = generateNPhases(phasesCount);
    setPhases(phases);

    const players = {};
    playerNames.forEach(name => players[name] = { name, points: 0, currentPhase: 1 });
    setPlayers(players);
  }
  /**
   * End a phase: update players scores and current phase
   */
  const handleEndPhase = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    event.currentTarget.reset();
    setPlayers(players => {
      const newValues = { ...players };

      Object.values(players).forEach((p) => {
        const moveToNextPhase = !!formData.get(`${p.name}[move]`);
        const points = parseInt(formData.get(`${p.name}[points]`) || 0);
        if (moveToNextPhase) {
          newValues[p.name].currentPhase++;
        }
        newValues[p.name].points += points;
      });
      return newValues;

    });
  }

  // Generates map {"phase" => [...playersInThatPhase]}
  const playersByPhase = React.useMemo(() => {
    const result = [];
    Object.values(players).forEach(p => result[p.currentPhase] = [...(result[p.currentPhase] || []), p.name]);

    return result;
  }, [players]);

  // List of phases with players that are in it
  const phasesSection = (
    <section >
      <h2>Phases</h2>
      <ol className="inline-block text-left w-full">
        {phases.map((p, index) => (
          <li key={index} className="border border-solid	border-gray-300	 rounded px-6 py-4 mb-2 flex bg-blue-50">
            <span className="mr-4 opacity-70 self-center	">{index + 1}.</span>
            <span className="flex-1  flex justify-between ">
              <div className="flex flex-col	">
                {p.split(' + ').map(part => (
                  <span key={part}>{part}</span>
                ))}
              </div>
              <div className="font-bold ml-4 text-right self-center	">
                {(playersByPhase[index + 1] || []).map(name => (<div key={name}>{name}</div>))}
              </div>
            </span>
          </li>
        ))}
      </ol>
    </section>);

  // End of phase section
  const endPhaseSection = (
    <section>
      <h2>End of phase</h2>
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
                  <input type="checkbox" name={`${p.name}[move]`} aria-label="made it" />
                </td>
                <td className="w-16 text-center">
                  <input type="number" min="0" name={`${p.name}[points]`} arial-label="score" className="w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="primary w-full mt-4" >End phase</button>
      </form>
    </section>);

  // List of scores
  const scoresSection = (
    <section>
      <h2>Scores</h2>
      <table>
        <tbody>
          {Object.values(players).map((p) => (
            <tr key={p.name}>
              <td><b>{p.name}</b></td>
              <td> {p.points} pts</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>);

  return (
    <div className="font-sans max-w-xs mx-auto mt-12" >
      <Head>
        <title>Phase 10</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1> Phase 10 </h1>
      </header>
      <main>
        {!phases.length ?
          <PreGameForm onStartGame={handleStartGame} /> :
          <>
            {phasesSection}
            {endPhaseSection}
            {scoresSection}
          </>}
      </main>
    </div>)
}


function PreGameForm({ onStartGame }) {

  const [{ formPlayerCount, previousPlayers }, setData] = React.useState(() => {
    // Fetch data from local storage
    const savedData = getLocalStorage();

    if (savedData) {
      return savedData;
    }

    return {
      formPlayerCount: 2,
      previousPlayers: []
    };
  });

  const handleAddPlayer = () => {
    setData(d => ({
      ...d,
      formPlayerCount: formPlayerCount + 1
    }));
  };

  /**
 * Submit initial player form: generate the phases and initialize game
 */
  const handleStartGame = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const phasesCount = formData.get('phaseCount');
    const playerNames = formData.getAll('playerName').filter(name => !!name);

    setLocalStorage(playerNames);
    onStartGame(phasesCount, playerNames);

  }
  return (
    <form onSubmit={handleStartGame} className="inline-block">
      <label>
        <span>Phases</span>
        <input type="number" min="1" name="phaseCount" placeholder="3" defaultValue="3" />
      </label>
      <div className="my-4">
        {[...Array(formPlayerCount)].map((_p, index) => (
          <label key={index} className="mb-2">
            <span>{`Player ${index}`}</span>
            <input type="text" placeholder="Enter a name" name="playerName" defaultValue={`${previousPlayers[index] || ''}`} />
          </label>
        ))}
        <button type="button" onClick={handleAddPlayer} className="mb-4 float-right">Add player</button>
      </div>
      <button className="block w-full primary" type="submit">Start game</button>
    </form>
  )
};

