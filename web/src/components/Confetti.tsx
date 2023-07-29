import React from 'react';
import Confetti from 'react-confetti';

const ConfettiArea = () => {
    const goldColors = ['#FFD700', '#DAA520', '#CDAD00']; // Array of gold colors

    const drawOctagon = (ctx: CanvasRenderingContext2D) => {
        const side = 13;
        const apothem = side / (2 * Math.tan(Math.PI / 8)); // calculate the apothem
        const radius = side / (2 * Math.sin(Math.PI / 8)); // calculate the radius

        ctx.beginPath();
        ctx.moveTo(radius, 0);

        // Draw the 8 sides of the octagon
        for (let i = 1; i <= 8; i++) {
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
                numberOfPieces={5}
                colors={goldColors}
                drawShape={drawOctagon}
                initialVelocityX={4}
                initialVelocityY={1}
                gravity={0.03}
                run={true}
            />
        </div>
        </>


    )
}

export default ConfettiArea;
