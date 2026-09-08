import { ArrowRight, Check, Circle, GitBranch } from "lucide-react";
import { services, type ServiceId } from "@/lib/services";

/** Conceptual process diagrams; these are not client results. */
export function ProjectArt({ service = "consulting", compact = false }: { service?: ServiceId; compact?: boolean }) {
  const item = services.find((entry) => entry.id === service)!;
  return <div className={`project-art art-${service}${compact ? " art-compact" : ""}`} aria-hidden="true">
    <div className="canvas-caption"><span className="canvas-dot" />{item.shortName} / connected thinking<GitBranch size={16} /></div>
    <div className="canvas-flow"><div className="canvas-node"><Circle size={18} /><span>Your challenge</span></div><ArrowRight className="canvas-arrow" size={22} /><div className="canvas-node canvas-node-active"><Check size={18} /><span>A clear next step</span></div></div>
    <div className="canvas-outcomes">{item.outcomes.map((outcome, index) => <span key={outcome}><i style={{ width: `${36 + index * 20}%` }} />{outcome}</span>)}</div>
    <div className="canvas-footer"><span>People + process + technology</span><span>✳</span></div>
  </div>;
}
