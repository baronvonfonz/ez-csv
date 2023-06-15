import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import "tabulator-tables/dist/css/tabulator.min.css";
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import './App.css';
import Error, { ErrorProps } from './component/Error';
import Loading, { LoadingProps } from './component/Loading';

const RESULTS_TABLE_ID = 'results-table';

function App() {
  const [parseResults, setParseResults] = useState<{ finished: boolean, data?: any[]}>({ finished: false });
  const [showError, setShowError] = useState<ErrorProps>();
  const [showLoading, setShowLoading] = useState<LoadingProps>();
  const urlParams = new URLSearchParams(window.location.search);
  const encodedUrl = urlParams.get('encodedUrl');

  useEffect(() => {
    if (!encodedUrl) {
      setShowError({ message: `No query param for 'encodedUrl'`});
      return;
    }
    const decodedUrl = decodeURIComponent(encodedUrl);
    const parsedUrl = new URL(decodedUrl);
    
    if (!parsedUrl || !['http:', 'https:'].includes(parsedUrl.protocol)) {
      setShowError({ message: `Decoded url is malformed or not http[s]: ${parsedUrl}`});
      return;
    }
    setShowLoading({ message: `loading CSV and parsing from URL: ${decodedUrl}`});
    Papa.parse(decodedUrl, {
      download: true,
      header: true,
      complete: function (results) {
        setParseResults({ finished: true, data: results.data });
      },          
    })
  }, [encodedUrl]);

  useEffect(() => {
    if (!parseResults.data?.length) {
      return;
    }
    setShowLoading(undefined);
    // TODO: config and stuff
    new Tabulator(`#${RESULTS_TABLE_ID}`, {
      height: window.innerHeight - 5,
      data: parseResults.data,
      autoColumns: true,
   });
   
  }, [parseResults]);

  if (!parseResults.finished) {
    return null;
  }

  if (parseResults.finished && !parseResults.data?.length) {
    setShowError({ message: `No items were found in the parsed array`});
    return null;
  }
    


  return (
    <div className="App">
        {showLoading && <Loading {...showLoading} />}
        {showError && <Error {...showError} />}
        <div id={RESULTS_TABLE_ID}></div>
    </div>
  );
}

export default App;
