import { GetServerSideProps } from "next";
import getGameInfo from "../../util/getGameInfo";
import getGameStatus, { PlayerNationStatus } from "../../util/getGameStatus";

interface GamePageProps {
  gameStatus: PlayerNationStatus[],
  name: string;
}

function Game({ gameStatus, name }: GamePageProps) {
  return (
    <div>
      <h3>{ name }</h3>
      <ul>
        { gameStatus.map(nation => <li>{`${nation.name}: ${nation.status}`}</li>) }
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params;

  const gameInfo = await getGameInfo(id as string);
  const gameStatus = await getGameStatus(id as string);

  return {
    props: {
      gameStatus,
      name: gameInfo.name,
    }
  }
}

export default Game;