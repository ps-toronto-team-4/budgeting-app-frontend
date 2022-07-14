import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CategoriesPayload = CategoriesSuccess | FailurePayload;

export type CategoriesSuccess = {
  __typename?: 'CategoriesSuccess';
  categories: Array<Maybe<Category>>;
};

export type Category = {
  __typename?: 'Category';
  colourHex?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type CategoryPayload = CategorySuccess | FailurePayload;

export type CategorySuccess = {
  __typename?: 'CategorySuccess';
  category: Category;
};

export type CreateExpensePayload = ExpenseSuccess | FailurePayload;

export type CreateUserPayload = CreateUserSuccess | FailurePayload;

export type CreateUserSuccess = {
  __typename?: 'CreateUserSuccess';
  passwordHash: Scalars['String'];
  user: User;
};

export type DeleteCategoryPayload = DeleteSuccess | FailurePayload;

export type DeleteMerchantPayload = DeleteSuccess | FailurePayload;

export type DeleteSuccess = {
  __typename?: 'DeleteSuccess';
  successMessage?: Maybe<Scalars['String']>;
};

export type DeleteUserFailed = {
  __typename?: 'DeleteUserFailed';
  errorMessage?: Maybe<Scalars['String']>;
  exceptionName?: Maybe<Scalars['String']>;
};

export type DeleteUserPayload = DeleteSuccess | FailurePayload;

/**
 * #
 * # EXPENSE RELATED
 * #
 */
export type Expense = {
  __typename?: 'Expense';
  amount?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type ExpenseSuccess = {
  __typename?: 'ExpenseSuccess';
  expense: Expense;
};

export type FailurePayload = {
  __typename?: 'FailurePayload';
  errorMessage?: Maybe<Scalars['String']>;
  exceptionName?: Maybe<Scalars['String']>;
};

export type Merchant = {
  __typename?: 'Merchant';
  defaultCategory?: Maybe<Category>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type MerchantPayload = FailurePayload | MerchantSuccess;

export type MerchantSuccess = {
  __typename?: 'MerchantSuccess';
  merchant: Merchant;
};

export type MerchantsPayload = FailurePayload | MerchantsSuccess;

export type MerchantsSuccess = {
  __typename?: 'MerchantsSuccess';
  merchants: Array<Maybe<Merchant>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: CategoryPayload;
  createExpense: CreateExpensePayload;
  createMerchant: MerchantPayload;
  deleteCategory: DeleteCategoryPayload;
  deleteMerchant: DeleteMerchantPayload;
  deleteUser: DeleteUserPayload;
  signUp: CreateUserPayload;
};


export type MutationCreateCategoryArgs = {
  colourHex: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};


export type MutationCreateExpenseArgs = {
  amount: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  passwordHash: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateMerchantArgs = {
  defaultCategoryId?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteMerchantArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteUserArgs = {
  passwordHash: Scalars['String'];
};


export type MutationSignUpArgs = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  username: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  categories: CategoriesPayload;
  category: CategoryPayload;
  expense: CreateExpensePayload;
  greeting: Scalars['String'];
  merchant?: Maybe<MerchantPayload>;
  merchants?: Maybe<MerchantsPayload>;
  /** # Helper for testing. */
  signIn: SignInPayload;
  user?: Maybe<User>;
};


export type QueryCategoriesArgs = {
  passwordHash: Scalars['String'];
};


export type QueryCategoryArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryExpenseArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryMerchantArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryMerchantsArgs = {
  passwordHash: Scalars['String'];
};


export type QuerySignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type QueryUserArgs = {
  username: Scalars['String'];
};

export type SignInPayload = FailurePayload | SignInSuccess;

export type SignInSuccess = {
  __typename?: 'SignInSuccess';
  passwordHash: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

export type GetPasswordHashQueryVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type GetPasswordHashQuery = { __typename?: 'Query', signIn: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'SignInSuccess', passwordHash: string } };

export type CreateUserMutationVariables = Exact<{
  fname: Scalars['String'];
  lname: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', signUp: { __typename: 'CreateUserSuccess', passwordHash: string } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };


export const GetPasswordHashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPasswordHash"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignInSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordHash"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPasswordHashQuery, GetPasswordHashQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fname"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lname"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"phoneNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordHash"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;