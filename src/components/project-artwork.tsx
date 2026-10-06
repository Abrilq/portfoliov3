import type { Project } from "@/lib/types";

export function ProjectArtwork({ project, index }: { project: Project; index: number }) {
  return (
    <div className={`project-artwork artwork-${(index % 5) + 1}`} aria-hidden="true">
      <div className="artwork-window">
        <div className="artwork-window-bar"><span /><span /><span /><b>{project.category}</b></div>
        <div className="artwork-window-content">
          {index % 5 === 0 ? (
            <>
              <div className="artwork-label">ITEM TRACKER <span>● LIVE</span></div>
              <strong>Found near<br />the library</strong>
              <div className="artwork-progress"><i /><i /><i /></div>
              <div className="artwork-row"><span>Report received</span><b>In review</b></div>
            </>
          ) : index % 5 === 1 ? (
            <>
              <div className="artwork-label">PRE-ADVISING / 2025</div>
              <strong>Plan your<br />next semester.</strong>
              <div className="artwork-subjects"><i>IT 304 <b>3 units</b></i><i>WEB 201 <b>3 units</b></i><i>HCI 102 <b>2 units</b></i></div>
            </>
          ) : index % 5 === 2 ? (
            <>
              <div className="artwork-label">OPTICAL STUDIO</div>
              <strong>Find your<br />point of view.</strong>
              <div className="artwork-frame"><span /><span /></div>
            </>
          ) : index % 5 === 3 ? (
            <>
              <div className="artwork-label">FIELD NOTES / 04</div>
              <strong>Learning,<br />in another layer.</strong>
              <div className="artwork-ar"><span>AR</span><i /><i /><i /></div>
            </>
          ) : (
            <>
              <div className="artwork-label">DAMATH / 3D STUDY</div>
              <strong>Play with<br />purpose.</strong>
              <div className="artwork-board"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </>
          )}
        </div>
      </div>
      <span className="artwork-index">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}