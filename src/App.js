import Calendar from "react-calendar";
import "./App.css";
import { memo, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";

function App() {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const handleEvents = async (e, name, weekNumber) => {
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
        let newData = data;
        if (weekNumber) {
          newData = newData.filter((item) => item.season_week == weekNumber);
        }
        let newEvents = [];
        newData?.forEach((item) => {
          item.celebrations.forEach((celebration) => {
            newEvents.push({ title: celebration.title, date: item.date });
          });
        });
        setEvents([...newEvents]);
      } else {
        setEvents([{ title: data?.celebrations[0]?.title, date: data.date }]);
      }
    }
  };
  console.log(events);
  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-10 grid grid-cols-2 gap-2">
      <div className="container mx-60 my-24">
        <Calendar
          onChange={(e) => {
            handleEvents(e, "day", "");
          }}
          value={value}
          onClickMonth={(e) => handleEvents(e, "month", "")}
          onClickWeekNumber={(weekNumber, date, event) => {
            handleEvents(date, "week", weekNumber);
          }}
          showWeekNumbers
        />
      </div>
      <div className="container bg-white lg:w-96 md:w-72 w-60 my-24">
        <div className="h-96 mx-5 overflow-y-auto">
          <h1 className="text-xl font-bold my-8 ">Events</h1>
          {events.map((item, index) => (
            <p key={index} className="border-b-2 my-1">
              <span className="font-bold">
                {item.date}:
              </span>
              <br></br>
              {item.title}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(App);
