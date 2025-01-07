import React from 'react'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCube, Pagination } from 'swiper/modules'

// css files
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cube';

function Slider({ images }) {
    return (
        <Swiper
            modules={[ Navigation, Autoplay, EffectCube, Pagination]}
            className='my-slider md:mb-10'
            navigation pagination={{type: "progress", clickable: true}}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            effect="cube"
            spaceBetween={0} slidesPerView={1}
        >
            {images && images.map((image, index) => (
                <SwiperSlide key={index} className='md:!h-[85vh] w-full' data-swiper-parallax="-100">
                    <img src={image} alt="swiper image sire" className='h-full mx-auto !object-contain swiper-lazy' />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default Slider
