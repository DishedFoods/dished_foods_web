"use client";

import Image from "next/image";
import { XIcon } from "@/components/ui/Icons";
import { StarRating } from "@/components/ui/StarRating";
import type { Chef } from "@/types";

interface Props {
  chef:    Chef;
  onClose: () => void;
}

export function ChefModal({ chef, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[1500] modal-backdrop flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[520px] max-h-[90vh] overflow-hidden
                   flex flex-col shadow-2xl animate-slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image header */}
        <div className="relative h-[150px] flex-shrink-0 bg-gradient-to-br from-green-700 to-green-900">
          <Image
            src={chef.photo}
            alt={chef.name}
            fill
            className="object-cover opacity-30"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 border-none
                       cursor-pointer text-white flex items-center justify-center hover:bg-white/30 transition"
          >
            <XIcon />
          </button>
          {/* Avatar */}
          <div className="absolute -bottom-8 left-5">
            <Image
              src={chef.photo}
              alt={chef.name}
              width={66}
              height={66}
              className="rounded-full border-[3px] border-white object-cover shadow-xl"
            />
          </div>
        </div>

        {/* Info */}
        <div className="px-5 pt-10 pb-4 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-serif font-black text-[21px] text-gray-900">{chef.name}</div>
              <div className="text-sm text-gray-400 mt-0.5">{chef.specialty} · {chef.province}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <StarRating rating={chef.rating} />
                <span className="text-sm font-bold">{chef.rating}</span>
              </div>
              <div className="text-xs text-gray-400">({chef.reviews} reviews) · {chef.distance} km</div>
            </div>
          </div>
          <div className="flex gap-1.5 mt-2.5 flex-wrap">
            {chef.cuisines.map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <div className="h-px bg-gray-100 mb-4" />
          <p className="text-gray-500 leading-relaxed text-[15px]">{chef.bio}</p>
        </div>
      </div>
    </div>
  );
}
