import { motion } from "framer-motion";
import AutoUpdateStatus from './AutoUpdateStatus';

export default function Header({ 
  autoUpdate, 
  lastUpdate, 
  updateCount, 
  toggleAutoUpdate, 
  manuallyUpdateStats 
}) {
  return (
    <div className="text-center">
      <h2 className="text-5xl font-bold mb-4">
        Thống kê Video YouTube
      </h2>
      <p className="text-xl text-gray-300 mb-4">
        Quản lý và theo dõi thống kê video YouTube của bạn - Real-time
      </p>
      
      <AutoUpdateStatus
        autoUpdate={autoUpdate}
        lastUpdate={lastUpdate}
        updateCount={updateCount}
        toggleAutoUpdate={toggleAutoUpdate}
        manuallyUpdateStats={manuallyUpdateStats}
      />
    </div>
  );
}