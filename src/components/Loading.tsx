"use client";

import { useEffect, useState } from "react";

import { loading } from "@/libs/loading";

export default function TopProgressBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubLoad = loading.subscribe((state: boolean) => {
      setVisible(state);
      if (!state) setProgress(100);
    });

    const unsubProg = loading.onProgress((val: any) => {
      setProgress(val);
    });

    return () => {
      unsubLoad();
      unsubProg();
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 h-[5px] bg-red-500 transition-all duration-200 z-[9999]"
        style={{
          width: visible ? `${progress}%` : "0%",
          opacity: visible ? 1 : 0,
        }}
      />
      {/* {visible && (
        <div
          className="
            fixed inset-0 
            bg-black/20
            backdrop-blur-xs
            z-[99998]
            flex items-center justify-center
            transition-opacity duration-200
          "
        >
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )} */}
    </>
  );
}
