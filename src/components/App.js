import React, { useState } from "react";
import moment from "moment";
import BigCalendar from "react-big-calendar";
import Popup from "react-popup";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-popup/style.css";

const localizer = BigCalendar.momentLocalizer(moment);

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelectSlot = ({ start }) => {
    const existingEvent = events.find((event) =>
      moment(event.start).isSame(start, "day")
    );
    setSelectedDate(start);
    if (existingEvent) {
      setSelectedEvent(existingEvent);
      Popup.create({
        title: "Edit/Delete Event",
        content: (
          <div>
            <button onClick={() => editEvent(existingEvent)}>Edit</button>
            <button onClick={() => deleteEvent(existingEvent)}>Delete</button>
          </div>
        ),
        buttons: {
          right: ["Close"],
        },
      });
    } else {
      Popup.create({
        title: "Create Event",
        content: <button onClick={createEvent}>Create Event</button>,
        buttons: {
          right: ["Close"],
        },
      });
    }
  };

  const createEvent = () => {
    const title = prompt("Enter event title");
    if (title) {
      setEvents([...events, { start: selectedDate, end: selectedDate, title }]);
      Popup.close();
    }
  };

  const editEvent = (event) => {
    const title = prompt("Edit event title", event.title);
    if (title) {
      setEvents(events.map((e) => (e === event ? { ...e, title } : e)));
      setSelectedEvent(null);
      Popup.close();
    }
  };

  const deleteEvent = (event) => {
    setEvents(events.filter((e) => e !== event));
    setSelectedEvent(null);
    Popup.close();
  };

  const showAllEvents = () => setEvents([...events]);
  const showPastEvents = () =>
    setEvents(
      events.filter((e) => moment(e.start).isBefore(new Date(), "day"))
    );
  const showUpcomingEvents = () =>
    setEvents(
      events.filter((e) => moment(e.start).isSameOrAfter(new Date(), "day"))
    );

  return (
    <div>
      <div>
        <button className="btn" onClick={showAllEvents}>
          All Events
        </button>
        <button className="btn" onClick={showPastEvents}>
          Past Events
        </button>
        <button className="btn" onClick={showUpcomingEvents}>
          Upcoming Events
        </button>
      </div>
      <BigCalendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectSlot}
        style={{ height: 500 }}
      />
      <Popup />
    </div>
  );
}

export default App;