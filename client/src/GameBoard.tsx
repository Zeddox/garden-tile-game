import { GiFruitTree, GiMushroomHouse, GiFlowers, GiLindenLeaf, GiStonePile, GiCirclingFish } from "react-icons/gi";

export const GameBoard = (props: { size:number }) => {
    const { size } = props;

    const getRowIcon = (index: number) => {
        const styles = 'w-full h-full';

        switch (index) {
            case 0:
                return <GiFruitTree className={styles}/>
            case 1:
                return <GiMushroomHouse className={styles}/>
            case 2:
                return <GiCirclingFish className={styles}/>
            case 3:
                return <GiFlowers className={styles}/>
            case 4:
                return <GiLindenLeaf className={styles}/>
            default:
                return <GiStonePile className={styles}/>
        }
    }

    return (
        <div className={'flex flex-col w-full'}>
            <div className={'grid grid-cols-6 mb-5 ml-[7.25rem] w-fit'}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div className={`w-24 h-12 p-2`}>
                        <div className={'w-full h-full bg-[#d2b48c24] border-2 border-red-500'}></div>
                    </div>
                ))}
            </div>
            <div className={'flex flex-row w-fit'}>
                <div className={'grid grid-rows-6 border-2 border-red-500 mr-4'}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div className={`w-24 h-24 p-2 bg-[#d2b48c24] ${index !== 0 ? 'border-t-2 border-red-500' : ''}`}>
                            {getRowIcon(index)}
                        </div>
                    ))}

                </div>
                <div className={`grid grid-cols-6 aspect-square w-fit border-2 border-white`}>
                    {Array.from({ length: 36 }).map((_, index) => {
                        console.log(`${index}: ${index % 7 === 0}`)
                        return (
                            <div className={`w-24 bg-[#d2b48c24] border-white ${index < 30 ? 'border-b-2' : ''} ${index % 6 !== 5 ? 'border-r-2' : ''}`}>
                            </div>
                        )
                    })}
                </div>
            </div>

        </div>
    );
}