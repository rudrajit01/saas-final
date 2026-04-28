import { useMemo, useState } from "react";

function CalendarWidget({ tasks = [] }) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const monthName = today.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

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
        const key = `${due.getFullYear()}-${String(due.getMonth() + 1).padStart(2, "0")}-${String(due.getDate()).padStart(2, "0")}`;
        set.add(key);
      }
    });

    return set;
  }, [tasks, currentMonth, currentYear]);

  const getDateKey = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return (
    <div className="calendar-card">
      <div className="calendar-header">
        <h3>{monthName} {currentYear}</h3>
      </div>

      <div className="calendar-weekdays">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const hasTask = day ? taskDateSet.has(getDateKey(day)) : false;

          return (
            <div
              key={index}
              className={`calendar-day ${
                day === today.getDate() ? "today" : ""
              } ${!day ? "empty" : ""}`}
              onClick={() => day && setSelectedDate(day)}
            >
              {day}
              {hasTask && <span className="task-dot"></span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarWidget;