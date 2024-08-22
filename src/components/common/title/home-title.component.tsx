import { Heading1 } from "../typography/typography.component"
export interface HomePageTitleProps {
    title: string,
    url?: string | null | undefined
}
const HomePageTitle = ({ title, url }: HomePageTitleProps) => {
    return (<>
        <div className="flex justify-between my-2 p-3 border-b border-solid  border-gray-400 bg-slate-100">
            <Heading1>{title}</Heading1>
            {
                url ? <a className="text-teal-800 text-l font-bold py-5 hover:cursor-pointer" href={url}>
                    View All &rarr;
                </a> : <></>
            }
        </div>
    </>)
}
export default HomePageTitle