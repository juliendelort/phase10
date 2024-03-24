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
  const defaultValue = { phases:/** @type {string[]} */ ([]), players:/** @type {Record<string, Player>} */ ({}) };
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
  const [phases, setPhases] = React.useState(/**@type {string[]}*/([]));
  const [players, setPlayers] = React.useState(/**@type {Record<string, Player>}*/({}));

  React.useEffect(() => {
    setPhases(readLocalStorage().phases);
    setPlayers(readLocalStorage().players);
  }, []);

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
   * @type {(playerName:string[], phasesCount:number)=>void}
   */
  const handleStartGame = (playerNames, phasesCount) => {
    const phases = generateNPhases(phasesCount);
    proxySetPhases(phases);

    /** @type {Record<string, Player>} */
    const players = {};
    playerNames.forEach(name => players[name] = { name, points: 0, currentPhase: 1, completedPhases: [] });
    proxySetPlayers(players);
  }

  /**
   * End a phase: update players scores and current phase
   * @type {(phaseData: Record<string, {moveToNextPhase:Boolean, points: number}>)=>void}
   */
  const handleEndPhase = (phaseData) => {
    proxySetPlayers(Object.keys(players).reduce((acc, name) => {
      /** @type {Player} */
      const player = players[name];

      acc[name] = {
        ...player,
        currentPhase: player.currentPhase + (phaseData[name].moveToNextPhase ? 1 : 0),
        points: player.points + phaseData[name].points,
        completedPhases: [...player.completedPhases, { moveToNextPhase: phaseData[name].moveToNextPhase, points: phaseData[name].points }]
      };
      return acc;
    },/** @type {Record<string, Player>}*/({})));
  }

  /** Un-apply last phase */
  const handleRevertPhase = () => {

    proxySetPlayers(Object.keys(players).reduce((acc, name) => {
      /** @type {Player} */
      const player = players[name];
      const { moveToNextPhase, points } = player.completedPhases[player.completedPhases.length - 1];

      acc[name] = {
        ...player,
        completedPhases: player.completedPhases.slice(0, -1),
        currentPhase: player.currentPhase - (moveToNextPhase ? 1 : 0),
        points: player.points - points,
      };
      return acc;
    },/** @type {Record<string, Player>}*/({})));
  }

  // Generates map {"phase" => [...playersInThatPhase]}
  const playersByPhase = Object.values(players).reduce((agg, p) => {
    if (!agg[p.currentPhase]) {
      agg[p.currentPhase] = [];
    }
    agg[p.currentPhase].push(p);
    return agg;
  },/** @type {Record<string, Player[]>} */({}));

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

  const finishedPlayers = Object.values(players).filter(p => p.currentPhase > phases.length);
  const winner = finishedPlayers.length ? finishedPlayers.reduce((winner, p) => winner.points > p.points ? p : winner) : null;

  const handleRestart = () => {
    handleStartGame(Object.keys(players), phases.length);
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

        {!phases.length
          ? <PreGameForm onStartGame={handleStartGame} />
          : <>
            {phasesSection}
            {winner
              ? <>
                <div className="font-bold"> 🎉🎉🎉 {winner.name} won!</div>
                <ul className="list-none p-0">
                  {Object.values(players).map(p => (
                    <li key={p.name}><b>{p.name}</b>{finishedPlayers.some(finishedPlayer => p.name === finishedPlayer.name) ? ' (finished)' : ''}: {p.points} points</li>
                  ))}
                </ul>
                <button className="primary mt-4 w-full" onClick={handleRestart}>Restart</button>

              </>
              : <EndPhaseSection players={players} onEndPhase={handleEndPhase} onReset={handleReset} />
            }

          </>}
      </main>
    </div>)
}
