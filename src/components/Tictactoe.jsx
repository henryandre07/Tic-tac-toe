import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faO, faRedo } from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal'

export default function Tictactoe() {
    
    const [board, setBoard] = React.useState(Array(9).fill(null))
    const [isXNext, setIsXNext] = React.useState(true)
    const [title, setTitle] = React.useState('Tic-Tac-Toe Game')
    const [isModalOpen, setIsModalOpen] = React.useState(true)
    const [isSinglePlayer, setIsSinglePlayer] = React.useState(null)
    const [playerChoice, setPlayerChoice] = React.useState(null)

    const handleClick = (index) => {
        const newBoard = [...board]
        if (newBoard[index] || calculateWinner(newBoard)) return

        newBoard[index] = isXNext ? playerChoice : (playerChoice === 'X' ? 'O' : 'X')
        setBoard(newBoard)
        setIsXNext(!isXNext)
    }

    const aiMove = (newBoard) => {
        const emptyIndexes = newBoard
        .map((value, index) => (value === null ? index : null))
        .filter((value) => value !== null)

        const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
        newBoard[randomIndex] = playerChoice === 'X' ? 'O' : 'X'
        setBoard(newBoard)
        setIsXNext(true)
    }

    React.useEffect(() => {
        if (isSinglePlayer && !isXNext && !calculateWinner(board)) {
            const newBoard = [...board]
            aiMove(newBoard)
        }
    }, [isXNext])

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setIsXNext(true)
        setTitle('Tic-Tac-Toe Game')
        if (isSinglePlayer && playerChoice === 'O') {
            setIsXNext(false);
            aiMove(Array(9).fill(null));
        }
    }

    const renderBox = (index) => {
        return (
            <div className='box' onClick={() => handleClick(index)}>
                {board[index] === 'X' && <FontAwesomeIcon icon={faX} className='x-icon' />}
                {board[index] === 'O' && <FontAwesomeIcon icon={faO} className='o-icon' />}
            </div>
        )
    }

    const calculateWinner = (board) => {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ]
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
              return board[a];
            }
          }
        return null
    }
       
    const winner = calculateWinner(board)
    const draw = !winner && board.every((box) => box !== null)
    
    React.useEffect(() => {
        if (winner) {
            setTitle(`${winner} Wins!`)
        } else if (draw) {
            setTitle("It's a tie!")
        }
    }, [winner, draw])

    const startGame = () => {
        setIsModalOpen(false)
        if (isSinglePlayer && playerChoice === 'O') {
            setIsXNext(false)
            const newBoard = [...board]
            aiMove(newBoard)
        }
    }

    const handleGameModeChange = (mode) => {
        setIsSinglePlayer(mode === 'single')
    }

    const handlePlayerChoice = (choice) => {
        setPlayerChoice(choice)
    }
        
    return (
        <div className="container">
          {isModalOpen ? (
            <Modal 
                handleGameModeChange={handleGameModeChange} 
                handlePlayerChoice={handlePlayerChoice} 
                startGame={startGame}
                isSinglePlayer={isSinglePlayer}
                playerChoice={playerChoice}
            />
          ) : (
            <>
              <h1 className="header">{title}</h1> 
              <div className='board'>
                <div className='row'>
                    {renderBox(0)}
                    {renderBox(1)}
                    {renderBox(2)}
                </div>
                <div className='row'>
                    {renderBox(3)}
                    {renderBox(4)}
                    {renderBox(5)}
                </div>
                <div className='row'>
                    {renderBox(6)}
                    {renderBox(7)}
                    {renderBox(8)}
                </div>
              </div>
              <button className='resetbtn' onClick={resetGame}>
                Reset {' '}
                <FontAwesomeIcon icon={faRedo} />
              </button>
            </>
          )}
        </div>
    )
}

// AI for Single Player: Implement a basic AI for single-player mode.
// End Game Message: Display a message when the game ends (either win or draw).
// Responsive Design: Ensure the game works well on different screen sizes.  