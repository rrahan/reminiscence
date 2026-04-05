import BgCard from '@/components/ui/bg-card';
import bgImage from './assets/av5.png'
import { PixelHeading } from "@/components/ui/pixel-heading-character"
import { Toaster } from 'sonner'
import './index.css'

function App() {
  return (
    //  hex if want to change bg #B91223
    <>
      <Toaster expand={false} visibleToasts={1} toastOptions={{ className: 'font-jetbrains', style: { borderRadius: 0 } }} />

      <div className="relative flex bg-[#961223] min-h-screen bg-cover bg-center bg-no-repeat max-lg:flex-col max-lg:items-center max-lg:overflow-x-hidden responsive-bg" style={{ backgroundImage: `url("${bgImage}")`, backgroundSize: '115% auto', backgroundPosition: '55% 100%', }}>
        <span className='absolute top-0 left-0 font-surgena cursor-pointer pl-2 pt-2 text-white text-9xl max-md:text-6xl max-sm:text-8xl z-10'>*</span>
        <span className='absolute top-0 right-0 font-jetbrains cursor-pointer pr-4 pt-3 text-white text-xl max-md:text-base max-sm:text-sm z-10'>[<a className='text-xl max-md:text-base max-sm:text-sm underline' href="https://git.new/reminiscence">GitHub</a>]</span>
        <div className="h-screen flex items-center justify-center max-lg:hidden">
        </div>
        <div className="w-1/2 flex items-end justify-center pb-8 max-lg:w-full max-lg:items-center max-lg:justify-center max-lg:pt-24 max-lg:pb-12 max-lg:px-4">

          <div className="flex flex-col w-min max-md:w-full max-md:items-center">
            <BgCard className="mb-6" />
            {/* old title, revert if needed */}
            {/* <div className="text-[#ffffff] text-8xl font-surgena whitespace-nowrap">Reminiscence*</div> */}
            <PixelHeading mode="random" staggerDelay={50} cycleInterval={800} autoPlay className="text-[#ffffff] text-8xl font-surgena whitespace-nowrap max-lg:text-6xl max-md:text-5xl max-sm:text-6xl">
              reminiscence
            </PixelHeading>
            <p className="text-[#ffffff] text-md font-jetbrains text-justify max-md:text-sm max-sm:text-xs max-md:text-center">A state-serialization protocol for portable context. Extract raw session memory from proprietary silos and inject it into any model to maintain narrative continuity without manual reconstruction.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
