import React, { useState } from 'react';
import { ENCODED_URL_QUERY_PARAM, HOSTED_URL } from '../const/common';
import { urlOrUndefined } from '../util/common';

function UrlHelper() {
  const [rawUrl, setRawUrl] = useState('');
  const [shareableUrl, setShareableUrl] = useState('');
  const [error, setError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareableUrl);
    setIsCopied(true);

    // Reset the "copied" state after a brief delay
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedUrl = urlOrUndefined(rawUrl);
    
    if (!parsedUrl || !['http:', 'https:'].includes(parsedUrl.protocol)) {
      setError(true);
    } else {
      const encoded = encodeURIComponent(rawUrl);
      setShareableUrl(`${HOSTED_URL}?${ENCODED_URL_QUERY_PARAM}=${encoded}`);
      setRawUrl('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRawUrl(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={rawUrl}
          onChange={handleChange}
        />
        <button type="submit">Generate Shareable URL</button>
      </form>
      {shareableUrl && (
          <div
            className={`well ${isCopied ? 'copied' : ''}`}
            onClick={handleCopyClick}
          >
          {shareableUrl}
        </div>
      )}
      {error && <h4>Invalid URL</h4>}
    </div>
  );
}

export default UrlHelper;
