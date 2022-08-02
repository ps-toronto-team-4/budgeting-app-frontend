import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ColorValue, StyleSheet, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRefresh } from "../../hooks/useRefresh";
import { DeleteCategoryDocument, DeleteCategoryMutation, DeleteCategoryMutationVariables, GetCategoriesDocument, GetCategoriesQuery, GetCategoriesQueryVariables, UpdateCategoryDocument, UpdateCategoryMutation, UpdateCategoryMutationVariables } from "../generated";
import { ColorField } from "./ColorField";
import { Form } from "./Form";
import { InputField } from "./InputField";

export interface CategoryFormValues {
    id: number;
    name: string;
    color: ColorValue;
    details?: string;
}

export interface CategoryEditFormProps {
    /**
     * Values to initial the form fields with.
     */
    initVals?: CategoryFormValues;
    onSubmit: (vals: CategoryFormValues) => void;
}

export function CategoryEditForm({ initVals, onSubmit }: CategoryEditFormProps) {
    const [getCategories, { data, refetch }] = useLazyQuery<GetCategoriesQuery, GetCategoriesQueryVariables>(GetCategoriesDocument, {
        onError: (e) => {
            alert('Error fetching categories: ' + e.message);
        }
    });
    const passwordHash = useAuth({
        onRetrieved: (passwordHash) => getCategories({ variables: { passwordHash } }),
        redirect: 'ifUnauthorized',
    });
    useRefresh(refetch);
    const [name, setName] = useState(initVals?.name || '');
    const [color, setColor] = useState<ColorValue | null>(initVals?.color || null);
    const [details, setDetails] = useState(initVals?.details || '');
    const [nameError, setNameError] = useState('');
    const nav = useNavigation();

    const [updateCategory, { }] = useMutation<UpdateCategoryMutation, UpdateCategoryMutationVariables>(UpdateCategoryDocument, {
        onCompleted: (response) => {
            nav.canGoBack() ? nav.goBack() : nav.navigate("CategorySettings");
        },
        onError: (e) => {
            alert('Error updating category: ' + e.message);
        },
    });

    const [deleteCategory, { }] = useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, {
        onCompleted: (response) => {
            nav.canGoBack() ? nav.goBack() : nav.navigate("CategorySettings");
        },
        onError: (e) => {
            alert('Error deleting category: ' + e.message);
        },
    });

    return (
        <Form>
            <View style={styles.container}>
                <InputField
                    label="Name"
                    placeholder="required"
                    defaultValue={name}
                    onChange={setName}
                    errorMessage={nameError} />
                <ColorField label="Color" />
            </View>
        </Form>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
    },
});
