"use client";
import * as React from "react";
import { CalendarIcon, DownloadIcon } from "@/components/ui/icons";

type CalendarActionsProps = {
  title: string;
  description?: string;
  location?: string;
  start: Date; // local time
  end: Date; // local time
};

function formatDateForGoogle(date: Date) {
  // Google Calendar expects YYYYMMDDTHHmmssZ in UTC
  const utc = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return utc
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function buildGoogleCalendarUrl({ title, description, location, start, end }: CalendarActionsProps) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description ?? "",
    location: location ?? "",
    dates: `${formatDateForGoogle(start)}/${formatDateForGoogle(end)}`,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}

function buildICSContent({ title, description, location, start, end }: CalendarActionsProps) {
  const dtStart = formatDateForGoogle(start);
  const dtEnd = formatDateForGoogle(end);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    location ? `LOCATION:${location}` : undefined,
    description ? `DESCRIPTION:${description.replace(/\n/g, "\\n")}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function CalendarActions(props: CalendarActionsProps) {
  const handleGoogle = () => {
    const url = buildGoogleCalendarUrl(props);
    window.open(url, "_blank");
  };

  const handleICS = () => {
    const content = buildICSContent(props);
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <button onClick={handleGoogle} className="px-3 py-2 text-sm rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 inline-flex items-center gap-1">
        <CalendarIcon size={18} />
        <span>캘린더</span>
      </button>
      <button onClick={handleICS} className="px-3 py-2 text-sm rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 inline-flex items-center gap-1">
        <DownloadIcon size={18} />
        <span>ICS</span>
      </button>
    </div>
  );
}

export default CalendarActions;


