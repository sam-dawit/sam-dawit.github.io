// UltimateTicTacToe.js
import React, { useState, useEffect } from "react";

const initialBoard = Array(9).fill(Array(9).fill(null));

function checkWinner(board) {
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let [a, b, c] of winningLines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function UltimateTicTacToe() {
    const [mode, setMode] = useState(null); // Game mode: 'single' or 'multi'
    const [mainBoard, setMainBoard] = useState(initialBoard);
    const [globalBoard, setGlobalBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState("X");
    const [activeBoard, setActiveBoard] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const resetGame = () => {
        setMainBoard(initialBoard);
        setGlobalBoard(Array(9).fill(null));
        setCurrentPlayer("X");
        setActiveBoard(null);
    };

    const handleMove = (boardIndex, cellIndex) => {
        if (
            globalBoard[boardIndex] ||
            (activeBoard !== null && activeBoard !== boardIndex)
        )
            return;

        const newBoard = mainBoard.map((board, i) =>
            i === boardIndex
                ? board.map((cell, j) =>
                      j === cellIndex ? currentPlayer : cell
                  )
                : board
        );

        const boardWinner = checkWinner(newBoard[boardIndex]);
        const newGlobalBoard = [...globalBoard];
        if (boardWinner) {
            newGlobalBoard[boardIndex] = boardWinner;
        }

        setMainBoard(newBoard);
        setGlobalBoard(newGlobalBoard);
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
        setActiveBoard(newGlobalBoard[cellIndex] ? null : cellIndex);
    };

    const makeAIMove = () => {
        if (checkWinner(globalBoard)) return;

        const availableBoardIndex =
            activeBoard === null || globalBoard[activeBoard]
                ? globalBoard.findIndex((b) => !b)
                : activeBoard;
        if (availableBoardIndex === -1) return;

        const availableCells = mainBoard[availableBoardIndex]
            .map((cell, idx) => (cell === null ? idx : null))
            .filter((idx) => idx !== null);

        if (availableCells.length === 0) return;

        const randomCell =
            availableCells[Math.floor(Math.random() * availableCells.length)];
        handleMove(availableBoardIndex, randomCell);
    };

    useEffect(() => {
        if (mode === "single" && currentPlayer === "O") {
            setTimeout(makeAIMove, 500);
        }
    }, [currentPlayer, mode]);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

    if (!mode) {
        return (
            <div style={{ textAlign: "center", paddingTop: "20px" }}>
                <h1>Ultimate Tic Tac Toe</h1>
                <button onClick={() => setMode("single")} style={buttonStyle}>
                    Single Player
                </button>
                <button onClick={() => setMode("multi")} style={buttonStyle}>
                    Multiplayer
                </button>
                <button
                    onClick={toggleDarkMode}
                    style={{ ...buttonStyle, marginTop: "20px" }}
                >
                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
            </div>
        );
    }

    const checkGlobalWinner = checkWinner(globalBoard);

    return (
        <div
            style={{
                textAlign: "center",
                backgroundColor: isDarkMode ? "#333" : "#fff",
                color: isDarkMode ? "#fff" : "#000",
                minHeight: "100vh",
            }}
        >
            <h1>Ultimate Tic Tac Toe</h1>
            {checkGlobalWinner ? (
                <h2>Winner: {checkGlobalWinner}</h2>
            ) : (
                <h2>Current Player: {currentPlayer}</h2>
            )}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                }}
            >
                {mainBoard.map((board, boardIndex) => (
                    <div
                        key={boardIndex}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "5px",
                            padding: "10px",
                            border: "2px solid black",
                            backgroundColor:
                                activeBoard === boardIndex ||
                                activeBoard === null
                                    ? isDarkMode
                                        ? "#444"
                                        : "#eee"
                                    : isDarkMode
                                    ? "#222"
                                    : "#ccc",
                        }}
                    >
                        {globalBoard[boardIndex] ? (
                            // If the sub-board is won, display the winning symbol ("X" or "O") in the center
                            <div
                                style={{
                                    gridColumn: "1 / span 3",
                                    gridRow: "1 / span 3",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "48px",
                                    fontWeight: "bold",
                                    color:
                                        globalBoard[boardIndex] === "X"
                                            ? "#f1c40f"
                                            : "#3498db",
                                }}
                            >
                                {globalBoard[boardIndex]}
                            </div>
                        ) : (
                            // Otherwise, display each cell in the sub-board
                            board.map((cell, cellIndex) => (
                                <div
                                    key={cellIndex}
                                    onClick={() =>
                                        currentPlayer === "X" &&
                                        handleMove(boardIndex, cellIndex)
                                    }
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "24px",
                                        border: "1px solid black",
                                        backgroundColor: cell
                                            ? cell === "X"
                                                ? "#f1c40f"
                                                : "#3498db"
                                            : isDarkMode
                                            ? "#666"
                                            : "white",
                                        color: isDarkMode ? "#fff" : "#000",
                                        cursor: "pointer",
                                    }}
                                >
                                    {cell}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
            <button
                onClick={resetGame}
                style={{ ...buttonStyle, marginTop: "20px" }}
            >
                Reset Game
            </button>
        </div>
    );
}

const buttonStyle = {
    padding: "10px 20px",
    margin: "10px",
    cursor: "pointer",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
};

export default UltimateTicTacToe;
