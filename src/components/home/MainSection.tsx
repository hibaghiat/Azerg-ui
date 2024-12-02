import React from 'react'
import Link from 'next/link'

export default function MainSection() {
	return (
		<section className='relative w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary to-primary/80'>
			<div className='ocean'>
				<div className='wave'></div>
				<div className='wave'></div>
			</div>
			<div className='relative container px-4 md:px-6 space-y-6 text-center text-primary-foreground'>
				<h1 className='text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl'>
					Welcome to AZERG
				</h1>
				<p className='max-w-[700px] mx-auto text-lg md:text-xl'>
					Unlock new levels of efficiency and productivity with our STIX Reports
					Generator
				</p>
				<div className='flex justify-center space-x-4'>
					<Link
						href='/upload'
						className='inline-flex mb-36 md:mb-56 h-12 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
					>
						Analyze Report
					</Link>
					<Link
						href='/about'
						className='inline-flex h-12 items-center justify-center rounded-md bg-primary-foreground px-8 text-sm font-medium text-primary shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
					>
						Learn More
					</Link>
				</div>
			</div>
		</section>
	)
}
