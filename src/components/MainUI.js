import React, { useContext, useRef, useState, useEffect } from "react";
import { store } from "../store/store";
import { parse, sub } from "date-fns";
import OldGenGraph from "./OldGenGraph";
import Axios from "axios";
import AppHeader from "./AppHeader";
import DateRangePicker from "./DateRangePicker";
import LogTypeSelect from "./LogTypeSelect";
import GclogUpload from "./GclogUpload";
import { Row, Col } from "react-bootstrap";

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

  const onClickQuickButtons = (data) => {
    //todo
    // if (data.clickedBtnName === "oneDay") {
    //   setOneDay();
    // }
    // if (data.clickedBtnName === "oneDay") {
    //   setOneWeek();
    // }
    // if (data.clickedBtnName === "oneDay") {
    //   setOneMonth();
    // }
  };

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
      <Row>
        <Col md>
          <DateRangePicker
            dateRange={{
              startDatetime: startDateTime,
              endDatetime: endDateTime,
            }}
            onChange={(dr) => {
              setStartDateTime(dr.startDatetime);
              setEndDateTime(dr.endDatetime);
            }}
            onClickQuickButtons={onClickQuickButtons}
          />
        </Col>
        <Col md>
          <LogTypeSelect />

          <GclogUpload
            selectedFile={selectedFile}
            onSelected={(f) => setSelectedFile(f)}
            onUpload={() => {
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
          />

          {uploadDataState === "uploading" ? (
            <span>
              <strong>Uploading</strong>
            </span>
          ) : null}
        </Col>
      </Row>

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
