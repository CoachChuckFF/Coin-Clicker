import { useAppState } from "../hooks/ClickerStore";

export interface ButtonProps {
    onClick: () => void;
    text: string;
}

export function GameButton(props: ButtonProps) {
    const { onClick, text } = props;
    const { isLoading } = useAppState();

    const handleClick = () => {
        if(isLoading) return;
        onClick();
    }

    return (
        <button onClick={handleClick} className="transition duration-200 ease-in-out bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 text-white font-bold py-2 px-4 rounded">{text}</button>
    );

}