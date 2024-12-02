import React, { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import graphData from './data.json'
interface Node {
	id: string
	type: string
	name: string
	fullName: string
	pattern?: string
	x?: number
	y?: number
	vx?: number
	vy?: number
}

interface Link {
	source: string
	target: string
	relationship_type: string
}

const Graph: React.FC<{ entityColors }> = ({ entityColors }) => {
	const svgRef = useRef<SVGSVGElement>(null)
	const legendRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const width = 928
		const height = 600

		const validNodeIds = new Set(graphData.entities.map((d: any) => d.id))
		const nodes: Node[] = graphData.entities.map((d: any) => ({
			...d,
			fullName: d.name, // Store full name initially
			name: d.name.length > 6 ? `${d.name.slice(0, 6)}...` : d.name,
		}))
		const links: Link[] = graphData.relationships
			.filter(
				(d: any) =>
					validNodeIds.has(d.source_ref) && validNodeIds.has(d.target_ref),
			)
			.map((d: any) => ({
				source: d.source_ref,
				target: d.target_ref,
				relationship_type: d.relationship_type,
			}))

		const simulation = d3
			.forceSimulation(nodes)
			.force(
				'link',
				d3
					.forceLink(links)
					.id((d: any) => d.id)
					.distance(70),
			) // Increase link distance
			.force('charge', d3.forceManyBody().strength(-50)) // Increase negative charge for more spacing
			.force('center', d3.forceCenter(width / 2, height / 2))
			.on('tick', ticked)

		const zoom = d3
			.zoom<SVGSVGElement, unknown>() // Specify SVGSVGElement here
			.scaleExtent([1, 5]) // Set zoom limits
			.on('zoom', event => {
				svg.attr('transform', event.transform)
			})

		d3.select(svgRef.current).selectAll('*').remove()

		const svg = d3
			.select(svgRef.current)
			.attr('width', width)
			.attr('height', height)
			.attr('viewBox', [0, 0, width, height])
			.attr('style', 'max-width: 100%; height: auto;')
			.call(zoom)
			.append('g')

		const link = svg
			.append('g')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke-width', 1.5)

		const linkLabels = svg
			.append('g')
			.attr('class', 'link-labels')
			.selectAll('text')
			.data(links)
			.enter()
			.append('text')
			.attr('font-size', 10)
			.attr('fill', '#555')
			.text((d: any) => d.relationship_type)

		const node = svg
			.append('g')
			.attr('stroke', '#fff')
			.attr('stroke-width', 1.5)
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('r', 5)
			.attr('fill', (d: any) => entityColors(d.type))
			.call(drag(simulation))

		const nodeLabels = svg
			.append('g')
			.attr('class', 'node-labels')
			.selectAll('text')
			.data(nodes)
			.enter()
			.append('text')
			.attr('font-size', 10)
			.attr('fill', '#333')
			.text((d: any) => d.name)
			.on('click', toggleLabel) // Add click event listener

		node.append('title').text((d: any) => d.fullName) // Show full name on hover

		// Legend
		const legend = d3
			.select(legendRef.current)
			.attr('class', 'legend')
			.style('position', 'absolute')
			.style('top', '20px')
			.style('right', '20px')

		const legendItems = legend
			.selectAll('.legend-item')
			.data(entityColors.domain())
			.enter()
			.append('div')
			.attr('class', 'legend-item')

		legendItems
			.append('div')
			.style('display', 'inline-block')
			.style('width', '10px')
			.style('height', '10px')
			.style('background-color', (d: any) => entityColors(d))

		legendItems
			.append('div')
			.style('display', 'inline-block')
			.style('margin-left', '5px')
			.text((d: any) => d)

		function ticked() {
			link
				.attr('x1', (d: any) => d.source.x)
				.attr('y1', (d: any) => d.source.y)
				.attr('x2', (d: any) => d.target.x)
				.attr('y2', (d: any) => d.target.y)

			linkLabels
				.attr('x', (d: any) => (d.source.x + d.target.x) / 2)
				.attr('y', (d: any) => (d.source.y + d.target.y) / 2)

			node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y)

			nodeLabels
				.attr('x', (d: any) => d.x + 6)
				.attr('y', (d: any) => d.y - 6)
				.text((d: any) => d.name) // Update text to current name state
		}

		function drag(simulation: d3.Simulation<Node, undefined>) {
			function dragstarted(event: any, d: any) {
				if (!event.active) simulation.alphaTarget(0.3).restart()
				d.fx = d.x
				d.fy = d.y
			}

			function dragged(event: any, d: any) {
				d.fx = event.x
				d.fy = event.y
			}

			function dragended(event: any, d: any) {
				if (!event.active) simulation.alphaTarget(0)
				d.fx = null
				d.fy = null
			}

			return d3
				.drag<SVGCircleElement, Node>()
				.on('start', dragstarted)
				.on('drag', dragged)
				.on('end', dragended)
		}

		function toggleLabel(event, d) {
			// Toggle between full name and shortened name
			d.name =
				d.name === d.fullName
					? d.name.length > 6
						? `${d.name.slice(0, 6)}...`
						: d.name
					: d.fullName

			// Update node label text
			d3.select(this).text((d: any) => d.name)
		}

		return () => {
			simulation.stop()
		}
	}, [entityColors])

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<svg ref={svgRef} style={{ width: '100%', height: '100%' }}></svg>
			<div ref={legendRef}></div>
		</div>
	)
}

export default Graph
