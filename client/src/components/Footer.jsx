import React from 'react' 
import { assets } from '../assets/assets'
const Footer = () => {
    return (
    <div className='bg-white text-gray - 500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between items-center gap-12 md:gap-6'>
                <div className='max-w-80'>
                
                <div className='flex items-center gap-3 mb-4'>

                <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios/50/iolani-palace.png"
                alt="iolani-palace"
                />
                <h1
                className='ml-3 font-magneto text-2xl text-black'
                >
                HeavensInn
                </h1>
                </div>
                    <p>Where comfort meets class
                    <br/>Experience the art of hospitality     </p>
                    
                    <div className='flex items-center gap-3 mt-4'>
                        <img src={assets.instagramIcon} alt='instagram-icon'className='w-6 '/>
                        <img src={assets.facebookIcon} alt='instagram-icon'className='w-6'/>
                        <img src={assets.twitterIcon} alt='instagram-icon'className='w-6'/>
                        <img src={assets.linkendinIcon} alt='instagram-icon'className='w-6'/>
                    </div>
                </div>

                <div>
                    <p className='text-lg text-white'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm text-white'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                        <li><a href="#">Partners</a></li>
                    </ul>
                </div>

                <div>
                    <p className='text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div>
                    <p className='text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>
                <div>
                    <p className='text-lg text-gray-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>


                
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} HeavensInn. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
    )
}

export default Footer
