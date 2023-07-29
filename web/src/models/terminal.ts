
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

const LONG_STRING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque accumsan urna vitae justo malesuada, a commodo justo finibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum a diam semper, faucibus erat a, semper arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Praesent posuere, lorem a aliquet dapibus, diam mauris fringilla magna, sit amet facilisis mi sapien at est. Fusce nec tincidunt est. Fusce tincidunt convallis nisl, sed aliquam urna feugiat sed. Cras non facilisis erat. Nulla facilisi. Aenean vulputate dapibus felis, a consequat enim eleifend id. Curabitur lacinia ligula nec dapibus iaculis. Nullam vel congue est, ac malesuada libero.";
export const DUMMY_ENTRIES = [
    {
        type: TerminalColor.error,
        message: 'Error message',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.normal,
        message: 'Normal message',
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.normal,
        message: LONG_STRING,
        timestamp: Date.now(),
    },
    {
        type: TerminalColor.system,
        message: 'System message',
        timestamp: Date.now(),
    },
    // ... more entries
];