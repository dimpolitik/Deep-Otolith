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
            <VerticalBarSeries data={xhr.response ? JSON.parse(xhr.response) : null} />
        </XYPlot>}
        </div>
		{status !== "done" && <h3>{xhrResponseSum = ''}</h3>}
		{status === "done" && !xhrResponseSum.includes(xhr.response) && <div class="jsonContentDiv" style={{display: "none"}}>{'{'}{xhrResponseSum += ((xhrResponseSum) ? ',' : '') + JSON.stringify(name.replace(/\.[^/.]+$/, "")) + ': ' + xhr.responseText}{'}'}</div>}
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

	const downloadJsonFile = () => {
		const btnJson = document.createElement("a");
		const getLastElemIndex = document.getElementsByClassName('jsonContentDiv').length - 1;
		const jsonFile = new Blob([document.getElementsByClassName('jsonContentDiv')[getLastElemIndex].innerHTML], {type: 'application/json'});
		btnJson.href = URL.createObjectURL(jsonFile);
		btnJson.download = "export.json";
		document.body.appendChild(btnJson); // Required for this to work in FireFox
		btnJson.click();
	}
	
	const downloadCsvFile = () => {
		const btnCsv = document.createElement("a");
		const getLastElemIndex = document.getElementsByClassName('jsonContentDiv').length - 1;
		
		let jsonStr = '';
		jsonStr = document.getElementsByClassName('jsonContentDiv')[getLastElemIndex].innerHTML;
		
        const json = JSON.parse(jsonStr);
        
		let num = 0;  
		for (const fishName in json) {
		  var fishSize = json[fishName]; 	
		  for (let k = 0; k < 2; k++) {
		    num = parseInt(fishSize.length);
		  }
		}
				
		// add header
		//let csvStr = 'Image/Age-groups' + ', ' + '0' + ', ' + '1' + ', ' + '2' + ', ' + '3' + ', ' + '4' + ', ' + '5+' + '\r\n';
	
        let csvStr = 'Image/Age-group-probabilities';
		if (num == 6){
			for (let j = 0; j < num; j++) {
              csvStr +=  ' ' + 'Age-' + j;
            }
		} else {
			for (let j = 1; j <= num; j++) {
              csvStr +=  ' ' + 'Age-' + j;
            }   
		}
		csvStr += ' ' + 'Age-prediction' + '\r\n';
		
		let index = {}
        for (const fishName in json) {
		  let max_value = 0
          var fishAgeProbabilities = json[fishName];
          let str = fishName + ' ';
          for (let i = 0; i < fishAgeProbabilities.length; i++) {
            str += parseFloat(fishAgeProbabilities[i].y).toFixed(2);

			if (parseFloat(fishAgeProbabilities[i].y).toFixed(4) > max_value) {
			  max_value = parseFloat(fishAgeProbabilities[i].y).toFixed(4)
			  index = parseInt(i);
			}
            if (i < fishAgeProbabilities.length) {
              str +=  ' ';
            }
          }
		  
		  if (num != 6) {index += 1}
		  str += index
          csvStr += str + '\r\n';
        }
        const csvFile = new Blob([csvStr], {type: 'text/csv'});
		btnCsv.href = URL.createObjectURL(csvFile);
		btnCsv.download = "export.csv";
		document.body.appendChild(btnCsv); // Required for this to work in FireFox
		btnCsv.click();
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
      <h3>2. Drop or Choose Otolith Images (.jpg or .png, max = 30 per minute)</h3>
      <div classeName="file-dropzone">
        {fishType && <Dropzone
          getUploadParams={getUploadParams}
          maxFiles={30}
          timeout={60000}
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
         <button onClick={downloadCsvFile}>Export to CSV</button>&nbsp;
         <button onClick={ refreshPage }>Refresh page</button>	
      </div>
     
      
    </div>
    );
}

export default App;
