import { Nation, PlayerController } from "../pages/api/common";

export interface PlayerNationStatus {
  name: string;
  status: 'Pending' | 'Unfinished' | 'Done';
}

const TURN_PLAYED_TO_STATUS: { [key: string]: PlayerNationStatus['status'] } = {
  '0': 'Pending',
  '1': "Unfinished",
  '2': 'Done',
};

function buildContentFromNations(nations: Nation[]): PlayerNationStatus[] {
  return nations
    .filter((nation) => nation.controller == PlayerController.Human)
    .map(nation => ({
      name: nation.name,
      status: TURN_PLAYED_TO_STATUS[nation.turnplayed],
    }));
}

export default async function (gameId: string) {
  const response = await fetch(`https://dom5.snek.earth/api/games/${gameId}/status`);

  if (response.ok) {
    const nationData: { nations: Nation[] } = await response.json();

    return buildContentFromNations(nationData.nations);
  } else {
    throw new Error('Game id not found');
  }
}
