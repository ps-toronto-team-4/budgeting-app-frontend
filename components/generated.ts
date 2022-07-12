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

export type CreateUserPayload = CreateUserSuccess | FailurePayload;

export type CreateUserSuccess = {
  __typename?: 'CreateUserSuccess';
  passwordHash: Scalars['String'];
  user: User;
};

export type DeleteCategoryPayload = DeleteSuccess | FailurePayload;

export type DeleteSuccess = {
  __typename?: 'DeleteSuccess';
  successMessage?: Maybe<Scalars['String']>;
};

export type DeleteUserPayload = DeleteSuccess | FailurePayload;

export type FailurePayload = {
  __typename?: 'FailurePayload';
  errorMessage?: Maybe<Scalars['String']>;
  exceptionName?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCategory: CategoryPayload;
  deleteCategory: DeleteCategoryPayload;
  deleteUser: DeleteUserPayload;
  signUp: CreateUserPayload;
};


export type MutationCreateCategoryArgs = {
  colourHex: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
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
  greeting: Scalars['String'];
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

export type GetPasswordHashQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPasswordHashQuery = { __typename?: 'Query', signIn: { __typename?: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename?: 'SignInSuccess', passwordHash: string } };


export const GetPasswordHashDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getPasswordHash"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignInSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordHash"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetPasswordHashQuery, GetPasswordHashQueryVariables>;