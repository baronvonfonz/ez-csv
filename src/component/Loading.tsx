import React from 'react';

export type LoadingProps = {
    message: string;
}

function Loading({ message }: LoadingProps) {
  return (
    <div>
        <h1>Please wait, performing operation: {message}</h1>
    </div>
  );
}

export default Loading;
