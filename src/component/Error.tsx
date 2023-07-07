import React from 'react';
import UrlHelper from './UrlHelper';

export type ErrorProps = {
    dump?: string;
    message: string;
}

function Error({ message, dump }: ErrorProps) {
  return (
    <div>
        <h2>{message}</h2>
        <p>{dump}</p>
        <hr />
        <h3>Make a URL to share ez-csv:</h3>
        <UrlHelper />
    </div>
  );
}

export default Error;
