import Image from "next/image";
import type { Project } from "@/lib/types";
import "./project-artwork.css";

function ExistingProjectArtwork({ project }: { project: Project }) {
  switch (project.slug) {
    case "lost-and-found":
      return <><div className="artwork-label">ITEM TRACKER <span>● LIVE</span></div><strong>Found near<br />the library</strong><div className="artwork-progress"><i /><i /><i /></div><div className="artwork-row"><span>Report received</span><b>In review</b></div></>;
    case "pre-advising":
      return <><div className="artwork-label">PRE-ADVISING / 2025</div><strong>Plan your<br />next semester.</strong><div className="artwork-subjects"><i>IT 304 <b>3 units</b></i><i>WEB 201 <b>3 units</b></i><i>HCI 102 <b>2 units</b></i></div></>;
    case "eyewear-store":
      return <><div className="artwork-label">OPTICAL STUDIO</div><strong>Find your<br />point of view.</strong><div className="artwork-frame"><span /><span /></div></>;
    case "ar-learning":
      return <><div className="artwork-label">FIELD NOTES / 04</div><strong>Learning,<br />in another layer.</strong><div className="artwork-ar"><span>AR</span><i /><i /><i /></div></>;
    case "damath":
      return <><div className="artwork-label">DAMATH / 3D STUDY</div><strong>Play with<br />purpose.</strong><div className="artwork-board"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></>;
    case "ordering-system":
      return <><div className="artwork-label">ORDER OVERVIEW</div><strong>Orders,<br />in progress.</strong><div className="artwork-order-list"><span>ORDER #0241 <b>Preparing</b></span><span>ORDER #0242 <b>Received</b></span></div></>;
    case "drinking-session":
      return <><div className="artwork-label">DRINKING SESSION</div><strong>Whose turn<br />is it?</strong><div className="artwork-turn-display"><span>YOUR TURN</span><b>03</b><i>of 08</i></div></>;
    case "srt-renamer":
      return <><div className="artwork-label">SRT RENAMER</div><strong>Subtitles,<br />in order.</strong><div className="artwork-file-list"><span><i />episode_01.srt</span><span><i />episode_02.srt</span></div></>;
    default:
      return (
        <div className="artwork-generic">
          <div className="artwork-label">{project.category}</div>
          <strong>{project.title}</strong>
          <p>{project.summary}</p>
          {project.stack.length > 0 && (
            <div className="artwork-generic-stack">
              {project.stack.slice(0, 2).map((item) => <span key={item}>{item}</span>)}
            </div>
          )}
        </div>
      );
  }
}

function artworkVariant(slug: string) {
  let hash = 0;
  for (const character of slug) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return (hash % 5) + 1;
}

function LiveProjectDemo({ project }: { project: Project }) {
  const liveUrl = project.live_url.trim();

  return (
    <div className="artwork-demo project-live-demo">
      <header className="project-live-toolbar">
        <span><i aria-hidden="true" /> LIVE DEMO</span>
        <a href={liveUrl} target="_blank" rel="noreferrer">Open in new tab ↗</a>
      </header>
      <iframe
        className="project-live-frame"
        src={liveUrl}
        title={`${project.title} live demo`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export function ProjectArtwork({ project, index, interactiveMedia = false }: { project: Project; index: number; interactiveMedia?: boolean }) {
  const hasMedia = project.media.length > 0;
  const hasVideoMedia = project.media.some((media) => media.type === "video");
  const hasLiveDemo = interactiveMedia && Boolean(project.live_url.trim()) && !hasMedia;

  return (
    <div className={`project-artwork artwork-${artworkVariant(project.slug)}${interactiveMedia && hasMedia ? " project-artwork-media" : ""}${interactiveMedia && hasVideoMedia ? " project-artwork-media-video" : ""}${hasLiveDemo ? " project-artwork--demo" : ""}`} aria-hidden={interactiveMedia ? undefined : true}>
      <div className="artwork-window">
        <div className="artwork-window-bar"><span /><span /><span /><b>{project.category}</b></div>
        <div className={`artwork-window-content${hasMedia ? " has-project-media" : ""}${interactiveMedia ? " is-interactive-artwork" : ""}${hasLiveDemo ? " has-project-demo" : ""}`}>
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
          ) : hasLiveDemo ? (
            <LiveProjectDemo project={project} />
          ) : (
            <ExistingProjectArtwork project={project} />
          )}
        </div>
      </div>
      <span className="artwork-index">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}
