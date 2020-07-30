import React from "react";
import OldGenGraph from "../OldGenGraph";
import gclog from "../gclog.json";
import * as d3 from "d3";

export default {
  title: "OldGenGraph",
  component: OldGenGraph,
};

export const WithoutDateTimes = () => {
  // let data = gclog.filter((d) => {
  //   return d.logtype === "completed minor gc";
  // });

  const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%f");

  let data = gclog.map((d) => {
    return {
      ...d,
      datetime: parseTime(d.datetime),
    };
  });

  data.sort((a, b) => {
    return a.datetime - b.datetime
  })

  return <OldGenGraph data={data} />;
};

export const WithDateTimes = () => {
  // let data = gclog.filter((d) => {
  //   return d.logtype === "completed minor gc";
  // });
  const parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%f");


  let data = gclog.map((d) => {
    return {
      ...d,
      datetime: parseTime(d.datetime),
    };
  });

  data.sort((a, b) => {
    return a.datetime - b.datetime
  })


  return (
    <OldGenGraph
      data={data}
      propstartdatetime={new Date(2020, 5, 25)}
      propenddatetime={new Date(2020, 5, 25, 20)}
    />
  );
};

// ToStorybook.story = {
//   name: 'to Storybook',
// };
