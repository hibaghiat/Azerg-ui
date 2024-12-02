import Link from 'next/link'
import Image from 'next/image'
import {
	NavigationMenu,
	NavigationMenuList,
	NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import Logo from '../assets/images/AzergLogo.png'
import DataSender from '@/utils/DataSender'
import { useRouter } from 'next/navigation'
import { useUser } from '@/utils/userContext'
import { FaBars, FaUser } from 'react-icons/fa'

export default function Navbar() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()
	const { userInfo, userProfile } = useUser()

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.pageYOffset
			setIsScrolled(scrollY > 0)
		}
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const handleLinkClick = () => {
		setIsOpen(false)
	}

	const handleSheetToggle = () => {
		setIsOpen(!isOpen)
	}

	const handleLogout = async () => {
		await DataSender.logout()
		delete localStorage['userId']
		window.location.href = '/'
	}

	return (
		<>
			<header
				className={`fixed top-0 z-50 w-full transition-all duration-300 ${
					isScrolled
						? 'h-14 bg-background shadow-md'
						: 'h-20 bg-background shadow-none'
				}`}
			>
				<div className='container flex h-full items-center justify-between px-4 md:px-6'>
					<Link href='/' className='flex items-center gap-2' prefetch={false}>
						<Image src={Logo} alt='About' width={40} height={40} />
						<span
							className={`text-lg font-bold transition-opacity duration-300 ${
								isScrolled ? 'opacity-0' : 'opacity-100'
							}`}
						>
							AZERG
						</span>
					</Link>
					<nav className='hidden items-center gap-4 text-sm font-medium md:flex'>
						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuLink asChild>
									<Link href='/'>
										<button className='group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:before:scale-x-100 hover:before:origin-left relative before:w-2/3 before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black before:absolute before:left-1/6 before:bottom-1'>
											Home
										</button>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href='/about'>
										<button className='group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:before:scale-x-100 hover:before:origin-left relative before:w-2/3 before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black before:absolute before:left-1/6 before:bottom-1'>
											About
										</button>
									</Link>
								</NavigationMenuLink>
								<NavigationMenuLink asChild>
									<Link href='/contact'>
										<button className='group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:before:scale-x-100 hover:before:origin-left relative before:w-2/3 before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black before:absolute before:left-1/6 before:bottom-1'>
											Contact
										</button>
									</Link>
								</NavigationMenuLink>
								{userInfo && userInfo['is_admin'] && (
									<NavigationMenuLink asChild>
										<Link href='/dashboard'>
											<button className='group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:before:scale-x-100 hover:before:origin-left relative before:w-2/3 before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black before:absolute before:left-1/6 before:bottom-1'>
												Dashboard
											</button>
										</Link>
									</NavigationMenuLink>
								)}
								{userInfo && userInfo['user_id'] && !userInfo['is_admin'] && (
									<NavigationMenuLink asChild>
										<Link href='/reports'>
											<button className='group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:before:scale-x-100 hover:before:origin-left relative before:w-2/3 before:h-[2px] before:origin-right before:transition-transform before:duration-300 before:scale-x-0 before:bg-black before:absolute before:left-1/6 before:bottom-1'>
												Reports
											</button>
										</Link>
									</NavigationMenuLink>
								)}
							</NavigationMenuList>
						</NavigationMenu>
					</nav>
					<div className='flex items-center gap-4'>
						{userInfo && userInfo['user_id'] ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Avatar className='h-9 w-9 hover:outline-primary'>
										{userProfile && userProfile['avatar'] && (
											<AvatarImage src={userProfile['avatar']} />
										)}
										<AvatarFallback className='hover:cursor-pointer'>
											{userProfile
												? userProfile['full_name']
														.split(' ')
														.map((part: string) => part[0])
														.join('')
														.toUpperCase()
														.slice(0, 2)
												: ''}
										</AvatarFallback>
										<span className='sr-only'>Toggle user menu</span>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>
										<Link href='/profile'>My Account</Link>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									{userInfo && userInfo['user_id'] && (
										<DropdownMenuItem onClick={handleLogout}>
											Logout
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link href='/login' prefetch={true}>
								<button className='ml-auto h-9 px-4 text-sm font-medium transition-colors rounded-md bg-primary text-white hover:bg-primary-hover cursor-pointer'>
									Login
								</button>
							</Link>
						)}
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button
									variant='outline'
									size='icon'
									className='md:hidden'
									onClick={handleSheetToggle}
								>
									<FaBars className='h-6 w-6' />
									<span className='sr-only'>Toggle navigation menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side='right'>
								<div className='grid gap-2 py-6'>
									<Link href='/about'>
										<button
											className='flex w-full items-center py-2 text-lg font-semibold'
											onClick={handleLinkClick}
										>
											About
										</button>
									</Link>
									<Link href='/contact'>
										<button
											className='flex w-full items-center py-2 text-lg font-semibold'
											onClick={handleLinkClick}
										>
											Contact
										</button>
									</Link>
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
		</>
	)
}
