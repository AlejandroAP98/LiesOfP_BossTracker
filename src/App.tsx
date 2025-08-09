// App.tsx (versión con timers)
import { useState, useEffect } from 'preact/hooks';
import bossData from './data/bosses.json';
import type { Boss } from './types/Boss';
import { BossCard } from './components/BossCard';
import Login from "./components/Login";
import Footer from "./components/Footer";
import Stats from "./components/Stats";

import {
  fetchBosses,
  fetchDefeated,
  saveDefeated,
  saveTimeFirebase,
  fetchTimes,
  deleteTimeFirebase,
  loadUserDataFromFirebase
} from "./services/firebase";

export function App() {
  type BossCategories = Record<string, Boss[]>;
  const [defeated, setDefeated] = useState<Record<string, boolean>>({});
  const [bossesByCategory, setBossesByCategory] = useState<Record<string, Boss[]>>({});
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Bosses Main");
  const [timers, setTimers] = useState<Record<string, number>>({}); 
  const [username, setUsername] = useState<string>(window.localStorage.getItem('bossTracker_username') || "");
  const LS_KEY = `boss_timers_${username}`;

  // Cargar datos desde Firebase y localStorage
  useEffect(() => {
    async function loadData() {
      const bossesRemote = await fetchBosses();
      setBossesByCategory(bossesRemote);
      setActiveTab(Object.keys(bossesRemote)[0] || "Bosses Main");

      const defeatedFromDb = await fetchDefeated(username);
      setDefeated(defeatedFromDb || {});

      const firebaseTimes = await fetchTimes(username);
      const localJson = localStorage.getItem(LS_KEY);
      const localTimers = localJson ? JSON.parse(localJson) : {};

      // Merge: si está derrotado -> preferir firebase time, si no -> usar local
      const merged: Record<string, number> = {};
      const keys = new Set<string>([
        ...Object.keys(defeatedFromDb || {}),
        ...Object.keys(firebaseTimes || {}),
        ...Object.keys(localTimers || {})
      ]);
      keys.forEach(k => {
        if (defeatedFromDb && defeatedFromDb[k]) {
          merged[k] = (firebaseTimes && firebaseTimes[k]) ?? (localTimers[k] ?? 0);
        } else {
          merged[k] = localTimers[k] ?? 0;
        }
      });
      setTimers(merged);
    }
    loadData();
  }, []);

  useEffect(() => {
    const bossesByCategory: BossCategories = bossData as BossCategories;
    setBosses(bossesByCategory[activeTab] || []);
  }, [activeTab]);

  const updateLocalTimers = (bossName: string, elapsed: number) => {
    setTimers(prev => {
      const next = { ...prev, [bossName]: elapsed };
      const localJson = localStorage.getItem(LS_KEY);
      const local = localJson ? JSON.parse(localJson) : {};
      local[bossName] = elapsed;
      localStorage.setItem(LS_KEY, JSON.stringify(local));
      return next;
    });
  };

  const updateTime = async (bossName: string, elapsed: number) => {
    if (defeated[bossName]) {
      await saveTimeFirebase(bossName, elapsed, username);
      const localJson = localStorage.getItem(LS_KEY);
      if (localJson) {
        const local = JSON.parse(localJson);
        delete local[bossName];
        localStorage.setItem(LS_KEY, JSON.stringify(local));
      }
      setTimers(prev => ({ ...prev, [bossName]: elapsed }));
    } else {
      updateLocalTimers(bossName, elapsed);
    }
  };

  const handleToggleDefeated = async (bossName: string, currentElapsed: number) => {
    const wasDefeated = !!defeated[bossName];
    const updatedDefeated = { ...defeated, [bossName]: !wasDefeated };
    setDefeated(updatedDefeated);
    if (!wasDefeated) {
      await saveDefeated(username, updatedDefeated);
      await saveTimeFirebase(bossName, currentElapsed, username);
      const localJson = localStorage.getItem(LS_KEY);
      if (localJson) {
        const local = JSON.parse(localJson);
        delete local[bossName];
        localStorage.setItem(LS_KEY, JSON.stringify(local));
      }
      setTimers(prev => ({ ...prev, [bossName]: currentElapsed }));
    } else {
      // Quitar como derrotado
      await saveDefeated(username, updatedDefeated);
      await deleteTimeFirebase(bossName, username);

      updateLocalTimers(bossName, currentElapsed);
    }
  };

  const handleLogin = async (username: string) => {
    window.localStorage.setItem('bossTracker_username', username);
    setUsername(username);
    const { defeated, timers } = await loadUserDataFromFirebase(username);
    setDefeated(defeated);
    setTimers(timers);  
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="container flex flex-col justify-between h-full bg-base-100 w-full sm:px-0 px-2 mx-auto">
      <div className="flex flex-col">
        <Stats defeated={defeated} timers={timers} />
      </div>
      <div className="flex justify-center gap-4 mb-2">
        <ul className="menu menu-horizontal  bg-base-200 rounded-box justify-center gap-2">
          {Object.entries(bossesByCategory).map(([category]) => (
            <li key={category}>
              <a
                onClick={() => setActiveTab(category)}
                className={`${activeTab === category ? 'text-primary font-bold decoration-primary-500 underline-offset-4 underline' : 'text-base-content'}`}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full mb-2"> 
        {bosses.map((boss) => (
          <BossCard
            boss={boss}
            key={boss.name}
            derrotados={!!defeated[boss.name]}
            elapsed={timers[boss.name] || 0}
            onTimeChange={(name, elapsed) => updateTime(name, elapsed)}
            onToggleDefeated={(name, elapsed) => handleToggleDefeated(name, elapsed)}
          />
        ))}
      </div>
      <div className="flex justify-center w-full items-center ">
        <Footer />
      </div>
    </div>
  );
}
