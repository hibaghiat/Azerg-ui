'use client'
import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import GraphView from '../graph/GraphView'
import * as d3 from 'd3'
import { getReport, getAllEntities, getAllRelations } from '@/app/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ShowPopup = {
	text: string
	x: number
	y: number
} | null

type SelectionDict = {
	[text: string]: {
		indices: number[]
		tag: string
		id: string
	}
}

interface Relationship {
	id: string
	type: string
	relationship_type: string
	source_ref: string
	target_ref: string
}

interface Entity {
	id: string
	type: string
	name: string
	fullName: string
	pattern?: string
}

const Section = ({ title, items, maxItems = 5 }) => {
	const [showAll, setShowAll] = React.useState(false)

	const displayItems = showAll ? items : items.slice(0, maxItems)

	return (
		<div className='space-y-4'>
			<p className='text-sm font-medium text-gray-700 mt-4'>{title}</p>
			<div
				className={`flex flex-wrap gap-2 ${
					items.length > maxItems ? 'overflow-auto max-h-60' : ''
				}`}
			>
				{displayItems.map((item, index) => (
					<Badge
						key={index}
						variant='outline'
						className='px-3 py-1 rounded-lg text-sm bg-gray-100'
					>
						{item}
					</Badge>
				))}
				{items.length > maxItems && (
					<Button
						variant='outline'
						size='sm'
						className='ml-auto px-4 py-2 rounded-md text-gray-700 border-gray-300 hover:bg-gray-200'
						onClick={() => setShowAll(!showAll)}
					>
						{showAll ? 'Show less' : 'Show more'}
					</Button>
				)}
			</div>
		</div>
	)
}

const hashes = [
	'MD5: 12345abcde',
	'SHA-1: 12345abcdef',
	'SHA-256: 12345abcdef12345',
	'SHA-512: 12345abcdef12345abcdef',
	'CRC32: 12345678',
	'Additional Hash',
]
const urls = [
	'https://example.com/azerg',
	'https://example.org/azerg',
	'https://example.net/azerg',
	'https://example.info/azerg',
	'https://example.biz/azerg',
	'Additional URL',
]
const ipAddresses = [
	'192.168.1.1',
	'10.0.0.1',
	'172.16.0.1',
	'8.8.8.8',
	'1.1.1.1',
	'Additional IP',
]
const mitreTechniques = [
	'T1059 - Command and Scripting Interpreter',
	'T1204 - User Execution',
	'T1218 - System Binary Proxy Execution',
]
const tags = [
	'malware',
	'threat',
	'cybersecurity',
	'exploit',
	'attack',
	'defense',
	'network',
	'phishing',
]

