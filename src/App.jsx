import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, X, Maximize2, Search, Play } from 'lucide-react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Gamepad2 className="text-zinc-950" size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-emerald-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <button 
            onClick={toggleFullscreen}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-zinc-400 hover:text-white"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Games</h2>
            <p className="text-zinc-500">Hand-picked unblocked games for your entertainment.</p>
          </div>
          <div className="text-sm font-mono text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
            {filteredGames.length} GAMES FOUND
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <motion.div
              key={game.id}
              layoutId={game.id}
              onClick={() => setSelectedGame(game)}
              className="group cursor-pointer bg-zinc-900 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <Play className="text-zinc-950 fill-current ml-1" size={24} />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 group-hover:text-emerald-400 transition-colors">{game.title}</h3>
                <p className="text-zinc-500 text-sm line-clamp-2">{game.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
              <Gamepad2 className="text-zinc-700" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No games found</h3>
            <p className="text-zinc-500">Try searching for something else.</p>
          </div>
        )}
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-zinc-950/95 backdrop-blur-xl"
          >
            <motion.div
              layoutId={selectedGame.id}
              className="w-full max-w-6xl bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-full max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Gamepad2 className="text-zinc-950" size={18} />
                  </div>
                  <h3 className="font-bold text-lg">{selectedGame.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                  allow="autoplay; fullscreen; gamepad"
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-zinc-900 border-t border-white/5 flex items-center justify-between">
                <p className="text-zinc-500 text-sm hidden sm:block">
                  Playing <span className="text-zinc-300 font-medium">{selectedGame.title}</span>
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(selectedGame.iframeUrl, '_blank')}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium transition-colors"
                  >
                    Open in New Tab
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl text-sm font-bold transition-colors"
                  >
                    Close Game
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gamepad2 className="text-emerald-500" size={20} />
            <span className="font-bold tracking-tight">UNBLOCKED GAMES</span>
          </div>
          <p className="text-zinc-500 text-sm max-w-md mx-auto">
            A simple hub for playing your favorite unblocked games directly in your browser. No downloads, no hassle.
          </p>
          <div className="mt-8 pt-8 border-t border-white/5 text-zinc-600 text-xs">
            © {new Date().getFullYear()} Unblocked Games Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
