import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper bileşenleri
import "swiper/css"; // Swiper'ın ana CSS dosyası
import "swiper/css/thumbs"; // Thumbs modülü için CSS
import "../styles/swiper.css"; // Özel Swiper stilleri
import { Thumbs, Navigation } from "swiper/modules"; // Thumbs modülü
import SwiperCore from "swiper/core"; // Swiper modülü ve Navigation modülü
import Accordion from "../components/Accordion";
import VerifiedIcon from "../components/VerifiedIcon";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UnverifiedIcon from "../components/UnverifiedIcon";
import swal from 'sweetalert';

SwiperCore.use([Navigation, Thumbs]); // Swiper modüllerini kullanıma dahil edin

function ProductPage() {
    const SERVER_URL = "https://tabelasign.com";
    const API_URL = "v1/api";
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const productCategory = useParams().category;
    const productId = useParams().id;
    const [product, setProduct] = useState(null);
    const lightMultiply = 5;
    /* SEPET BİLGİLERİ */
    const [count, setCount] = useState(1);
    const [selectedHeight, setSelectedHeight] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedColor2, setSelectedColor2] = useState(null);
    const [selectedPrice, setSelectedPrice] = useState(0);
    const [selectedLight, setSelectedLight] = useState(0);
    const [selectedLedColor, setSelectedLedColor] = useState(null);
    /* SEPET BİLGİLERİ BİTİŞ */
    const { t } = useTranslation();

    /* GEÇİCİ */
    const letterColors = ["blue", "red", "green", "yellow", "purple", "orange", "pink", "gray", "black", "white"];
    const chromeColors = ["gold", "silver"]

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${SERVER_URL}/${API_URL}/${productCategory}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: `
                            query {
                                ${productCategory}(id: ${productId}) {
                                    id
                                    name
                                    type
                                    ptype
                                    sizes
                                    prices
                                    props
                                    files
                                    selected_image
                                }
                            }
                        `,
                    }),
                });
    
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
                const data = await response.json();
                
                /* data.data.letterbox = data.data.letterbox.slice(0, 2); */
                
                data.data.letterbox.map((product) => {
                    product.sizes = JSON.parse(product.sizes);
                    product.prices = JSON.parse(product.prices);
                    product.props = JSON.parse(product.props);
                    product.files = JSON.parse(product.files);
                });

                console.log("API Yanıtı:", data);

                setProduct(data.data.letterbox[0]);
                setSelectedPrice(data.data.letterbox[0].prices[0]);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    
        fetchData();
    }, [productId, productCategory]); // productType bağımlılığını ekleyin

    const handleSpecialModel = (state) => {
        const specialModel = document.getElementById("special-model");
        if (state) {
            specialModel.classList.add("contrast-50", "pointer-events-none");
        }
        else {
            specialModel.classList.remove("contrast-50", "pointer-events-none");
        }
    }

    const handleModelClick = (e) => {
        if (e.target.classList.contains("active-model")) {
            e.target.classList.remove("active-model");
            handleSpecialModel(false);
            return;
        }

        const modelImages = document.querySelectorAll(".model-image");
        modelImages.forEach((modelImage) => {
            modelImage.classList.remove("active-model");
        });
        e.target.classList.add("active-model");
        handleSpecialModel(true);
    }

    /* SEPET BİLGİLERİ GÜNCELLE */
    const incrementProduct = () => {
        setCount(count + 1);
    }

    const decrementProduct = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    }

    const heightChange = (e) => {
        setSelectedHeight(e.target.value);

        const index = product.sizes.indexOf(Number(e.target.value));
        setSelectedPrice(product.prices[index]);
    }

    const lightChange = (e) => {
        setSelectedLight(e.target.value);
        setSelectedLedColor(null);
    }


    const colorChange = (color) => {
        setSelectedColor(color);
    }

    const colorChange2 = (color) => {
        setSelectedColor2(color);
    }

    const ledcolorChange = (color) => {
        setSelectedLedColor(color);
    }

    const addToCart = () => {
        const text = document.getElementById("enterText").value.trim().replace(/\s/g, '');
        const message = document.getElementById("message").value.trim().replace(/\s/g, '');


        if (!selectedHeight || !selectedColor || text === "") {
            swal({
                title: "Hata",
                text: "Lütfen ürün seçeneklerini belirleyin.",
                icon: "error",
                button: {
                    text: "Tamam",
                    closeModal: true,
                    className: "bg-rose-600 text-white hover:bg-rose-700",
                }
            });

            return;
        }

        /* SEPETİ LOCAL STORAGE a kaydet */
        let cart = localStorage.getItem("cart");
        cart = cart ? JSON.parse(cart) : [];

        const product = {
            id: productId,
            text: text,
            category: productCategory,
            count: count,
            height: selectedHeight,
            color1: selectedColor,
            color2: selectedColor2,
            light: Number(selectedLight),
            ledColor: selectedLedColor,
            note: message
        };
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

        swal({
            title: "Başarılı",
            text: "Ürün sepete eklendi.",
            icon: "success",
            button: {
                text: "Tamam",
                closeModal: true,
                className: "bg-green-600 text-white hover:bg-green-700",
            }
        });
    }
    /* SEPET BİLGİLERİ GÜNCELLE BİTİŞ*/

    return (
        <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="slider-box w-full h-full max-lg:mx-auto mx-0">
                    <Swiper 
                        className="swiper main-slide-carousel swiper-container relative mb-6 bg-gray-900"
                        slidesPerView={1}
                        loop={true}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                    >
                        <div className="swiper-wrapper">
                            {/* <SwiperSlide>
                                <img src="https://pagedone.io/asset/uploads/1700472379.png"
                                    alt="Summer Travel Bag image" className="max-lg:mx-auto rounded-2xl object-cover"/>
                            </SwiperSlide> */}
                            {product && product.files.map((file, index) => (
                                /* centered image */
                                <SwiperSlide key={index}>
                                    <img src={SERVER_URL + file}
                                        alt="Summer Travel Bag image" className="h-[600px] w-full object-cover"/>
                                </SwiperSlide>

                            ))}
                        </div>
                    </Swiper>
                    <div className="nav-for-slider ">
                        <Swiper 
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[Thumbs]}
                            className="thumbs-slider"
                        >
                            {product && product.files.map((file, index) => (
                                <SwiperSlide key={index}>
                                    <img src={SERVER_URL + file}
                                        alt="Summer Travel Bag image" className="h-[100px] w-full object-cover"/>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <div class="w-full max-w-7xl mx-auto mt-10">
                    <Accordion 
                            header={t("ppage.technicalDetails")} 
                            content="Ürünün teknik detayları ile ilgili önyazı."
                    >
                            {/* <ul class="grid gap-y-4 p-3 mb-8">
                                <VerifiedIcon content="ABS LUGGAGE" />
                                <VerifiedIcon content="20 kg" />
                            </ul> */}
                            <div className="mt-2">
                                <span class="font-semibold text-gray-900">Ürün Materyalleri: </span>
                                {product && product.props.material.map((material, index) => (
                                    <li className="ml-3" key={index}>{material}</li>
                                ))}
                            </div>
                            <div className="mt-2">
                                <span class="font-semibold text-gray-900">Ürün Işıklımı ? </span>
                                {product && product.props.iscolored ?
                                <VerifiedIcon bg="fill-green-500" content="Evet" /> : <UnverifiedIcon bg="fill-rose-500" content="Hayır" />}
                            </div>
                        </Accordion>
                    </div>
                </div>
                <div className="flex justify-center items-center">
                    <div className="pro-detail w-full max-lg:max-w-[608px] lg:pl-8 xl:pl-16 max-lg:mx-auto max-lg:mt-8">
                        <div className="flex items-baseline justify-between gap-6 mb-6">
                            <div className="text">
                                <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2">
                                    {product && product.name}
                                </h2>
                                <p className="font-normal text-base text-gray-500">{product && product.type}</p>
                            </div>
                            <button className="group transition-all duration-500 p-0.5">
                                <svg className="stroke-gray-800 hover:fill-gray-800" height="40" width="40" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M30.051 45.6071L17.851 54.7401C17.2728 55.1729 16.5856 55.4363 15.8662 55.5008C15.1468 55.5652 14.4237 55.4282 13.7778 55.1049C13.1319 54.7817 12.5887 54.2851 12.209 53.6707C11.8293 53.0563 11.6281 52.3483 11.628 51.626V15.306C11.628 13.2423 12.4477 11.2631 13.9069 9.8037C15.3661 8.34432 17.3452 7.52431 19.409 7.52405H45.35C47.4137 7.52431 49.3929 8.34432 50.8521 9.8037C52.3112 11.2631 53.131 13.2423 53.131 15.306V51.625C53.1309 52.3473 52.9297 53.0553 52.55 53.6697C52.1703 54.2841 51.6271 54.7807 50.9812 55.1039C50.3353 55.4272 49.6122 55.5642 48.8928 55.4998C48.1734 55.4353 47.4862 55.1719 46.908 54.739L34.715 45.6071C34.0419 45.1031 33.2238 44.8308 32.383 44.8308C31.5422 44.8308 30.724 45.1031 30.051 45.6071V45.6071Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                            </button>
                        </div>

                        <div className="flex flex-col min-[400px]:flex-row min-[400px]:items-center mb-8 gap-y-3">
                            <div className="flex items-center">
                                <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 ">$ {product && selectedPrice} </h5>
                            </div>
                            <svg className="mx-5 max-[400px]:hidden" xmlns="http://www.w3.org/2000/svg" width="2"
                                height="36" viewBox="0 0 2 36" fill="none">
                                <path d="M1 0V36" stroke="#E5E7EB" />
                            </svg>
                            <span className="font-semibold text-3xl text-red-500">$ {product && Number(selectedPrice + (Number(selectedLight) == 1 ? ((selectedPrice * lightMultiply) / 100) : 0)).toFixed(2)}</span>
                            {/* <button className="flex items-center gap-1 rounded-lg bg-amber-400 py-1.5 px-2.5 w-max">
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_12657_16865)">
                                        <path
                                            d="M8.10326 2.26718C8.47008 1.52393 9.52992 1.52394 9.89674 2.26718L11.4124 5.33818C11.558 5.63332 11.8396 5.83789 12.1653 5.88522L15.5543 6.37768C16.3746 6.49686 16.7021 7.50483 16.1086 8.08337L13.6562 10.4738C13.4205 10.7035 13.313 11.0345 13.3686 11.3589L13.9475 14.7343C14.0877 15.5512 13.2302 16.1742 12.4966 15.7885L9.46534 14.1948C9.17402 14.0417 8.82598 14.0417 8.53466 14.1948L5.5034 15.7885C4.76978 16.1742 3.91235 15.5512 4.05246 14.7343L4.63137 11.3589C4.68701 11.0345 4.57946 10.7035 4.34378 10.4738L1.89144 8.08337C1.29792 7.50483 1.62543 6.49686 2.44565 6.37768L5.8347 5.88522C6.16041 5.83789 6.44197 5.63332 6.58764 5.33818L8.10326 2.26718Z"
                                            fill="white" />
                                        <g clip-path="url(#clip1_12657_16865)">
                                            <path
                                                d="M8.10326 2.26718C8.47008 1.52393 9.52992 1.52394 9.89674 2.26718L11.4124 5.33818C11.558 5.63332 11.8396 5.83789 12.1653 5.88522L15.5543 6.37768C16.3746 6.49686 16.7021 7.50483 16.1086 8.08337L13.6562 10.4738C13.4205 10.7035 13.313 11.0345 13.3686 11.3589L13.9475 14.7343C14.0877 15.5512 13.2302 16.1742 12.4966 15.7885L9.46534 14.1948C9.17402 14.0417 8.82598 14.0417 8.53466 14.1948L5.5034 15.7885C4.76978 16.1742 3.91235 15.5512 4.05246 14.7343L4.63137 11.3589C4.68701 11.0345 4.57946 10.7035 4.34378 10.4738L1.89144 8.08337C1.29792 7.50483 1.62543 6.49686 2.44565 6.37768L5.8347 5.88522C6.16041 5.83789 6.44197 5.63332 6.58764 5.33818L8.10326 2.26718Z"
                                                fill="white" />
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_12657_16865">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                        <clipPath id="clip1_12657_16865">
                                            <rect width="18" height="18" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span className="text-base font-medium text-white">4.8</span>
                            </button> */}
                        </div>
                        <span className="text-sm text-red-500"> (Sipariş üzerinde değişiklik istiyorsanız lütfen not olarak ekleyin!)</span>
                        <p className="font-medium text-lg text-gray-900 mb-2">{t("ppage.model")}</p>
                        <div id="modelContainer" className="grid grid-cols-3 gap-3 mb-6 overflow-auto overflow-y-hidden">
                            {/* ÖRNEK MODEL KUTUSU */}
                            
                            {/* <div className="color-box group">
                                <div>
                                    <img src="https://pagedone.io/asset/uploads/1700472379.png"
                                        alt="Summer Travel Bag image"
                                        className="min-[400px]:h-[100px] aspect-square border-2 border-gray-100 rounded-xl transition-all duration-500 group-hover:border-indigo-600 object-cover"
                                        />
                                    <p
                                        className="font-normal text-sm leading-6 text-gray-400 text-center mt-2 group-hover:text-indigo-600 ">
                                        Black</p>
                                </div>
                            </div> */}

                            <div className="flex gap-2 h-32 position-relative w-[1050px]">
                                {product && product.files.map((file, index) => (
                                    <div className="color-box group" key={index}>
                                        <div>
                                            <img src={SERVER_URL + file}
                                                alt="Summer Travel Bag image"
                                                className="model-image min-[400px]:h-[100px] aspect-square border-2 border-gray-100 rounded-xl transition-all duration-500 group-hover:border-orange-600 object-cover"
                                                onClick={handleModelClick}
                                                />
                                            {/* <p
                                                className="font-normal text-sm leading-6 text-gray-400 text-center mt-2 group-hover:text-indigo-600 ">
                                                {file.split("/")[3].split(".")[0]}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            

                        </div>
                        <div id="special-model" className="mb-2">
                            <h2 className="font-medium text-lg text-gray-900 mb-2">Özel Model</h2>
                            {(product && product.ptype != "duzkrom") && (
                                <Accordion header={t("ppage.color1")}>
                                    <div className="flex gap-2 mb-6 max-w-full">
                                        {letterColors.map((color, index) => (
                                            <div className={`color-box group w-12 h-12 rounded-full ${(selectedColor==color ? 'border-[3px] border-orange-300' : '')}`} key={index} onClick={()=> colorChange(color)} style={{backgroundColor: color}}>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            )}

                            {(product && product.ptype == "duzkrom") && (
                                <Accordion header={t("ppage.color1")}>
                                    <div className="flex gap-2 mb-6 max-w-full">
                                        {chromeColors.map((color, index) => (
                                            <div className={`color-box group w-12 h-12 rounded-full ${(selectedColor==color ? 'border-[3px] border-orange-300' : '')}`} key={index} onClick={()=> colorChange(color)} style={{backgroundColor: color}}>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            )}

                            {(product && product.ptype == "uv") && (
                                <Accordion header={t("ppage.file")}>
                                    <div className="flex gap-2 mb-6 max-w-full">
                                        <span className="text-center bg-rose-50 w-full h-full py-3">Dosya Sürükleyebilirsiniz</span>
                                        <input type="file" id="file" name="file" accept="image/*" className="absolute opacity-0 w-full border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-lg text-center  font-semibold shadow-sm shadow-transparent outline-none transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300"/>
                                    </div>
                                </Accordion>
                            )}

                            {(product && product.ptype == "2color") && (
                                <Accordion header={t("ppage.color2")}>
                                    <div className="flex gap-2 mb-6 max-w-full">
                                        {letterColors.map((color, index) => (
                                            <div className={`color-box group w-12 h-12 rounded-full ${(selectedColor2==color ? 'border-[3px] border-orange-300' : '')}`} key={index} onClick={()=> colorChange2(color)} style={{backgroundColor: color}}>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 mb-6">
                            <h2 className="font-medium text-lg text-gray-900 mb-2">Zorunlu*</h2>
                            <input type="text" id="enterText" placeholder="Metin Girin" className="w-full border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-lg text-center  font-semibold shadow-sm shadow-transparent outline-none transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300"/>
                            
                            {(product && product.props.iscolored) ? (
                                <select onChange={lightChange} className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option value="0">Işıksız</option>
                                    <option value="1">Işıklı</option>
                                </select>
                            ) : <></>}

                            {(product && selectedLight == 1) && (
                                <Accordion header={t("ppage.ledColor")}>
                                    <div className="flex gap-2 mb-6 max-w-full">
                                        {letterColors.map((color, index) => (
                                            <div className={`color-box group w-12 h-12 rounded-full ${(selectedLedColor==color ? 'border-[3px] border-orange-300' : '')}`} key={index} onClick={()=> ledcolorChange(color)} style={{backgroundColor: color}}>
                                            </div>
                                        ))}
                                    </div>
                                </Accordion>
                            )}

                            <h2 className="font-medium text-lg text-gray-900 mb-2">Ek Olarak</h2>
                            <textarea name="message" id="message" cols="30" rows="10" placeholder="Notunuzu buraya yazabilirsiniz." className="w-full resize-none h-48 border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 p-2.5 rounded-lg font-semibold shadow-sm shadow-transparent outline-none transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300"></textarea>
                        </div>
                        <p className="font-medium text-lg text-gray-900 mb-2">{t("ppage.letterHeight")}</p>
                        <div className="grid grid-cols-2 max-h-32 overflow-auto min-[400px]:grid-cols-4 gap-3 mb-3 min-[400px]:mb-8">
                            <select id="letterHeightSelect" onChange={heightChange} className="border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-full text-center  font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300">
                                <option value="">Yükseklik Seçin</option>
                                {product && product.sizes.map((size, index) => (
                                   <option key={index} value={size}>{size}</option> 
                                ))}
                            </select>
                            
                            {/* <button
                                className="border border-gray-200 whitespace-nowrap text-gray-900 text-sm leading-6 py-2.5 rounded-full px-5 text-center w-full font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300">Full
                                Set</button> */}
                        </div>
                        
                        <div className="flex items-center flex-col min-[400px]:flex-row gap-3 mb-3 min-[400px]:mb-8">
                            <div className=" flex items-center justify-center border border-gray-400 rounded-full">
                                <button
                                    id="decrement"
                                    onClick={decrementProduct}
                                    className="group py-[14px] px-3 w-full border-r border-gray-400 rounded-l-full h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300">
                                    <svg className="stroke-black group-hover:stroke-black" width="22" height="22"
                                        viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.5 11H5.5" stroke="" stroke-width="1.6" stroke-linecap="round" />
                                        <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M16.5 11H5.5" stroke="" stroke-opacity="0.2" stroke-width="1.6"
                                            stroke-linecap="round" />
                                    </svg>
                                </button>
                                <input id="pcount" type="text"
                                    className="font-semibold text-gray-900 text-lg py-3 px-2 w-full min-[400px]:min-w-[75px] h-full bg-transparent placeholder:text-gray-900 text-center outline-0"
                                    placeholder="1" value={count}/>
                                <button
                                    id="increment"
                                    onClick={incrementProduct}
                                    className="group py-[14px] px-3 w-full border-l border-gray-400 rounded-r-full h-full flex items-center justify-center bg-white shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300">
                                    <svg className="stroke-black group-hover:stroke-black" width="22" height="22"
                                        viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="#9CA3AF" stroke-width="1.6"
                                            stroke-linecap="round" />
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="black" stroke-opacity="0.2"
                                            stroke-width="1.6" stroke-linecap="round" />
                                        <path d="M11 5.5V16.5M16.5 11H5.5" stroke="black" stroke-opacity="0.2"
                                            stroke-width="1.6" stroke-linecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={addToCart}
                                className="group py-3 px-5 rounded-full bg-gray-800 text-white font-semibold text-lg w-full flex items-center justify-center gap-2 shadow-sm shadow-transparent transition-all duration-500 hover:shadow-indigo-300 hover:bg-gray-900">
                                <svg className="stroke-white transition-all duration-500"
                                    width="22" height="22" viewBox="0 0 22 22" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.7394 17.875C10.7394 18.6344 10.1062 19.25 9.32511 19.25C8.54402 19.25 7.91083 18.6344 7.91083 17.875M16.3965 17.875C16.3965 18.6344 15.7633 19.25 14.9823 19.25C14.2012 19.25 13.568 18.6344 13.568 17.875M4.1394 5.5L5.46568 12.5908C5.73339 14.0221 5.86724 14.7377 6.37649 15.1605C6.88573 15.5833 7.61377 15.5833 9.06984 15.5833H15.2379C16.6941 15.5833 17.4222 15.5833 17.9314 15.1605C18.4407 14.7376 18.5745 14.0219 18.8421 12.5906L19.3564 9.84059C19.7324 7.82973 19.9203 6.8243 19.3705 6.16215C18.8207 5.5 17.7979 5.5 15.7522 5.5H4.1394ZM4.1394 5.5L3.66797 2.75"
                                        stroke="" stroke-width="1.6" stroke-linecap="round" />
                                </svg>
                                {t("ppage.addToCart")}
                            </button>
                        </div>
                        <button
                            className="text-center w-full px-5 py-4 rounded-[100px] bg-gray-800 flex items-center justify-center font-semibold text-lg text-white shadow-sm shadow-transparent transition-all duration-500 hover:bg-gray-900 hover:shadow-indigo-300">
                            {t("ppage.buyNow")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default ProductPage;