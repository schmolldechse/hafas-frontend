"use client";

import React, {useState, useRef, useEffect} from "react";
import { DateTime } from "luxon";
import Image from "next/image";

interface Props {
    onChangedDate: (date: DateTime) => void;
}

const TimePicker: React.FC<Props> = ({ onChangedDate }) => {
    const [selectedDate, setSelectedDate] = useState<DateTime>(() =>
        DateTime.now().set({ second: 0, millisecond: 0 })
    );

    const [showPicker, setShowPicker] = useState(false); // Toggle for calendar
    const pickerRef = useRef(null);

    const inputTimeout = useRef(null); // Ref for input timeout
    const buffer = useRef({ hours: "", minutes: "" }); // Buffer for input

    // Helper functions
    const prevMonth = () => setSelectedDate(selectedDate.minus({ months: 1 }));
    const nextMonth = () => setSelectedDate(selectedDate.plus({ months: 1 }));

    const renderCalendarDays = () => {
        const startDate = selectedDate.startOf("month").startOf("week");
        const endDate = selectedDate.endOf("month").endOf("week");

        let days = [];
        let day = startDate;

        while (day <= endDate) {
            days.push(day);
            day = day.plus({ days: 1 });
        }

        return days.map((day) => (
            <div
                key={day}
                className={`p-2 text-center
                    ${day.hasSame(selectedDate, "month") ? "" : "text-gray-400"}
                    ${day.hasSame(selectedDate, "day")
                        ? "bg-aqua text-black font-bold rounded-full"
                        : ""
                }`}
                onClick={() => setSelectedDate((prev) =>
                    day.set({ hour: prev.hour, minute: prev.minute })
                )}
            >
                {day.day}
            </div>
        ));
    };

    const adjustTimeByMinutes = (amount: number) => {
        setSelectedDate((prev) => prev.plus({ minutes: amount }));
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setShowPicker(false);
            }
        }

        if (selectedDate) onChangedDate(selectedDate);

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedDate]);

    const handleKeyPress = (e) => {
        const part = e.target.dataset.part;
        if (!part || (part !== "minutes" || part !== "hours"))
        if (!/^\d+$/.test(e.key)) return;

        clearTimeout(inputTimeout.current);
        buffer.current[part] += e.key;

        if (buffer.current[part].length === 2) {
            // validate if two digits are entered
            const maxValue = part === "hours" ? 23 : 59;
            const validatedValue = Math.min(parseInt(buffer.current[part], 10), maxValue);

            setSelectedDate((prev) =>
                part === "hours"
                    ? prev.set({ hour: validatedValue })
                    : prev.set({ minute: validatedValue })
            );

            // reset buffer
            buffer.current[part] = "";
        } else {
            setSelectedDate((prev) =>
                part === "hours"
                    ? prev.set({ hour: parseInt(e.key, 10) || 0 })
                    : prev.set({ minute: parseInt(e.key, 10) || 0 })
            );

            inputTimeout.current = setTimeout(() => buffer.current[part] = "", 500);
        }
    };

    return (
        <div className="relative rounded-xl text">
            {/* Input Field */}
            <div className="flex flex-row space-x-2">
                <div className={"flex flex-row items-center space-x-2 md:space-x-4 p-2 grow bg-lightgray rounded"}
                     onClick={() => setShowPicker(true)}
                >
                    <Image className={"p-1 md:h-[35px] md:w-[35px]"} width={25} height={25} src={"/ui/calendar.svg"} alt={"CALENDAR"} />
                    <span
                        className={"w-full text-base md:text-2xl bg-lightgray text-text cursor-pointer focus:outline-none"}
                    >
                        {selectedDate.toFormat("dd.MM.yyyy - HH:mm")}
                    </span>
                </div>
                <button className={"w-fit py-2 px-3 md:px-6 bg-white rounded font-bold"} onClick={() => setSelectedDate(DateTime.now().set({ second: 0, millisecond: 0 }))}>Now</button>
            </div>

            {/* Calendar Picker */}
            {showPicker && (
                <div
                    ref={pickerRef}
                    className="absolute top-1/2 left-1/2 mt-8 transform -translate-x-1/2 p-4 w-80 md:top-full md:left-auto md:transform-none md:mt-2 md:w-auto z-10 shadow-lg rounded bg-lightgray text-white"
                >
                    {/* header */}
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={prevMonth}>&lt; {selectedDate.minus({ months: 1 }).toFormat("MMM")}</button>
                        <div className={"font-bold"}>{selectedDate.toFormat("MMMM yyyy")}</div>
                        <button onClick={nextMonth}>{selectedDate.plus({ months: 1 }).toFormat("MMM")} &gt;</button>
                    </div>

                    {/* calendar grid */}
                    <div className="grid grid-cols-7 gap-1 text-sm">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                            <div key={day} className="font-bold text-center">
                                {day}
                            </div>
                        ))}
                        {renderCalendarDays()}
                    </div>

                    {/* time inputs */}
                    <div className="mt-4 flex items-center justify-between font-bold space-x-2">
                        <button
                            className="bg-aqua text-black px-4 md:px-3 py-1 rounded"
                            onClick={() => adjustTimeByMinutes(-15)}
                        >
                            -
                        </button>

                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                name="hours"
                                data-part="hours"
                                value={String(selectedDate.hour).padStart(2, "0")}
                                onKeyDown={handleKeyPress}
                                maxLength={2}
                                readOnly={true}
                                className="w-full border rounded text-center text-xl bg-lightgray text-white border-none focus:outline-none"
                            />
                            <span>:</span>
                            <input
                                type="text"
                                name="minutes"
                                data-part="minutes"
                                value={String(selectedDate.minute).padStart(2, "0")}
                                onKeyDown={handleKeyPress}
                                maxLength={2}
                                readOnly={true}
                                className="w-full border rounded text-center text-xl bg-lightgray text-white border-none focus:outline-none"
                            />
                        </div>

                        <button
                            className="bg-aqua text-black px-4 md:px-3 py-1 rounded"
                            onClick={() => adjustTimeByMinutes(15)}
                        >
                            +
                        </button>
                    </div>

                    {/* select button */}
                    <button
                        className="mt-4 w-full bg-aqua font-bold text-black py-2 rounded"
                        onClick={() => {
                            setShowPicker(false);
                            onChangedDate(selectedDate);
                        }}
                    >
                        Select
                    </button>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
