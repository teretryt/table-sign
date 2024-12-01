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
  { name: 'AboutUs', to: '#' },
]


function Head() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolling, setScrolling] = useState(false);
  const { t } = useTranslation();
  /* GET page name */
  const path = useLocation();
  const [isWhite, setIsWhite] = useState(path.pathname === '/' && !scrolling);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 20) {
      setScrolling(true);
      setIsWhite(false);
    } else {
      setScrolling(false);
      setIsWhite(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* SAYFA DEĞİŞTİKÇE TETİKLENSİN VE PATH İ GÜNCELLESİN */
  useEffect(() => {
    setIsWhite(path.pathname === '/' && !scrolling);
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
                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
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
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a href="#" className={`text-sm font-semibold leading-6 ${isWhite ? 'text-white' : 'text-gray-900'}`}>
              Log in <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </nav>
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
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
                    <a
                      key={item.name}
                      as={Link}
                      href={item.to}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
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