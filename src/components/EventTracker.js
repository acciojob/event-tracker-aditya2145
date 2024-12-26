import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Popup from "react-popup";

const localizer = momentLocalizer(moment);

const EventTracker = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [popupMode, setPopupMode] = useState(null); // 'create', 'edit'

  const openPopup = (date, mode) => {
    setSelectedDate(date);
    setPopupMode(mode);
    Popup.close();
    Popup.create({
      title: mode === "create" ? "Create Event" : "Edit/Delete Event",
      content: <PopupContent date={date} mode={mode} />, // Custom content
      buttons: {
        right: [
          {
            text: "Close",
            className: "button",
            action: Popup.close,
          },
        ],
      },
    });
  };

  const addEvent = (title, date) => {
    if (title) {
      setEvents([...events, { title, start: date, end: date }]);
      Popup.close();
    }
  };

  const editEvent = (title) => {
    if (title) {
      setEvents(
        events.map((event) =>
          event.start === selectedDate ? { ...event, title } : event
        )
      );
      Popup.close();
    }
  };

  const deleteEvent = () => {
    setEvents(events.filter((event) => event.start !== selectedDate));
    Popup.close();
  };

  const filterEvents = (type) => {
    const today = new Date();
    if (type === "all") {
      setFilteredEvents(events);
    } else if (type === "past") {
      setFilteredEvents(events.filter((event) => new Date(event.start) < today));
    } else if (type === "upcoming") {
      setFilteredEvents(events.filter((event) => new Date(event.start) >= today));
    }
  };

  const handleSelectSlot = (slotInfo) => {
    const date = moment(slotInfo.start).format("YYYY-MM-DD");
    const existingEvent = events.find(
      (event) => moment(event.start).format("YYYY-MM-DD") === date
    );
    openPopup(date, existingEvent ? "edit" : "create");
  };

  const PopupContent = ({ date, mode }) => {
    const [title, setTitle] = useState(
      mode === "edit"
        ? events.find(
            (event) => moment(event.start).format("YYYY-MM-DD") === date
          )?.title || ""
        : ""
    );

    return (
      <div>
        {mode === "create" && (
          <div>
            <label>
              Event Title:
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <button onClick={() => addEvent(title, date)}>Add Event</button>
          </div>
        )}
        {mode === "edit" && (
          <div>
            <label>
              Event Title:
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <button onClick={() => editEvent(title)}>Save</button>
            <button onClick={deleteEvent}>Delete</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Event Tracker Calendar</h1>
      <div>
        <button onClick={() => filterEvents("all")}>All</button>
        <button onClick={() => filterEvents("past")}>Past</button>
        <button onClick={() => filterEvents("upcoming")}>Upcoming</button>
      </div>
      <Calendar
        localizer={localizer}
        events={filteredEvents.length ? filteredEvents : events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 500, margin: "50px" }}
      />
      <Popup />
    </div>
  );
};

export default EventTracker;
