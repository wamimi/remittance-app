'use client';
import { useState } from 'react';

export default function ReceiveTokens() {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('');
  const [message, setMessage] = useState('');

  const handleReceiveTokens = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/actions/receive-tokens', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
        setMessage(data.message);
      } else {
        setMessage('Error fetching balance');
      }
    } catch (error) {
      setMessage('Error receiving tokens');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Receive Tokens</h1>
      <button onClick={handleReceiveTokens} disabled={loading}>
        {loading ? 'Checking balance...' : 'Receive Tokens'}
      </button>
      {balance && <p>Your balance is: {balance}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}
