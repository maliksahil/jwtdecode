import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, Lock, Shield, Eye } from 'lucide-react';

interface JsonViewerProps {
  data: any;
  label?: string;
  isLast?: boolean;
}

const JsonViewer = ({ data, label, isLast }: JsonViewerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const isObject = typeof data === 'object' && data !== null;

  const renderValue = (val: any) => {
    if (typeof val === 'string') return <span className="text-emerald-400">"{val}"</span>;
    if (typeof val === 'number') return <span className="text-amber-400">{val}</span>;
    if (typeof val === 'boolean') return <span className="text-blue-400">{val.toString()}</span>;
    if (val === null) return <span className="text-zinc-500">null</span>;
    return null;
  };

  if (!isObject) {
    return (
      <div className="flex items-center gap-1 font-mono text-sm py-0.5">
        {label && <span className="text-zinc-400">{label}: </span>}
        {renderValue(data)}
        {!isLast && <span className="text-zinc-500">,</span>}
      </div>
    );
  }

  const keys = Object.keys(data);

  return (
    <div className="font-mono text-sm py-0.5">
      <div className="flex items-center gap-1 group">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-0.5 hover:bg-zinc-800 rounded transition-colors"
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
          )}
        </button>
        {label && <span className="text-zinc-400">{label}: </span>}
        <span className="text-zinc-500">{Array.isArray(data) ? '[' : '{'}</span>
        {!isOpen && (
          <span
            className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs cursor-pointer hover:bg-zinc-700 transition-colors mx-1"
            onClick={() => setIsOpen(true)}
          >
            {keys.length} items
          </span>
        )}
        {!isOpen && <span className="text-zinc-500">{Array.isArray(data) ? ']' : '}'}</span>}
        {!isOpen && !isLast && <span className="text-zinc-500">,</span>}
      </div>

      {isOpen && (
        <div className="pl-6 border-l border-zinc-800 ml-2 mt-0.5">
          {keys.map((key, index) => (
            <JsonViewer
              key={key}
              label={Array.isArray(data) ? undefined : key}
              data={data[key]}
              isLast={index === keys.length - 1}
            />
          ))}
        </div>
      )}

      {isOpen && (
        <div className="flex items-center gap-1">
          <span className="text-zinc-500 pl-5">{Array.isArray(data) ? ']' : '}'}</span>
          {!isLast && <span className="text-zinc-500">,</span>}
        </div>
      )}
    </div>
  );
};

function App() {
  const [jwt, setJwt] = useState('');
  const [error, setError] = useState('');

  const decoded = useMemo(() => {
    if (!jwt) {
      setError('');
      return null;
    }
    const parts = jwt.split('.');
    if (parts.length < 2 || parts.length > 3) {
      setError('Invalid JWT format. Must have 2 or 3 parts.');
      return null;
    }

    try {
      const decodePart = (part: string) => {
        const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const json = decodeURIComponent(
          decoded
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(json);
      };

      setError('');
      return {
        header: decodePart(parts[0]),
        payload: decodePart(parts[1]),
      };
    } catch (e) {
      setError('Failed to decode part: Invalid Base64 or JSON');
      return null;
    }
  }, [jwt]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Shield className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">JWT Debugger</h1>
              <p className="text-zinc-500 text-sm">Decode and inspect JSON Web Tokens locally</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">v1.0.0</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Lock className="w-4 h-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Encoded Token</h2>
            </div>
            <textarea
              value={jwt}
              onChange={(e) => setJwt(e.target.value)}
              placeholder="Paste your JWT here..."
              className="w-full h-96 bg-zinc-900 border border-zinc-800 rounded-xl p-6 font-mono text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-700 leading-relaxed resize-none"
            />
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-2 text-zinc-400">
              <Eye className="w-4 h-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Decoded Payload</h2>
            </div>

            {!decoded ? (
              <div className="h-96 flex flex-col items-center justify-center bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl space-y-3">
                <p className="text-zinc-600 font-mono text-sm">Enter a valid JWT to see the decoded content</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Header</span>
                    <span className="text-[10px] text-zinc-500 font-mono">ALGORITHM & TOKEN TYPE</span>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <JsonViewer data={decoded.header} />
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                  <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Payload</span>
                    <span className="text-[10px] text-zinc-500 font-mono">DATA & CLAIMS</span>
                  </div>
                  <div className="p-4 overflow-x-auto">
                    <JsonViewer data={decoded.payload} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
