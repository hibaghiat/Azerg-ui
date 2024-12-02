import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FaUser } from 'react-icons/fa'

const team = [
	{
		name: 'Ahmed Lekssays',
		size: 'w-12 h-12 md:w-[60px] md:h-[60px] lg:w-12 lg:h-12',
	},
	{
		name: 'Maira Waheed',
		size: 'w-12 h-12 md:w-[55px] md:h-[55px] lg:w-12 lg:h-12',
	},
	{ name: 'Youssef Aly', size: 'w-12 h-12 md:w-12 md:h-12 lg:w-12 lg:h-12' },
	{
		name: 'Ali Zair',
		size: 'w-12 h-12 md:w-[50px] md:h-[50px] lg:w-12 lg:h-12',
	},
	{
		name: 'Omar Elshenhabi',
		size: 'w-12 h-12 md:w-[60px] md:h-[60px] lg:w-12 lg:h-12',
	},
	{
		name: 'Othman Ouzzani',
		size: 'w-12 h-12 md:w-[60px] md:h-[60px] lg:w-12 lg:h-12',
	},
	{
		name: 'Hiba Ghiat',
		size: 'w-12 h-12 md:w-[50px] md:h-[50px] lg:w-12 lg:h-12',
	},
]

export default function TeamSection() {
	return (
		<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
			<div className='container px-4 md:px-6 space-y-6 text-center'>
				<div className='space-y-4'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
						Meet our Team
					</h2>
					<p className='mx-auto text-muted-foreground md:text-xl'>
						We are a diverse team of professionals that are passionate about our
						work!
					</p>
				</div>
				<div
					className={`mt-12 grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-8`}
				>
					{team.map((person, index) => (
						<Card
							key={index}
							className='relative overflow-hidden shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105'
						>
							<CardContent className='flex items-center justify-center h-full p-4 md:p-8'>
								<FaUser
									className={`${person.size} text-blue-500 px-3 transition-transform duration-300 transform hover:scale-110`}
								/>
								<h3 className='text-xl font-bold'>{person.name}</h3>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
