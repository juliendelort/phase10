import Head from 'next/head'
import * as React from 'react';
import { generateNPhases } from '../utils/phases';
import { PreGameForm } from '../components/PreGameForm';
import { EndPhaseSection } from '../components/EndPhaseSection';

/**
 * @typedef {{name:string, points:number, currentPhase: number, completedPhases: Array<{moveToNextPhase: boolean, points: number}> }} Player
 */

/**
 * @typedef {{phases: string[],players: Record<string, Player>}} GameData
 */

const localStorageKey = 'phase10-game';

function readLocalStorage() {
  const defaultValue = { phases: [], players: {} };
  if (typeof window === 'undefined') {
    return defaultValue
  }

  const str = window.localStorage.getItem(localStorageKey);
  return /** @type {GameData}*/(str ? JSON.parse(str) : defaultValue);
}

/**
 * 
 * @param {Partial<GameData>} gameData 
 */
function writeLocalStorage(gameData) {
  if (typeof window === 'undefined') {
    return;
  }
  const currentGameData = readLocalStorage();
  window.localStorage.setItem(localStorageKey, JSON.stringify({ ...currentGameData, ...gameData }));
}

export default function Home() {
  const [phases, setPhases] = React.useState(() => readLocalStorage().phases);

  const [players, setPlayers] = React.useState(() => readLocalStorage().players);

  /**
   * 
   * @param {string[]} phases 
   */
  function proxySetPhases(phases) {
    writeLocalStorage({ phases });
    setPhases(phases);
  }

  /**
   * 
   * @param {Record<string, Player>} players 
   */
  function proxySetPlayers(players) {
    writeLocalStorage({ players });
    setPlayers(players);
  }

  /**
   * Starting the game
   */
  const handleStartGame = /** @type {(playerName:string[], phasesCount:number)=>void}*/((playerNames, phasesCount) => {
    const phases = generateNPhases(phasesCount);
    proxySetPhases(phases);

    /** @type {Record<string, Player>} */
    const players = {};
    playerNames.forEach(name => players[name] = { name, points: 0, currentPhase: 1, completedPhases: [] });
    proxySetPlayers(players);
  });
  /**
   * End a phase: update players scores and current phase
   */
  const handleEndPhase = /**@type {(phaseData: Record<string, {moveToNextPhase:Boolean, points: number}>)=>void}*/((phaseData) => {

    const newValues = structuredClone(players);

    Object.values(players).forEach((p) => {
      const { moveToNextPhase, points } = phaseData[p.name];

      if (moveToNextPhase) {
        newValues[p.name].currentPhase++;
      }
      newValues[p.name].points += points;

      newValues[p.name].completedPhases.push({ moveToNextPhase, points });
    });

    proxySetPlayers(newValues);
  });

  /** Un-apply last phase */
  const handleRevertPhase = () => {
    const newValues = structuredClone(players);

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
      return newValues;
    });

    proxySetPlayers(newValues);

  }

  // Generates map {"phase" => [...playersInThatPhase]}
  const playersByPhase = React.useMemo(() => {
    /** @type {Record<string, Player[]>} */
    const result = {};
    Object.values(players).forEach(p => {
      result[p.currentPhase] = [...(result[p.currentPhase] || []), p]
    });

    return result;
  }, [players]);

  // Show revert button if at least one player is above phase 1
  const showRevertButton = Object.keys(playersByPhase).some(phase => Number(phase) > 1);

  // List of phases with players that are in it
  const phasesSection = (
    <section >
      <h2>
        Phases
        {showRevertButton ?
          <button className="small float-right" onClick={handleRevertPhase}>Back 1 phase</button> :
          null}
      </h2>
      <ol className="inline-block w-full text-left">
        {phases.map((p, index) => (
          <li key={index} className="mb-2 flex rounded border border-solid border-gray-300 bg-blue-50 px-6 py-4">
            <span className="mr-4 self-center opacity-70">{index + 1}.</span>
            <span className="flex flex-1 items-center justify-between">
              <div className="flex flex-col">
                {p.split(' + ').map((part, index) => (
                  <span key={index}>{part}</span>
                ))}
              </div>
              <div className="ml-4 self-center text-right font-bold">
                {(playersByPhase[index + 1] || []).map(p => (<div key={p.name}>{p.name} ({p.points})</div>))}
              </div>
            </span>
          </li>
        ))}
      </ol>
    </section>);

  function handleReset() {
    if (confirm('Are you sure you want to reset the game?')) {
      proxySetPhases([]);
      proxySetPlayers({});
    }
  }

  return (
    <div className="mx-auto mt-12 max-w-xs font-sans" >
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
            <EndPhaseSection players={players} onEndPhase={handleEndPhase} onReset={handleReset} />

          </>}
      </main>
    </div>)
}
