import React, { useState, useEffect } from 'react';
import 'react-dropzone-uploader/dist/styles.css';
import './App.css';
import Dropzone from 'react-dropzone-uploader';
import { getFishType } from './services/fishType';
import { API_URL } from './constants';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
} from 'react-vis';

let { xhrResponseSum } = '';

// preview component
const Preview = ({ meta, fileWithMeta }) => {
  const { name, percent, status, previewUrl } = meta;
  const { xhr } = fileWithMeta;

  return (
    <div className="preview-box">
        <div className="preview-image">
            {previewUrl && <img width={200} src={previewUrl} alt={name} title={name} />}
            <span className="name">{name}</span>
        </div>
        <div className="preview-progress">
            {status !== "done" && <progress max={100} value={status === 'done' || status === 'headers_received' ? 100 : percent} />}
            {status !== "done" && <span className="status">{status}</span>}
        </div>
        <div className="preview-plot">
            {status === "done" && <XYPlot xType="ordinal" width={500} height={220} yDomain={[0, 1]} xDistance={10} style={{backgroundColor: '#ffffff'}}>
            <XAxis title="Age" tickLabelAngle={-0} style={{text: {fontSize: 12}, }} />
            <YAxis title="Probability"/>
            <VerticalGridLines />
            <HorizontalGridLines style={{stroke: '#B7E9ED'}} />
            <VerticalBarSeries data={JSON.parse(xhr.response)} />
        </XYPlot>}
        </div>
		{status !== "done" && <h3>{xhrResponseSum = ''}</h3>}
		{status === "done" && !xhrResponseSum.includes(xhr.response) && <div class="myText" style={{display: "none"}}>{xhrResponseSum += JSON.stringify(name) + ': ' + xhr.responseText + ','}</div>}
    </div>
  )
}

function App() {
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

    // specify upload params and API url to file upload
    const getUploadParams = ({ file }) => {
        const body = new FormData();
        body.append('images', file);
        body.append('fishType', fishType);
        return { url: /*API_URL +*/ '/predict', body }
    }

	const downloadTxtFile = () => {
		const element = document.createElement("a");
		const getLastElemIndex = document.getElementsByClassName('myText').length - 1;
		const file = new Blob([document.getElementsByClassName('myText')[getLastElemIndex].innerHTML], {type: 'text/plain'});
		element.href = URL.createObjectURL(file);
		element.download = "myFile.txt";
		document.body.appendChild(element); // Required for this to work in FireFox
		element.click();
	  }
	  
	function refreshPage() {
        window.location.reload();
    }  
  
    const [isOpen, setIsOpen] = useState(false);
      
    return (
    <div className="App">
          
      <h3>1. Select Fish Type</h3>
      <div className="fish-type-selector">
          {fishTypes.map(f => (
        <div className="form-check form-check-inline">
          <label className="form-check-label">
          {f.description}
          <input
            type="radio"
            name="fishType"
            className="form-check-input"
            key={f.model}
            value={f.model}
            checked={fishType === f.model}
            onChange={e => setFishType(e.currentTarget.value)}
          />
          </label>
        </div>
      ))}
      </div>
      <h3>2. Drop or Choose Otolith Images (.jpg or .png, max = 50)</h3>
      <div classeName="file-dropzone">
        {fishType && <Dropzone
          getUploadParams={getUploadParams}
          maxFiles={50}
          timeout={5000}
          styles={{
            dropzone: { overflow: 'auto', height: '350px', border: '1px solid #999', background: '#f5f5f5' },
            inputLabelWithFiles: { margin: '20px 3%' }
          }}
          canRemove={false}
          PreviewComponent={Preview}
          accept="image/*,"
        />
        }
      </div>
	  <div>
         <button onClick={downloadTxtFile}>Download JSON</button>     
         <a href="https://cloudfs.hcmr.gr/index.php/s/fxeo8zXbr4zph9W/download" target="_blank" download= 'Json2Excel.r' > 
          <button>
            <i className="fas fa-download"/>
              Convert JSON to Excel (R-file)
          </button>
        </a>   
        &nsbp;
      </div>
          
      <div>
        <button onClick={ refreshPage }>Refresh page</button>
      </div>
      
    </div>
    );
}

export default App;
