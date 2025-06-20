import { FaSpinner } from 'react-icons/fa';

const Loader = () => (
  <div style={{ display: 'grid', placeItems: 'center', height: '100vh', fontSize: '2rem' }}>
    <FaSpinner className="spin" />
    <p style={{ marginTop: '1rem' }}>One moment...</p>
  </div>
);
export default Loader;