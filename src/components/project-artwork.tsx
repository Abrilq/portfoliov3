"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import type { Project } from "@/lib/types";
import "./project-artwork.css";

const existingProjectSlugs = new Set([
  "lost-and-found",
  "pre-advising",
  "eyewear-store",
  "ar-learning",
  "damath",
  "ordering-system",
  "drinking-session",
  "srt-renamer",
]);

const interactiveProjectSlugs = new Set([
  "lost-and-found",
  "eyewear-store",
  "drinking-session",
  "srt-renamer",
]);

function ExistingProjectArtwork({ project, index }: { project: Project; index: number }) {
  if (project.slug === "ordering-system") {
    return <><div className="artwork-label">ORDER OVERVIEW</div><strong>Orders,<br />in progress.</strong><div className="artwork-order-list"><span>ORDER #0241 <b>Preparing</b></span><span>ORDER #0242 <b>Received</b></span></div></>;
  }
  if (project.slug === "drinking-session") {
    return <><div className="artwork-label">DRINKING SESSION</div><strong>Whose turn<br />is it?</strong><div className="artwork-turn-display"><span>YOUR TURN</span><b>03</b><i>of 08</i></div></>;
  }
  if (project.slug === "srt-renamer") {
    return <><div className="artwork-label">SRT RENAMER</div><strong>Subtitles,<br />in order.</strong><div className="artwork-file-list"><span><i />episode_01.srt</span><span><i />episode_02.srt</span></div></>;
  }
  if (index % 5 === 0) {
    return <><div className="artwork-label">ITEM TRACKER <span>● LIVE</span></div><strong>Found near<br />the library</strong><div className="artwork-progress"><i /><i /><i /></div><div className="artwork-row"><span>Report received</span><b>In review</b></div></>;
  }
  if (index % 5 === 1) {
    return <><div className="artwork-label">PRE-ADVISING / 2025</div><strong>Plan your<br />next semester.</strong><div className="artwork-subjects"><i>IT 304 <b>3 units</b></i><i>WEB 201 <b>3 units</b></i><i>HCI 102 <b>2 units</b></i></div></>;
  }
  if (index % 5 === 2) {
    return <><div className="artwork-label">OPTICAL STUDIO</div><strong>Find your<br />point of view.</strong><div className="artwork-frame"><span /><span /></div></>;
  }
  if (index % 5 === 3) {
    return <><div className="artwork-label">FIELD NOTES / 04</div><strong>Learning,<br />in another layer.</strong><div className="artwork-ar"><span>AR</span><i /><i /><i /></div></>;
  }
  return <><div className="artwork-label">DAMATH / 3D STUDY</div><strong>Play with<br />purpose.</strong><div className="artwork-board"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></>;
}