const ReportPage: React.FC = () => {
	const [showGraphView, setShowGraphView] = useState(false)
	const [expandedEntities, setExpandedEntities] = useState<Set<string>>(
		new Set(),
	)
	const [isMetadataExpanded, setIsMetadataExpanded] = useState(false)
	const router = useRouter()

	const [tagsMappings, setTags] = useState<TagMappings>({})
	const colors = [
		'orange',
		'bisque',
		'cyan',
		'yellow',
		'chartreuse',
		'plum',
		'pink',
		'lightblue',
		'tomato',
		'aquamarine',
		'indianred',
		'wheat',
		'yellowgreen',
		'thistle',
		'seagreen',
		'tan',
		'silver',
		'skyblue',
		'slategrey',
		'slateblue',
	]
	type TagMappings = {
		[key: string]: string
	}

	const [txt, setTxt] = useState('')
	const [selections, setSelections] = useState<SelectionDict>({})
	const [showPopup, setShowPopup] = useState<ShowPopup>(null)
	const [showRemoveTagPopup, setShowRemoveTagPopup] = useState<ShowPopup>(null)
	const [newRelationship, setNewRelationship] = useState<Relationship>({
		id: '',
		type: 'relationship',
		relationship_type: '',
		source_ref: '',
		target_ref: '',
	})
	const [relationships, setRelationships] = useState<Relationship[]>([])
	const [entities, setEntities] = useState<Entity[]>([])
	const [relations, setRelations] = useState([])
	const [AllEntities, setAllEntities] = useState<
		{
			name: string
			description: string
		}[]
	>([])

	useEffect(() => {
		getReport().then(data => {
			setTxt(data.paragraphs.join('\n').trim())
			setRelationships(data.relations)
			setEntities(
				data.entities.map((d: any) => ({
					...d,
					fullName: d.name,
					name: d.name.length > 6 ? `${d.name.slice(0, 6)}...` : d.name,
				})),
			)

			const sel = data.entities.reduce((map, entity) => {
				map[entity.name] = {
					indices: [findIndices(txt, entity.fullName)],
					tag: entity.type.toUpperCase(),
					id: entity.id,
				}
				return map
			}, {})
			setSelections(sel)
		})
		getAllEntities().then(data => {
			setAllEntities(data)
			const newTagsMappings: TagMappings = {}
			data.forEach((entity, index) => {
				const color = colors[index % colors.length]
				newTagsMappings[color] = entity
			})

			setTags(newTagsMappings)
		})
		getAllRelations().then(data => {
			setRelations(data)
		})
	}, [])

	const handleDownloadSTIX = () => {
		const downloadButton = document.querySelector('.download-button')
		const downloadIcon = document.querySelector('.download-icon')
		const downloadLoader = document.querySelector('.download-loader')
		const downloadCheckMark = document.querySelector('.check-svg')
		const downloadText = document.querySelector('.button-copy')

		if (
			downloadButton &&
			downloadIcon &&
			downloadLoader &&
			downloadCheckMark &&
			downloadText
		) {
			downloadIcon.classList.add('hidden')
			downloadLoader.classList.remove('hidden')
			downloadText.innerHTML = 'DOWNLOADING'

			downloadLoader.addEventListener(
				'animationend',
				() => {
					downloadLoader.classList.add('hidden')
					downloadCheckMark.classList.remove('hidden')
					downloadText.innerHTML = 'DOWNLOADED'
				},
				{ once: true },
			)

			// Simulate a download process with a timeout
			setTimeout(() => {
				downloadLoader.classList.add('hidden')
				downloadCheckMark.classList.remove('hidden')
				downloadText.innerHTML = 'DOWNLOADED'
			}, 3000)
		}
	}

	const handleToggleView = () => {
		setShowGraphView(!showGraphView)
	}

	const handleToggleMetadata = () => {
		setIsMetadataExpanded(prev => !prev)
	}

	// Generate color scale
	const entityColors = d3.scaleOrdinal(d3.schemeCategory10)

	// Function to get entity name by ID
	const getEntityNameById = (id: string) => {
		const entity = entities.find(entity => entity.id === id)
		if (!entity) return id
		return expandedEntities.has(id) ? entity.fullName : entity.name // Return full name if expanded, otherwise return shortened name
	}

	// Function to get entity color by ID
	const getEntityColorById = (id: string) => {
		const entity = entities.find(entity => entity.id === id)
		return entity ? entityColors(entity.type) : '#000' // Return entity color if found, otherwise return default color
	}

	// Toggle expanded state for entity names
	const handleToggleEntityName = (id: string) => {
		setExpandedEntities(prev => {
			const newSet = new Set(prev)
			if (newSet.has(id)) {
				newSet.delete(id)
			} else {
				newSet.add(id)
			}
			return newSet
		})
	}

	// Report tagging and relationship creation functions

	const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
		const selection = window.getSelection()
		if (selection && selection.toString().trim().length > 0) {
			const selectedText = selection.toString().trim()
			const range = selection.getRangeAt(0)
			const rect = range.getBoundingClientRect()
			setShowPopup({ text: selectedText, x: rect.x, y: rect.y + rect.height })
			setShowRemoveTagPopup(null)
		} else {
			setShowPopup(null)
		}
	}

	const handleTextClick = (
		text: string,
		event: React.MouseEvent<HTMLSpanElement>,
	) => {
		if (showRemoveTagPopup !== null && showRemoveTagPopup.text === text) {
			setShowRemoveTagPopup(null)
			return
		}
		const rect = event.currentTarget.getBoundingClientRect()
		setShowRemoveTagPopup({ text, x: rect.x, y: rect.y + rect.height })
	}

	const selectTag = (tag: string) => {
		if (showPopup && tag) {
			const { text } = showPopup
			const newSelections = { ...selections }
			const indices = findIndices(txt, text)
			const id = Date.now().toString()

			if (!newSelections[text]) {
				newSelections[text] = { indices, tag, id }
			} else {
				newSelections[text].tag = tag
			}

			setSelections(newSelections)
		}

		setShowPopup(null)
	}

	const removeTag = (text: string) => {
		const newSelections = { ...selections }
		delete newSelections[text]
		setSelections(newSelections)
		setShowRemoveTagPopup(null)
	}

	const findIndices = (text: string, search: string) => {
		const indices: number[] = []
		let startIndex = 0

		while ((startIndex = text.indexOf(search, startIndex)) > -1) {
			indices.push(startIndex)
			startIndex += search.length
		}

		return indices
	}

	const getTaggedText = () => {
		let parts: { text: string; tag: string | null }[] = [
			{ text: txt, tag: null },
		]

		Object.keys(selections).forEach(selectedText => {
			const { indices, tag } = selections[selectedText]
			let newParts: { text: string; tag: null | string }[] = []

			parts.forEach(part => {
				if (part.tag) {
					newParts.push(part)
					return
				}

				let text = part.text
				let lastIndex = 0

				indices.forEach(index => {
					let splitIndex = text.indexOf(selectedText, lastIndex)
					if (splitIndex !== -1) {
						if (splitIndex > lastIndex) {
							newParts.push({
								text: text.substring(lastIndex, splitIndex),
								tag: null,
							})
						}
						newParts.push({
							text: text.substring(
								splitIndex,
								splitIndex + selectedText.length,
							),
							tag,
						})
						lastIndex = splitIndex + selectedText.length
					}
				})
				if (lastIndex < text.length) {
					newParts.push({
						text: text.substring(lastIndex),
						tag: null,
					})
				}
			})

			parts = newParts
		})

		return parts
	}

	const entitiesMap = entities.reduce((map, entity) => {
		map[entity.id] = { name: entity.name, type: entity.type }
		return map
	}, {})

	const handleAddRelationship = () => {
		if (!newRelationship.source_ref || !newRelationship.target_ref) return
		newRelationship.id = Date.now().toString()
		setEntities([
			...entities,
			{
				id: selections[newRelationship.source_ref].id,
				type: selections[newRelationship.source_ref].tag,
				name:
					newRelationship.source_ref.length > 6
						? `${newRelationship.source_ref.slice(0, 6)}...`
						: newRelationship.source_ref,
				fullName: newRelationship.source_ref,
			},
			{
				id: selections[newRelationship.target_ref].id,
				type: selections[newRelationship.target_ref].tag,
				name:
					newRelationship.target_ref.length > 6
						? `${newRelationship.target_ref.slice(0, 6)}...`
						: newRelationship.target_ref,
				fullName: newRelationship.target_ref,
			},
		])
		newRelationship.source_ref = selections[newRelationship.source_ref].id
		newRelationship.target_ref = selections[newRelationship.target_ref].id

		var newRelationships: Relationship[] = [...relationships, newRelationship]

		setRelationships(newRelationships)

		setNewRelationship({
			relationship_type: '',
			id: '',
			type: 'relationship',
			source_ref: '',
			target_ref: '',
		})
	}

	const handleInputChange = e => {
		const { name, value } = e.target
		setNewRelationship({ ...newRelationship, [name]: value })
	}

	const handleSourceChange = e => {
		const { value } = e.target
		setNewRelationship({
			...newRelationship,
			source_ref: value,
			target_ref: '',
		})
	}

	const getTargetOptions = () => {
		if (!newRelationship.source_ref || !newRelationship.target_ref) return []
		if (
			!selections[newRelationship.source_ref] ||
			!selections[newRelationship.target_ref]
		)
			return []
		const sourceType = selections[newRelationship.source_ref]?.tag.toUpperCase()
		const targetType = selections[newRelationship.target_ref]?.tag.toUpperCase()
		if (!relations[sourceType] || !relations[sourceType][targetType]) return []
		const targetOptions = relations[sourceType][targetType]
		return targetOptions
	}

	return (
		<div>
			{/* Metadata Section */}
			<div className='bg-white rounded-lg shadow-md p-4 mb-6 m-2'>
				<div className='text-lg font-semibold mb-4 text-blue-600 border-b-2 border-blue-300 pb-2'>
					{' '}
					Metadata
				</div>
				<div
					className={`transition-all duration-300 ease-in-out overflow-hidden ${
						isMetadataExpanded ? '' : 'max-h-24'
					}`}
				>
					<div className='p-4 bg-gray-50 rounded-lg mb-4 shadow-sm'>
						<p className='text-sm font-medium text-gray-700'>Source</p>
						<Link href='#' className='text-blue-500 hover:underline'>
							https://example.com/azerg.pdf
						</Link>
					</div>
					<Section title='Hashes' items={hashes} />
					<Section title='URLs' items={urls} />
					<Section title='IP Addresses' items={ipAddresses} />
					<Section title='MITRE Techniques' items={mitreTechniques} />
					<Section title='Tags' items={tags} />
				</div>
				<Button
					variant='outline'
					size='sm'
					className='mt-4 px-4 py-2 rounded-md text-gray-700 border-gray-300 hover:bg-gray-200 transition-colors'
					onClick={handleToggleMetadata}
				>
					{isMetadataExpanded ? 'Reduce' : 'Expand'}
				</Button>
			</div>
			<div className='grid grid-cols-[1fr,3fr,1fr] gap-4 min-h-screen'>
				{/* Left Sidebar */}
				<div className='border-r bg-muted/40 p-4'>
					<Button
						size='sm'
						className='px-4 py-4 mb-4 rounded-md w-full'
						onClick={() => router.push('/reports')}
					>
						Back to Reports
					</Button>

					<Button
						size='sm'
						className='px-4 py-4 mb-4 rounded-md w-full'
						onClick={handleDownloadSTIX}
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='download-icon h-4 w-4'
							viewBox='0 0 20 20'
							fill='currentColor'
						>
							<path
								fillRule='evenodd'
								d='M10 16a1 1 0 0 1-1-1V5.414l-3.293 3.293a1 1 0 1 1-1.414-1.414l5-5a1 1 0 0 1 1.414 0l5 5a1 1 0 0 1-1.414 1.414L11 5.414V15a1 1 0 0 1-1 1z'
								clipRule='evenodd'
							/>
						</svg>
						<span className='button-copy'>Download STIX Report</span>
					</Button>

					{/* Relations Section */}
					<div className='bg-white rounded-lg shadow-md p-4 mb-6'>
						<div className='text-lg font-semibold mb-4 text-green-600 border-b-2 border-green-300 pb-2'>
							Relations
						</div>
						<div className='flex flex-col gap-2 overflow-auto'>
							{relationships.map((rel, index) => (
								<div
									key={index}
									className='flex items-center justify-between rounded-md bg-gray-100 px-3 py-1 hover:bg-gray-200'
									style={{ fontSize: '0.875rem' }}
								>
									<span
										style={{
											color:
												entitiesMap[rel.source_ref]?.type !== undefined
													? Object.keys(tagsMappings).find(
															key =>
																tagsMappings[key] ===
																entitiesMap[rel.source_ref].type.toUpperCase(),
													  )
													: 'none',
											fontSize: '0.875rem',
											cursor: 'pointer',
										}}
										onClick={() => handleToggleEntityName(rel.source_ref)}
									>
										{getEntityNameById(rel.source_ref)}
									</span>
									<Badge size='sm'>{rel.relationship_type}</Badge>
									<span
										style={{
											color:
												entitiesMap[rel.target_ref]?.type !== undefined
													? Object.keys(tagsMappings).find(
															key =>
																tagsMappings[key] ===
																entitiesMap[rel.target_ref].type.toUpperCase(),
													  )
													: 'none',
											fontSize: '0.875rem',
											cursor: 'pointer',
										}}
										onClick={() => handleToggleEntityName(rel.target_ref)}
									>
										{getEntityNameById(rel.target_ref)}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Main Content Area */}
				<div
					className='
      flex flex-col'
				>
					<header className='flex h-14 lg:h-[60px] items-center gap-4 border-b bg-muted/40 px-6'>
						<div className='flex-1 font-semibold text-lg'>Threat Report</div>
						<Button size='sm' onClick={handleToggleView}>
							{showGraphView ? 'Switch to Text View' : 'Switch to Graph View'}
						</Button>
					</header>
					<main className='flex-1 overflow-auto'>
						{showGraphView ? (
							<GraphView entityColors={entityColors} />
						) : (
							<div className='prose prose-gray dark:prose-invert'>
								<main className='w-full h-auto flex flex-col justify-center p-3 gap-3'>
									<section className='flex flex-row flex-wrap gap-2 w-full border-l-4 border-sky-500 p-2 rounded-md'>
										{Object.keys(tagsMappings).map((tag, i) => (
											<div key={i} className='flex items-center'>
												<p
													className='w-fit h-fit rounded-sm px-2'
													style={{ backgroundColor: tag }}
												>
													{tagsMappings[tag]}
												</p>
											</div>
										))}
									</section>
									<section className='w-full flex flex-col'>
										<div
											className='whitespace-pre-wrap text-base font-medium p-3'
											onMouseUp={handleMouseUp}
										>
											{getTaggedText().map((part, index) => (
												<span
													key={index}
													style={{
														textDecoration:
															part.tag !== null ? 'underline' : 'none',
														backgroundColor:
															part.tag !== null
																? Object.keys(tagsMappings).find(
																		key => tagsMappings[key] === part.tag,
																  )
																: 'none',
														textDecorationColor:
															part.tag !== null
																? Object.keys(tagsMappings).find(
																		key => tagsMappings[key] === part.tag,
																  )
																: 'none',
														cursor: part.tag ? 'pointer' : 'text',
														textDecorationThickness: '1px',
													}}
													onClick={
														part.tag
															? event => handleTextClick(part.text, event)
															: undefined
													}
													className='whitespace-pre-wrap'
												>
													{part.text}
												</span>
											))}
										</div>
									</section>
								</main>

								{showPopup && !showGraphView && (
									<div
										className='absolute bg-white p-1 rounded shadow-lg flex flex-row w-[40%] flex-wrap gap-3 m-2 border-gray-500 border-2'
										style={{ top: showPopup.y, left: showPopup.x }}
									>
										{Object.keys(tagsMappings).map(key => (
											<div
												key={tagsMappings[key]}
												className={'cursor-pointer radius-2 text-black px-1'}
												style={{ backgroundColor: key }}
												onClick={() => selectTag(tagsMappings[key])}
											>
												{tagsMappings[key]}
											</div>
										))}
									</div>
								)}
								{showRemoveTagPopup && !showGraphView && (
									<div
										className='absolute bg-white p-1 rounded shadow-lg flex flex-col gap-3 m-2 border-gray-500 border-2'
										style={{
											top: showRemoveTagPopup.y,
											left: showRemoveTagPopup.x,
										}}
									>
										<div className='flex flex-col justify-between'>
											<span className='p-2 font-semibold'>
												Tag: {selections[showRemoveTagPopup.text].tag}
											</span>
											<button
												className='p-2 m-2 text-white rounded bg-sky-400'
												onClick={() => removeTag(showRemoveTagPopup.text)}
											>
												Remove Tag
											</button>
										</div>
									</div>
								)}
							</div>
						)}
					</main>
				</div>

				{/* Add New Relationship Section */}
				<div className='bg-white rounded-lg shadow-md p-4 flex flex-col max-w-xs max-h-60'>
					<div className='text-lg font-semibold mb-4 text-red-600 border-b-2 border-red-300 pb-2'>
						Add New Relationship
					</div>
					<div className='flex flex-col gap-2 justify-start'>
						<select
							name='source_ref'
							value={newRelationship.source_ref}
							onChange={handleSourceChange}
							className='p-1 bg-[#46A2FF] rounded text-white text-sm'
						>
							<option value='1'>Select Source Entity</option>
							{Object.keys(selections).map((text, index) => (
								<option key={index} value={text}>
									{text}
								</option>
							))}
						</select>

						<select
							name='target_ref'
							value={newRelationship.target_ref}
							onChange={handleInputChange}
							className='p-1 bg-[#46A2FF] rounded text-white text-sm'
						>
							<option value=''>Select Target Entity</option>
							{Object.keys(selections).map((text, index) => (
								<option key={index} value={text}>
									{text}
								</option>
							))}
						</select>
						<select
							name='relationship_type'
							value={newRelationship.relationship_type}
							onChange={handleInputChange}
							className='p-1 bg-[#46A2FF] rounded text-white text-sm'
						>
							<option value=''>Select Relationship Type</option>
							{Object.entries(
								getTargetOptions() as { [key: string]: { name: string } },
							).map((rel, index) => (
								<option key={index} value={rel[1].name}>
									{rel[1].name}
								</option>
							))}
						</select>
						<Button onClick={handleAddRelationship}>Add Relationship</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ReportPage
