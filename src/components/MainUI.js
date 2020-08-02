import React, { useContext, useRef, useState, useEffect } from "react";
import { store } from "../store/store";
import DateTimePicker from "react-datetime-picker";
import { parse, sub } from "date-fns";
import OldGenGraph from "./OldGenGraph";
import Axios from "axios";
import LogoutBtn from "./LogoutBtn";

export default function MainUI() {
  const LOGTYPES = {
    all: "all",
    newgenlog: "newgenlog",
    oldgenlog: "oldgenlog",
  };

  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const globalDispatch = storeContext.dispatch;

  const [clickedLog, setClickedLog] = useState(LOGTYPES.oldgenlog);
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [startDateTime, setStartDateTime] = useState(
    sub(endDateTime, { weeks: 1 })
  );
  const [lastEntryDateTime, setLastEntryDateTime] = useState();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState({});
  const [uploadDataState, setUploadDataState] = useState();

  const logDivRef = useRef();

  useEffect(() => {
    Axios.get("http://localhost:8000/api/gclogs", {
      params: {},
      withCredentials: true,
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
          setLoading(false);
        } else {
          setData(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (e.response.status === 401) {
          globalDispatch({ type: "logout" });
        }
        console.log("Error when fetching error=", e);
        console.log("e.request", e.request);
        console.log("e.response", e.response);
        setLoading(false);
      });
    // setTimeout(() => {
    //   setData(gclog);
    //   setDataState("ready");
    //   }, 1000);
  }, [globalDispatch]);

  if(loading) {
      return <p>Loading Graph</p>
  }

  return (
    <div>
      <h1>
        Welcome to Log Monitor App
        {globalState.loginStatus === "loggedIn" ? <LogoutBtn /> : null}
      </h1>
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
            Axios.post("api/upload", formData, {
              timeout: 0,
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
}
