import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1";

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');

  // Fetch events from backend on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/events/all`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const generateCalendarView = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const day = selectedDate.getDate();

    const filteredEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate >= new Date(year, month, day) && eventDate < new Date(year, month, day + 7);
    });

    switch(viewMode) {
      case 'month':
        return generateMonthView(year, month, filteredEvents);
      case 'week':
        return generateWeekView(year, month, day, filteredEvents);
      default:
        return generateMonthView(year, month, filteredEvents);
    }
  };

  const generateMonthView = (year, month, filteredEvents) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayEvents = filteredEvents.filter(event =>
          new Date(event.start).toDateString() === currentDate.toDateString()
      );
      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const generateWeekView = (year, month, day, filteredEvents) => {
    const weekStart = new Date(year, month, day - new Date(year, month, day).getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + i);

      const dayEvents = filteredEvents.filter(event =>
          new Date(event.start).toDateString() === currentDate.toDateString()
      );

      days.push({ date: currentDate, events: dayEvents });
    }

    return days;
  };

  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + direction * 7);
    }
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return today.toDateString() === date.toDateString();
  };

  const renderView = () => {
    const calendarData = generateCalendarView();

    switch(viewMode) {
      case 'month':
        return (
            <div className="grid grid-cols-7 gap-2 text-center flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-bold text-white-600">{day}</div>
              ))}
              {calendarData.map((day, index) => (
                  <div
                      key={index}
                      className={`border p-2 min-h-[100px] ${day ? 'bg-white' : 'bg-gray-100'} ${day && isToday(day.date) ? 'bg-yellow-300' : ''}`}
                  >
                    {day && (
                        <>
                          <div className="text-sm text-gray-500">{day.date.getDate()}</div>
                          {day.events.map(event => (
                              <div
                                  key={event.id}
                                  className="bg-blue-100 text-blue-800 rounded p-1 mt-1 text-xs"
                              >
                                <span>{event.title}</span>
                              </div>
                          ))}
                        </>
                    )}
                  </div>
              ))}
            </div>
        );
      case 'week':
        return (
            <div className="grid grid-cols-7 gap-2 text-center h-full">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-bold text-gray-600">{day}</div>
              ))}
              {calendarData.map((day, index) => (
                  <div
                      key={index}
                      className={`border p-2 flex flex-col justify-between ${day ? 'bg-white h-full' : 'bg-gray-100'} ${day && isToday(day.date) ? 'bg-yellow-300' : ''}`}
                  >
                    {day && (
                        <>
                          <div className="text-sm text-gray-500">{day.date.getDate()}</div>
                          {day.events.map(event => (
                              <div
                                  key={event.id}
                                  className="bg-blue-100 text-blue-800 rounded p-1 mt-1 text-xs"
                              >
                                <span>{event.title}</span>
                              </div>
                          ))}
                        </>
                    )}
                  </div>
              ))}
            </div>
        );
      default:
        return null;
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
        <div className="max-w-5xl mx-auto from-gray-100 to-gray-200 rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Class Schedule
            </h1>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded flex items-center ${viewMode === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
              >
                Month
              </button>
              <button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded flex items-center ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
              >
                Week
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                  onClick={goToToday}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Today
              </button>
              <button
                  onClick={() => changeDate(-1)}
                  className="px-4 py-2 bg-gray-500 rounded hover:bg-blue-600"
              >
                Previous
              </button>
              <h2 className="text-2xl font-bold text-black">
                {viewMode === 'month' ? selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : selectedDate.toDateString()}
              </h2>
              <button
                  onClick={() => changeDate(1)}
                  className="px-4 py-2 bg-gray-500 rounded hover:bg-blue-500"
              >
                Next
              </button>
            </div>
          </div>

          {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
          ) : (
              renderView()
          )}
        </div>
      </div>
  );
}
