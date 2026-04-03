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

      <div className="flex bg-[#961223] min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${bgImage}")`, backgroundSize: '115% auto', backgroundPosition: '55% 100%', }}>
        <span className=' font-surgena cursor-pointer pl-2 pt-2 text-white text-9xl'>*</span>
        <div className="h-screen flex items-center justify-center">
        </div>
        <div className="w-1/2 flex items-end justify-center pb-8">

          <div className="flex flex-col w-min">
            <BgCard className="mb-6" />
            {/* old title, revert if needed */}
            {/* <div className="text-[#ffffff] text-8xl font-surgena whitespace-nowrap">Reminiscence*</div> */}
            <PixelHeading mode="random" staggerDelay={50} cycleInterval={800} autoPlay className="text-[#ffffff] text-8xl font-surgena whitespace-nowrap">
              reminiscence
            </PixelHeading>
            <p className="text-[#ffffff] text-md font-jetbrains text-justify">A state-serialization protocol for portable context. Extract raw session memory from proprietary silos, normalize its structure, and inject it into any model to maintain narrative continuity without manual reconstruction.</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
