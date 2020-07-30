import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import OldGenGraph from "./OldGenGraph";
import DateTimePicker from "react-datetime-picker";
import { sub, format } from "date-fns";
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
  const [dataState, setDataState] = useState("loading");
  const [data, setData] = useState([]);

  useEffect(() => {
    Axios.get("api/gclogs", {
      params: {
        startdatetime: format(startDateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        enddatetime: format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      },
    })
      .then((r) => {
        console.log("fetch succeeded. data= ", r.data);
        setData(r.data);
        setDataState("ready");
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
  }, [startDateTime, endDateTime]);

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
      <button
        onClick={() => {
          setEndDateTime(new Date());
          setStartDateTime(sub(new Date(), { weeks: 1 }));
        }}
      >
        Reset
      </button>

      <button onClick={() => setOneDay()}>1 Day</button>
      <button onClick={() => setOneWeek()}>1 Week</button>
      <button onClick={() => setOneMonth()}>1 Month</button>
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
    let now = new Date();
    setEndDateTime(now);
    setStartDateTime(sub(now, { days: 1 }));
  }

  function setOneWeek() {
    let now = new Date();
    setEndDateTime(now);
    setStartDateTime(sub(now, { weeks: 1 }));
  }

  function setOneMonth() {
    let now = new Date();
    setEndDateTime(now);
    setStartDateTime(sub(now, { months: 1 }));
  }
}

export default App;
