import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import debounce from 'lodash.debounce';
import 'tabulator-tables/dist/css/tabulator.min.css';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import './App.css';
import Error, { ErrorProps } from './component/Error';
import Loading, { LoadingProps } from './component/Loading';
import Filters from './component/Filters';

const RESULTS_TABLE_ID = 'results-table';

function App() {
  const [parseResults, setParseResults] = useState<{ finished: boolean, data?: any[]}>({ finished: false });
  const [showError, setShowError] = useState<ErrorProps>();
  const [showLoading, setShowLoading] = useState<LoadingProps>();
  const [tableInstance, setTableInstance] = useState<Tabulator>();
  const [filterState, setFilterState] = useState<Parameters<Tabulator['setFilter']> | undefined>();
  const [headerValues, setHeaderValues] = useState<string[]>();
  const filtersRef = useRef<HTMLDivElement | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const encodedUrl = urlParams.get('encodedUrl');
  const debouncedFilterState = debounce(setFilterState, 500);

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
        setHeaderValues(Object.keys(results.data[0] as any));
        setParseResults({ finished: true, data: results.data });
      },          
    })
  }, [encodedUrl]);

  useEffect(() => {
    if (!parseResults.data?.length || !filtersRef.current) {
      return;
    }
    setShowLoading(undefined);
    // TODO: config and stuff
    setTableInstance(new Tabulator(`#${RESULTS_TABLE_ID}`, {
      height: window.innerHeight - (filtersRef.current.clientHeight + 5),
      data: parseResults.data,
      autoColumns: true,
   }));
  }, [parseResults]);

  useEffect(() => {
    if (!tableInstance) {
      return;
    }

    if (!filterState) {
      tableInstance.clearFilter(true);
      return;
    }

    // TODO: wonky typing
    tableInstance.setFilter(filterState[0], filterState[1], filterState[2]);
  }, [filterState, tableInstance]);

  if (!parseResults.finished && !showError) {
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
        {(headerValues) && (
          <Filters headerValues={headerValues} onFilterChange={debouncedFilterState} filtersRef={filtersRef} />
        )}
        <div id={RESULTS_TABLE_ID}></div>
    </div>
  );
}

export default App;
