"use client";

import { StarIcon } from "./Icons";

interface Props {
  rating: number;
}

export function StarRating({ rating }: Props) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={i <= Math.floor(rating)} />
      ))}
    </span>
  );
}
