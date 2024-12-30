'use client'

import React, { useEffect } from 'react';
import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import LanguageSelector from '../components/LanguageSelector';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { use } from 'i18next';
 

const navigation = [
  { name: 'Home', to: '/' },
  { name: 'Workshop', to: '/workshop' },
  { name: 'DirectionSign', to: '/products/directionsign' },
  { name: 'BoxLetter', to: '/products/letterbox' },
]


function Head() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false);
  const { t } = useTranslation();
  /* GET page name */
  const path = useLocation();
  //const [isWhite, setIsWhite] = useState(path.pathname === '/' && !scrolling);
  const [isWhite, setIsWhite] = useState(false);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 20) {
      setScrolling(true);
      setIsWhite(false);
    } else {
      setScrolling(false);
      if (path.pathname === '/')
        setIsWhite(false);
    }
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setScrolling(false);
    //setIsWhite(path.pathname === '/');
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [path]);

  return (
    <div className="bg-white">
      {/* <iframe className='absolute inset-0 h-full w-full' src="https://www.youtube.com/embed/XpuOYYMw9K0?autoplay=1&mute=1&controls=0&loop=1&playlist=XpuOYYMw9K0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"></iframe>
 */}
      <header className={`fixed ${scrolling ? 'scrolled': ''} inset-x-0 top-0 z-50 transition`}>
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <NavLink to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Table - Sign</span>
              <img
                alt=""
                src="https://teretryt.com/textures/logo.png"
                className="h-12 w-auto"
              />
            </NavLink>
            <LanguageSelector isWhite={isWhite}/>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${isWhite ? 'text-white' : 'text-gray-700'}`}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              /* if isWhite true remove text-gray-900 put text-white */
              <NavLink key={item.name} to={item.to} className={`text-sm font-semibold leading-6 ${isWhite ? 'text-white' : 'text-gray-900'}`}>
                {t("Header.nav." + item.name)}
              </NavLink>
            ))}
          </div>
          
          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-3 items-center">
            <NavLink to="/cart" className={`flex gap-2 p-2 rounded-full text-sm font-semibold leading-6 ${isWhite ? 'text-white border-2 border-indigo-50' : 'text-gray-900 bg-indigo-50'}`}>
              <svg className={`${isWhite ? 'stroke-white' : 'stroke-gray-900'} transition-all duration-500 group-hover:stroke-black`} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25" stroke="" strokeWidth="1.6" strokeLinecap="round"></path></svg>
              Sepetim
            </NavLink>
            <a href="#" className={`text-sm font-semibold leading-6 ${isWhite ? 'text-white' : 'text-gray-900'}`}>
              {t("Header.nav.login")} <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Table Sign</span>
                <img
                  alt=""
                  src="https://teretryt.com/textures/logo.png"
                  className="h-12 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {t("Header.nav." + item.name)}
                    </NavLink>
                  ))}
                </div>
                <div className="py-6">
                <NavLink to="/cart" className={`flex items-center gap-2 text-sm font-semibold leading-6`}>
                  <svg className={`stroke-gray-900 transition-all duration-500 group-hover:stroke-black`} xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M12.6892 21.125C12.6892 22.0225 11.9409 22.75 11.0177 22.75C10.0946 22.75 9.34632 22.0225 9.34632 21.125M19.3749 21.125C19.3749 22.0225 18.6266 22.75 17.7035 22.75C16.7804 22.75 16.032 22.0225 16.032 21.125M4.88917 6.5L6.4566 14.88C6.77298 16.5715 6.93117 17.4173 7.53301 17.917C8.13484 18.4167 8.99525 18.4167 10.7161 18.4167H18.0056C19.7266 18.4167 20.587 18.4167 21.1889 17.9169C21.7907 17.4172 21.9489 16.5714 22.2652 14.8798L22.8728 11.6298C23.3172 9.25332 23.5394 8.06508 22.8896 7.28254C22.2398 6.5 21.031 6.5 18.6133 6.5H4.88917ZM4.88917 6.5L4.33203 3.25" stroke="" strokeWidth="1.6" strokeLinecap="round"></path></svg>
                  <span className='text-md font-semibold'>Sepetim</span>
                </NavLink>
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {t("Header.nav.login")}
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </div>
  )
}

export default Head;