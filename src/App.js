import Calendar from "react-calendar";
import "./App.css";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";

function App() {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const handleEvents = async (e, name) => {
    if (e) {
      let searchDate = "";
      if (name == "day") {
        searchDate = moment(e).format("YYYY/MM/DD");
      } else {
        searchDate = moment(e).format("YYYY/MM");
      }
      const { data } = await axios.get(
        `http://calapi.inadiutorium.cz/api/v0/en/calendars/default/${searchDate}`
      );

      if (Array.isArray(data)) {
        let newEvents = [];
        data?.forEach((item) => {
          newEvents.push(...item.celebrations);
        });
        setEvents([...newEvents]);
      } else {
        setEvents([...data.celebrations]);
      }
    }
  };

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10 grid grid-cols-2 gap-2">
      <div className="container mx-60 my-24">
        <Calendar
          onChange={(e) => handleEvents(e, "day")}
          value={value}
          onClickMonth={(e) => handleEvents(e, "month")}
          onclik
        />
      </div>
      <div className="container bg-white lg:w-96 md:w-72 w-60 my-24">
        <div className="mx-5 overflow-y-auto">
          <h1 className="text-xl font-bold my-8 ">Events</h1>
          {events.map((item, index) => (
            <p key={index} className="border-b-2 my-1">
              {item.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
