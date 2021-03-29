export default async function (gameId: string) {
  const response = await fetch(`https://dom5.snek.earth/api/games/${gameId}`);

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Game id not found');
  }
}