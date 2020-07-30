import React, { useEffect } from "react";
import * as d3 from "d3";
import { parse } from "date-fns";


export default function OldGenGraph({ data, startDateTime, endDateTime }) {
  useEffect(() => {
    if (data.length === 0) {
      return undefined;
    }

    let localdata = data.data;
    console.log("localdata=", localdata);
    
    localdata = localdata.map((d) => {
      return {
        ...d,
        datetime: parse(d.datetime, "y-MM-dd HH:mm:ss.SSS", new Date()),
      };
    });

    localdata.sort((a, b) => {
      return a.datetime - b.datetime;
    });

    if (startDateTime && endDateTime) {
      localdata = localdata.filter((d) => {
        return (
          d.datetime.getTime() <= endDateTime &&
          d.datetime.getTime() >= startDateTime
        );
      });
    }
    if (!localdata) {
      return undefined;
    }

    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 70,
    };

    const width = 900 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const oldGenMaximumLine = d3
      .line()
      .defined((d) => {
        return !isNaN(d.oldGenTotal)
      })
      .x((d) => x(d.datetime))
      .y((d) => y(d.oldGenTotal));

    const oldGenBeforeLine = d3
      .line()
      .defined((d) => {
        return !isNaN(d.oldGenTotal)
      })
      .x((d) => x(d.datetime))
      .y((d) => y(d.oldGen));

    const daytimeArea = d3
      .area()
      .defined((d) => {
        return d.datetime.getHours() >= 6 && d.datetime.getHours() <= 18
      })
      .x((d) => x(d.datetime))
      .y0(y(0))
      .y1(y(d3.max(localdata, (d) => d.oldGenTotal)));

    const svg = d3
      .select("#resultDiv")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(localdata, (d) => d.datetime));
    y.domain([0, d3.max(localdata, (d) => d.oldGenTotal)]);
    // y.domain([0, 5000000]);

    svg
      .append("path")
      .datum(localdata.filter((d) => d.logtype === 'completed minor gc'))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("d", oldGenMaximumLine);

    svg
      .append("path")
      .datum(localdata.filter((d) => d.logtype === 'completed minor gc'))
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("d", oldGenBeforeLine);

    svg
      .append("g")
      // .attr("stroke", "steelblue")
      // .attr("stroke-width", 1)
      .attr("fill", "red")
      .selectAll("circle")
      .data(localdata.filter((d) => d.logtype === "CMS-initial-mark"))
      .join("circle")
      .attr("cx", (d) => x(d.datetime))
      .attr("cy", y(400000))
      .attr("r", 1);

    // svg
    //   .append("path")
    //   .data([localdata])
    //   .attr("fill", "none")
    //   .attr("stroke", "steelblue")
    //   .attr("d", newPlusOldTotalLine);

    // svg
    //   .append("path")
    //   .data([localdata])
    //   .attr("fill", "none")
    //   .attr("stroke", "red")
    //   .attr("d", newGenLine);

    svg
      .append("path")
      .datum(localdata.filter(d => d.logtype === 'completed minor gc'))
      .attr("fill", "steelblue")
      .attr("opacity", "0.1")
      .attr("d", daytimeArea);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y));

    return () => {
      d3.select("#resultDiv").select("svg").remove();
    };
  });

  if (data.length === 0) {
    return <p>There is no data</p>;
  }

  return (
    <div>
      <h3>
        This is a log of Oldgen
        {startDateTime && endDateTime
          ? ` Between ${startDateTime.toLocaleString()} and ${endDateTime.toLocaleString()}`
          : null}
      </h3>
      <div id="resultDiv" />
    </div>
  );
}
