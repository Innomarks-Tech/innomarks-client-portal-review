"use client";
import { useActionState, useEffect, useRef } from "react";
import { addNote, updateStatus, type StaffActionState } from "@/app/admin/leads/[id]/actions";

const initial: StaffActionState = { error: "", success: "" };
export function InquiryControls({ inquiryId, currentStatus }: { inquiryId: string; currentStatus: string }) {
  const [statusState, statusAction, statusPending] = useActionState(updateStatus, initial);
  const [noteState, noteAction, notePending] = useActionState(addNote, initial);
  const noteForm = useRef<HTMLFormElement>(null);
  useEffect(() => { if (noteState.success) noteForm.current?.reset(); }, [noteState.success]);
  return <div className="inquiry-controls">
    <section aria-labelledby="status-control-title"><span className="eyebrow purple">Status</span><h2 id="status-control-title">Current status</h2><form action={statusAction}><input type="hidden" name="id" value={inquiryId} /><label htmlFor="inquiry-status">Status</label><select id="inquiry-status" name="status" defaultValue={currentStatus}>{["New", "Contacted", "Proposal Sent"].map((status) => <option key={status}>{status}</option>)}</select><button className="button button-primary" type="submit" disabled={statusPending}>{statusPending ? "Saving…" : "Save status"}</button>{statusState.error && <p className="control-error" role="alert">{statusState.error}</p>}{statusState.success && <p className="control-success" role="status">✓ {statusState.success}</p>}</form></section>
    <section aria-labelledby="note-control-title"><span className="eyebrow purple">Internal notes</span><h2 id="note-control-title">Add context for the team</h2><form action={noteAction} ref={noteForm}><input type="hidden" name="id" value={inquiryId} /><label htmlFor="inquiry-note">Private note</label><textarea id="inquiry-note" name="note" maxLength={2000} required placeholder="Add context for the team…" /><button className="button button-primary" type="submit" disabled={notePending}>{notePending ? "Adding…" : "Add note"}</button>{noteState.error && <p className="control-error" role="alert">{noteState.error}</p>}{noteState.success && <p className="control-success" role="status">✓ {noteState.success}</p>}</form><small>Notes are private, timestamped and cannot be edited or deleted.</small></section>
  </div>;
}
