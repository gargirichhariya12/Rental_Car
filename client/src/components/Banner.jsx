import React from 'react'
import banner01 from '../assets/banner01.png'
import Heading from './Heading';

function Banner() {
  return (
    <section className='bg-black px-6 pb-16 md:px-10'>
      <div className='mx-auto grid max-w-7xl items-center gap-8 rounded-[36px] border border-white/10 bg-white/[0.03] p-6 md:p-8 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='relative overflow-hidden rounded-[28px]'>
          <img src={banner01} alt="Banner" className="h-[280px] w-full object-cover md:h-[360px]" />
        </div>
        <div className='flex flex-col justify-center text-white'>
          <Heading
            heading="Unmatched Performance"
            className="mb-6"
            titleClassName="text-left text-3xl md:text-4xl"
            underlineClassName="mx-0"
          />
          <p className='mb-6 max-w-xl text-sm leading-7 text-[#AEB7ED] md:text-base'>
            Feel instant torque, refined handling, and premium cabin control in a vehicle built to turn every trip into a statement.
          </p>
          <div className="gradient-border max-w-xl rounded-2xl p-4 text-[#AEB7ED]">
            <ul className='grid gap-3 sm:grid-cols-2'>
              <li>0-100 km/h in ~3s</li>
              <li>Dual-Motor AWD</li>
              <li>Instant Electric Torque</li>
              <li>Precision Handling</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
