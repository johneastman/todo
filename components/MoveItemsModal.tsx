import { useContext, useEffect, useState } from "react";
import { COPY, Item, List, MOVE } from "../data/data";
import CustomModal from "./CustomModal";
import CustomRadioButtons from "./CustomRadioButtons";
import { MoveItemAction, SelectionValue } from "../types";
import CustomDropdown from "./CustomDropdown";
import { getItems, saveItems } from "../data/utils";
import { areCellsSelected } from "../utils";
import { MoveItems } from "../data/reducers/app.reducer";
import { AppContext } from "../contexts/app.context";

interface MoveItemsModalProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    currentList: List;
    otherLists: List[];

    setItems: (items: Item[]) => void;
}

export default function MoveItemsModal(
    props: MoveItemsModalProps
): JSX.Element {
    const { isVisible, setIsVisible, currentList, otherLists, setItems } =
        props;

    const appContext = useContext(AppContext);
    const { dispatch } = appContext;

    // Data
    const actions: SelectionValue<MoveItemAction>[] = [COPY, MOVE];

    // The source list should be the current list plus any other lists that contain items.
    const sourceLists: List[] = [currentList].concat(
        otherLists.filter((l) => l.items.length > 0)
    );

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

    // States
    const [action, setAction] = useState<MoveItemAction>("copy");
    const [source, setSource] = useState<List>(currentList);
    const [destination, setDestination] = useState<List>();

    // Effects
    useEffect(() => {
        // Reset values every time modal opens
        setAction("copy");
        setSource(currentList);
    }, [props]);

    const positiveAction = async () => {
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
                setSelectedValue={(newList: List) => setSource(newList)}
                selectedValue={source}
            />

            {/* If the source list is NOT the current list, the destination is the current list */}
            {source.id === currentList.id && (
                <CustomDropdown
                    placeholder="Select destination list"
                    data={labeledDestinationLists}
                    setSelectedValue={(newList: List) =>
                        setDestination(newList)
                    }
                    selectedValue={destination}
                />
            )}
        </CustomModal>
    );
}
