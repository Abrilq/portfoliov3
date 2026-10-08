import Image from "next/image";
import type { Project } from "@/lib/types";

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

export function ProjectArtwork({ project, index, interactiveMedia = false }: { project: Project; index: number; interactiveMedia?: boolean }) {
  const hasMedia = project.media.length > 0;
  const hasExistingArtwork = existingProjectSlugs.has(project.slug);

  return (
    <div className={`project-artwork artwork-${(index % 5) + 1}${interactiveMedia && hasMedia ? " project-artwork-media" : ""}`} aria-hidden={interactiveMedia ? undefined : true}>
      <div className="artwork-window">
        <div className="artwork-window-bar"><span /><span /><span /><b>{project.category}</b></div>
        <div className={`artwork-window-content${hasMedia ? " has-project-media" : ""}${interactiveMedia ? " is-interactive-artwork" : ""}`}>
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
