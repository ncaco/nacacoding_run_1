"use client";
import * as React from "react";
import { MapPinIcon } from "@/components/ui/icons";

type MapActionsProps = {
  query: string;
};

export function MapActions({ query }: MapActionsProps) {
  const encoded = encodeURIComponent(query);
  const openNaver = () => window.open(`https://map.naver.com/p/search/${encoded}`, "_blank");
  const openKakao = () => window.open(`https://map.kakao.com/?q=${encoded}`, "_blank");

  return (
    <div className="flex gap-2">
      <button onClick={openNaver} className="px-3 py-2 text-sm rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 inline-flex items-center gap-1">
        <MapPinIcon size={18} />
        <span>네이버</span>
      </button>
      <button onClick={openKakao} className="px-3 py-2 text-sm rounded-md bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15 inline-flex items-center gap-1">
        <MapPinIcon size={18} />
        <span>카카오</span>
      </button>
    </div>
  );
}

export default MapActions;


