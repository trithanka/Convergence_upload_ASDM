import React from 'react';

const SectorModal: React.FC = () => {
  return (
    <div className="px-4 py-4 md:px-8 lg:px-12 overflow-auto max-h-[450px] max-w-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
    
      
        <input 
          type="text" 
          placeholder="Enter sector name" 
          className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
   
  );
}

export default SectorModal;
