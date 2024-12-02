import * as d3 from 'd3';

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

export const getColor = (type) => colorScale(type);

export default colorScale;
