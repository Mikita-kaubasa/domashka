import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [d, setD] = useState<number | null>(null);

  useEffect(() => {
    // Dynamically create the worker from the file
    const worker = new Worker(new URL('./sumWorker.js', import.meta.url));
    worker.postMessage(1e8);
    worker.onmessage = (e) => {
      setD(e.data);
      worker.terminate();
    };
    // Cleanup in case component unmounts early
    return () => worker.terminate();
  }, []);

  return <div>{d}</div>;
}
