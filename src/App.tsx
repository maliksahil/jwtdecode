import { useState, useEffect } from 'react';

function App() {
  const [jwt, setJwt] = useState('');
  const [header, setHeader] = useState<null | object>(null);
  const [payload, setPayload] = useState<null | object>(null);
  const [error, setError] = useState('');

  const decodeJwt = (token: string) => {
    try {
      setError('');
      if (!token.trim()) {
        setHeader(null);
        setPayload(null);
        return;
      }

      const parts = token.split('.');
      if (parts.length < 2 || parts.length > 3) {
        throw new Error('Invalid JWT format. Must have 2 or 3 parts.');
      }

      const decodePart = (part: string) => {
        try {
          const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = atob(base64);
          const json = decodeURIComponent(
            decoded
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(json);
        } catch {
          throw new Error('Failed to decode part: Invalid Base64 or JSON');
        }
      };

      setHeader(decodePart(parts[0]));
      setPayload(decodePart(parts[1]));
    } catch (err) {
      setHeader(null);
      setPayload(null);
      setError(err instanceof Error ? err.message : 'Invalid token');
    }
  };

  useEffect(() => {
    decodeJwt(jwt);
  }, [jwt]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">JWT Decoder</h1>
          <p className="text-gray-400">Decode JSON Web Tokens instantly without any external libraries.</p>
        </header>

        <main className="grid grid-cols-1 gap-6">
          <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">Encoded JWT</h2>
            <textarea
              className="w-full h-40 bg-gray-950 border border-gray-700 rounded p-4 text-pink-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none"
              placeholder="Paste your JWT here..."
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
            />
            {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Header</h2>
              <div className="bg-gray-950 border border-gray-700 rounded p-4 overflow-auto max-h-[500px]">
                {header ? (
                  <pre className="text-sm text-green-400">{JSON.stringify(header, null, 2)}</pre>
                ) : (
                  <p className="text-gray-600 italic">No header data</p>
                )}
              </div>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Payload</h2>
              <div className="bg-gray-950 border border-gray-700 rounded p-4 overflow-auto max-h-[500px]">
                {payload ? (
                  <pre className="text-sm text-yellow-400">{JSON.stringify(payload, null, 2)}</pre>
                ) : (
                  <p className="text-gray-600 italic">No payload data</p>
                )}
              </div>
            </section>
          </div>
        </main>

        <footer className="mt-8 text-center text-gray-500 text-sm">
          Built with React + Tailwind + Native Web APIs
        </footer>
      </div>
    </div>
  );
}

export default App;
