import React from "react";
import EnterRoomButton from "../EnterRoomButton";
import styles from "../../styles/EnterRoom.module.css"
import Image from 'next/image'
import Logo from "../../public/images/im3.svg"

const EnterRoom = () => {
    return(
        <section className="flex flex-col justify-center md:items-start lg:mx-40 md:gap-60 gap-36">
            <div className={`${styles.logo} lg:mx-0 md:mx-12 mt-6`}>
                <Image
                className="xl:w-[142px] z-[20px] w-[100px]"
                    src={Logo}
                    width={500}
                    height={500}
                    alt="Im3_Logo"
                />
            </div>
            <div className={`flex-col 2xl:px-2 flex gap-[90px] `}>

                <h1 className={`font-bold lg:text-5xl text-start lg:inline-block hidden font-SpaceGrotesk text-[26px] whitespace-pre-line`}>{`Video Calls and Meetings
                via a `}<span className="text-im3Red">Decentralized</span> {`Public Network `} 
                </h1>

                {/* for small layout */}
                <h1 className={`font-bold text-center md:text-start md:px-20 font-SpaceGrotesk lg:hidden md:text-5xl sm:text-[26px] whitespace-pre-line text-xl`}>{`Video Calls and Meetings 
                via a `}<span className="text-im3Red">Decentralized</span> {`
                Public Network `}
                </h1>

                <div className="flex  lg:justify-start lg:items-start justify-center items-center flex-col gap-[56px]">
                    <p className={`${styles.subtitle} font-Nunito opacity-60 px-[68px] lg:px-0`}>Connect with your <span className="text-im3Red">web3 identity </span> , <span className="text-im3Red">mint NFTs</span> and <span className="text-im3Red">POAPs</span>, and more.</p>
                    <div className="flex md:flex-row flex-col gap-4 justify-center items-center">
                    <EnterRoomButton />
                    <EnterRoomButton variation="solid"/>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default EnterRoom;