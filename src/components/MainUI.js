import React, { useContext, useRef, useState, useEffect } from "react";
import { store } from "../store/store";
import DateTimePicker from "react-datetime-picker";
import { parse, sub } from "date-fns";
import OldGenGraph from "./OldGenGraph";
import Axios from "axios";
import AppHeader from "./AppHeader";

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
        console.log("Axio get error. e=", e);
        if (e.request.status === 401) {
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

  if (loading) {
    return <p>Loading Graph</p>;
  }

  return (
    <div>
      <AppHeader />
      <div className="form-group">
        <h5>Enter Range:</h5>
        <div style={{ margin: "0 0 10px 0" }}>
          <label style={{ margin: "0 10px 0 0" }}>From :</label>
          <DateTimePicker
            value={startDateTime}
            onChange={(v) => setStartDateTime(v)}
          />
          <label style={{ margin: "0 10px 0 10px" }}>To :</label>
          <DateTimePicker
            value={endDateTime}
            onChange={(v) => setEndDateTime(v)}
          />
        </div>
        <div className="btn-group">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setOneDay()}
          >
            Latest 1 Day
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setOneWeek()}
          >
            Latest 1 Week
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => setOneMonth()}
          >
            Latest 1 Month
          </button>
        </div>
      </div>

      <div className="btn-group">
        <button
          onClick={() => setClickedLog(LOGTYPES.all)}
          className="btn btn-outline-secondary"
        >
          All
        </button>
        <button
          onClick={() => setClickedLog(LOGTYPES.oldgenlog)}
          className="btn btn-outline-secondary"
        >
          Old Gen
        </button>
        <button
          onClick={() => setClickedLog(LOGTYPES.newgenlog)}
          className="btn btn-outline-secondary"
        >
          New Gen
        </button>
      </div>
      <div className="input-group mb-3" style={{margin: "10px 0 10px 0"}}>
        <div className="custom-file">
          {/* <label>Upload GC Log file?</label> */}
          <input
            type="file"
            className="custom-file-input"
            id="inputGroupFile02"
            onChange={(e) => {
              setSelectedFile(e.target.files[0]);
              console.log("selected file=", e.target.files);
            }}
          />
          <label
            className="custom-file-label"
            htmlFor="inputGroupFile02"
            aria-describedby="inputGroupFileAddon02"
          >
            Upload GC Log file?
          </label>
        </div>
        <div className="input-group-append">
          <span
            className="input-group-text"
            id="inputGroupFileAddon02"
            onClick={() => {
              const formData = new FormData();
              formData.append("file", selectedFile);
              Axios.post("http://localhost:8000/api/upload", formData, {
                timeout: 0,
                withCredentials: true,
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
          </span>
        </div>
      </div>
      {uploadDataState === "uploading" ? (
        <span>
          <strong>Uploading</strong>
        </span>
      ) : null}
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
