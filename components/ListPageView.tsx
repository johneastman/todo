interface ListPageViewProps<T> {
    children?: React.ReactNode;
}

export default function ListPageView<T>(
    props: ListPageViewProps<T>
): JSX.Element {
    const { children } = props;
    return <>{children}</>;
}
