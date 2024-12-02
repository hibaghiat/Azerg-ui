import React from 'react'
import { Button } from '@/components/ui/button'

interface SearchBarProps {
	searchTerm: string
	setSearchTerm: (term: string) => void
	handleSearch: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
	searchTerm,
	setSearchTerm,
	handleSearch,
}) => {
	return (
		<>
			<input
				type='text'
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				className='px-2 py-2 border border-gray-300 rounded-md focus:outline-none'
				placeholder='Search reports...'
				style={{ width: '50%' }}
			/>
			<Button
				onClick={handleSearch}
				className='ml-2 px-3 py-2 font-semibold rounded-md focus:outline-none'
			>
				Search
			</Button>
		</>
	)
}

export default SearchBar
