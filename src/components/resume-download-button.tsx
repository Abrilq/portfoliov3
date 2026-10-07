import { Download } from "lucide-react";

export function ResumeDownloadButton() {
  return (
    <a className="resume-button" id="download" href="/JohnClarenceCV.pdf" download="JohnClarenceCV.pdf">
      Download Resume as PDF <Download size={17} />
    </a>
  );
}
