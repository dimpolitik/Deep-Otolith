import React, { useState, useEffect } from 'react';
import { Component, Fragment } from "react";
import Dropzone from "react-dropzone";
import request from "superagent";

import { getFishType } from './services/fishType';
import { getPrediction } from './services/prediction';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries
} from 'react-vis';

// preview component
const Preview = ({ meta, fileWithMeta }) => {
  const { name, percent, status, previewUrl } = meta;
  const { xhr } = fileWithMeta;

  return (
    <div className="preview-box">
        <img src={previewUrl} />
        <span className="name">{name}</span> -
        <span className="status">{status}</span>
        {status !== "done" && <span className="percent">&nbsp;({Math.round(percent)}%)</span>}
        {status === "done" && <XYPlot xType="ordinal" width={200} height={200} yDomain={[0, 100]} xDistance={10}>
        <XAxis title="Age" />
        <YAxis title="Probability" />
        <VerticalGridLines />
        <HorizontalGridLines />
        <VerticalBarSeries data={JSON.parse(xhr.response)} />

        </XYPlot>}
    </div>
  )
}

const previewStyle = {
      display: 'inline',
      width: 100,
      height: 100,
    };

function App() {
    const [files, setFiles] = useState([]);

    const [fishType, setFishType] = useState("");

    const [fishTypes, setFishTypes] = useState([]);
    useEffect(() => {
        getFishType()
        .then(data => {
            setFishTypes(data.items);
        })
        .then(() => {
            // /setFishType(fishTypes[0].model);
        });
    }, []);

    const onDrop = (files) => {
        files.forEach(file => {
            getPrediction(file, fishType)
            .then(data => {
              console.log(data);
          });
        });
    }

    return (
    <div className="App">
      <h3>1. Select Fish Type</h3>
      <div>
          {fishTypes.map(f => (
        <>
          <input
            type="radio"
            name="fishType"
            key={f.model}
            value={f.model}
            checked={fishType === f.model}
            onChange={e => setFishType(e.currentTarget.value)}
          />{" "}
          {f.description}
        </>
      ))}
      </div>
      <h3>2. Drop or Choose Otolith Images</h3>
      <div>

          <Dropzone
              onDrop={onDrop}
              accept="image/*"
              minSize={0}
              maxSize={5242880}
         >
          {({getRootProps, getInputProps}) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
      </div>
    </div>
    );
}

export default App;
