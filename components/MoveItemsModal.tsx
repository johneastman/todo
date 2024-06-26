import { useContext, useEffect, useReducer } from "react";
import { COPY, List, MOVE } from "../data/data";
import CustomModal from "./core/CustomModal";
import CustomRadioButtons from "./core/CustomRadioButtons";
import { MoveItemAction, SelectionValue } from "../types";
import CustomDropdown from "./core/CustomDropdown";
import { MoveItems } from "../data/reducers/app.reducer";
import { AppContext } from "../contexts/app.context";
import {
    MoveItemsModalState,
    UpdateSource,
    UpdateDestination,
    UpdateAction,
    moveItemsModalReducer,
} from "../data/reducers/moveItemsModal.reducer";
import { UpdateError, Replace } from "../data/reducers/common";

function getState(list: List, listIndex: number): MoveItemsModalState {
    return {
        action: "Copy",
        source: list.areAnyItemsSelected() ? listIndex : undefined,
    };
}

type MoveItemsModalProps = {
    listIndex: number;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
};

export default function MoveItemsModal(
    props: MoveItemsModalProps
): JSX.Element {
    const { listIndex, isVisible, setIsVisible } = props;

    const appContext = useContext(AppContext);
    const {
        data: { lists },
        dispatch,
    } = appContext;

    const currentList: List | undefined = lists[listIndex];
    if (currentList === undefined) {
        throw Error(`No list at index: ${listIndex}`);
    }

    const [moveItemsModalState, moveItemsModalDispatch] = useReducer(
        moveItemsModalReducer,
        getState(currentList, listIndex)
    );
    const { action, source, destination, error } = moveItemsModalState;

    const setError = (newError: string) =>
        moveItemsModalDispatch(new UpdateError(newError));

    const setSource = (newSource: number) =>
        moveItemsModalDispatch(new UpdateSource(newSource));

    const setDestination = (newDestination: number) =>
        moveItemsModalDispatch(new UpdateDestination(newDestination));

    const setAction = (newAction: MoveItemAction) =>
        moveItemsModalDispatch(new UpdateAction(newAction));

    useEffect(() => {
        const newState: MoveItemsModalState = getState(currentList, listIndex);
        moveItemsModalDispatch(new Replace(newState));
    }, [props]);

    const positiveAction = () => {
        if (source === undefined) {
            setError("A source list must be selected");
            return;
        }

        if (source === listIndex && destination === undefined) {
            setError("A destination list must be selected");
            return;
        }

        dispatch(
            new MoveItems(action, listIndex, source, destination ?? listIndex)
        );

        // Dismiss the modal
        setIsVisible(false);
    };

    const negativeAction = () => {
        setIsVisible(false);
    };

    // Data
    const actions: SelectionValue<MoveItemAction>[] = [COPY, MOVE];

    /**
     * To preverse lists' indices, create a {@link List}-{@link number} tuple, then filter
     * those tuples based on the desired criteria, then convert those tuples
     * to {@link SelectionValue} objects.
     *
     * The source lists contains all lists that have items and the current list if items
     * in that list are selected.
     *
     * For the destination lists, we want all mlists that are not the current list.
     */
    const labeledSourceLists: SelectionValue<number>[] = lists
        .map((list, index): [List, number] => [list, index])
        .filter(
            ([list, index]) =>
                (index !== listIndex && list.items.length > 0) ||
                (index === listIndex && list.areAnyItemsSelected())
        )
        .map(([list, index]) => ({
            label: index === listIndex ? "Current List" : list.name,
            value: index,
        }));

    const labeledDestinationLists: SelectionValue<number>[] = lists
        .map((list, index): [List, number] => [list, index])
        .filter(([_, index]) => index !== listIndex)
        .map(([list, index]) => ({ label: list.name, value: index }));

    return (
        <CustomModal
            title={`Select list to ${action} items from into this list`}
            isVisible={isVisible}
            positiveActionText={action}
            positiveAction={positiveAction}
            negativeActionText={"Cancel"}
            negativeAction={negativeAction}
            error={error}
        >
            <CustomRadioButtons
                data={actions}
                setSelectedValue={setAction}
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
            {source === listIndex && (
                <CustomDropdown
                    placeholder="Select destination list"
                    data={labeledDestinationLists}
                    setSelectedValue={setDestination}
                    selectedValue={destination}
                />
            )}
        </CustomModal>
    );
}
