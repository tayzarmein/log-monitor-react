import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import OldGenGraph from "./OldGenGraph";
import DateTimePicker from "react-datetime-picker";
import { parse, sub } from "date-fns";
import Axios from "axios";

const LOGTYPES = {
  all: "all",
  newgenlog: "newgenlog",
  oldgenlog: "oldgenlog",
};

function App() {
  const [clickedLog, setClickedLog] = useState(LOGTYPES.oldgenlog);
  const logDivRef = useRef();
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [startDateTime, setStartDateTime] = useState(
    sub(endDateTime, { weeks: 1 })
  );
  const [lastEntryDateTime, setLastEntryDateTime] = useState();
  const [dataState, setDataState] = useState("loading");
  const [data, setData] = useState([]);

  useEffect(() => {
    Axios.get("api/gclogs", {
      params: {
        
      },
    })
      .then((r) => {
        const data = r.data.data;
        console.log("fetch succeeded. data= ", data);
        
        if(data.length) {
          let startDateTime = parse(data[0].datetime, "y-MM-dd HH:mm:ss.SSS", new Date());
          let endDateTime = parse(data[data.length - 1].datetime, "y-MM-dd HH:mm:ss.SSS", new Date())

          console.log("startDateTime=", startDateTime);
          console.log("enddatetime=", endDateTime);
          setStartDateTime(startDateTime);
          setEndDateTime(endDateTime);
          setLastEntryDateTime(endDateTime);

          setData(data);
          setDataState("ready");
          }


      })
      .catch((e) => {
        console.log("Error when fetching error=", e);
        setTimeout(() => {
          setDataState("error");
        }, 5000);
      });
    // setTimeout(() => {
    //   setData(gclog);
    //   setDataState("ready");
    //   }, 1000);
  }, []);

  if (dataState === "loading") {
    return <h2>Loading</h2>;
  }

  if (dataState === "error") {
    return <h2>Error connecting with the backend.</h2>;
  }

  return (
    <div>
      <h1>Status of Java Memory</h1>
      <p>Enter Range:</p>
      <DateTimePicker
        value={startDateTime}
        onChange={(v) => setStartDateTime(v)}
      />
      <DateTimePicker value={endDateTime} onChange={(v) => setEndDateTime(v)} />
      {/* <button
        onClick={() => {
          setEndDateTime(lastEntryDateTime);
          setStartDateTime(sub(lastEntryDateTime, { months: 1 }));
        }}
      >
        Reset
      </button> */}

      <button onClick={() => setOneDay()}>Latest 1 Day</button>
      <button onClick={() => setOneWeek()}>Latest 1 Week</button>
      <button onClick={() => setOneMonth()}>Latest 1 Month</button>
      <button>Live</button>

      <p>
        <button
          onClick={() => setClickedLog(LOGTYPES.all)}
          className="graph-btn"
        >
          All
        </button>
        <button
          onClick={() => setClickedLog(LOGTYPES.oldgenlog)}
          className="graph-btn"
        >
          Old Gen
        </button>
        <button
          onClick={() => setClickedLog(LOGTYPES.newgenlog)}
          className="graph-btn"
        >
          New Gen
        </button>
      </p>
      {renderGraph()}
      <div ref={logDivRef} />
    </div>
  );

  function renderGraph() {
    switch (clickedLog) {
      case LOGTYPES.newgenlog:
        return <p>This is new Gen graph</p>;

      case LOGTYPES.oldgenlog:
        return <OldGenGraph data={data} {...{ startDateTime, endDateTime }} />;

      case LOGTYPES.all:
        return <p>This is all graph</p>;

      default:
        break;
    }
  }

  function setOneDay() {
    setEndDateTime(lastEntryDateTime);
    setStartDateTime(sub(lastEntryDateTime, { days: 1 }));
  }

  function setOneWeek() {
    setEndDateTime(lastEntryDateTime);
    setStartDateTime(sub(lastEntryDateTime, { weeks: 1 }));
  }

  function setOneMonth() {
    setEndDateTime(lastEntryDateTime);
    setStartDateTime(sub(lastEntryDateTime, { months: 1 }));
  }
}

export default App;
