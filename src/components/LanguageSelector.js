// src/components/LanguageSelector.js
import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const LanguageSelector = ({isWhite}) => {
  const { i18n, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setSelectedLang(lng);
  };

  return (
    <Menu as="div" className="relative inline-block text-left ml-5">
      <div>
        <MenuButton className={`inline-flex w-full justify-center gap-x-1.5 rounded-md bg-transparent px-3 py-2 text-sm font-semibold ${!isWhite ? "text-gray-900 hover:bg-gray-50" : "text-white hover:bg-gray-900"} shadow-sm`}>
          {t('languages.' + selectedLang)}
          <ChevronDownIcon aria-hidden="true" className={`-mr-1 h-5 w-5 ${!isWhite ? "text-gray-900" : "text-white"}`} />
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <MenuItem>
              <button
                onClick={() => changeLanguage('tr')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {t('languages.tr')}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => changeLanguage('en')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {t('languages.en')}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                onClick={() => changeLanguage('fr')}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                {t('languages.fr')}
              </button>
            </MenuItem>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageSelector;
