import Image from "next/image";
import {useState} from "react";

interface Props {
    onSelectType: (types: string[]) => void;
}

interface Filter {
    types: string[];
    display: string;
    src?: string;
    background?: string;
    height?: number;
    width?: number;
}

const TFilter = ({ onSelectType }: Props) => {
    const filters: Filter[] = [
        { types: ["*"], display: "Alle" },
        { types: ["HIGH_SPEED_TRAIN", "INTERCITY_TRAIN", "nationalExpress", "national"], display: "Fernverkehr", src: "/timetable/filter/nationalexpress.svg", background: "bg-yellow-300 p-0.5 rounded-xl" },
        { types: ["REGIONAL_TRAIN", "regional"], display: "Regional", src: "/timetable/filter/regional.svg", background: "bg-red-500 p-0.5 rounded-xl" },
        { types: ["CITY_TRAIN", "suburban"], display: "S-Bahn", src: "/timetable/filter/suburban.svg" },
        { types: ["TRAM", "tram"], display: "Straßen/ Stadtbahn", src: "/timetable/filter/tram.svg" },
        { types: ["BUS", "bus"], display: "Bus", src: "/timetable/filter/bus.svg", background: "bg-fuchsia-800 hexagon p-1" },
    ]

    const [selectType, setSelectedType] = useState<Filter>(filters[0]);
    const handleSelectType = (filter: Filter) => {
        setSelectedType(filter);
        onSelectType(filter.types);
    }

    /**
     * RIS , `db-vendo-client`
     * -----------------------
     * *
     * HIGH_SPEED_TRAIN , INTERCITY_TRAIN , national , nationalExpress
     * REGIONAL_TRAIN , regional
     * CITY_TRAIN , suburban
     * TRAM , tram
     * BUS , bus
     */

    return (
        <div className="container mx-auto w-full md:flex md:justify-center bg-accent rounded-2xl">
            <div className="flex space-x-4 overflow-x-auto px-4 py-2 md:w-full md:max-w-screen-lg md:justify-center scrollbar-hidden">
                {filters.map((filter: Filter, index: number) => (
                    <span
                        key={index}
                        className={`flex-shrink-0 flex items-center space-x-2 cursor-pointer p-2 ${selectType.types[0] === filter.types[0] ? "bg-secondary rounded-2xl" : ""}`}
                        onClick={() => handleSelectType(filter)}
                    >
                        {filter.src && <Image className={filter.background} src={filter.src} alt={filter.display} width={filter.width ?? 35} height={filter.height ?? 35} />}
                        <span>{filter.display}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}

export default TFilter;
