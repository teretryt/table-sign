import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CartPage = () => {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const SERVER_URI = 'https://teretryt.com';
    const API_URL = 'https://teretryt.com/v1/api';
    const [fetchedProducts, setFetchedProducts] = useState([]);
    const { t } = useTranslation();


    useEffect(() => {
        const fetchCart = async () => {
            const products = []; // Burada tüm ürünleri tutacağız
            for (const item of cart) {  // forEach yerine for...of kullanıyoruz
                const response = await fetch(`${API_URL}/${item.category}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                ${item.category}(id: ${item.id}) {
                                    id
                                    name
                                    type
                                    sizes
                                    prices
                                    props
                                    files
                                    selected_image
                                }
                            }`
                    }),
                });
    
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
                const data = await response.json();
                
                // Veriyi işleme
                data.data.letterbox.map((product) => {
                    product.sizes = JSON.parse(product.sizes);
                    product.prices = JSON.parse(product.prices);
                    product.props = JSON.parse(product.props);
                    product.files = JSON.parse(product.files);
                    products.push(product); // Her bir ürünü diziye ekliyoruz
                });
            }
    
            setFetchedProducts(products);  // Tüm ürünler çekildikten sonra state güncellemesi yapıyoruz
        }
    
        fetchCart();  // Verileri çekmeye başlıyoruz
    }, [cart]);

    const calculatePrice = (item, product) => {
        if (!item) return 0;

        const size = product.sizes.indexOf(Number(item.height));
        const price = product.prices[size];

        return price * (item.count * item.text.length);
    }

    const truePrice = (item, product) => {
        if (!item) return 0;

        const size = product.sizes.indexOf(Number(item.height));
        const price = product.prices[size];

        return price;
    }

    const calculateTotal = () => {
        let total = 0;
        fetchedProducts.forEach((product, index) => {
            total += calculatePrice(cart[index], product);
        });

        return total;
    }

    const removeFromCart = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(newCart));
        setCart(newCart);
    }


    return (
        <section
        className=" relative z-10 after:contents-[''] after:absolute after:z-0 after:h-full xl:after:w-1/3 after:top-0 after:right-0 after:bg-gray-50">
        <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto relative z-10">
            <div className="grid grid-cols-12">
                <div
                    className="col-span-12 xl:col-span-8 lg:pr-8 pt-16 pb-8 lg:py-24 w-full max-xl:max-w-3xl max-xl:mx-auto">
                    <div className="flex items-center justify-between pb-8 border-b border-gray-300">
                        <h2 className="font-manrope font-bold text-3xl leading-10 text-black">{t("cartPage.cart")}</h2>
                        <h2 className="font-manrope font-bold text-xl leading-8 text-gray-600">{fetchedProducts ? (fetchedProducts.length): 0} {t("cartPage.product")}</h2>
                    </div>
                    <div className="grid grid-cols-12 mt-8 max-md:hidden pb-6 border-b border-gray-200">
                        <div className="col-span-12 md:col-span-7">
                            <p className="font-normal text-lg leading-8 text-gray-400">{t("cartPage.productDetails")}</p>
                        </div>
                        <div className="col-span-12 md:col-span-5">
                            <div className="grid grid-cols-5">
                                <div className="col-span-3">
                                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">{t("cartPage.quantity")}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-normal text-lg leading-8 text-gray-400 text-center">{t("cartPage.total")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div
                        className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group">
                        <div className="w-full md:max-w-[126px]">
                            <img src="https://pagedone.io/asset/uploads/1701162850.png" alt="perfume bottle image"
                                className="mx-auto rounded-xl object-cover"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                            <div className="md:col-span-2">
                                <div className="flex flex-col max-[500px]:items-center gap-3">
                                    <h6 className="font-semibold text-base leading-7 text-black">Rose Petals Divine</h6>
                                    <h6 className="font-normal text-base leading-7 text-gray-500">Perfumes</h6>
                                    <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300 group-hover:text-indigo-600">$120.00</h6>
                                </div>
                            </div>
                            <div className="flex items-center max-[500px]:justify-center h-full max-md:mt-3">
                                <div className="flex items-center h-full">
                                    <button
                                        className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300">
                                        <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                            xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                            viewBox="0 0 22 22" fill="none">
                                            <path d="M16.5 11H5.5" stroke="" strokeWidth="1.6"
                                                strokeLinecap="round" />
                                            <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" strokeWidth="1.6"
                                                strokeLinecap="round" />
                                            <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" strokeWidth="1.6"
                                                strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <input type="text"
                                        className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[15px]  text-center bg-transparent"
                                        placeholder="1"/>
                                    <button
                                        className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300">
                                        <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                            xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                            viewBox="0 0 22 22" fill="none">
                                            <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" strokeWidth="1.6"
                                                strokeLinecap="round" />
                                            <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2"
                                                strokeWidth="1.6" strokeLinecap="round" />
                                            <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2"
                                                strokeWidth="1.6" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
                                <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300 group-hover:text-indigo-600">$120.00</p>
                            </div>
                        </div>
                    </div> */}
                    {(cart && cart.length > 0) ? (cart.map((item) => {
                        const product = fetchedProducts.find((p) => p.id == item.id);
                        if (!product) return null;

                        return (
                            <div
                                className="flex flex-col min-[500px]:flex-row min-[500px]:items-center gap-5 py-6  border-b border-gray-200 group">
                                <div className="w-full md:max-w-[126px]">
                                    <img src={`${SERVER_URI}/${product.files[product.selected_image]}`} alt="perfume bottle image"
                                        className="mx-auto rounded-xl object-cover"/>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 w-full">
                                    <div className="md:col-span-2">
                                        <div className="flex flex-col max-[500px]:items-center gap-3">
                                            <h6 className="font-semibold text-base leading-7 text-black">{product.name}</h6>
                                            <h6 className="font-normal text-base leading-7 text-gray-500">{product.type}</h6>
                                            <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300">{truePrice(item, product)} $</h6>
                                            <div className="flex gap-2 items-center">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 18L12 6M12 18L9 16M12 18L15 16M12 6L9 8M12 6L15 8M21 3H3M21 21H3" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>    
                                                <h6 className="font-medium text-base leading-7 text-gray-600 transition-all duration-300"> {item.height} cm</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items
                                    -center max-[500px]:justify-center h-full max-md:mt-3">
                                        <div className="flex items
                                        -center h-full">
                                            <button
                                                className="group rounded-l-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300">
                                                <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                                    xmlns="http://www.w
                                                    .3.org/2000/svg" width="22" height="22"
                                                    viewBox="0 0 22 22" fill="none">
                                                    <path d="M16.5 11H5.5" stroke="" strokeWidth="1.6"
                                                        strokeLinecap="round" />
                                                    <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" strokeWidth="1.6"
                                                        strokeLinecap="round" />
                                                    <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" strokeWidth="1.6"
                                                        strokeLinecap="round" />
                                                </svg>
                                            </button>
                                            <input type="text"
                                                value={item.count}
                                                className="border-y border-gray-200 outline-none text-gray-900 font-semibold text-lg w-full max-w-[73px] min-w-[60px] placeholder:text-gray-900 py-[15px]  text-center bg-transparent"
                                                placeholder="1"/>
                                            <button
                                                className="group rounded-r-xl px-5 py-[18px] border border-gray-200 flex items-center justify-center shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-50 hover:border-gray-300 hover:shadow-gray-300 focus-within:outline-gray-300">
                                                <svg className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                                                    xmlns="http://www.w
                                                    .3.org/2000/svg" width="22" height="22"
                                                    viewBox="0 0 22 22" fill="none">
                                                    <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" strokeWidth="1.6"
                                                        strokeLinecap="round" />
                                                    <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2"
                                                        strokeWidth="1.6" strokeLinecap="round" />
                                                    <path d="M11 5.5V16.5M16.5 11H5.5" stroke="" stroke-opacity="0.2"
                                                        strokeWidth="1.6" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center max-[500px]:justify-center md:justify-end max-md:mt-3 h-full">
                                        <div className="flex flex-col">
                                            <p className="font-bold text-lg leading-8 text-gray-600 text-center transition-all duration-300">{calculatePrice(item, product).toFixed(2)} $</p>
                                            <button onClick={()=>{removeFromCart(item.id)}} className="font-small text-lg leading-8 text-rose-800 text-center transition-all duration-300 group-hover:text-rose-600">Sepetten Çıkar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })): (<span className="bg-gray-900 text-white p-2 relative top-[20px]">{t("cartPage.emptyCart")}</span>)}


                    <div className="flex items-center justify-end mt-8">
                        <button
                            className="flex items-center px-5 py-3 rounded-full gap-2 border-none outline-0 group font-semibold text-lg leading-8 text-gray-800 shadow-sm shadow-transparent transition-all duration-500 hover:text-gray-900">
                            {t("cartPage.addCouponCode")}
                            <svg className="transition-all duration-500 group-hover:translate-x-2" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                                fill="none">
                                <path
                                    d="M12.7757 5.5L18.3319 11.0562M18.3319 11.0562L12.7757 16.6125M18.3319 11.0562L1.83203 11.0562"
                                    stroke="#2a2a2a" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className=" col-span-12 xl:col-span-4 bg-gray-50 w-full max-xl:px-6 max-w-3xl xl:max-w-lg mx-auto lg:pl-8 py-24">
                    <h2 className="font-manrope font-bold text-3xl leading-10 text-black pb-8 border-b border-gray-300">
                        {t("cartPage.orderSummary")}</h2>
                    <div className="mt-8">
                        <div className="flex items-center justify-between pb-6">
                            <p className="font-normal text-lg leading-8 text-black">{fetchedProducts ? (fetchedProducts.length): 0} {t("cartPage.product")}</p>
                            <p className="font-medium text-lg leading-8 text-black">{calculateTotal().toFixed(2)} $</p>
                        </div>
                        <form>
                            <label className="flex  items-center mb-1.5 text-gray-600 text-lg font-medium">{t("cartPage.recipientInformation")}
                            </label>
                            <div className="flex pb-6">
                                <div className="relative w-full">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <label htmlFor="name" className="sr-only">{t("cartPage.recipientName")}</label>
                                            <input type="text" id="name" name="name"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.recipientName")}/>     
                                        </div>
                                        <div>
                                            <label htmlFor="name" className="sr-only">{t("cartPage.recipientPhone")}</label>
                                            <input type="phone" id="phone" name="phone"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.recipientPhone")}/>     
                                        </div>
                                        <div>
                                            <label htmlFor="name" className="sr-only">{t("cartPage.recipientMail")}</label>
                                            <input type="email" id="email" name="email"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.recipientMail")}/>     
                                        </div> 
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-manrope font-bold text-lg leading-8 text-gray-600">{t("cartPage.card.cardInformation")}</h2>
                                        <div>
                                            <label htmlFor="cardNo" className="sr-only">{t("cartPage.card.cardNumber")}</label>
                                            <input type="text" id="cardNo" name="cardNo"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.card.cardNumber")}/>
                                        </div>
                                        <div className="flex gap-2">
                                            <label htmlFor="cardName" className="sr-only">{t("cartPage.card.cardName")}</label>
                                            <input type="text" id="cardName" name="cardName"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.card.cardName")}/>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label htmlFor="cardExp" className="text-gray-600">{t("cartPage.card.cardExp")}</label>
                                            <input type="date" id="cardExp" name="cardExp"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.card.cardExp")}/>
                                        </div>
                                        <div className="flex gap-2">
                                            <label htmlFor="cardCvc" className="sr-only">{t("cartPage.card.cardCvc")}</label>
                                            <input type="text" id="cardCvc" name="cardCvc"
                                                className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                                placeholder={t("cartPage.card.cardCvc")}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <label className="flex items-center mb-1.5 text-gray-400 text-sm font-medium">{t("cartPage.promoCode")}
                            </label>
                            <div className="flex pb-4 w-full">
                                <div className="relative w-full ">
                                    <div className=" absolute left-0 top-0 py-2.5 px-4 text-gray-300">

                                    </div>
                                    <input type="text"
                                        className="block w-full h-11 pr-11 pl-5 py-2.5 text-base font-normal shadow-xs text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-gray-400 "
                                        placeholder="xxxx xxxx xxxx"/>
                                    <button id="dropdown-button" data-target="dropdown"
                                        className="dropdown-toggle flex-shrink-0 z-10 inline-flex items-center py-4 px-4 text-base font-medium text-center text-gray-900 bg-transparent  absolute right-0 top-0 pl-2 "
                                        type="button"><svg className="ml-2 my-auto" width="12" height="7" viewBox="0 0 12 7"
                                            fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M1 1.5L4.58578 5.08578C5.25245 5.75245 5.58579 6.08579 6 6.08579C6.41421 6.08579 6.74755 5.75245 7.41421 5.08579L11 1.5"
                                                stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"
                                                strokeLinejoin="round"></path>
                                        </svg>
                                    </button>
                                    <div id="dropdown"
                                        className="absolute top-10 right-0 z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby="dropdown-button">
                                            <li>
                                                <a href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Shopping</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Images</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">News</a>
                                            </li>
                                            <li>
                                                <a href="#"
                                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Finance</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center border-b border-gray-200">
                                <button
                                    className="rounded-lg w-full bg-black py-2.5 px-4 text-white text-sm font-semibold text-center mb-8 transition-all duration-500 hover:bg-black/80">Apply</button>
                            </div>
                            <div className="flex items-center justify-between py-8">
                                <p className="font-medium text-xl leading-8 text-black">{fetchedProducts ? (fetchedProducts.length): 0} {t("cartPage.product")}</p>
                                <p className="font-semibold text-xl leading-8 text-black">{calculateTotal().toFixed(2)} $</p>
                            </div>
                            <button
                                className="w-full text-center bg-green-700 rounded-xl py-3 px-6 font-semibold text-lg text-white transition-all duration-500 hover:bg-green-900">{t("cartPage.checkout")}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    );
}

export default CartPage;