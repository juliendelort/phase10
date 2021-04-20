import Head from 'next/head'
import React from 'react';
import { generateNPhases } from '../utils/phases';
import { PreGameForm } from '../components/PreGameForm';
import { EndPhaseSection } from '../components/EndPhaseSection';


export default function Home() {
  const [phases, setPhases] = React.useState([]);
  const [players, setPlayers] = React.useState({});

  /**
   * Starting the game
   */
  const handleStartGame = React.useCallback((phasesCount, playerNames) => {
    const phases = generateNPhases(phasesCount);
    setPhases(phases);

    const players = {};
    playerNames.forEach(name => players[name] = { name, points: 0, currentPhase: 1, completedPhases: [] });
    setPlayers(players);
  }, []);
  /**
   * End a phase: update players scores and current phase
   */
  const handleEndPhase = React.useCallback((phaseData) => {

    setPlayers(players => {
      const newValues = { ...players };

      Object.values(players).forEach((p) => {
        const { moveToNextPhase, points } = phaseData[p.name];

        if (moveToNextPhase) {
          newValues[p.name].currentPhase++;
        }
        newValues[p.name].points += points;

        newValues[p.name].completedPhases.push({ moveToNextPhase, points });
      });
      return newValues;
    });
  }, []);

  /** Un-apply last phase */
  const handleRevertPhase = () => {
    setPlayers(players => {
      const newValues = { ...players };

      Object.values(players).forEach((p) => {
        if (p.completedPhases.length) {
          const { moveToNextPhase, points } = p.completedPhases[p.completedPhases.length - 1];

          if (moveToNextPhase) { // If player has moved up, move back down
            newValues[p.name].currentPhase--;
          }
          // Remove points
          newValues[p.name].points -= points;

          // Remove completed phase
          newValues[p.name].completedPhases.pop();
        }
      });
      return newValues;
    });
  }

  // Generates map {"phase" => [...playersInThatPhase]}
  const playersByPhase = React.useMemo(() => {
    const result = {};
    Object.values(players).forEach(p => result[p.currentPhase] = [...(result[p.currentPhase] || []), p.name]);

    return result;
  }, [players]);

  const showRevertButton = Object.keys(playersByPhase).length > 1; // Show revert button if at least is above phase 1

  // List of phases with players that are in it
  const phasesSection = (
    <section >
      <h2>
        Phases
       {showRevertButton ?
          <button className="small float-right" onClick={handleRevertPhase}>Back 1 phase</button> :
          null}
      </h2>
      <ol className="inline-block text-left w-full">
        {phases.map((p, index) => (
          <li key={index} className="border border-solid	border-gray-300	 rounded px-6 py-4 mb-2 flex bg-blue-50">
            <span className="mr-4 opacity-70 self-center	">{index + 1}.</span>
            <span className="flex-1  flex justify-between items-center">
              <div className="flex flex-col	">
                {p.split(' + ').map((part, index) => (
                  <span key={index}>{part}</span>
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <header>
        <h1> Phase 10 </h1>
      </header>
      <main>
        {!phases.length ?
          <PreGameForm onStartGame={handleStartGame} /> :
          <>
            {phasesSection}
            <EndPhaseSection players={players} onEndPhase={handleEndPhase} />
            {scoresSection}
          </>}
      </main>
    </div>)
}
