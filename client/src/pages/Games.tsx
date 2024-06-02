import React, { useState, useEffect } from 'react';
import { Game } from '../types/Game';
import './Games.css';
import { Link } from 'react-router-dom';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [lastPage, setlastPage] = useState<number>(0);
  const [limit] = useState<number>(10);  // Number of games per page
  const [search, setSearch] = useState<string>('');

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
    fetchGames(newPage, limit, search);
  };

  const fetchGames = async (page : number, limit : number, search : string) => {
    const response = await fetch(`http://localhost:4000/api/games?page=${page}&limit={limit}&search=${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Ensure cookies are sent with the request
    });
    if(response.ok) { 
      const data = await response.json();
      setTotalGames(data.total);
      setlastPage(Math.round(data.total / limit));
      setGames(data.games);
    }

  };
  useEffect(() => {
    

    fetchGames(1,10,'');
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    fetchGames(1,10,event.target.value);  
}
  return (
    <div className="gamesWrapper">
      <h1>Games List</h1> 
      <input type="text" onChange={handleSearch} className=''/>
      
      <div className="gamesGrid">
        {games && games.map(game => (
          <Link to={`/game/${game._id}`} key={game._id}>
            <div className="gamePanel">
              <img src={"//images.igdb.com/igdb/image/upload/t_cover_big/" + game.cover.url.split("/")[7]}></img>
              <p>{game.name + ` (${new Date(game.first_release_date * 1000).getFullYear()})`}</p  >
            </div>
          </Link>

        ))}
      </div>

      <div className="pagination">
        <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}> Previous </button>
        {currentPage != 1 && <button onClick={() => changePage(1)} disabled={currentPage === 1}> 1 </button> }
        {currentPage > 4 && <p> ... </p> }
        {currentPage > 3 && <button onClick={() => changePage(currentPage - 2)}> {currentPage - 2} </button> }  
        {currentPage > 2 && <button onClick={() => changePage(currentPage - 1)}> {currentPage - 1} </button> }
        <button onClick={() => changePage(currentPage)} disabled={currentPage === currentPage}> {currentPage} </button> 
        {currentPage < lastPage - 2  && <button onClick={() => changePage(currentPage + 1)}> {currentPage + 1} </button> }
        {currentPage < lastPage - 3 && <button onClick={() => changePage(currentPage + 1)}> {currentPage + 2} </button> } 
        {currentPage < lastPage - 2 && <p> ... </p> }
        {currentPage != lastPage && <button onClick={() => changePage(lastPage)} disabled={currentPage === lastPage}> {lastPage} </button> }
        <button onAbort={() => changePage(currentPage + 1)} > Next </button>
    </div>
    
    </div>
  );
};

export default Games;