// import React from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// export default function Landing() {
//   const navigate = useNavigate();

//   return (
//     <div className="relative min-h-screen bg-[#0B0B0F] overflow-hidden">
      
//       {/* Subtle Background Glow */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-400/10 rounded-full blur-[160px]" />
//         <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[140px]" />
//       </div>

//       {/* Hero Content */}
//       <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 text-center">
        
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.9, ease: "easeOut" }}
//           className="text-6xl md:text-8xl font-semibold text-white mb-6 tracking-tight"
//         >
//           Meet{" "}
//           <span className="text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.35)]">
//             Ora
//           </span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.15 }}
//           className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12"
//         >
//           A calm, voice-first AI that listens, understands, and responds naturally —
//           just like a human conversation.
//         </motion.p>

//         <motion.button
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.6, delay: 0.3 }}
//           whileHover={{ scale: 1.06 }}
//           whileTap={{ scale: 0.97 }}
//           onClick={() => navigate("/talk")}
//           className="relative px-10 py-4 rounded-full bg-green-400 text-black font-medium text-lg
//                      shadow-[0_0_40px_rgba(74,222,128,0.35)]"
//         >
//           Start Talking
//         </motion.button>

//       </div>


//       {/* Second Section */}
//       <section className="relative py-32 bg-[#0B0B0F] text-white">
//         <div className="max-w-6xl mx-auto px-6 text-center">

//           <motion.h2
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//             className="text-4xl md:text-5xl font-semibold mb-20"
//           >
//             Conversation, made{" "}
//             <span className="text-green-400">natural</span>.
//           </motion.h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-16">

//             {/* Feature 1 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-2xl font-medium mb-4">
//                 Speak freely
//               </h3>
//               <p className="text-gray-400">
//                 Talk to Ora just like you would to a person. No commands. No syntax.
//               </p>
//             </motion.div>

//             {/* Feature 2 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-2xl font-medium mb-4">
//                 Interrupt anytime
//               </h3>
//               <p className="text-gray-400">
//                 Change your mind mid-sentence. Ora adapts instantly.
//               </p>
//             </motion.div>

//             {/* Feature 3 */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               viewport={{ once: true }}
//             >
//               <h3 className="text-2xl font-medium mb-4">
//                 Real-time voice
//               </h3>
//               <p className="text-gray-400">
//                 Responses stream naturally — no waiting, no silence.
//               </p>
//             </motion.div>

//           </div>
//         </div>
//       </section>
//     </div>
    
//   );
// }

import React from "react";
import HeroSection from "../components/landing_page/HeroSection";
import VoiceSection from "../components/landing_page/VoiceSection";
import CarouselSection from "../components/landing_page/CarouselSection";
import FeaturesSection from "../components/landing_page/FeaturesSection";
import CTASection from "../components/landing_page/CTASection";
import Footer from "../components/landing_page/Footer";

export default function Landing() {
  return (
    <>
      <HeroSection />
      <VoiceSection />
      <CarouselSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}