import React from 'react';

export type ErrorProps = {
    dump?: string;
    message: string;
}

function Error({ message, dump }: ErrorProps) {
  return (
    <div>
        <h2>{message}</h2>
        <p>{dump}</p>
    </div>
  );
}

export default Error;
