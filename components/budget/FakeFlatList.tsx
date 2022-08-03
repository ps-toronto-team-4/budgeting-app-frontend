import { ReactElement } from "react"
import { View, Text } from "react-native"

const FakeFlatList = (
    {
        data,
        title,
        renderItem,
        ItemSeparatorComponent
    }
        :
        {
            data: Array<any>,
            title?: string | undefined,
            renderItem: (item: any) => ReactElement,
            ItemSeparatorComponent?: () => ReactElement
        }) => {

    const itemsRender = data.map((item: any, index: number) => {

        return (<View key={index}>
            {index != 0 && (ItemSeparatorComponent && ItemSeparatorComponent())}
            {renderItem({ item })}
        </View>)
    })

    return (<View>
        {title && <Text>{title}</Text>}
        {itemsRender}
    </View>)
}

export default FakeFlatList;