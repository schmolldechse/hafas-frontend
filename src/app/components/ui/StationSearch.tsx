import { Station } from "@/app/lib/objects";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface Props {
    onSelectStation: (station: Station) => void;
}

const StationSearch: React.FC<Props> = ({ onSelectStation }) => {
    const [query, setQuery] = useState<Station[]>([]);
    const [focusedQuery, setFocusedQuery] = useState<number | null>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [manualClose, setManualClose] = useState<boolean>(false); // tracks if dropdown was manually closed

    const [inputValue, setInputValue] = useState<string>("");

    const dropdownRef = useRef<HTMLDivElement>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!manualClose && inputValue.trim() !== "") setIsOpen(true);
    }, [inputValue]);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const searchStations = async (query: string) => {
        const response = await fetch(`/api/v1/station`, {
            method: "POST",
            body: JSON.stringify({ query }),
        });
        if (!response.ok) return;

        const data = await response.json();
        if (!data.entries || data.entries.length === 0) return;

        const filtered: Station[] = data.entries
            .filter((location: any) => location.evaNr && location.name)
            .map((location: any) => location as Station);

        setQuery(filtered);
        setFocusedQuery(null);
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        setManualClose(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => searchStations(value), 500);
    };

    const handleKeyInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isOpen || query.length === 0) return;

        switch (e.key) {
            case "ArrowDown":
            case "Tab":
                e.preventDefault();
                setFocusedQuery((prev) => (prev === null || prev === query.length - 1 ? 0 : prev + 1));
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedQuery((prev) => (prev === null || prev === 0 ? query.length - 1 : prev - 1));
                break;
            case "Enter":
                e.preventDefault();
                if (focusedQuery !== null && query[focusedQuery]) selectStation(query[focusedQuery]);
                break;
            default:
                break;
        }
    };

    const selectStation = (station: Station) => {
        onSelectStation(station); // notify parent about station update
        setInputValue(station.name);
        setIsOpen(false); // close dropdown immediately
        setManualClose(true); // prevent reopening
    };

    return (
        <div
            className="relative flex flex-col space-x-2 bg-lightgray p-2 rounded-xl"
            onKeyDown={handleKeyInput}
            ref={dropdownRef}
        >
            <div className="flex flex-row">
                <Image height={20} width={20} className={"md:h-[35px] md:w-[35px]"} src={"/search.svg"} alt={"SEARCH ICON"} />
                <input
                    type="text"
                    placeholder="Search a station"
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="bg-lightgray text-base md:text-2xl p-1 w-full focus:outline-none"
                    value={inputValue}
                    onFocus={() => setIsOpen(true)}
                />
            </div>
            {isOpen && query.length > 0 && (
                <div className="absolute top-full left-0 z-50 flex flex-col mt-2 bg-lightgray rounded">
                    {query.map((location: Station, index) => (
                        <p
                            key={location.evaNr}
                            className={`text-white text-sm md:text-base m-1 py-0.5 px-2 cursor-pointer bg-lightgray hover:bg-gray-700 rounded ${
                                focusedQuery === index ? "bg-gray-700" : ""
                            }`}
                            onClick={() => selectStation(location)}
                            tabIndex={0}
                            role="button"
                            aria-pressed={focusedQuery === index}
                        >
                            {location.name}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StationSearch;
