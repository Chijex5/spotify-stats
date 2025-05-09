import React from 'react';

interface PopularityChartProps {
  popularity: number;
}

const PopularityChart: React.FC<PopularityChartProps> = ({ popularity }) => {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-1">
        <div className="text-xs text-gray-500">Popularity</div>
        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
            style={{ width: `${popularity}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500">{popularity}%</div>
      </div>
    </div>
  );
};

export default PopularityChart;