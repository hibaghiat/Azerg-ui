'use client'
import React, { useState, MouseEvent, useEffect } from 'react'
import { getReport, getAllEntities, getAllRelations } from '@/app/actions'

type TagMappings = {
	[key: string]: string
}

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

const ModifyReport = (props: any) => {
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
	const [entities, setEntities] = useState<any[]>([])
	const [relations, setRelations] = useState<any>({})

	useEffect(() => {
		const fetchData = async () => {
			const reportData = await getReport()
			setTxt(reportData.paragraphs.join('\n').trim())
			setRelationships(reportData.relations)
			setEntities(reportData.entities)

			const sel = reportData.entities.reduce(
				(map: SelectionDict, entity: any) => {
					map[entity.name] = {
						indices: findIndices(txt, entity.name),
						tag: entity.type.toUpperCase(),
						id: entity.id,
					}
					return map
				},
				{},
			)

			setSelections(sel)
		}

		const fetchEntities = async () => {
			const data = await getAllEntities()
			const newTagsMappings: TagMappings = {}
			data.forEach((entity, index) => {
				const color = colors[index % colors.length]
				newTagsMappings[color] = entity
			})
			setTags(newTagsMappings)
		}

		const fetchRelations = async () => {
			const data = await getAllRelations()
			setRelations(data)
		}

		fetchData()
		fetchEntities()
		fetchRelations()
	}, [])

	const handleMouseUp = (event: MouseEvent<HTMLDivElement>) => {
		const selection = window.getSelection()
		if (selection && selection.toString().length > 0) {
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
		event: MouseEvent<HTMLSpanElement>,
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
		] // Update this line

		Object.keys(selections).forEach(selectedText => {
			const { indices, tag } = selections[selectedText]
			let newParts: { text: string; tag: string | null }[] = []

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
		const updatedRelationship = {
			...newRelationship,
			id: Date.now().toString(),
			source_ref: selections[newRelationship.source_ref]?.id || '',
			target_ref: selections[newRelationship.target_ref]?.id || '',
		}

		setEntities([
			...entities,
			{
				id: updatedRelationship.source_ref,
				type: selections[newRelationship.source_ref]?.tag,
				name: newRelationship.source_ref,
			},
			{
				id: updatedRelationship.target_ref,
				type: selections[newRelationship.target_ref]?.tag,
				name: newRelationship.target_ref,
			},
		])

		setRelationships([...relationships, updatedRelationship])

		setNewRelationship({
			relationship_type: '',
			id: '',
			type: 'relationship',
			source_ref: '',
			target_ref: '',
		})
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
	) => {
		const { name, value } = e.target
		setNewRelationship({ ...newRelationship, [name]: value })
	}

	const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
		<>
			<div className='m-5'>
				<div className='flex flex-row justify-between mt-2 mb-2 mr-2'>
					<h1 className='text-2xl font-black'>Report</h1>
				</div>

				<main className='w-full h-auto flex justify-center mt-5 gap-3'>
					<section className='flex flex-col gap-3 flex-wrap w-[12%]'>
						<h3 className='text-lg font-semibold '>Tags</h3>
						{Object.keys(tagsMappings).map((tag, i) => (
							<div key={i} className='flex flex-row items-center'>
								<p
									className='w-fit h-fit rounded-sm px-2'
									style={{ backgroundColor: tag }}
								>
									{tagsMappings[tag]}
								</p>
							</div>
						))}
					</section>
					<section className='w-auto flex flex-col'>
						<h3 className='mb-3 text-lg font-semibold '>Report Content</h3>
						<hr />
						<div
							className='h-[75vh] border-l-4 border-sky-500 border-opacity-60 overflow-auto pr-1'
							onMouseUp={handleMouseUp}
						>
							{getTaggedText().map((part, index) => (
								<span
									key={index}
									onClick={event => handleTextClick(part.text, event)}
									className={part.tag ? 'tagged-text' : ''}
								>
									{part.text}
								</span>
							))}
						</div>
					</section>
				</main>

				{showPopup && (
					<div
						className='absolute'
						style={{ left: showPopup.x, top: showPopup.y }}
					>
						<div className='bg-white border border-gray-300 shadow-md p-2 rounded'>
							{Object.keys(tagsMappings).map(tag => (
								<button
									key={tag}
									onClick={() => selectTag(tag)}
									className='block text-left w-full hover:bg-gray-100 p-1'
								>
									{tagsMappings[tag]}
								</button>
							))}
						</div>
					</div>
				)}
				{showRemoveTagPopup && (
					<div
						className='absolute'
						style={{ left: showRemoveTagPopup.x, top: showRemoveTagPopup.y }}
					>
						<div className='bg-white border border-gray-300 shadow-md p-2 rounded'>
							<p>Remove tag: {showRemoveTagPopup.text}?</p>
							<button
								onClick={() => removeTag(showRemoveTagPopup.text)}
								className='bg-red-500 text-white rounded px-2 py-1 hover:bg-red-700'
							>
								Yes
							</button>
							<button
								onClick={() => setShowRemoveTagPopup(null)}
								className='bg-gray-300 rounded px-2 py-1 hover:bg-gray-400'
							>
								No
							</button>
						</div>
					</div>
				)}

				<section className='mt-5'>
					<h3 className='text-lg font-semibold '>Add Relationship</h3>
					<div className='flex flex-col gap-3'>
						<select
							name='source_ref'
							value={newRelationship.source_ref}
							onChange={handleSourceChange}
						>
							<option value=''>Select Source</option>
							{Object.keys(selections).map(text => (
								<option key={text} value={text}>
									{text}
								</option>
							))}
						</select>
						<select
							name='target_ref'
							value={newRelationship.target_ref}
							onChange={handleInputChange}
						>
							<option value=''>Select Target</option>
							{getTargetOptions().map((target: any) => (
								<option key={target.id} value={target.name}>
									{target.name}
								</option>
							))}
						</select>
						<input
							type='text'
							name='relationship_type'
							placeholder='Relationship Type'
							value={newRelationship.relationship_type}
							onChange={handleInputChange}
						/>
						<button
							onClick={handleAddRelationship}
							className='bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700'
						>
							Add Relationship
						</button>
					</div>
				</section>
			</div>
		</>
	)
}

export default ModifyReport
