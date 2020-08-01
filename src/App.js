import React, { useState, useRef, useEffect, useContext } from "react";
import "./App.css";
import OldGenGraph from "./components/OldGenGraph";
import DateTimePicker from "react-datetime-picker";
import { parse, sub } from "date-fns";
import Axios from "axios";
import LoginForm from "./components/LoginForm";
import { store } from "./store/store";

const LOGTYPES = {
  all: "all",
  newgenlog: "newgenlog",
  oldgenlog: "oldgenlog",
};

const axios = Axios.create({
  baseURL: 'http://localhost:8000',
});

function App() {
  const [clickedLog, setClickedLog] = useState(LOGTYPES.oldgenlog);
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [startDateTime, setStartDateTime] = useState(
    sub(endDateTime, { weeks: 1 })
  );
  const [lastEntryDateTime, setLastEntryDateTime] = useState();
  const [dataState, setDataState] = useState("loading");
  const [data, setData] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [uploadDataState, setUploadDataState] = useState();

  const logDivRef = useRef();
  const context = useContext(store);
  const globalState = context.state;
  const globalDispatch = context.dispatch;


  useEffect(() => {
    if (globalState.loginStatus !== 'loggedIn') {
      return undefined;
    }
    axios.get("api/gclogs", {
      params: {},
      headers: {
        'Authorization': 'Bearer ' + globalState.token
      }
    })
      .then((r) => {
        const data = r.data.data;
        console.log("fetch succeeded. data= ", data);

        if (data.length) {
          let startDateTime = parse(
            data[0].datetime,
            "y-MM-dd HH:mm:ss.SSS",
            new Date()
          );
          let endDateTime = parse(
            data[data.length - 1].datetime,
            "y-MM-dd HH:mm:ss.SSS",
            new Date()
          );

          console.log("startDateTime=", startDateTime);
          console.log("enddatetime=", endDateTime);
          setStartDateTime(startDateTime);
          setEndDateTime(endDateTime);
          setLastEntryDateTime(endDateTime);

          setData(data);
          setDataState("ready");
        } else {
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
  }, [globalState]);

  // if (dataState === "loading") {
  //   return <h2>Loading</h2>;
  // }

  if (dataState === "error") {
    return <h2>Error connecting with the backend.</h2>;
  }

  if (globalState.loginStatus !== 'loggedIn') {
    return <LoginForm />
  }

  return (
    <div>
      <h1>Welcome to Log Monitor App{globalState.loginStatus === 'loggedIn' ? <button onClick={() => globalDispatch({type: 'logout'})}>Logout</button> : null}</h1>
      <p>Enter Range:</p>
      <DateTimePicker
        value={startDateTime}
        onChange={(v) => setStartDateTime(v)}
      />
      <DateTimePicker value={endDateTime} onChange={(v) => setEndDateTime(v)} />

      <button onClick={() => setOneDay()}>Latest 1 Day</button>
      <button onClick={() => setOneWeek()}>Latest 1 Week</button>
      <button onClick={() => setOneMonth()}>Latest 1 Month</button>

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
      <p>
        Upload GC Log File?{" "}
        <input
          type="file"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
            console.log("selected file=", e.target.files);
          }}
        />{" "}
        <button
          onClick={() => {
            const formData = new FormData();
            formData.append("file", selectedFile);
            axios.post("api/upload", formData, {
              timeout: 0
            })
              .then((r) => {
                const data = r.data;
                console.log("Axios response=", r);
                if (data.message === "success") {
                  setUploadDataState("uploadingSuccess");
                  if (window.confirm("Success, Press OK To Reload")) {
                    window.location.reload();
                  }
                }
              })
              .catch((e) => {
                console.log("File upload error. e=", e);
                setUploadDataState("uploadingerror");
              });
            setUploadDataState("uploading");
          }}
        >
          Upload
        </button>
        {uploadDataState === "uploading" ? (
          <span>
            <strong>Uploading</strong>
          </span>
        ) : null}
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
