
export enum TerminalColor {
    error = "text-red-500",
    normal = "text-solana-green",
    system = "text-solana-blue"
}

export interface TerminalEntry {
    type: TerminalColor,
    message: string,
    timestamp: number, // will be filled with Date.now()
}

export const STARTING_ENTRIES = [
    {
        type: TerminalColor.system,
        message: 'Hello There!',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: 'Welcome to Coach\'s Coin Clicker! Let\'s get started!',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: '1. Deposit 0.01 sol into the Player Wallet ( by clicking Deposit Above )',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: '2. Click the coin, and buy upgrades',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: '3a. Withdraw your coins to play again later ( You\'ll get real Coin tokens! )',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: '3b. Submit your coins to the leaderboard! ( And be famous! )',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: 'Note: Have fun! Love, Coach Chuck!',
        timestamp: Date.now(),
    },
];