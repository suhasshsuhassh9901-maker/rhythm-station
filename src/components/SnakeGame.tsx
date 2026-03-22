import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      const head = { ...snake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      const newSnake = [head, ...snake];

      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => prev + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffcc' : '#00ccaa';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00ffcc';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff0066';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0066';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex justify-between w-full px-2 mb-2">
        <div className="text-neon-cyan font-mono text-xl tracking-widest">
          SCORE: <span className="text-white">{score}</span>
        </div>
        <div className="text-neon-pink font-mono text-sm uppercase tracking-tighter self-center">
          {isPaused ? 'Paused' : 'Playing'}
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-lg border-2 border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,204,0.2)]"
        />
        
        {(gameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-lg backdrop-blur-sm transition-all">
            {gameOver ? (
              <>
                <h2 className="text-4xl font-bold text-neon-pink mb-4 animate-pulse">GAME OVER</h2>
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-neon-cyan text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,255,204,0.5)]"
                >
                  RESTART
                </button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-neon-cyan mb-4">SNAKE</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-8 py-3 bg-neon-pink text-white font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,0,102,0.5)]"
                >
                  START GAME
                </button>
                <p className="mt-4 text-white/50 text-sm font-mono">Use Arrow Keys to Move</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
