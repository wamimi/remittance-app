'use client';
import { useState } from 'react';

export default function SendTokens() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendTokens = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/actions/send-tokens', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Success: ${data.message}`);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage('Error sending tokens');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Send Tokens</h1>
      <button onClick={handleSendTokens} disabled={loading}>
        {loading ? 'Sending...' : 'Send Tokens'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
