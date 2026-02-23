import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('JWT Decoder App', () => {
  it('renders correctly', () => {
    render(<App />);
    expect(screen.getByText('JWT Decoder')).toBeInTheDocument();
  });

  it('decodes a valid JWT', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Paste your JWT here...');

    // Simple JWT for testing: header: {"alg":"HS256","typ":"JWT"}, payload: {"sub":"1234567890","name":"John Doe","iat":1516239022}
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    
    fireEvent.change(textarea, { target: { value: jwt } });

    expect(await screen.findByText(/"alg": "HS256"/)).toBeInTheDocument();
    expect(await screen.findByText(/"sub": "1234567890"/)).toBeInTheDocument();
  });

  it('shows error for invalid JWT', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Paste your JWT here...');
    
    fireEvent.change(textarea, { target: { value: 'invalid.token' } });

    expect(await screen.findByText(/Failed to decode part/)).toBeInTheDocument();
  });
});
