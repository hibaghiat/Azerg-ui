import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FaUpload, FaCog, FaBrain, FaFileAlt } from 'react-icons/fa'

const howItWorks = [
	{
		title: '1. Upload Malware',
		desc: 'Submit the malware file for analysis.',
		Icon: FaUpload,
		iconSize: 'w-8 h-8 lg:w-10 lg:h-10',
		iconColor: 'text-primary',
	},
	{
		title: '2. Analysis Engine',
		desc: 'Our engine processes the malware in a sandboxed environment.',
		Icon: FaCog,
		iconSize: 'w-16 h-16 lg:w-20 lg:h-20',
		iconColor: 'text-primary',
	},
	{
		title: '3. Leverage LLM',
		desc: 'Leverages our large language model for analysis.',
		Icon: FaBrain,
		iconSize: 'w-12 h-12 lg:w-16 lg:h-16',
		iconColor: 'text-primary',
	},
	{
		title: '4. Generate Report',
		desc: 'Receive a detailed report of the analysis.',
		Icon: FaFileAlt,
		iconSize: 'w-8 h-8 lg:w-10 lg:h-10',
		iconColor: 'text-primary',
	},
]

export default function FlowSection() {
	return (
		<section className='w-full py-12 md:py-24 lg:py-32'>
			<div className='container px-4 md:px-6 space-y-8'>
				<div className='text-center space-y-4'>
					<h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
						How it works
					</h2>
					<p className='mx-auto text-muted-foreground md:text-xl py-4'>
						Our cutting-edge STIX Reports Generator leverages the power of large
						language models to generate reports in a matter of seconds!
					</p>
				</div>
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
					{howItWorks.map((step, index) => (
						<Card
							key={index}
							className='relative overflow-hidden shadow-md rounded-lg transition-transform duration-300 transform hover:scale-105'
						>
							<CardContent className='flex items-center justify-center h-full p-8'>
								<step.Icon
									className={`${step.iconSize} ${step.iconColor} transition-transform duration-300 transform hover:scale-110`}
								/>
								<div className='ml-4'>
									<h3 className='text-xl font-bold'>{step.title}</h3>
									<p className='text-muted-foreground'>{step.desc}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	)
}
