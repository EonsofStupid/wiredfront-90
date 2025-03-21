
export const iconStackStyles = {
  container: 'absolute flex flex-col space-y-2 z-50 animate-fade-in-up',
  positions: {
    left: 'left-4 bottom-16',
    right: 'right-4 bottom-16'
  },
  button: 'h-8 w-8 rounded-full bg-black/40 shadow-lg transition-all duration-300',
  variants: {
    neonBlue: 'border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 hover:text-white shadow-neon-blue/20',
    neonPink: 'border border-neon-pink/30 text-neon-pink hover:bg-neon-pink/20 hover:text-white shadow-neon-pink/20',
    neonPurple: 'border border-purple-500/30 text-purple-500 hover:bg-purple-500/20 hover:text-white shadow-purple-500/20',
    neonTeal: 'border border-teal-400/30 text-teal-400 hover:bg-teal-400/20 hover:text-white shadow-teal-400/20',
    default: 'border border-gray-400/30 text-gray-400 hover:bg-gray-400/20 hover:text-white shadow-gray-400/20'
  }
};
