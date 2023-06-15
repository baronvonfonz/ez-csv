import React, { MutableRefObject, useEffect, useState } from 'react';
import { Tabulator } from 'tabulator-tables';

export type FiltersProps = {
    filtersRef: MutableRefObject<HTMLDivElement | null>;
    headerValues: string[];
    onFilterChange: (newFilter?: Parameters<Tabulator['setFilter']>) => void;
}

function Filters({ filtersRef, headerValues, onFilterChange }: FiltersProps) {
    const [filterField, setFilterField] = useState<string>();
    const [filterType, setFilterType] = useState<string>();
    const [filterValue, setFilterValue] = useState<string>();

    useEffect(() => {
        if (filterField && filterType && filterValue) {
            onFilterChange([filterField, filterType, filterValue]);
        } else {
            onFilterChange();
        }
    }, [filterField, filterType, filterValue]);

    return (
        <div style={{ display: 'flex' }} ref={filtersRef}>
            <select id="filter-field" value={filterField} onChange={e => setFilterField(e.target.value)}>
                <option value=""></option>
                {headerValues.map(headerValue => <option value={headerValue}>{headerValue}</option>)}
            </select>

            <select id="filter-type" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value=""></option>
                <option value="=">{'='}</option>
                <option value="<">{'<'}</option>
                <option value="<=">{'<='}</option>
                <option value=">">{'>'}</option>
                <option value=">=">{'>='}</option>
                <option value="!=">{'!='}</option>
                <option value="like">{'like'}</option>
            </select>

            <input id="filter-value" type="text" value={filterValue} placeholder="value to filter" onChange={e => setFilterValue(e.target.value)} />

            <button id="filter-clear" onClick={() => {
                setFilterField('');
                setFilterType('');
                setFilterValue('');
            }}>Clear Filter</button>        
        </div>
    );
}

export default Filters;
