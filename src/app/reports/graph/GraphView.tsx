import React, { useState, useEffect } from 'react';
import Graph from './graph';
import * as d3 from 'd3';

const GraphView: React.FC<{ entityColors: d3.ScaleOrdinal<string, string> }> = ({ entityColors }) => {
  const [isGraphLoaded, setIsGraphLoaded] = useState(false);

  useEffect(() => {
    setIsGraphLoaded(true); // Set this to true once the graph is loaded
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Graph View</h2>
      <div className="border rounded-lg p-4 bg-white shadow">
        {isGraphLoaded ? (
          <Graph entityColors={entityColors} />
        ) : (
          <p>This is where your graph visualization component will be.</p>
        )}
      </div>
    </div>
  );
};

export default GraphView;
