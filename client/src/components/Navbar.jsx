    import React, { useEffect, useState } from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { assets } from '../assets/assets';
    import { useClerk, useUser, UserButton } from '@clerk/clerk-react';

    const PhoneIcon = () => (
    <svg className="w-4 h-4 text-inherit" viewBox="0 0 24 24" fill="none">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3.11 5.18 2 2 0 0 1 5.1 3h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.57 2.5a2 2 0 0 1-.45 2.11L9 10a16 16 0 0 0 5 5l.67-1.22a2 2 0 0 1 2.11-.45c.8.27 1.64.45 2.5.57A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    );

    const MailIcon = () => (
    <svg className="w-4 h-4 text-inherit" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
        <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    );

    const BookIcon = () => (
    <svg className="w-4 h-4 text-inherit" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
    </svg>
    );

    const Navbar = () => {
    const navLinks = [
        { name: 'Offers', path: '/' },
        { name: 'Accomodations', path: '/rooms' },
        { name: 'Dining', path: '/' },
        { name: 'Experiences', path: '/' },
        { name: 'Festive', path: '/' },
        { name: 'Wellness', path: '/' },
        { name: 'About', path: '/' }
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { openSignIn } = useClerk();
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const update = () => setIsScrolled(window.scrollY > 10);
        // set initial state on mount + on route change
        update();
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, [location.pathname]); // rerun when route changes

    return (
        <nav
        className={`
            fixed top-0 left-0 w-full z-50 transition-all duration-500
            ${isScrolled
            ? 'bg-white/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur shadow-sm text-gray-800'
            : 'bg-transparent text-white hover:bg-white/95 hover:text-gray-800 hover:shadow-md'
            }
        `}
        >
        {/* Top utility + brand row */}
        <div className="px-4 md:px-10 lg:px-16 xl:px-24">
            <div className="hidden md:grid grid-cols-3 items-center py-3 text-inherit">
            {/* Left utilities */}
            <div className="flex items-center gap-6 text-[13px] tracking-wide text-inherit">
                <button className="flex items-center gap-1 hover:opacity-70">
                <span className="uppercase">EN</span>
                <span>▾</span>
                </button>
                <span className="flex items-center gap-2 hover:opacity-70 cursor-default">
                <PhoneIcon />
                </span>
                <span className="flex items-center gap-2 hover:opacity-70 cursor-default">
                <MailIcon />
                </span>
                <button className="uppercase tracking-[0.3em] text-[12px] hover:opacity-70">
                Newsletter
                </button>
            </div>

            {/* Brand center */}
            <div className="flex justify-center">
                <Link to="/" className="select-none">
                <span className="font-serif italic text-xl md:text-2xl font-black text-inherit">
                    HeavensRide
                </span>
                </Link>
            </div>

            {/* Right: search + auth + dashboard */}
            <div className="flex items-center justify-end gap-4 text-inherit">
                <img
                src={assets.searchIcon}
                alt="search"
                className={`h-6 opacity-80 hover:opacity-100 transition ${isScrolled ? '' : 'invert'}`}
                />

                {user ? (
                <div className="flex items-center gap-3">
                    <button
                    className="border px-4 py-1 text-sm rounded-full text-inherit"
                    onClick={() => navigate('/owner')}
                    >
                    DashBoard
                    </button>
                    <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Action
                        label="My Bookings"
                        labelIcon={<BookIcon />}
                        onClick={() => navigate('/my-bookings')}
                        />
                    </UserButton.MenuItems>
                    </UserButton>
                </div>
                ) : (
                <button
                    onClick={openSignIn}
                    className={`px-6 py-2 rounded-full text-sm ${isScrolled ? 'bg-black text-white' : 'bg-white text-black'}`}
                >
                    Login
                </button>
                )}
            </div>
            </div>

            {/* Mobile top row */}
            <div className="md:hidden flex items-center justify-between py-3 text-inherit">
            <Link to="/" className="flex items-center gap-3">
                <img
                width="32"
                height="32"
                src="https://img.icons8.com/ios/50/iolani-palace.png"
                alt="brand"
                className={`${isScrolled ? '' : 'invert-0'}`}
                />
                <span className="font-serif italic text-2xl text-inherit">One&amp;Only</span>
            </Link>

            <div className="flex items-center gap-3">
                {user && (
                <UserButton>
                    <UserButton.MenuItems>
                    <UserButton.Action
                        label="My Bookings"
                        labelIcon={<BookIcon />}
                        onClick={() => navigate('/my-bookings')}
                    />
                    </UserButton.MenuItems>
                </UserButton>
                )}
                <img
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                src={assets.menuIcon}
                alt="menu"
                className={`h-5 ${isScrolled ? '' : 'invert'}`}
                />
            </div>
            </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${isScrolled ? 'border-gray-200' : 'border-white/30'} transition-colors`} />

        {/* Centered nav row with dot separators */}
        <div className="px-4 md:px-10 lg:px-16 xl:px-24">
            <div className="hidden md:flex items-center justify-center gap-6 py-3 text-[13px] tracking-[0.25em] uppercase text-inherit">
            {navLinks.map((link, i) => (
                <React.Fragment key={link.name}>
                <Link to={link.path} className="hover:opacity-70">
                    {link.name}
                </Link>
                {i !== navLinks.length - 1 && <span className="opacity-60">•</span>}
                </React.Fragment>
            ))}
            </div>
        </div>

        {/* Mobile slide-out menu */}
        <div
            className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >
            <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
            <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
            </button>

            {navLinks.map((link) => (
            <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)}>
                {link.name}
            </Link>
            ))}

            <button
            className="border px-4 py-1 text-sm rounded-full"
            onClick={() => {
                setIsMenuOpen(false);
                navigate('/owner');
            }}
            >
            DashBoard
            </button>

            {!user && (
            <button
                onClick={openSignIn}
                className="bg-black text-white px-8 py-2.5 rounded-full transition"
            >
                Login
            </button>
            )}
        </div>
        </nav>
    );
    };

    export default Navbar;
