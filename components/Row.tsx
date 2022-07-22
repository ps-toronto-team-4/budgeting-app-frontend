import { TouchableRow, TouchableRowProps } from "./TouchableRow";

export type RowProps = Omit<TouchableRowProps, 'onPress'>;

export function Row(props: RowProps) {
    return <TouchableRow {...props} />
}
