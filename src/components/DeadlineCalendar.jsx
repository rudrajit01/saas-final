"use client";

import { useMemo, useState } from "react";

export default function DeadlineCalendar({ tasks = [] }) {
  const today = new Date();
  const [currentDate] = useState(today);

  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let day = 1; day <= daysInMonth; day++) days.push(day);
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  const taskDateSet = useMemo(() => {
    const set = new Set();
    tasks.forEach((task) => {
      if (!task?.dueDate) return;
      const due = new Date(task.dueDate);
      if (
        due.getMonth() === currentMonth &&
        due.getFullYear() === currentYear
      ) {
        const key = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(due.getDate()).padStart(2, "0")}`;
        set.add(key);
      }
    });
    return set;
  }, [tasks, currentMonth, currentYear]);

  const getDateKey = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-300">Schedule</p>
          <h2 className="text-2xl font-bold text-white">
            {monthName} {currentYear}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-xs text-slate-400">Deadlines</span>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const isToday = day === today.getDate();
          const hasTask = day ? taskDateSet.has(getDateKey(day)) : false;

          return (
            <div
              key={index}
              className={`relative flex h-12 w-full flex-col items-center justify-center rounded-2xl border transition ${
                !day
                  ? "bg-transparent"
                  : isToday
                  ? "border-cyan-500 bg-cyan-500/10 text-white"
                  : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="text-sm font-medium">{day}</span>
              {hasTask && (
                <span className="absolute bottom-2 h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}