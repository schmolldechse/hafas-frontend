import { Station } from "@/app/lib/objects";
import { useRouter } from "next/navigation";
import React, {useState} from "react";
import TimePicker from "@/app/components/ui/TimePicker";
import StationSearch from "@/app/components/ui/StationSearch";
import { DateTime } from "luxon";

const FTimetable: React.FC = ({ }) => {
    const router = useRouter();

    const [typeSelected, setTypeSelected] = useState<{ type: "departures" | "arrivals" }>({ type: 'departures' });
    const [stationSelected, setStationSelected] = useState<Station | undefined>(undefined);
    const [dateSelected, setDateSelected] = useState<DateTime | undefined>(undefined);

    return (
        <div className={"px-4 py-7 md:px-10 md:w-[40%] flex flex-col space-y-4 bg-secondary text-text rounded-2xl border-accent border-2"}>
            <div className={"ml-auto items-center space-x-4"}>
                <span className={`cursor-pointer ${typeSelected.type === 'departures' ? 'text-' : 'text-white'}`} onClick={() => setTypeSelected({ type: 'departures' })}>Departures</span>
                <span className={"text-xl text-text"}>|</span>
                <span className={`cursor-pointer ${typeSelected.type === 'arrivals' ? 'text-aqua' : 'text-white'}`} onClick={() => setTypeSelected({ type: 'arrivals' })}>Arrivals</span>
            </div>

            <StationSearch onSelectStation={(station) => setStationSelected(station)} />

            <div className={"flex flex-col"}>
                <span>Pick a time:</span>
                <TimePicker onChangedDate={(date) => setDateSelected(date)} />
            </div>

            <button
                className={"w-full bg-primary p-2 rounded text-text font-bold text-base md:text-2xl"}
                onClick={() => {
                    if (!stationSelected) return;
                    router.push(`/${stationSelected?.evaNr}/${typeSelected.type}?startDate=${encodeURIComponent(dateSelected.toISO())}`);
                }}
            >
                Request
            </button>
        </div>
    );
}

export default FTimetable;
