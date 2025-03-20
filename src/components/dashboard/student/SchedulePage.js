import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000/api/v1";

export default function SchedulePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

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
      alert("Failed to load events. Please try again.");
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

  const openEventDetails = (event) => {
    setSelectedEvent(event);
    setMeetLink(event.meetLink || "");
    setIsEventDetailsModalOpen(true);
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const generateMeetLink = async (event) => {
    try {
      setIsGeneratingLink(true);
      const response = await axios.post(`${API_URL}/meet/generate-meet-link`, {
        title: event.title
      });

      // Update the event with the meet link
      const updatedEvent = { ...event, meetLink: response.data.meetLink };
      await axios.put(`${API_URL}/events/${event.id}`, updatedEvent);

      // Update local state
      setMeetLink(response.data.meetLink);

      // Refresh events list
      await fetchEvents();
    } catch (error) {
      console.error("Error generating Meet link:", error);
      alert("Failed to generate Meet link. Please try again.");
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const renderView = () => {
    const calendarData = generateCalendarView();

    switch(viewMode) {
      case 'month':
        return (
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-bold text-cyan-400">{day}</div>
              ))}
              {calendarData.map((day, index) => (
                  <div
                      key={index}
                      className={`border border-gray-700 p-2 min-h-[100px] ${day ? 'bg-gray-800/50' : 'bg-gray-900/50'} ${day && isToday(day.date) ? 'border-cyan-500 border-2' : ''}`}
                  >
                    {day && (
                        <>
                          <div className="text-sm text-gray-300">{day.date.getDate()}</div>
                          {day.events.map(event => (
                              <div
                                  key={event.id}
                                  className="bg-cyan-900/50 text-cyan-200 rounded p-1 mt-1 text-xs cursor-pointer hover:bg-cyan-800/50 border border-cyan-500/20"
                                  onClick={() => openEventDetails(event)}
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
                  <div key={day} className="font-bold text-cyan-400">{day}</div>
              ))}
              {calendarData.map((day, index) => (
                  <div
                      key={index}
                      className={`border border-gray-700 p-2 flex flex-col justify-between ${day ? 'bg-gray-800/50 h-full' : 'bg-gray-900/50'} ${day && isToday(day.date) ? 'border-cyan-500 border-2' : ''}`}
                  >
                    {day && (
                        <>
                          <div className="text-sm text-gray-300">{day.date.getDate()}</div>
                          {day.events.map(event => (
                              <div
                                  key={event.id}
                                  className="bg-cyan-900/50 text-cyan-200 rounded p-1 mt-1 text-xs cursor-pointer hover:bg-cyan-800/50 border border-cyan-500/20"
                                  onClick={() => openEventDetails(event)}
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
      <div className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 min-h-screen">
        <main className="p-4">
          <div className="mx-auto max-w-4xl">
            {/* Page Title */}
            <div className="mb-6 p-4">
              <h1 className="text-2xl font-bold text-white">Class Schedule</h1>
              <p className="text-gray-300 text-sm">
                View and manage your scheduled classes. Click on any event to see details or generate a meeting link.
              </p>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white/5 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm overflow-hidden mb-6">
              <div className="p-4 flex flex-wrap justify-between items-center">
                <div className="flex space-x-2 mb-2 sm:mb-0">
                  <button
                      onClick={() => setViewMode('month')}
                      className={`px-4 py-2 rounded ${viewMode === 'month' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Month
                  </button>
                  <button
                      onClick={() => setViewMode('week')}
                      className={`px-4 py-2 rounded ${viewMode === 'week' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                  >
                    Week
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                      onClick={goToToday}
                      className="px-3 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors duration-200 text-sm"
                  >
                    Today
                  </button>
                  <button
                      onClick={() => changeDate(-1)}
                      className="px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 text-sm"
                  >
                    Previous
                  </button>
                  <h2 className="text-cyan-300 font-medium px-2">
                    {viewMode === 'month' ? selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' }) : selectedDate.toDateString()}
                  </h2>
                  <button
                      onClick={() => changeDate(1)}
                      className="px-3 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors duration-200 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar View */}
            <div className="bg-white/5 rounded-lg border border-cyan-500/20 shadow-lg shadow-cyan-500/10 backdrop-blur-sm overflow-hidden">
              <div className="p-4">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                ) : (
                    renderView()
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Event Details Modal */}
        {isEventDetailsModalOpen && selectedEvent && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 border border-cyan-500/20">
                <h2 className="text-xl font-bold mb-2 text-cyan-300">{selectedEvent.title}</h2>

                <div className="space-y-4 text-gray-200">
                  <div>
                    <p className="text-sm text-gray-400">Time</p>
                    <p>{formatDateTime(selectedEvent.start)} - {formatDateTime(selectedEvent.end)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Description</p>
                    <p className="text-white">{selectedEvent.description}</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-gray-400 mb-2">Meeting Link</p>
                    {selectedEvent.meetLink ? (
                        <div className="flex items-center space-x-2">
                          <a
                              href={selectedEvent.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 underline"
                          >
                            {selectedEvent.meetLink}
                          </a>
                        </div>
                    ) : (
                        <div>
                          <button
                              onClick={() => generateMeetLink(selectedEvent)}
                              disabled={isGeneratingLink}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition-colors duration-200 text-sm disabled:bg-green-800 disabled:cursor-not-allowed"
                          >
                            {isGeneratingLink ? "Generating..." : "Generate Meeting Link"}
                          </button>
                        </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                      onClick={() => setIsEventDetailsModalOpen(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
