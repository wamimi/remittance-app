'use client';
import { useState } from 'react';

export default function TokenActions() {
  // State for sending tokens
  const [sendLoading, setSendLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState('');

  // State for receiving tokens
  const [receiveLoading, setReceiveLoading] = useState(false);
  const [balance, setBalance] = useState('');
  const [receiveMessage, setReceiveMessage] = useState('');

  // State for transaction history
  const [historyLoading, setHistoryLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [historyMessage, setHistoryMessage] = useState('');

  // Send tokens handler
  const handleSendTokens = async () => {
    setSendLoading(true);
    setSendMessage('');
    try {
      const response = await fetch('/api/actions/send-tokens', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setSendMessage(`Success: ${data.message}`);
      } else {
        setSendMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setSendMessage('Error sending tokens');
    }
    setSendLoading(false);
  };

  // Receive tokens handler
  const handleReceiveTokens = async () => {
    setReceiveLoading(true);
    setReceiveMessage('');
    try {
      const response = await fetch('/api/actions/receive-tokens', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
        setReceiveMessage(data.message);
      } else {
        setReceiveMessage('Error fetching balance');
      }
    } catch (error) {
      setReceiveMessage('Error receiving tokens');
    }
    setReceiveLoading(false);
  };

  // Fetch transaction history handler
  const fetchTransactions = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch('/api/actions/transaction-history');
      const data = await response.json();
      if (response.ok) {
        setTransactions(data.history);
        setHistoryMessage('');
      } else {
        setHistoryMessage('Error fetching transaction history');
      }
    } catch (error) {
      setHistoryMessage('Error fetching transaction history');
    }
    setHistoryLoading(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Send Tokens Section */}
      <h1>Send Tokens</h1>
      <button onClick={handleSendTokens} disabled={sendLoading}>
        {sendLoading ? 'Sending...' : 'Send Tokens'}
      </button>
      {sendMessage && <p>{sendMessage}</p>}

      <hr />

      {/* Receive Tokens Section */}
      <h1>Receive Tokens</h1>
      <button onClick={handleReceiveTokens} disabled={receiveLoading}>
        {receiveLoading ? 'Checking balance...' : 'Receive Tokens'}
      </button>
      {balance && <p>Your balance is: {balance}</p>}
      {receiveMessage && <p>{receiveMessage}</p>}

      <hr />

      {/* Transaction History Section */}
      <h1>Transaction History</h1>
      <button onClick={fetchTransactions} disabled={historyLoading}>
        {historyLoading ? 'Loading...' : 'Refresh'}
      </button>
      {historyMessage && <p>{historyMessage}</p>}
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              {tx.date} - {tx.amount} tokens - {tx.action}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
}
