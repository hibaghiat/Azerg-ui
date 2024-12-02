'use client'
import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Upload() {
	const [file, setFile] = useState(null)
	const [url, setUrl] = useState('')
	const [uploadProgress, setUploadProgress] = useState(0)
	const [isUploading, setIsUploading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [uploadCompleteMessage, setUploadCompleteMessage] = useState('')
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const router = useRouter()

	const checkAuthentication = async () => {
		const response = await fetch('http://localhost:3000/api/reports?limit=10', {
			method: 'GET',
			credentials: 'include',
		})

		if (response.ok) {
			setIsAuthenticated(true)
		} else {
			setIsAuthenticated(false)
			router.push('/login')
		}
	}

	useEffect(() => {
		checkAuthentication()
	}, [])

	const handleFileChange = event => {
		const selectedFile = event.target.files[0]
		if (selectedFile) {
			const allowedTypes = ['application/octet-stream', 'application/json', 'application/pdf', 'text/plain']
			if (!allowedTypes.includes(selectedFile.type)) {
				setErrorMessage(
					'Invalid file type. Please upload a binary file, CAPE Report in JSON format, PDF, or text file.',
				)
				setFile(null)
			} else {
				setFile(selectedFile)
				setUploadProgress(0)
				setIsUploading(false)
				setErrorMessage('')
			}
		}
	}

	const handleUpload = () => {
		if (file || url) {
			setIsUploading(true)
			const formData = new FormData()
			if (file) {
				formData.append('file', file)
			} else if (url) {
				formData.append('url', url)
			}

			const xhr = new XMLHttpRequest()
			xhr.open('POST', 'http://localhost:3000/api/reports/upload')

			xhr.upload.onprogress = event => {
				if (event.lengthComputable) {
					const percentComplete = Math.round((event.loaded * 100) / event.total)
					setUploadProgress(percentComplete)
				}
			}

			xhr.onload = () => {
				if (xhr.status === 200) {
					setUploadCompleteMessage('Upload complete!')
					setUploadProgress(0)
					setFile(null)
					setUrl('')
					setIsUploading(false)
					setTimeout(() => {
						setUploadCompleteMessage('')
					}, 5000)
				} else {
					setErrorMessage('Upload failed. Please try again.')
					setIsUploading(false)
				}
			}

			xhr.onerror = () => {
				setErrorMessage('Upload failed. Please check the server and network.')
				setIsUploading(false)
			}

			xhr.send(formData)
		}
	}

	return (
		<>
			<header>
				<title>Upload - AZERG</title>
				<meta name='description' content='Upload page for AZERG' />
			</header>
			{isAuthenticated && (
				<div className='flex flex-col items-center justify-center h-screen gap-12 px-4 md:px-0'>
					<div className='text-center space-y-4'>
						<h1 className='text-3xl font-bold md:text-4xl'>Upload a File</h1>
						<p className='text-gray-500 dark:text-gray-400 max-w-md'>
							Securely upload and track your files with our enterprise-grade platform.
						</p>
					</div>
					<div className='w-full max-w-md space-y-6 bg-white dark:bg-gray-950 rounded-2xl shadow-lg p-8'>
						<div className='relative grid gap-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 cursor-pointer transition-colors hover:border-gray-400 dark:hover:border-gray-600'>
							<div className='flex flex-col items-center justify-center space-y-4'>
								<UploadIcon className='h-10 w-10 text-gray-400' />
								<div className='space-y-1'>
									<h3 className='text-lg text-center font-semibold'>
										Drag and drop a file
									</h3>
									<p className='text-gray-500 dark:text-gray-400'>
										or click to select a file to upload
									</p>
								</div>
							</div>
							<input
								className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
								type='file'
								accept='.bin,application/octet-stream,application/json,application/pdf,text/plain'
								onChange={handleFileChange}
							/>
						</div>
						<div className='text-center my-4 text-gray-500 dark:text-gray-400'>
							OR
						</div>
						<div className='relative grid gap-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 transition-colors'>
							<div className='flex flex-col items-center justify-center space-y-4'>
								<div className='space-y-1 w-full'>
									<h3 className='text-lg text-center font-semibold'>
										Enter a URL
									</h3>
									<input
										className='w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 h-12'
										type='url'
										placeholder='https://example.com/report.pdf'
										value={url}
										onChange={e => setUrl(e.target.value)}
									/>
								</div>
							</div>
						</div>
						{errorMessage && (
							<div className='text-red-500 dark:text-red-400 text-sm'>
								{errorMessage}
							</div>
						)}
						{file && (
							<div className='space-y-4'>
								<div className='text-sm text-gray-600 dark:text-gray-300'>
									Selected file: <strong>{file['name']}</strong>
								</div>
							</div>
						)}
						{uploadCompleteMessage && (
							<div className='text-green-500 dark:text-green-400 text-sm'>
								{uploadCompleteMessage}
							</div>
						)}
						{isUploading && (
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<span className='text-sm font-medium'>Uploading...</span>
									<span className='text-sm font-medium'>{uploadProgress}%</span>
								</div>
								<Progress className='h-3 rounded-full' value={uploadProgress} />
							</div>
						)}
						<Button
							className='w-full'
							onClick={handleUpload}
							disabled={(!file && !url) || isUploading}
						>
							{isUploading ? 'Uploading...' : 'Upload'}
						</Button>
					</div>
				</div>
			)}
		</>
	)
}


function UploadIcon(props) {
	return (
		<svg
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
			<polyline points='17 8 12 3 7 8' />
			<line x1='12' x2='12' y1='3' y2='15' />
		</svg>
	)
}
