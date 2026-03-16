"use client";

import { useState, useEffect } from "react";
import { ChefCard }  from "@/components/chef/ChefCard";
import { ChefModal } from "@/components/chef/ChefModal";
import { Toast }     from "@/components/ui/Toast";
import { CheckIcon, ChevronIcon } from "@/components/ui/Icons";
import { ALL_CHEFS, CUISINE_FILTERS, SORT_OPTIONS } from "@/lib/data";
import { filterAndSort } from "@/lib/utils";
import type { Chef, SortOption } from "@/types";

export function ChefGrid() {
  const [cuisineFilter,  setCuisineFilter]  = useState("All");
  const [sortBy,         setSortBy]         = useState<SortOption>("Nearest");
  const [showSortMenu,   setShowSortMenu]   = useState(false);
  const [likedChefs,     setLikedChefs]     = useState<Set<number>>(new Set());
  const [filteredChefs,  setFilteredChefs]  = useState<Chef[]>(ALL_CHEFS);
  const [selectedChef,   setSelectedChef]   = useState<Chef | null>(null);
  const [toast,          setToast]          = useState<string | null>(null);

  useEffect(() => {
    setFilteredChefs(filterAndSort(ALL_CHEFS, cuisineFilter, sortBy));
  }, [cuisineFilter, sortBy]);

  const showToast = (msg: string) => { setToast(null); setTimeout(() => setToast(msg), 50); };

  const toggleLike = (id: number) => {
    setLikedChefs((s) => {
      const n = new Set(s);
      if (n.has(id)) { n.delete(id); } else { n.add(id); showToast("Saved to favourites ❤️"); }
      return n;
    });
  };

  return (
    <>
      <section id="chefs-section" className="bg-[#f0faf8] py-14 px-4 md:py-20 md:px-8">
        <div className="max-w-[1200px] mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="eyebrow justify-center mb-3">
              In Your Neighbourhood
            </div>
            <h2 className="font-serif font-black text-[38px] text-gray-900 mb-2.5">
              Meet Your Local Chefs
            </h2>
            <p className="text-gray-500 text-base max-w-[460px] mx-auto">
              Every chef is background-checked, certified, and passionate about sharing
              their culinary heritage.
            </p>
          </div>

          {/* Filter + Sort bar */}
          <div className="flex justify-between items-center flex-wrap gap-2.5 mb-7">
            {/* Cuisine pills */}
            <div className="flex gap-2 flex-wrap">
              {CUISINE_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setCuisineFilter(f)}
                  className={`px-4 py-2 rounded-full border-[1.5px] text-sm font-semibold
                              transition-all duration-200
                              ${cuisineFilter === f
                                ? "border-green-600 bg-green-100 text-green-800"
                                : "border-green-200 bg-white text-gray-500 hover:border-green-500 hover:text-green-600"
                              }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu((s) => !s)}
                className="btn-ghost flex items-center gap-1.5 px-4 py-2 text-sm"
              >
                Sort: <strong className="text-green-600">{sortBy}</strong>
                <ChevronIcon up={showSortMenu} />
              </button>

              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute top-[110%] right-0 bg-white rounded-2xl
                                  shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-green-100
                                  z-50 min-w-[175px] overflow-hidden animate-slide-down">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o}
                        onClick={() => { setSortBy(o as SortOption); setShowSortMenu(false); }}
                        className={`w-full px-4 py-2.5 border-none text-[13.5px] cursor-pointer
                                    text-left flex items-center justify-between transition-colors
                                    font-sans
                                    ${sortBy === o
                                      ? "bg-green-50 text-green-800 font-bold"
                                      : "bg-white text-gray-800 font-normal hover:bg-green-50"
                                    }`}
                      >
                        {o} {sortBy === o && <CheckIcon />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-400 mb-4">
            {filteredChefs.length === 0
              ? "No chefs match this filter."
              : `Showing ${filteredChefs.length} chef${filteredChefs.length !== 1 ? "s" : ""}${
                  cuisineFilter !== "All" ? ` for "${cuisineFilter}"` : ""
                }`}
          </p>

          {/* Grid */}
          {filteredChefs.length === 0 ? (
            <div className="text-center py-14 bg-white rounded-2xl border border-green-100">
              <div className="text-5xl mb-3">🍽️</div>
              <div className="font-serif font-bold text-xl text-gray-900 mb-2">No chefs found</div>
              <p className="text-gray-500 text-sm mb-5">Try a different cuisine filter</p>
              <button
                onClick={() => setCuisineFilter("All")}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Show All Chefs
              </button>
            </div>
          ) : (
            <div className="grid gap-5"
                 style={{ gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))" }}>
              {filteredChefs.map((chef, i) => (
                <ChefCard
                  key={chef.id}
                  chef={chef}
                  index={i}
                  onSelect={setSelectedChef}
                  liked={likedChefs.has(chef.id)}
                  onLike={toggleLike}
                />
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => { setCuisineFilter("All"); setSortBy("Nearest"); }}
              className="btn-outline px-8 py-3.5 text-[15px]"
            >
              Reset Filters & Show All →
            </button>
          </div>
        </div>
      </section>

      {selectedChef && (
        <ChefModal
          chef={selectedChef}
          onClose={() => setSelectedChef(null)}
        />
      )}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </>
  );
}
