"use client";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import type { PreviewActivity, PreviewInquiry, PreviewStatus } from "@/lib/staff-preview";

const subscribe = () => () => {};
const statuses: PreviewStatus[] = ["New", "Contacted", "Proposal Sent"];
export function PreviewInquiryControls({ inquiry }: { inquiry: PreviewInquiry }) {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [status, setStatus] = useState(inquiry.status);
  const [savedStatus, setSavedStatus] = useState(inquiry.status);
  const [note, setNote] = useState("");
  const [activities, setActivities] = useState(inquiry.activities);
  const [statusMessage, setStatusMessage] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  function saveStatus(event: FormEvent) {
    event.preventDefault();
    if (status !== savedStatus) {
      const activity: PreviewActivity = { id: crypto.randomUUID(), type: "status_changed", at: new Date().toISOString(), actor: "Preview Staff", previousStatus: savedStatus, newStatus: status };
      setActivities((current) => [activity, ...current]); setSavedStatus(status);
    }
    setStatusMessage(`Preview status set to ${status}.`);
  }
  function addNote(event: FormEvent) {
    event.preventDefault();
    const value = note.trim();
    if (!value) return;
    setActivities((current) => [{ id: crypto.randomUUID(), type: "note_added", at: new Date().toISOString(), actor: "Preview Staff", note: value }, ...current]);
    setNote(""); setNoteMessage("Preview note added.");
  }
  return <><div className="inquiry-controls"><section aria-labelledby="preview-status-title"><span className="eyebrow purple">Status</span><h2 id="preview-status-title">Current status</h2><form onSubmit={saveStatus}><label htmlFor="preview-status">Status</label><select disabled={!ready} id="preview-status" value={status} onChange={(event) => setStatus(event.target.value as PreviewStatus)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select><button className="button button-primary" type="submit" disabled={!ready}>Save status</button>{statusMessage && <p className="control-success" role="status">✓ {statusMessage}</p>}</form></section><section aria-labelledby="preview-note-title"><span className="eyebrow purple">Internal notes</span><h2 id="preview-note-title">Add context for the team</h2><form onSubmit={addNote}><label htmlFor="preview-note">Private note</label><textarea disabled={!ready} id="preview-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={2000} required placeholder="Add context for the team…" /><button className="button button-primary" type="submit" disabled={!ready}>Add note</button>{noteMessage && <p className="control-success" role="status">✓ {noteMessage}</p>}</form><small>Preview only. Notes reset when you refresh this page.</small></section></div><section className="activity-panel preview-activity" aria-labelledby="preview-activity-title"><span className="eyebrow purple">Activity</span><h2 id="preview-activity-title">What the team has done</h2><ol>{activities.map((activity) => <li key={activity.id}><time dateTime={activity.at}>{new Intl.DateTimeFormat("en-ZA", { timeZone: "Africa/Johannesburg", dateStyle: "medium", timeStyle: "short" }).format(new Date(activity.at))}</time><div><strong>{activity.type === "inquiry_received" ? "Inquiry received" : activity.type === "status_changed" ? "Status changed" : "Internal note added"}</strong>{activity.actor && <span>{activity.actor}</span>}{activity.type === "status_changed" && <p>{activity.previousStatus} → {activity.newStatus}</p>}{activity.note && <p>{activity.note}</p>}</div></li>)}</ol></section></>;
}
