"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(require("moment"));

type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

const events: Event[] = [
  {
    id: "1",
    title: "하객 입장 및 포토",
    start: new Date(2025, 10, 15, 12, 0), // 2025년 11월 15일 12:00
    end: new Date(2025, 10, 15, 12, 30),
  },
  {
    id: "2", 
    title: "예식",
    start: new Date(2025, 10, 15, 13, 0), // 2025년 11월 15일 13:00
    end: new Date(2025, 10, 15, 13, 30),
  },
  {
    id: "3",
    title: "피로연", 
    start: new Date(2025, 10, 15, 14, 0), // 2025년 11월 15일 14:00
    end: new Date(2025, 10, 15, 14, 30),
  },
];

export default function WeddingCalendar() {
  return (
    <div className="h-[300px] sm:h-[350px] md:h-[400px] rounded-xl overflow-hidden shadow-sm">
      <style jsx global>{`
        .rbc-calendar {
          font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .rbc-toolbar, .rbc-toolbar button { color: #2b2222; }
        .rbc-header {
          background: linear-gradient(135deg, #ffe3ec, #ffd9e1);
          color: #6a4a52;
          font-weight: 600;
          padding: 12px 8px;
          border: none;
          font-size: 14px;
        }
        .rbc-month-view {
          border: none;
        }
        .rbc-date-cell {
          padding: 8px;
          font-size: 14px;
          color: #5a3b43;
        }
        .rbc-off-range-bg {
          background: #fafafa;
        }
        .rbc-today {
          background: rgba(255, 143, 179, 0.1);
        }
        .rbc-current-time-indicator {
          background: #f3b7c5;
        }
        .rbc-event {
          background: linear-gradient(135deg, #ff8fb3, #ffc1d4);
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 500;
          font-size: 12px;
          padding: 2px 6px;
          box-shadow: 0 2px 4px rgba(255, 143, 179, 0.3);
        }
        .rbc-event:hover {
          background: linear-gradient(135deg, #ffc1d4, #ff8fb3);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(255, 143, 179, 0.4);
        }
        .rbc-day-bg {
          border: 1px solid #f7e9ee;
        }
        .rbc-day-bg:hover {
          background: rgba(255, 143, 179, 0.06);
        }
      `}</style>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={["month"]}
        defaultView="month"
        defaultDate={new Date(2025, 10, 15)} // 2025년 11월로 고정
        toolbar={false} // 네비게이션 버튼 숨김
        culture="ko"
        messages={{
          next: "다음",
          previous: "이전", 
          today: "오늘",
          month: "월",
          week: "주",
          day: "일",
          agenda: "일정",
          date: "날짜",
          time: "시간",
          event: "이벤트",
          noEventsInRange: "이 기간에 일정이 없습니다.",
          showMore: (total) => `+${total} 더보기`,
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "transparent",
            border: "none",
            borderRadius: "8px",
            color: "white",
            fontSize: "12px",
            fontWeight: "500",
          },
        })}
      />
    </div>
  );
}
