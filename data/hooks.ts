import { useEffect, useState } from "react";
import { ListTypeValues } from "../types";
import { getDefaultListType, getDeveloperMode } from "./utils";

/**
 * Hook for retrieving the default list type.
 * 
 * @returns value and setter
 */
export function useDefaultListType(): [ListTypeValues, React.Dispatch<React.SetStateAction<ListTypeValues>>] {
    const [listType, setListType] = useState<ListTypeValues>("List");

    useEffect(() => {
        (async () => {
            let defaultListType = await getDefaultListType();
            setListType(defaultListType);
        })();
    });

    return [listType, setListType];
}


/**
 * Hook for retrieving the developer-mode flag.
 * 
 * @param runOnce sometimes we want to retrieve the developer-mode flag during the first render, while other
 * times we want to retrieve it every time components re-render. 
 * 
 * @returns value and setter
 */
export function useDeveloperMode(runOnce: boolean = false): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
    const [devMode, setDevMode] = useState<boolean>(false);

    useEffect(() => {
        (async () => setDevMode(await getDeveloperMode()))();
    }, runOnce ? [] : undefined);

    return [devMode, setDevMode];
}
