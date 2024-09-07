// layout.tsx
import './globals.css';

export default function Layout({ children }) {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {children}
    </div>
  );
}
