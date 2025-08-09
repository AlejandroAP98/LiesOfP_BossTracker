export default function Footer() {
  const handleLogout = () => {
    window.localStorage.removeItem('bossTracker_username');
    window.location.reload();
  };
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-neutral-content items-center p-4 min-h-auto w-full">
      <aside className="flex w-full items-center justify-between bg-bas-200 ">
        <p className="text-sm sm:text-center">
          Información extraída de{" "}
          <a
            href="https://liesofp.wiki.fextralife.com/Lies+of+P+Wiki"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Sekiro Wiki
          </a>{" "}
          y{" "}
          <a
            href="https://fextralife.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            Fextralife
          </a>.
        </p>
        <div className="flex items-center w-full justify-center">
          <p className="text-xs text-neutral-content flex items-center gap-2 text-center w-full justify-center">
            <a className="pr-1" href="https://github.com/AlejandroAP98" target="_blank" rel="noopener noreferrer">
            <svg width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
            </svg>
          </a>
          Alejandro Álvarez - Lies of P Boss Tracker v1.0
          </p>
        </div>
        <div className="flex mx-4 items-center flex-wrap justify-center">
            <button className="btn btn-sm btn-primary cursor-pointer" onClick={handleLogout}>
            Cerrar sesión
            </button>
        </div>
      </aside>
    </footer>
  );
}
