import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Note Manager</h1>
      <Outlet />
    </div>
  );
}