import { createContext, Dispatch, SetStateAction } from "react";
import { GameInfo, getEmptyGameInfo } from "../types/game_info";

type GameContextType = {
	gameInfo: GameInfo,
	setGameInfo: Dispatch<SetStateAction<GameInfo>>
}

export const GameContext = createContext<GameContextType>({
	gameInfo: getEmptyGameInfo(),
	setGameInfo: () => { return; }
});