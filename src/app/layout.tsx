'use client'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { UserProvider } from '@/utils/userContext'
import CookieConsentPopup from '@/components/home/CookieConsentPopup'

export default function RootLayout({ children }) {
	const pathname = usePathname()
	const [showLayout, setShowLayout] = useState(true)

	useEffect(() => {
		if (pathname.includes('/login')) {
			setShowLayout(false)
		} else {
			setShowLayout(true)
		}
	}, [pathname])

	return (
		<html lang='en'>
			<body className={`${inter.className} min-h-screen flex flex-col`}>
				<UserProvider>
					{showLayout && <Navbar />}
					{showLayout ? (
						<main className='main flex-grow min-h-screen'>{children}</main>
					) : (
						<main className='flex-grow min-h-screen'>{children}</main>
					)}
					<CookieConsentPopup />
					{showLayout && <Footer />}
				</UserProvider>
			</body>
		</html>
	)
}
