export default function Modal({ handleGameModeChange, handlePlayerChoice, startGame, isSinglePlayer, playerChoice }) {

    return(
        <div className="modal">
            <h2>Single or Multi-player</h2>
            <div>
                <label htmlFor="single">Single player</label>
                <input 
                    type="radio" 
                    id="single" 
                    name="gameMode" 
                    value="single"
                    onChange={() => handleGameModeChange('single')}
                    style={{ cursor: 'pointer' }} 
            />
            
                <label htmlFor="multi">Multiplayer</label>
                <input 
                    type="radio" 
                    id="multi" 
                    name="gameMode" 
                    value="multi"
                    onChange={() => handleGameModeChange('multi')}
                    style={{ cursor: 'pointer' }}
            />
            </div>
            
            {isSinglePlayer !== null && (
                <div>
                    <h2>Choose X or O</h2>
                    <label htmlFor="x">X</label>
                    <input 
                        type="radio" 
                        id="x" 
                        name="playerChoice" 
                        value="X"
                        onChange={() => handlePlayerChoice('X')}
                        style={{ cursor: 'pointer' }}
                    />
                    <label htmlFor="o">O</label>
                    <input 
                        type="radio" 
                        id="o" 
                        name="playerChoice" 
                        value="O"
                        onChange={() => handlePlayerChoice('O')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            )}

            {playerChoice && <button onClick={startGame}>Start Game</button>}
        </div>
    )
}