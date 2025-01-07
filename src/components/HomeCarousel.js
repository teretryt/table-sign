import { Button } from "@headlessui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function HomeCarousel() {
    const { t } = useTranslation();

    return (
      <>
        {/* <div 
          className="h-[730px] md:h-[960px] lg:h-[960px] w-full absolute inset-0"
          
        ></div> */}
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#f21119] to-[#9c060e] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div className="flex flex-wrap gap-5 justify-around w-full py-16 sm:py-32 lg:py-0 lg:pt-32">
            <div className="lg:flex-[2_2_0%] md:flex-[1_1_0%] flex-none w-full">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-900 ring-1 ring-gray-500/10 hover:ring-gray-900/20">
                  {t('Header.welcome')}.{' '}
                  <a href="#" className="font-semibold text-gray-900">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {t('Header.about')} <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  {t('Header.slideMessage')}
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-900">
                  3D Atölyemizde dilediğiniz Kutu Harf ve Tabelaları tasarlayıp önizleme yapabilme ayrıcalığına sahipsiniz.
                  <b>Tam Sürüm Çok Yakında - TabelaSign </b> 
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <Button
                    as={Link}
                    to="/workshop"
                    className="rounded-md border-2 border-black px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 duration-75"
                  >
                    Tasarlamaya Başla
                  </Button>
                  <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
                    {t('Header.aboutWorkshop')} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:flex-[3_3_0%] md:flex-[1_1_0%] flex-none w-full">
              <div className="flex flex-wrap gap-5">
                <div className=" rounded-lg p-6 h-96 flex-none xl:flex-1 w-full">
                  <iframe className='h-full w-full' src="https://www.youtube.com/embed/XpuOYYMw9K0?&mute=1&controls=0&loop=1&playlist=XpuOYYMw9K0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"></iframe>
                  <div className="flex justify-between items-center p-1">
                    <h3 className="text-2xl font-bold text-gray-900 px-3 py-1 rounded-lg">3D Atölye Tanıtım</h3>
                  </div>
                </div>

                <div className=" rounded-lg p-6 h-96 relative bottom-0 flex-none xl:flex-1 w-full xl:bottom-[-8rem]">
                <iframe className='h-full w-full' src="https://www.youtube.com/embed/XpuOYYMw9K0?&mute=1&controls=0&loop=1&playlist=XpuOYYMw9K0" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin"></iframe>
                  <div className="flex justify-between items-center p-1">
                    <h3 className="text-2xl font-bold text-gray-900 px-3 py-1 rounded-lg ">Nasıl Sipariş Veririm ?</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#f21119] to-[#9c060e] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
          <a href="#pageBottom" className="absolute left-1/2 top-[50rem] -translate-x-1/2 flex flex-col items-center justify-center gap-3">
            <button className="border-[2px] border-gray-200 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <i class="fa-solid fa-arrow-down text-xl text-gray-900"></i>
            </button>
            <span>Bizi Tanıyın</span>
          </a>
      </div>
      </>
    )
}

export default HomeCarousel;