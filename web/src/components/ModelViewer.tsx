export const ModelViewer = () => {
    const handleClick = (e: any) => {
        console.log('Model clicked', e);
    };

    const modelHTML = `
    <model-viewer 
        src="https://arweave.net/MtyZ1n5soAmvC6NTaabaotEVdvxp6yKMjSX--yNYA0U" 
        alt="A 3D model of something" 
        ar 
        auto-rotate 
        camera-controls
        class="object-contain w-full">
    </model-viewer>
    `;

    return (
        <div 
            onClick={handleClick} 
            dangerouslySetInnerHTML={{ __html: modelHTML }}
        />
    );
};