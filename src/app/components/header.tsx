"use client"
import RotatingText from './reactbits/RotatingText'


export default function Header() {

    return (
        <>
            <header className="p-24 text-4xl items-center justify-center text-center">
                <div className='flex w-full text-6xl items-center justify-center space-x-5 pb-4 font-bold'>
                    <h1>Shop</h1>
                    <RotatingText
                        texts={['In Peace', 'Effectively']}
                        mainClassName="px-2 sm:px-2 md:px-3 bg-[#FF5A5F] text-[#ffffff] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                        staggerFrom={"first"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                        transition={{ type: "spring", damping: 30, stiffness: 400 }}
                        rotationInterval={2000}
                    />
                </div>
                <h1 className='font-semibold'>Ensure your food is safe and available!</h1>
            </header>
        </>
    );
}