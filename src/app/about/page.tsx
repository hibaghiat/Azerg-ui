'use client'
import logo from '../../assets/images/about.png'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useEffect } from 'react'
import { FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa'

export default function Component() {
	useEffect(() => {
		document.documentElement.style.scrollBehavior = 'smooth'
	}, [])

	return (
		<>
			<header>
				<title>About - AZERG</title>
				<meta name='description' content='About page for AZERG' />
			</header>
			<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
				<div className='container px-4 md:px-6'>
					<div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
						<div className='flex flex-col justify-center space-y-4'>
							<div className='space-y-2'>
								<h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
									About AZERG
								</h1>
								<p className='max-w-[600px] text-muted-foreground md:text-xl'>
									AZERG is a leading technology company that specializes in
									providing innovative solutions to businesses of all sizes. Our
									mission is to empower our clients with the tools and resources
									they need to succeed in the digital age.
								</p>
							</div>
						</div>
						<Image
							src={logo}
							alt='About'
							width={550}
							height={550}
							className='aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square'
						/>
					</div>
				</div>
			</section>
			<section className='w-full py-12 md:py-24 lg:py-32'>
				<div className='container px-4 md:px-6'>
					<div className='space-y-4 text-center'>
						<div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
							Our Leadership Team
						</div>
						<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
							Meet the Experts Behind AZERG
						</h2>
					</div>
					<div className='grid gap-6 py-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						<div className='flex flex-col items-center justify-center space-y-2'>
							<Avatar>
								<AvatarImage src='/placeholder-user.jpg' />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
							<div className='space-y-1 text-center'>
								<h3 className='text-lg font-bold'>John Doe</h3>
								<p className='text-sm text-muted-foreground'>
									CEO and Co-Founder
								</p>
							</div>
						</div>
						<div className='flex flex-col items-center justify-center space-y-2'>
							<Avatar>
								<AvatarImage src='/placeholder-user.jpg' />
								<AvatarFallback>JS</AvatarFallback>
							</Avatar>
							<div className='space-y-1 text-center'>
								<h3 className='text-lg font-bold'>Jane Smith</h3>
								<p className='text-sm text-muted-foreground'>
									CTO and Co-Founder
								</p>
							</div>
						</div>
						<div className='flex flex-col items-center justify-center space-y-2'>
							<Avatar>
								<AvatarImage src='/placeholder-user.jpg' />
								<AvatarFallback>MJ</AvatarFallback>
							</Avatar>
							<div className='space-y-1 text-center'>
								<h3 className='text-lg font-bold'>Michael Johnson</h3>
								<p className='text-sm text-muted-foreground'>
									Chief Operating Officer
								</p>
							</div>
						</div>
						<div className='flex flex-col items-center justify-center space-y-2'>
							<Avatar>
								<AvatarImage src='/placeholder-user.jpg' />
								<AvatarFallback>SL</AvatarFallback>
							</Avatar>
							<div className='space-y-1 text-center'>
								<h3 className='text-lg font-bold'>Sarah Lee</h3>
								<p className='text-sm text-muted-foreground'>
									Chief Marketing Officer
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
			<section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
				<div className='container px-4 md:px-6'>
					<div className='grid gap-8 md:grid-cols-2'>
						<div className='space-y-2'>
							<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl mb-5'>
								Our Mission
							</h2>
							<p className='max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
								Our mission is to empower individuals and organizations to
								achieve their goals through innovative and user-centric
								solutions. We strive to create products and services that make a
								positive impact on the world.
							</p>
						</div>
						<div className='space-y-2'>
							<h2 className='text-3xl font-bold tracking-tighter sm:text-5xl mb-5'>
								Our Values
							</h2>
							<ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								<li className='flex items-start gap-4'>
									<div className='rounded-md p-3 flex items-center justify-center'>
										<FaLightbulb className='h-6 w-6' />
									</div>
									<div>
										<h3 className='text-xl font-bold'>Innovation</h3>
										<p className='text-muted-foreground'>
											Continuously innovating with new technologies.
										</p>
									</div>
								</li>
								<li className='flex items-start gap-4'>
									<div className='rounded-md p-3 flex items-center justify-center'>
										<FaUsers className='h-6 w-6' />
									</div>
									<div>
										<h3 className='text-xl font-bold'>Collaboration</h3>
										<p className='text-muted-foreground'>
											Emphasizing teamwork for client success.
										</p>
									</div>
								</li>
								<li className='flex items-start gap-4'>
									<div className='rounded-md p-3 flex items-center justify-center'>
										<FaRocket className='h-6 w-6' />
									</div>
									<div>
										<h3 className='text-xl font-bold'>Impact</h3>
										<p className='text-muted-foreground'>
											Creating impactful solutions.
										</p>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
