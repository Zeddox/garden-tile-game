export const LoadingSpinner = (props: { scale?: number }) => {
    return <DotSpin scale={props.scale} />;
};

const DotSpin = (props: { scale?: number }) => {
    return <div className={'dot-spin'} style={props.scale ? { transform: `scale(${props.scale})` } : undefined}></div>;
};
