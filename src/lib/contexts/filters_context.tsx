import { createContext, Dispatch, SetStateAction } from "react";
import { SongFilters, getEmptySongFilters } from "../types/next_song_params";

type FiltersContextType = {
	songFilters: SongFilters,
	setSongFilters: Dispatch<SetStateAction<SongFilters>>
}

export const FiltersContext = createContext<FiltersContextType>({
	songFilters: getEmptySongFilters(),
	setSongFilters: () => { return; }
});