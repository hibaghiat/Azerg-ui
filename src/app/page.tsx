import React from 'react'
import MainSection from '@/components/home/MainSection'
import FlowSection from '@/components/home/FlowSection'
import TeamSection from '@/components/home/TeamSection'
import CookieConsentPopup from '@/components/home/CookieConsentPopup'

export default function HomePage() {
	return (
		<>
			<header>
				<title>Home - AZERG</title>
				<meta name='description' content='Home page for AZERG' />
			</header>
			<div className='flex flex-col min-h-dvh'>
				<MainSection />
				<FlowSection />
				<TeamSection />
			</div>
		</>
	)
}