function ShotpunoDemo() {
  const [players, setPlayers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstClick, setFirstClick] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [showManage, setShowManage] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const artworkRef = useRef<HTMLDivElement>(null);
  const draggedIndex = useRef<number | null>(null);

  useEffect(() => {
    let isActive = true;
    const timeout = window.setTimeout(() => {
      if (!isActive) return;
      try {
        const savedPlayers = window.localStorage.getItem("shotpuno_players");
        const savedIndex = window.localStorage.getItem("shotpuno_currentIndex");
        const savedFirstClick = window.localStorage.getItem("shotpuno_firstClick");
        if (savedPlayers) {
          const parsedPlayers: unknown = JSON.parse(savedPlayers);
          if (Array.isArray(parsedPlayers) && parsedPlayers.every((player) => typeof player === "string")) {
            setPlayers(parsedPlayers);
          }
        }
        if (savedIndex !== null && Number.isInteger(Number(savedIndex))) {
          setCurrentIndex(Math.max(0, Number(savedIndex)));
        }
        if (savedFirstClick !== null) {
          const parsedFirstClick: unknown = JSON.parse(savedFirstClick);
          if (typeof parsedFirstClick === "boolean") setFirstClick(parsedFirstClick);
        }
      } catch {
        setStorageMessage("Saved session could not be read. Your changes will still work for now.");
      } finally {
        setHasLoaded(true);
      }
    }, 0);
    return () => {
      isActive = false;
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    try {
      window.localStorage.setItem("shotpuno_players", JSON.stringify(players));
      window.localStorage.setItem("shotpuno_currentIndex", String(currentIndex));
      window.localStorage.setItem("shotpuno_firstClick", JSON.stringify(firstClick));
    } catch {
      window.setTimeout(() => setStorageMessage("This browser could not save your player list."), 0);
    }
  }, [currentIndex, firstClick, hasLoaded, players]);

  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === artworkRef.current);
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () => document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const currentPlayer = players[currentIndex] ?? "";

  function addPlayer() {
    const name = playerName.trim();
    if (!name) return;
    setPlayers((current) => [...current, name]);
    setPlayerName("");
    if (players.length === 0) {
      setCurrentIndex(0);
      setFirstClick(true);
    }
  }

  function advancePlayer() {
    if (!players.length) return;
    setCurrentIndex((index) => firstClick ? 1 % players.length : (index + 1) % players.length);
    setFirstClick(false);
  }

  function removePlayer(index: number) {
    const remaining = players.filter((_, playerIndex) => playerIndex !== index);
    setPlayers(remaining);
    if (!remaining.length) {
      setCurrentIndex(0);
      setFirstClick(true);
      return;
    }
    if (index < currentIndex) setCurrentIndex(currentIndex - 1);
    else if (index === currentIndex) setCurrentIndex(Math.min(index, remaining.length - 1));
  }

  function movePlayer(from: number, to: number) {
    if (from === to || to < 0 || to >= players.length) return;
    const reordered = [...players];
    const [player] = reordered.splice(from, 1);
    reordered.splice(to, 0, player);
    setPlayers(reordered);
    if (currentIndex === from) setCurrentIndex(to);
    else if (from < currentIndex && to >= currentIndex) setCurrentIndex(currentIndex - 1);
    else if (from > currentIndex && to <= currentIndex) setCurrentIndex(currentIndex + 1);
  }

  async function toggleFullscreen() {
    if (!artworkRef.current) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await artworkRef.current.requestFullscreen();
    } catch {
      setStorageMessage("Fullscreen is not available in this browser.");
    }
  }

  return (
    <div className={`artwork-demo shotpuno-demo${isFullscreen ? " is-fullscreen" : ""}`} ref={artworkRef}>
      <div className="demo-heading">
        <div><span className="demo-kicker">THE GROUP GAME</span><strong>SHOTPUNO</strong></div>
        <button className="demo-icon-button" type="button" aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"} onClick={toggleFullscreen}>
          {isFullscreen ? "↙" : "⛶"}
        </button>
      </div>
      <div className="shotpuno-layout">
        <section className="shotpuno-turn">
          <div className="shotpuno-turn-top"><span>UP NEXT</span><span>{players.length ? `${String(currentIndex + 1).padStart(2, "0")} / ${String(players.length).padStart(2, "0")}` : "READY WHEN YOU ARE"}</span></div>
          <button className="shotpuno-current" type="button" onClick={advancePlayer} aria-label="Show the next player">
            <span className="shotpuno-orbit" aria-hidden="true">✳</span>
            <small>{players.length ? "IT'S YOUR TURN" : "ADD YOUR CREW"}</small>
            <strong>{currentPlayer || "Who's\nnext?"}</strong>
            <span className="shotpuno-tap">{players.length ? "TAP TO PASS THE TURN ↗" : "YOUR NEXT ROUND STARTS HERE"}</span>
          </button>
          <button className="demo-primary-button shotpuno-next" type="button" onClick={advancePlayer} disabled={!players.length}>
            Next player <span aria-hidden="true">↗</span>
          </button>
        </section>
        <section className="shotpuno-roster" aria-label="Player list">
          <div className="shotpuno-roster-heading">
            <div><span className="demo-kicker">IN THIS ROUND</span><strong>Players <i>{players.length}</i></strong></div>
            <button className="demo-text-button" type="button" onClick={() => setShowManage((value) => !value)} aria-expanded={showManage}>{showManage ? "Done" : "Manage"}</button>
          </div>
          <form className="shotpuno-add" onSubmit={(event) => { event.preventDefault(); addPlayer(); }}>
            <label className="sr-only" htmlFor="shotpuno-player-name">Player name</label>
            <input id="shotpuno-player-name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Add a player…" maxLength={32} />
            <button type="submit" aria-label="Add player" disabled={!playerName.trim()}>+</button>
          </form>
          {players.length ? (
            <ul className="shotpuno-player-list">
              {players.map((player, index) => (
                <li
                  key={`${player}-${index}`}
                  className={index === currentIndex ? "is-current-player" : ""}
                  draggable={showManage}
                  onDragStart={(event) => { draggedIndex.current = index; event.dataTransfer.effectAllowed = "move"; }}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => { event.preventDefault(); if (draggedIndex.current !== null) movePlayer(draggedIndex.current, index); draggedIndex.current = null; }}
                  onDragEnd={() => { draggedIndex.current = null; }}
                >
                  <button className="shotpuno-player-select" type="button" onClick={() => { setCurrentIndex(index); setFirstClick(false); }} aria-current={index === currentIndex ? "true" : undefined}>
                    <span className="player-number">{String(index + 1).padStart(2, "0")}</span><span className="player-name">{player}</span>{index === currentIndex && <span className="player-turn-dot" aria-label="Current player" />}
                  </button>
                  {showManage && <div className="player-manage-actions">
                    <button type="button" aria-label={`Move ${player} up`} disabled={index === 0} onClick={() => movePlayer(index, index - 1)}>↑</button>
                    <button type="button" aria-label={`Move ${player} down`} disabled={index === players.length - 1} onClick={() => movePlayer(index, index + 1)}>↓</button>
                    <button type="button" aria-label={`Remove ${player}`} onClick={() => removePlayer(index)}>×</button>
                  </div>}
                </li>
              ))}
            </ul>
          ) : (
            <div className="shotpuno-empty"><span aria-hidden="true">＋</span><p>Your crew will show up here.<br />Add someone to start.</p></div>
          )}
          <p className="shotpuno-hint">{showManage ? "Drag to reorder, or use the arrows." : "Add names, then tap the card to pass."}</p>
        </section>
      </div>
      {storageMessage && <p className="demo-status-message" role="status">{storageMessage}</p>}
    </div>
  );
}

