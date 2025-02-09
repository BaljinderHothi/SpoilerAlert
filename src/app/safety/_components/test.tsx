"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import GooeyFilter from "@/components/fancy/gooey-svg-filter";
import { Camera as CameraIcon, Type, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ItemForm } from "@/components/ui/item-form";
import Camera from "./camera"
import Sidebar from "./sidebar";



export default function Test() {
  const [activeTab, setActiveTab] = useState(0);
  const [detectedObject, setDetectedObject] = useState<string>("");

  const TAB_CONTENT = [
    {
      title: "Camera",
      icon: <CameraIcon className="w-4 h-4 mr-2" />,
      content: <Camera setObject={setDetectedObject} />
    },
    {
      title: "Text",
      icon: <Type className="w-4 h-4 mr-2" />,
      content: <ItemForm />
    }
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-black">
      {/* Main grid container */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-24 grid grid-cols-1 md:grid-cols-[1.3fr,0.7fr] gap-8 md:gap-12 auto-rows-auto">
        {/* First row, first column - Gooey Filter Content */}
        <div className="relative h-full mb-8 md:mb-0">
          <GooeyFilter id="gooey-filter" strength={20} />
          <div className="relative h-full">
            <div
              className="absolute inset-0"
            >
              {/* Background tabs */}
              <div className="flex w-full">
                {TAB_CONTENT.map((_, index) => (
                  <div key={index} className="relative flex-1 h-12">
                    {activeTab === index && (
                      <motion.div
                        layoutId="active-tab"
                        className="absolute inset-0 bg-[#efefef] dark:bg-zinc-900"
                        transition={{
                          type: "spring",
                          bounce: 0.0,
                          duration: 0.4,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Content panel */}
              <div className="w-full h-[525px] bg-[#efefef] dark:bg-zinc-900 overflow-hidden ">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeTab}
                    initial={{
                      opacity: 0,
                      y: 50,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -50,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="h-full p-8 flex flex-col"
                  >
                    <div className="flex-1 text-black dark:text-zinc-300 overflow-hidden">
                      {TAB_CONTENT[activeTab].content}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive text overlay */}
            <div className="relative flex w-full">
              {TAB_CONTENT.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className="flex-1 h-12"
                >
                  <span className={`
                    w-full h-full flex items-center justify-center
                    ${activeTab === index 
                      ? "text-black dark:text-white" 
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }
                  `}>
                    {tab.icon}
                    {tab.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* First row, second column - Info Card */}
        <Card className="bg-[#efefef] dark:bg-zinc-900 border-0 h-[572px] rounded-2xl overflow-hidden shadow-none pt-4">
          <CardContent>
            {/* Content will go here */}
            <Sidebar/>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}