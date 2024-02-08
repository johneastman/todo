import { useContext, useEffect, useState } from "react";
import { COPY, List, MOVE } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { MoveItemAction, SelectionValue } from "../types";
import CustomDropdown from "./CustomDropdown";
import { MoveItems } from "../data/reducers/app.reducer";
import { AppContext } from "../contexts/app.context";
import { areCellsSelected } from "../utils";
import Error from "./Error";

type MoveItemsModalProps = {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    currentList: List;
    otherLists: List[];
};

export default function MoveItemsModal(
    props: MoveItemsModalProps
): JSX.Element {
    const { isVisible, setIsVisible, currentList, otherLists } = props;

    const appContext = useContext(AppContext);
    const { dispatch } = appContext;

    // States
    const [action, setAction] = useState<MoveItemAction>("Copy");
    const [source, setSource] = useState<List>();
    const [destination, setDestination] = useState<List>();
    const [error, setError] = useState<string>();

    // Effects
    useEffect(() => {
        // Reset values every time modal opens
        setAction("Copy");
        setSource(areItemsInCurrentListSelected() ? currentList : undefined);
        setDestination(undefined);
    }, [props]);

    useEffect(() => setError(undefined), [action, source, destination]);

    const areItemsInCurrentListSelected = (): boolean => {
        return areCellsSelected(currentList.items);
    };

    const positiveAction = () => {
        if (source === undefined) {
            setError("A source list must be selected");
            return;
        }

        if (source.id === currentList.id && destination === undefined) {
            setError("A destination list must be selected");
            return;
        }

        dispatch(
            new MoveItems(
                action,
                currentList.id,
                source.id,
                destination?.id ?? currentList.id
            )
        );

        // Dismiss the modal
        setIsVisible(false);
    };

    const negativeAction = () => {
        setIsVisible(false);
    };

    // Data
    const actions: SelectionValue<MoveItemAction>[] = [COPY, MOVE];

    // The source list options should include the current list (if the current list
    // has items selected) and any other lists that contain items.
    const sourceLists: List[] = [
        ...(areItemsInCurrentListSelected() ? [currentList] : []),
        ...otherLists.filter((l) => l.items.length > 0),
    ];

    const labeledSourceLists: SelectionValue<List>[] = sourceLists.map(
        (l: List): SelectionValue<List> => ({
            label: l.id === currentList.id ? "Current List" : l.name,
            value: l,
        })
    );

    const labeledDestinationLists: SelectionValue<List>[] = otherLists.map(
        (l: List): SelectionValue<List> => ({
            label: l.name,
            value: l,
        })
    );

    return (
        <CustomModal
            title={`Select list to ${action} items from into this list`}
            isVisible={isVisible}
            positiveActionText={action}
            positiveAction={positiveAction}
            negativeActionText={"Cancel"}
            negativeAction={negativeAction}
        >
            <CustomRadioButtons
                data={actions}
                setSelectedValue={function (newValue: MoveItemAction): void {
                    setAction(newValue);
                }}
                selectedValue={action}
            />

            <CustomDropdown
                placeholder="Select source list"
                data={labeledSourceLists}
                setSelectedValue={setSource}
                selectedValue={source}
            />

            {/**
             * If the source list is NOT the current list, the destination is the current list.
             * This is also true when no items are selected in the current list.
             */}
            {source?.id === currentList.id && (
                <CustomDropdown
                    placeholder="Select destination list"
                    data={labeledDestinationLists}
                    setSelectedValue={(newList: List) =>
                        setDestination(newList)
                    }
                    selectedValue={destination}
                />
            )}
            <Error error={error} />
        </CustomModal>
    );
}
