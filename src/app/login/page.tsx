'use client'
import React, { Suspense, useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import Logo from '@/assets/images/shield.png'
import SignUpForm from './components/SignUpForm'
import '@/app/globals.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
const VerifyEmail = React.lazy(() => import('./components/VerifyEmail'))

export default function Page() {
	const imageUrl = Logo.src
	const [isSigningUp, setShowSignUp] = useState(false)
	const [showEmailDialog, setShowEmailDialog] = useState(false)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [email, setEmail] = useState('')
	const router = useRouter()

	useEffect(() => {
		const fetchReports = async () => {
			const response = await fetch(
				'http://localhost:3000/api/reports?limit=0',
				{
					method: 'GET',
					credentials: 'include',
				},
			)

			if (response.ok) {
				setIsAuthenticated(true)
				router.push('/')
			} else {
				setIsAuthenticated(false)
			}
		}

		fetchReports()
	}, [])

	const handleSignUpSuccess = email => {
		setEmail(email)
		setShowEmailDialog(true)
	}

	return (
		<>
			<header>
				<title>Login / Sign-up - AZERG</title>
				<meta name='description' content='Login / Sign-up page for AZERG' />
			</header>
			<div className='flex flex-col h-screen overflow-hidden'>
				<div className='flex-grow md:flex md:flex-row'>
					<div className='hidden md:flex h-full w-1/2 bg-primary justify-center items-center'>
						<Image
							width='400'
							height='400'
							src={imageUrl}
							alt='A shield icon'
							className='object-contain'
						/>
					</div>

					<div className='w-full md:w-1/2 h-full overflow-auto'>
						{isSigningUp ? (
							<SignUpForm className='' onSignUpSuccess={handleSignUpSuccess}>
								<p className='text-center text-sm text-gray-500'>
									Already have an account?{' '}
									<button
										className='font-semibold leading-6 text-primary hover:text-primary-hover'
										onClick={e => setShowSignUp(false)}
									>
										Log in
									</button>
								</p>
							</SignUpForm>
						) : (
							<LoginForm className=''>
								<p className='text-center text-sm text-gray-500'>
									Not a member?{' '}
									<button
										className='font-semibold leading-6 text-primary hover:text-primary-hover'
										onClick={e => setShowSignUp(true)}
									>
										Register
									</button>
								</p>
							</LoginForm>
						)}
					</div>
				</div>
				{showEmailDialog && (
					<VerifyEmail
						email={email}
						openModal={showEmailDialog}
						setOpenModal={setShowEmailDialog}
					></VerifyEmail>
				)}
			</div>
		</>
	)
}
