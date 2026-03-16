"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HeartIcon, PlayIcon, LocationPinIcon } from "@/components/ui/Icons";
import { StarRating } from "@/components/ui/StarRating";
import type { Chef } from "@/types";

interface Props {
  chef: Chef;
  index: number;
  onSelect: (chef: Chef) => void;
  liked: boolean;
  onLike: (id: number) => void;
}

export function ChefCard({ chef, index, onSelect, liked, onLike }: Props) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 90);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden cursor-pointer relative border
                 transition-all duration-500"
      style={{
        opacity:   visible ? 1 : 0,
        transform: visible ? (hovered ? "translateY(-6px)" : "translateY(0)") : "translateY(24px)",
        transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hovered
          ? "0 16px 40px rgba(77, 158, 138,0.16)"
          : "0 4px 18px rgba(0,0,0,0.06)",
        borderColor: hovered ? "#7dcfc1" : "#d6f0e9",
      }}
      onClick={() => onSelect(chef)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {chef.badge && (
        <div className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-br from-green-700
                        to-green-800 text-white text-[9.5px] font-black px-2.5 py-0.5
                        rounded-full uppercase tracking-wider">
          {chef.badge}
        </div>
      )}

      {/* Like button */}
      <button
        onClick={(e) => { e.stopPropagation(); onLike(chef.id); }}
        className="absolute top-2.5 right-2.5 z-10 w-[31px] h-[31px] rounded-full
                   bg-white/93 border-none flex items-center justify-center shadow-md
                   transition-transform duration-200 hover:scale-110 cursor-pointer
                   text-gray-500"
      >
        <HeartIcon filled={liked} />
      </button>

      {/* Photo */}
      <div className="relative h-[138px] overflow-hidden">
        <Image
          src={chef.photo}
          alt={chef.name}
          width={300}
          height={300}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${chef.name}&background=c2f6d9&color=21744a&size=300`;
          }}
        />
        {/* Story ring */}
        {chef.hasStory && (
          <div className="absolute bottom-[-19px] left-1/2 -translate-x-1/2 w-[46px] h-[46px]
                          bg-gradient-to-br from-green-400 via-green-600 to-green-900
                          rounded-full p-[3px] shadow-[0_2px_12px_rgba(77, 158, 138,0.40)]">
            <div className="w-full h-full rounded-full border-[2.5px] border-white bg-black
                            flex items-center justify-center">
              <PlayIcon />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={chef.hasStory ? "px-4 pt-7 pb-4" : "px-4 pt-3.5 pb-4"}>
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <div className="font-serif font-bold text-[16px] text-gray-900">{chef.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{chef.specialty}</div>
          </div>
          <span className="text-[13px] font-bold text-gray-500">{chef.price}</span>
        </div>

        {/* Cuisine tags */}
        <div className="flex flex-wrap gap-1.5 my-2">
          {chef.cuisines.map((cu) => (
            <span key={cu} className="tag">{cu}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2.5 border-t border-green-50">
          <div className="flex items-center gap-1.5">
            <StarRating rating={chef.rating} />
            <span className="text-xs text-gray-500 ml-1">
              {chef.rating} ({chef.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-green-600 font-bold bg-green-50 px-2.5 py-1 rounded-xl">
            <LocationPinIcon size={11} /> {chef.distance} km
          </div>
        </div>
      </div>
    </div>
  );
}
