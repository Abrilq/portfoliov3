"use client";

import { Download } from "lucide-react";

export function ResumePrintButton() {
  return (
    <button className="resume-button" id="download" type="button" onClick={() => window.print()}>
      Download as PDF <Download size={17} />
    </button>
  );
}
