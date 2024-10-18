/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/

import React from 'react'

const categories = [
    {
      id: 1,
      name: 'Özel Tabelalar',
      href: '#',
      imageSrc: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ffiles.printo.in%2Fsite%2F20221109_134012135481_c784e4_ASB_CP.jpeg&f=1&nofb=1&ipt=4bbb9264d12a780c38e5e03b204ce38a0edeedaf073be9b17d884549bfb20d49&ipo=images',
      imageAlt: "Front of men's Basic Tee in black.",
    },
    {
      id: 1,
      name: 'Yol Tabelaları',
      href: '#',
      imageSrc: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fgoodmockups.com%2Fwp-content%2Fuploads%2F2019%2F04%2FFree-Highway-Wayfinding-Signage-Board-Mockup-PSD.jpg&f=1&nofb=1&ipt=3e2cd3c9dea5196f8418d60b30c25e2a0a708b28cc7099fa17f0e091d9a64772&ipo=images',
      imageAlt: "Front of men's Basic Tee in black.",
    }
    // More products...
  ]
  
  function CategoriesView() {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8"> 
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Tabela Çeşitleri</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
            {categories.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h2 className="text-md text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default CategoriesView;