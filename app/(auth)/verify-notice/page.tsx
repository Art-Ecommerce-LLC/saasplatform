"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyNoticePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Use useSearchParams to get the URL parameters
  const searchParams = useSearchParams();

  // Use useEffect to get the sessionToken from URL params and store it in the component state
  useEffect(() => {
    const token = searchParams.get('sessionToken');
    if (token) {
      setSessionToken(token);
    }
  }, [searchParams]);

  const handleResendClick = async () => {
    if (!sessionToken) {
      setMessage('Session token is missing.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Send the sessionToken in the POST request
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Verification email has been resent. Please check your inbox.');
      } else {
        setMessage(data.message || 'Failed to resend verification email. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while resending the verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Verification Required</h1>
      <p>A verification link has been sent to your email. Please verify your email address before signing in.</p>

      <button
        onClick={handleResendClick}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: loading ? 'not-allowed' : 'pointer',
          backgroundColor: loading ? '#ccc' : '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Resending...' : 'Resend Verification Email'}
      </button>

      {message && (
        <p style={{ marginTop: '20px', color: message.includes('error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
}
