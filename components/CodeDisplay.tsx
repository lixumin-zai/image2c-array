
import React, { useState, useCallback } from 'react';
import { Button } from './Button';

interface CodeDisplayProps {
  cCode: string | null;
  imageName: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ cCode, imageName }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (cCode) {
      navigator.clipboard.writeText(cCode.replace('img_board', imageName.replace(/[^a-zA-Z0-9_]/g, '_')))
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Failed to copy text: ', err));
    }
  }, [cCode, imageName]);

  if (!cCode) {
    return null;
  }
  
  const formattedCode = cCode.replace('img_board', imageName.replace(/[^a-zA-Z0-9_]/g, '_'));

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-sky-400">Generated C Code</h2>
        <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-500 text-sm py-1 px-3">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="bg-slate-900 text-slate-300 p-4 rounded-md overflow-auto max-h-96 text-xs custom-scrollbar">
        <code>{formattedCode}</code>
      </pre>
    </div>
  );
};
