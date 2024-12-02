import React, { useState, useEffect, useMemo } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
	ArrowDownTrayIcon,
	MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'
import {
	Report,
	formatTimestamp,
	getStatusBackgroundColor,
	getStatusIcon,
	truncateHash,
} from '@/app/reports/components/ReportUtils'
import Link from 'next/link'
import DataFetcher from '@/utils/DataFetcher'
import DataSender from '@/utils/DataSender'
import { DataTable } from '@/app/reports/components/data-table'
import { DataTableColumnHeader } from '@/app/dashboard/components/data-table-column-header'

interface ReportsListProps {
	searchTerm: string
	setReports: React.Dispatch<React.SetStateAction<Report[]>>
}

const ReportsList: React.FC<ReportsListProps> = ({
	searchTerm,
	setReports,
}) => {
	const [allReports, setAllReports] = useState<Report[]>([])
	const [displayedReports, setDisplayedReports] = useState<Report[]>([])
	const [reportsShownCount, setReportsShownCount] = useState(10)
	const [loading, setLoading] = useState(false)
	const [hasMore, setHasMore] = useState(true)
	const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
	const [skip, setSkip] = useState(0)

	const fetchTagNames = async (
		tagIds: string[],
	): Promise<{ [key: string]: { name: string; id: string } }> => {
		try {
			const tags = await DataFetcher.fetchTagsByIds(tagIds)
			const tagMapping = tags.reduce((map, tag) => {
				map[tag.tag_id] = { name: tag.tag_name, id: tag.tag_id }
				return map
			}, {} as { [key: string]: { name: string; id: string } })
			return tagMapping
		} catch (error) {
			console.error('Failed to fetch tag names:', error)
			return {}
		}
	}

	const fetchReports = async (limit: number, skip: number) => {
		setLoading(true)
		try {
			const data = await DataFetcher.fetchReports(limit, skip, searchTerm)
			const tagIds = data.flatMap(report => report.tags)
			const tagMap = await fetchTagNames(tagIds)

			const formattedReports = await Promise.all(
				data.map(async report => ({
					...report,
					timestamp: formatTimestamp(report.timestamp),
					tags: report.tags.map(tagId => tagMap[tagId]?.name || 'Unknown Tag'),
					tagDetails: report.tags.map(tagId => tagMap[tagId]),
				})),
			)

			if (skip === 0) {
				setAllReports(formattedReports)
				setDisplayedReports(formattedReports)
			} else {
				setAllReports(prevReports => [...prevReports, ...formattedReports])
				setDisplayedReports(prevReports => [
					...prevReports,
					...formattedReports,
				])
			}

			setHasMore(data.length === limit)
			setLastUpdate(new Date())
		} catch (error) {
			console.error('Failed to fetch reports:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchReports(10, 0)

		const interval = setInterval(() => fetchReports(10, 0), 30000)
		return () => clearInterval(interval)
	}, [searchTerm])

	useEffect(() => {
		fetchReports(reportsShownCount, skip)

		const interval = setInterval(
			() => fetchReports(reportsShownCount, skip),
			30000,
		)
		return () => clearInterval(interval)
	}, [searchTerm, reportsShownCount, skip])

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [hasMore, loading])

	const handleScroll = () => {
		if (
			window.innerHeight + document.documentElement.scrollTop >=
				document.documentElement.offsetHeight - 10 &&
			hasMore &&
			!loading
		) {
			setReportsShownCount(prevReportsPerPage => prevReportsPerPage + 10)
		}
	}

	const createNewTags = async (newTags: string[], reportId: string) => {
		try {
			for (const tag of newTags) {
				console.log('Creating tag:', { tag_name: tag, tag_description: '' })
				await DataSender.createTag(tag, reportId)
			}
		} catch (error) {
			console.error('Failed to create new tags:', error)
		}
	}

	const columns = useMemo<ColumnDef<Report, any>[]>(
		() => [
			{
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title='Title' />
				),
				accessorKey: 'title',
			},
			{
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title='Hash' />
				),
				accessorKey: 'hash',
				cell: info => truncateHash(info.getValue()),
			},
			{
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title='Submission Time' />
				),
				accessorKey: 'timestamp',
			},
			{
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title='Tags' />
				),
				accessorKey: 'tagDetails',
				cell: info => {
					const [isEditing, setIsEditing] = useState(false)
					const [tags, setTags] = useState<{ name: string; id: string }[]>(
						info.getValue() as { name: string; id: string }[],
					)

					const handleDoubleClick = () => setIsEditing(true)
					const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
						setTags(
							event.target.value
								.split(',')
								.map(tag => ({ name: tag.trim(), id: '' })),
						)
					}
					const handleKeyDown = async (
						event: React.KeyboardEvent<HTMLInputElement>,
					) => {
						if (event.key === 'Enter') {
							setIsEditing(false)
							const currentTags = info.getValue() as {
								name: string
								id: string
							}[]
							const newTags = tags.filter(
								tag => !currentTags.some(t => t.name === tag.name),
							)
							const removedTags = currentTags.filter(
								tag => !tags.some(t => t.name === tag.name),
							)
							const reportId = info.row.original.report_id

							// Log values for debugging
							console.log(
								'Deleting tags:',
								removedTags,
								'from report:',
								reportId,
							)

							// Create new tags
							await createNewTags(
								newTags.map(tag => tag.name),
								reportId,
							)

							// Delete removed tags
							for (const tag of removedTags) {
								try {
									await DataSender.deleteTagFromReport(tag.id, reportId)
								} catch (error) {
									console.error(
										`Failed to delete tag ${tag.id} from report ${reportId}:`,
										error,
									)
								}
							}
						}
					}

					return isEditing ? (
						<input
							type='text'
							value={tags.map(tag => tag.name).join(', ')}
							onChange={handleChange}
							onKeyDown={handleKeyDown}
							onBlur={() => setIsEditing(false)}
							className='inline-block bg-blue-100 text-blue-500 px-2 py-1 rounded-full text-xs font-medium'
							style={{ minWidth: '200px' }}
						/>
					) : (
						<div
							className='mt-2 flex flex-wrap gap-2'
							onDoubleClick={handleDoubleClick}
						>
							{tags.length > 0 ? (
								tags.map((tag, index) => (
									<div
										key={index}
										className='inline-block bg-blue-100 text-blue-500 px-2 py-1 rounded-full text-xs font-medium'
									>
										{tag.name}
									</div>
								))
							) : (
								<div className='inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium'>
									No Tag
								</div>
							)}
						</div>
					)
				},
			},
			{
				header: ({ column }) => (
					<DataTableColumnHeader column={column} title='Status' />
				),
				accessorKey: 'status',
				cell: info => {
					const status = info.getValue()
					return (
						<div
							className={`px-2 py-1 rounded-full text-xs font-medium flex items-center justify-center ${getStatusBackgroundColor(
								status,
							)}`}
						>
							{getStatusIcon(status)}
							{status}
						</div>
					)
				},
			},
			{
				header: 'Actions',
				cell: info => {
					const report = info.row.original as Report
					return (
						<div className='flex items-center gap-4'>
							<Link href={`/reports/${report.report_id}`} passHref>
								<Button
									variant='outline'
									className='p-2 hover:bg-blue-400 hover:text-white'
								>
									<MagnifyingGlassIcon className='w-4 h-4' />
									<span className='text-sm pl-1'>View</span>
								</Button>
							</Link>
							<Link href={`/reports/${report.report_id}/download`} passHref>
								<Button
									variant='outline'
									className='p-2 hover:bg-blue-400 hover:text-white'
								>
									<ArrowDownTrayIcon className='w-4 h-4' />
									<span className='text-sm pl-1'>Download</span>
								</Button>
							</Link>
						</div>
					)
				},
			},
		],
		[],
	)

	return (
		<div>
			<DataTable data={displayedReports} columns={columns} />
		</div>
	)
}

export default ReportsList
