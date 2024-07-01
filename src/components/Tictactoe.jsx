import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faO, faRedo } from '@fortawesome/free-solid-svg-icons'
import Modal from './Modal'

export default function Tictactoe() {
    
    const [board, setBoard] = useState(Array(9).fill(null))
    const [isXNext, setIsXNext] = useState(true)
    const [title, setTitle] = useState('Tic-Tac-Toe Game')
    const [isModalOpen, setIsModalOpen] = useState(true)
    const [isSinglePlayer, setIsSinglePlayer] = useState(null)
    const [playerChoice, setPlayerChoice] = useState(null)
    const [firstAIMove, setFirstAIMove] = useState(true)

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

        if (emptyIndexes.length === 0) 
            return

        if (firstAIMove) {
            const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)]
            newBoard[randomIndex] = playerChoice === 'X' ? 'O' : 'X'
        } else {
            const bestMove = getBestMove(newBoard, playerChoice === 'X' ? 'O' : 'X')
            newBoard[bestMove] = playerChoice === 'X' ? 'O' : 'X'
        }

        setBoard(newBoard)
        setIsXNext(true)
    }

    const getBestMove = (newBoard, aiPlayer) => {
        let bestScore = -Infinity
        let move
        newBoard.forEach((cell, index) => {
            if (cell === null) {
                newBoard[index] = aiPlayer
                const score = minimax(newBoard, 0, false, aiPlayer)
                newBoard[index] = null
                if (score > bestScore) {
                    bestScore = score
                    move = index
                }
            }
        })
        return move
    }

    const minimax = (newBoard, depth, isMaximizing, aiPlayer) => {
        const humanPlayer = aiPlayer === 'X' ? 'O' : 'X'
        const winner = calculateWinner(newBoard)

        if (winner === aiPlayer) return 10 - depth
        if (winner === humanPlayer) return depth - 10
        if (newBoard.every(cell => cell !== null)) return 0

        if (isMaximizing) {
            let bestScore = -Infinity
            newBoard.forEach((cell, index) => {
                if (cell === null) {
                    newBoard[index] = aiPlayer
                    const score = minimax(newBoard, depth + 1, false, aiPlayer)
                    newBoard[index] = null
                    bestScore = Math.max(score, bestScore)
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity
            newBoard.forEach((cell, index) => {
                if (cell === null) {
                    newBoard[index] = humanPlayer
                    const score = minimax(newBoard, depth + 1, true, aiPlayer)
                    newBoard[index] = null
                    bestScore = Math.min(score, bestScore)
                }
            })
            return bestScore
        }
    }

    useEffect(() => {
        if (isSinglePlayer && !isXNext && !calculateWinner(board)) {
            const newBoard = [...board]
            aiMove(newBoard)
        }
    }, [isXNext])

    const resetGame = () => {
        setBoard(Array(9).fill(null))
        setIsXNext(playerChoice !== 'O')
        setTitle('Tic-Tac-Toe Game')
        setFirstAIMove(true)
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
    
    useEffect(() => {
        if (winner) {
            setTitle(`${winner} Wins!`)
        } else if (draw) {
            setTitle("It's a tie!")
        }
    }, [winner, draw])

    const startGame = () => {
        setIsModalOpen(false)
        setIsXNext(playerChoice !== 'O' )
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