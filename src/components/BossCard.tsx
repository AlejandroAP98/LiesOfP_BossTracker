// components/BossCard.tsx (reemplaza tu versión por esta)
import { useState, useEffect, useRef } from 'preact/hooks';
import type { Boss } from '../types/Boss';

export const BossCard = ({
  boss,
  derrotados,
  elapsed: elapsedFromParent,
  onTimeChange,
  onToggleDefeated
}: {
  boss: Boss;
  derrotados: boolean;
  elapsed: number; 
  onTimeChange: (bossName: string, elapsed: number) => void;
  onToggleDefeated: (bossName: string, elapsed: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number>(elapsedFromParent || 0);
  const tickCounterRef = useRef(0);
  const TICK_SAVE_INTERVAL = 5; 

  useEffect(() => {
    setElapsed(elapsedFromParent || 0);
    if (derrotados) setRunning(false);
  }, [elapsedFromParent, derrotados]);

  useEffect(() => {
    let id: number | null = null;
    if (running && !derrotados) {
      id = window.setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          tickCounterRef.current += 1;
          if (tickCounterRef.current >= TICK_SAVE_INTERVAL) {
            onTimeChange(boss.name, next);
            tickCounterRef.current = 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [running, derrotados]);

  const formatTime = (s: number) => {
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (hh > 0) return `${hh}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    return `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
  };

  const handleStart = () => {
    if (!derrotados) setRunning(true);
  };
  const handlePause = () => {
    setRunning(false);
    onTimeChange(boss.name, elapsed); 
  };
  const handleReset = () => {
    if(confirm(`¿Estás seguro de reiniciar el tiempo para ${boss.name}?`)){
      setRunning(false);
      setElapsed(0);
      onTimeChange(boss.name, 0);
    }
  };

  const handleToggle = () => {
    setRunning(false);
    onTimeChange(boss.name, elapsed);
    onToggleDefeated(boss.name, elapsed);
  };

  return (
    <div className={`card w-full cursor-pointer transition-colors duration-500 ease-in-out  ${derrotados ? 'bg-primary text-primary-content ' : 'bg-base-300'}`} onDblClick={handleToggle}>
        <div className="flex justify-start items-center mx-5 mt-1">
            <input
              type="checkbox"
              className="checkbox checkbox-warning"
              checked={derrotados}
              onChange={handleToggle}
            />
            <label className="collapse-title text-sm font-medium">
              Derrotado
            </label>
        </div>
        <figure >
            <img src={boss.image} alt={boss.name} className="w-48 h-48 rounded-full object-cover" />
        </figure>
      <h2 className="card-title font-bold flex text-center items-center justify-center">{boss.name}</h2>
      <div className="card-body w-full flex flex-col justify-between">
        <div className="flex flex-col justify-between w-full gap-1">
            <div className="flex justify-between items-center w-full">
            <div className="text-sm font-medium mx-1"><span className="countdown items-center font-mono font-bold text-xl">{formatTime(elapsed)}</span></div>
            <div className="flex gap-2 mx-1">
              <button className="btn btn-sm btn-primary" onClick={handleStart} hidden={running || derrotados}>Start</button>
              <button className="btn btn-sm btn-secondary" onClick={handlePause} hidden={!running}>Pause</button>
              <button className="btn btn-sm btn-error" onClick={handleReset} hidden={derrotados}>Reset</button>
            </div>
          </div>
            <div className={`stats shadow bg-base-200 flex justify-start items-start transition-colors duration-500 ease-in-out ${derrotados ? 'text-primary' : 'text-base-content'}`}>
                <div className="stat flex">
                    <div className="stat-figure">
                        <div className="stat-title text-sm">
                            <p className="flex items-center gap-2 ">
                                <span>Puntos de vida</span>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-4 w-4 stroke-current"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    ></path>
                                </svg>
                            </p>
                        </div>
                        <div className="stat-value text-sm text-wrap ">{boss.health? boss.health : "- -"}</div>
                    </div>
                </div>
                <div className="stat flex">
                    <div className="stat-figure">
                        <div className="stat-title text-sm">
                            <p className="flex items-center gap-2">
                                <span>Ergo</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
                                <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
                                </svg>
                            </p>
                        </div>
                        <div className="stat-value text-sm text-wrap ">{boss.ergo? boss.ergo : "- -"}</div>
                    </div>
                </div>
            </div>
            <div className={`stats shadow bg-base-200 transition-colors duration-500 ease-in-out ${derrotados ? 'text-primary' : 'text-base-content'}`}>
                <div className="stats stats-vertical">
                    <div className="stat">
                        <div className="stat-title text-sm">
                            <p className="flex items-center gap-2">
                                <span>Locación</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                            </p>
                        </div>
                        <div className="stat-value text-sm text-wrap font-semibold">{boss.location? boss.location : "- -"}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title text-sm">
                            <p className="flex items-center gap-2">
                                <span>Recompensa</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trophy" viewBox="0 0 16 16">
                                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
                                </svg>
                                
                            </p>
                        </div>
                        <div className="stat-value text-sm text-wrap font-semibold">{boss.rewards? boss.rewards : "- -"}</div>
                    </div>
                </div>
            </div>
          <div className="collapse collapse-plus bg-base-100 w-full text-base-content">
            <input type="checkbox" className="peer" id={`collapse-${boss.name}`} checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
            <label htmlFor={`collapse-${boss.name}`} className="collapse-title text-sm font-medium">
              {isOpen ? 'Ocultar' : 'Mostrar'} descripción
            </label>
            <div className="collapse-content">
              <div className="content">
                <p className="text-sm text-primary">{boss.description}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-actions flex justify-end items-center">
          <a href={boss.detail_url} target="_blank" className="btn btn-ghost btn-sm">
            <span className="flex items-center gap-2">Visitar
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
                    <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                    <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};
