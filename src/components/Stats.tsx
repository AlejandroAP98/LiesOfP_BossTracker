import { useMemo } from "preact/hooks";
import dataBosses from "../data/bosses.json";

Stats.defaultProps = {
  defeated: {},
  timers: {}
};

function Stats({ defeated, timers }: { defeated: Record<string, boolean>; timers: Record<string, number> }) {
  const stats = useMemo(() => {
    // Total de bosses en todas las categorías
    const totalBosses =
      Object.keys(dataBosses["Bosses Main"]).length +
      Object.keys(dataBosses["Bosses Overture"]).length +
      Object.keys(dataBosses["Minibosses"]).length;

    // Contar solo los bosses derrotados
    const defeatedCount = Object.values(defeated).filter(isDefeated => isDefeated).length;
    const progress = Math.round((defeatedCount / totalBosses) * 100);

    // Tiempo total acumulado (solo bosses derrotados)
    const totalTimeSeconds = Object.entries(defeated)
      .filter(([_, isDefeated]) => isDefeated)
      .reduce((acc, [bossName]) => acc + (timers[bossName] || 0), 0);

    // Convertir a formato legible
    const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (h > 0) {
        return `${h}h ${m}m ${s}s`;
      }
      return `${m}m ${s}s`;
    };

    return {
      progress,
      totalTimeFormatted: formatTime(totalTimeSeconds)
    };
  }, [defeated, timers]); 

  return (
    <div class="w-full flex flex-col justify-center items-center gap-2 mx-1">
      <div class="w-full">
        <progress
        className="progress progress-warning w-full "
        value={stats.progress}
        max="100"
      ></progress>
      </div>
      <div class="w-full flex justify-between items-center">
        <p class="text-xl font-bold font-mono">{stats.progress}%</p>
        <p class="text-xl font-bold font-mono">{stats.totalTimeFormatted}</p>
      </div>
    </div>
  );
}

export default Stats;
