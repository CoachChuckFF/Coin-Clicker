import React from 'react';
import Confetti from 'react-confetti';

function getColors(coins: number): string[]{
    if(coins >= 1_000_000_000) return ['#16F195', '#4AAACE', '#9A45FF', '#CE4A5C', '#CE784A', '#DAA520', '#FFFFFF'];
    if(coins >= 100_000_000) return ['#DFDFDF', '#FFFFFF', '#E3E3E3'];
    if(coins >= 10_000_000) return ['#CE784A', '#CE7240', '#CE7D51'];
    if(coins >= 1_000_000) return ['#CE4A5C', '#CE5263', '#CE384C'];
    if(coins >= 100_000) return ['#9A45FF', '#A355FF', '#8C2BFF'];
    if(coins >= 10_000) return ['#4AAACE', '#5CAFCE', '#239FCE'];
    if(coins >= 1_000) return ['#16F195', '#2FF1A0', '#00D179']; 

    return ['#FFD700', '#DAA520', '#CDAD00'];
}

const ConfettiArea = (props: { coins: number }) => {
    const colors = getColors(props.coins);

    const drawOctagon = (ctx: CanvasRenderingContext2D) => {
        const side = 13;
        const radius = side / (2 * Math.sin(Math.PI / 8)); // calculate the radius

        ctx.beginPath();
        ctx.moveTo(radius, 0);

        // Draw the 8 sides of the octagon
        for (let i = 1; i <= 13; i++) {
            ctx.lineTo(
                radius * Math.cos((2 * Math.PI * i) / 8),
                radius * Math.sin((2 * Math.PI * i) / 8)
            );
        }

        ctx.closePath();
        ctx.fill();
    };

    return (
        <>
            <div className='confetti-overlay'></div>
            <div className='-z-10'>
            <Confetti 
                numberOfPieces={8}
                colors={colors}
                drawShape={drawOctagon}
                initialVelocityX={4}
                initialVelocityY={1}
                gravity={0.03}
                wind={-0.001}
                run={true}
            />
        </div>
        </>


    )
}

export default ConfettiArea;