function safeFilename(value: string) {
  return value.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").replace(/ +$/g, "");
}

function SrtRenamerDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [prefix, setPrefix] = useState("");
  const [increment, setIncrement] = useState("S01E01");
  const [suffix, setSuffix] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState("Choose subtitle files or drop them here.");
  const [statusIsError, setStatusIsError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const episodeMatch = increment.trim().match(/^S(\d{1,2})E(\d{1,3})$/i);
  const seasonNumber = episodeMatch?.[1] ?? "";
  const startingEpisode = episodeMatch?.[2] ?? "";
  const outputNames = useMemo(() => files.map((_, index) => {
    if (!seasonNumber || !startingEpisode) return "";
    const season = seasonNumber.padStart(2, "0");
    const episode = String(Number(startingEpisode) + index).padStart(2, "0");
    return `${safeFilename(prefix)}S${season}E${episode}${safeFilename(suffix)}.srt`;
  }), [files, prefix, seasonNumber, startingEpisode, suffix]);

  function receiveFiles(incoming: FileList | File[]) {
    const validFiles = Array.from(incoming).filter((file) => file.name.toLowerCase().endsWith(".srt"));
    if (!validFiles.length) {
      setStatus("No valid .srt files found. Try selecting subtitle files.");
      setStatusIsError(true);
      return;
    }
    setFiles(validFiles);
    setStatus(`${validFiles.length} subtitle ${validFiles.length === 1 ? "file" : "files"} ready to rename.`);
    setStatusIsError(false);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) receiveFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    receiveFiles(event.dataTransfer.files);
  }

  async function downloadRenamedFiles() {
    if (!files.length) {
      setStatus("Choose at least one .srt file first.");
      setStatusIsError(true);
      return;
    }
    if (!episodeMatch) {
      setStatus("Use an episode number like S02E01 to continue.");
      setStatusIsError(true);
      return;
    }

    try {
      const contents = await Promise.all(files.map((file) => file.text()));
      contents.forEach((content, index) => {
        const blobUrl = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = outputNames[index];
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      });
      setStatus(`${files.length} renamed ${files.length === 1 ? "file is" : "files are"} downloading.`);
      setStatusIsError(false);
    } catch {
      setStatus("A subtitle file could not be read. Please try selecting it again.");
      setStatusIsError(true);
    }
  }

  return (
    <div className="artwork-demo srt-demo" onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false); }} onDrop={handleDrop}>
      <div className="demo-heading">
        <div><span className="demo-kicker">BATCH FILE TOOL</span><strong>SRT RENAMER</strong></div>
        <span className="srt-privacy-badge"><i /> FILES STAY LOCAL</span>
      </div>
      <div className="srt-layout">
        <section className={`srt-upload-zone${isDragging ? " is-dragging" : ""}`} aria-label="Subtitle file upload">
          <input ref={fileInputRef} className="sr-only" type="file" accept=".srt" multiple onChange={handleFileChange} aria-label="Choose SRT files" />
          <span className="srt-upload-icon" aria-hidden="true">↑</span>
          <strong>Drop your .srt files here</strong>
          <span>or</span>
          <button className="demo-secondary-button" type="button" onClick={() => fileInputRef.current?.click()}>Browse files</button>
          <small>Multiple subtitle files supported</small>
        </section>
        <section className="srt-settings">
          <div className="srt-section-heading"><span className="demo-kicker">NAME FORMAT</span><span>01 / 02</span></div>
          <label className="srt-field"><span>Prefix <small>optional</small></span><input value={prefix} onChange={(event) => setPrefix(event.target.value)} placeholder="Show.Name." /></label>
          <label className="srt-field"><span>Starting episode</span><input value={increment} onChange={(event) => setIncrement(event.target.value.toUpperCase())} placeholder="S02E01" autoCapitalize="characters" /></label>
          <label className="srt-field"><span>Suffix <small>optional</small></span><input value={suffix} onChange={(event) => setSuffix(event.target.value)} placeholder=".1080p.WEB-DL" /></label>
          <p className="srt-example">Example: <b>{outputNames[0] || `${prefix || "Show.Name."}S02E01${suffix}.srt`}</b></p>
        </section>
      </div>
      <section className="srt-file-tray">
        <div className="srt-file-tray-heading"><strong>Ready to rename <i>{files.length}</i></strong>{files.length > 0 && <button className="demo-text-button" type="button" onClick={() => { setFiles([]); setStatus("Choose subtitle files or drop them here."); setStatusIsError(false); }}>Clear all</button>}</div>
        {files.length ? (
          <ul className="srt-file-list">
            {files.slice(0, 3).map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`}><span className="srt-file-type">SRT</span><span className="srt-file-names"><b>{file.name}</b><i>→ {outputNames[index] || "Check episode format"}</i></span><span className="srt-file-size">{Math.max(1, Math.round(file.size / 1024))} KB</span></li>)}
            {files.length > 3 && <li className="srt-more-files">+ {files.length - 3} more subtitle files</li>}
          </ul>
        ) : <p className="srt-no-files">Your renamed file preview will appear here.</p>}
      </section>
      <div className="srt-footer">
        <p className={statusIsError ? "is-error" : ""} role="status">{status}</p>
        <button className="demo-primary-button" type="button" onClick={downloadRenamedFiles} disabled={!files.length || !episodeMatch}>Rename &amp; download <span aria-hidden="true">↗</span></button>
      </div>
    </div>
  );
}

function LostAndFoundDemo() {
  return (
    <div className="artwork-demo lost-found-demo">
      <header className="found-live-toolbar">
        <span><i aria-hidden="true" /> LIVE DEMO</span>
        <a href="https://lnfdemoapp.vercel.app/" target="_blank" rel="noreferrer">Open in new tab ↗</a>
      </header>
      <iframe
        className="found-live-frame"
        src="https://lnfdemoapp.vercel.app/"
        title="Live Lost & Found demo"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

function EyewearStoreDemo() {
  return (
    <div className="artwork-demo eyewear-demo">
      <header className="eyewear-live-toolbar">
        <span><i aria-hidden="true" /> LIVE STORE</span>
        <a href="https://pro-website-cat-peas.vercel.app/" target="_blank" rel="noreferrer">Open in new tab ↗</a>
      </header>
      <iframe
        className="eyewear-live-frame"
        src="https://pro-website-cat-peas.vercel.app/"
        title="Live Cat'peas eyewear store"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function ProjectArtwork({ project, index, interactiveMedia = false }: { project: Project; index: number; interactiveMedia?: boolean }) {
  const hasMedia = project.media.length > 0;
  const hasExistingArtwork = existingProjectSlugs.has(project.slug);
  const isInteractiveProject = interactiveMedia && interactiveProjectSlugs.has(project.slug) && !hasMedia;

  return (
    <div className={`project-artwork artwork-${(index % 5) + 1}${interactiveMedia && hasMedia ? " project-artwork-media" : ""}${isInteractiveProject ? ` project-artwork--demo project-artwork--${project.slug}` : ""}`} aria-hidden={interactiveMedia ? undefined : true}>
      <div className="artwork-window">
        <div className="artwork-window-bar"><span /><span /><span /><b>{project.category}</b></div>
        <div className={`artwork-window-content${hasMedia ? " has-project-media" : ""}${interactiveMedia ? " is-interactive-artwork" : ""}${isInteractiveProject ? " has-project-demo" : ""}`}>
          {hasMedia ? (
            <div className="artwork-media-list">
              {project.media.map((media) => (
                <figure key={media.path}>
                  {media.type === "video"
                    ? <video controls={interactiveMedia} muted={!interactiveMedia} playsInline preload={interactiveMedia ? "metadata" : "none"}><source src={media.url} /></video>
                    : <Image alt={interactiveMedia ? media.name : ""} height={900} src={media.url} unoptimized width={1600} />}
                  {interactiveMedia && <figcaption>{media.name}</figcaption>}
                </figure>
              ))}
            </div>
          ) : isInteractiveProject ? (
            project.slug === "drinking-session" ? <ShotpunoDemo />
              : project.slug === "srt-renamer" ? <SrtRenamerDemo />
                : project.slug === "lost-and-found" ? <LostAndFoundDemo />
                  : <EyewearStoreDemo />
          ) : hasExistingArtwork ? (
            <ExistingProjectArtwork index={index} project={project} />
          ) : (
            <>
              <div className="artwork-label">{project.title}</div>
              <strong>Still working<br />on it.</strong>
              <div className="artwork-progress"><i /><i /><i /></div>
              <div className="artwork-row"><span>Project in progress</span><b>Stay tuned</b></div>
            </>
          )}
        </div>
      </div>
      <span className="artwork-index">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}
