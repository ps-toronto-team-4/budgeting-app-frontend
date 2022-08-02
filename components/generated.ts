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

export type Budget = {
  __typename?: 'Budget';
  budgetCategories?: Maybe<Array<BudgetCategory>>;
  id: Scalars['Int'];
  month: MonthType;
  user: User;
  year: Scalars['Int'];
};

export type BudgetCategoriesPayload = BudgetCategoriesSuccess | FailurePayload;

export type BudgetCategoriesSuccess = {
  __typename?: 'BudgetCategoriesSuccess';
  budgetCategories: Array<BudgetCategory>;
};

export type BudgetCategory = {
  __typename?: 'BudgetCategory';
  amount: Scalars['Float'];
  budget: Budget;
  category: Category;
  id: Scalars['Int'];
  user: User;
};

export type BudgetCategoryDetails = {
  __typename?: 'BudgetCategoryDetails';
  amountActual: Scalars['Float'];
  amountBudgeted: Scalars['Float'];
  category: Category;
};

export type BudgetCategoryPayload = BudgetCategorySuccess | FailurePayload;

export type BudgetCategorySuccess = {
  __typename?: 'BudgetCategorySuccess';
  budgetCategory: BudgetCategory;
};

export type BudgetDetails = {
  __typename?: 'BudgetDetails';
  budget: Budget;
  byCategory: Array<BudgetCategoryDetails>;
  totalActual: Scalars['Float'];
  totalBudgeted: Scalars['Float'];
  totalUnplanned: Scalars['Float'];
};

export type BudgetDetailsPayload = BudgetDetails | FailurePayload;

export type BudgetPayload = BudgetSuccess | FailurePayload;

export type BudgetSuccess = {
  __typename?: 'BudgetSuccess';
  budget: Budget;
};

export type BudgetsPayload = BudgetsSuccess | FailurePayload;

export type BudgetsSuccess = {
  __typename?: 'BudgetsSuccess';
  budgets: Array<Budget>;
};

export type CategoriesPayload = CategoriesSuccess | FailurePayload;

export type CategoriesSuccess = {
  __typename?: 'CategoriesSuccess';
  categories: Array<Category>;
};

export type Category = {
  __typename?: 'Category';
  colourHex: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['Int'];
  merchants?: Maybe<Array<Merchant>>;
  name: Scalars['String'];
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

export type DeleteMerchantPayload = DeleteSuccess | FailurePayload;

export type DeletePayload = DeleteSuccess | FailurePayload;

export type DeleteSuccess = {
  __typename?: 'DeleteSuccess';
  successMessage?: Maybe<Scalars['String']>;
};

export type DeleteUserPayload = DeleteSuccess | FailurePayload;

export type Expense = {
  __typename?: 'Expense';
  amount: Scalars['Float'];
  category?: Maybe<Category>;
  date: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  merchant?: Maybe<Merchant>;
  user: User;
};

export type ExpensePayload = ExpenseSuccess | FailurePayload;

export type ExpenseSuccess = {
  __typename?: 'ExpenseSuccess';
  expense: Expense;
};

export type ExpensesPayload = ExpensesSuccess | FailurePayload;

export type ExpensesSuccess = {
  __typename?: 'ExpensesSuccess';
  expenses: Array<Expense>;
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
  expenses?: Maybe<Array<Expense>>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type MerchantPayload = FailurePayload | MerchantSuccess;

export type MerchantSuccess = {
  __typename?: 'MerchantSuccess';
  merchant: Merchant;
};

export type MerchantsPayload = FailurePayload | MerchantsSuccess;

export type MerchantsSuccess = {
  __typename?: 'MerchantsSuccess';
  merchants: Array<Merchant>;
};

export type MonthBreakdown = {
  __typename?: 'MonthBreakdown';
  byCategory: Array<MonthBreakdownCategory>;
  byMerchant: Array<MonthBreakdownMerchant>;
  month: MonthType;
  topCategory?: Maybe<MonthBreakdownCategory>;
  topMerchant?: Maybe<MonthBreakdownMerchant>;
  totalSpent: Scalars['Float'];
  year: Scalars['Int'];
};

export type MonthBreakdownCategory = {
  __typename?: 'MonthBreakdownCategory';
  amountSpent: Scalars['Float'];
  category?: Maybe<Category>;
};

export type MonthBreakdownMerchant = {
  __typename?: 'MonthBreakdownMerchant';
  amountSpent: Scalars['Float'];
  merchant?: Maybe<Merchant>;
};

export type MonthBreakdownPayload = FailurePayload | MonthBreakdown;

export enum MonthType {
  April = 'APRIL',
  August = 'AUGUST',
  December = 'DECEMBER',
  February = 'FEBRUARY',
  January = 'JANUARY',
  July = 'JULY',
  June = 'JUNE',
  March = 'MARCH',
  May = 'MAY',
  November = 'NOVEMBER',
  October = 'OCTOBER',
  September = 'SEPTEMBER'
}

export type MonthsTotals = {
  __typename?: 'MonthsTotals';
  averageSpent: Scalars['Float'];
  byMonth: Array<MonthsTotalsItem>;
};

export type MonthsTotalsItem = {
  __typename?: 'MonthsTotalsItem';
  amountBudgeted: Scalars['Float'];
  amountSpent: Scalars['Float'];
  month: MonthType;
  year: Scalars['Int'];
};

export type MonthsTotalsPayload = FailurePayload | MonthsTotals;

export type Mutation = {
  __typename?: 'Mutation';
  copyBudget: BudgetPayload;
  createBudget: BudgetPayload;
  createBudgetCategory: BudgetCategoryPayload;
  createCategory: CategoryPayload;
  createExpense: ExpensePayload;
  createMerchant: MerchantPayload;
  deleteBudget: DeletePayload;
  deleteBudgetCategory: DeletePayload;
  deleteCategory: DeleteCategoryPayload;
  deleteExpense: DeletePayload;
  deleteMerchant: DeleteMerchantPayload;
  deleteUser: DeleteUserPayload;
  signUp: CreateUserPayload;
  updateBudgetCategory: BudgetCategoryPayload;
  updateCategory: CategoryPayload;
  updateExpense: ExpensePayload;
  updateMerchant: MerchantPayload;
};


export type MutationCopyBudgetArgs = {
  id: Scalars['Int'];
  month: MonthType;
  passwordHash: Scalars['String'];
  year: Scalars['Int'];
};


export type MutationCreateBudgetArgs = {
  month: MonthType;
  passwordHash: Scalars['String'];
  year: Scalars['Int'];
};


export type MutationCreateBudgetCategoryArgs = {
  amount: Scalars['Float'];
  budgetId: Scalars['Int'];
  categoryId: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationCreateCategoryArgs = {
  colourHex: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};


export type MutationCreateExpenseArgs = {
  amount: Scalars['Float'];
  categoryId?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  epochDate: Scalars['Int'];
  merchantId?: InputMaybe<Scalars['Int']>;
  passwordHash: Scalars['String'];
};


export type MutationCreateMerchantArgs = {
  defaultCategoryId?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteBudgetArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteBudgetCategoryArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationDeleteExpenseArgs = {
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


export type MutationUpdateBudgetCategoryArgs = {
  amount: Scalars['Float'];
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type MutationUpdateCategoryArgs = {
  colourHex: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};


export type MutationUpdateExpenseArgs = {
  amount: Scalars['Float'];
  categoryId?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  epochDate: Scalars['Int'];
  id: Scalars['Int'];
  merchantId?: InputMaybe<Scalars['Int']>;
  passwordHash: Scalars['String'];
};


export type MutationUpdateMerchantArgs = {
  defaultCategoryId?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
  passwordHash: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  budget: BudgetPayload;
  budgetByDate: BudgetPayload;
  budgetCategories: BudgetCategoriesPayload;
  budgetCategory: BudgetCategoryPayload;
  budgetDetails: BudgetDetailsPayload;
  budgets: BudgetsPayload;
  categories: CategoriesPayload;
  category: CategoryPayload;
  expense: ExpensePayload;
  expenses: ExpensesPayload;
  expensesInMonth: ExpensesPayload;
  greeting: Scalars['String'];
  merchant: MerchantPayload;
  merchants: MerchantsPayload;
  monthBreakdown: MonthBreakdownPayload;
  monthsTotals: MonthsTotalsPayload;
  signIn: SignInPayload;
  user: UserPayload;
  userTest?: Maybe<User>;
};


export type QueryBudgetArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryBudgetByDateArgs = {
  month: MonthType;
  passwordHash: Scalars['String'];
  year: Scalars['Int'];
};


export type QueryBudgetCategoriesArgs = {
  passwordHash: Scalars['String'];
};


export type QueryBudgetCategoryArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryBudgetDetailsArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryBudgetsArgs = {
  passwordHash: Scalars['String'];
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


export type QueryExpensesArgs = {
  passwordHash: Scalars['String'];
};


export type QueryExpensesInMonthArgs = {
  month: MonthType;
  passwordHash: Scalars['String'];
  year: Scalars['Int'];
};


export type QueryMerchantArgs = {
  id: Scalars['Int'];
  passwordHash: Scalars['String'];
};


export type QueryMerchantsArgs = {
  passwordHash: Scalars['String'];
};


export type QueryMonthBreakdownArgs = {
  month: MonthType;
  passwordHash: Scalars['String'];
  year: Scalars['Int'];
};


export type QueryMonthsTotalsArgs = {
  passwordHash: Scalars['String'];
};


export type QuerySignInArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type QueryUserArgs = {
  passwordHash: Scalars['String'];
};


export type QueryUserTestArgs = {
  username: Scalars['String'];
};

export type SignInPayload = FailurePayload | SignInSuccess;

export type SignInSuccess = {
  __typename?: 'SignInSuccess';
  passwordHash: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  budgetCategories?: Maybe<Array<BudgetCategory>>;
  budgets?: Maybe<Array<Budget>>;
  categories?: Maybe<Array<Category>>;
  email: Scalars['String'];
  expenses?: Maybe<Array<Expense>>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  merchants?: Maybe<Array<Merchant>>;
  phoneNumber?: Maybe<Scalars['String']>;
  username: Scalars['String'];
};

export type UserPayload = FailurePayload | User;

export type LoginQueryVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginQuery = { __typename?: 'Query', signIn: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'SignInSuccess', passwordHash: string } };

export type GetCategoryQueryVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
}>;


export type GetCategoryQuery = { __typename?: 'Query', category: { __typename: 'CategorySuccess', category: { __typename?: 'Category', id: number, name: string, colourHex: string, description?: string | null } } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type GetGreetingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGreetingsQuery = { __typename?: 'Query', greeting: string };

export type GetUserQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type GetUserQuery = { __typename?: 'Query', user: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'User', lastName: string, firstName: string, username: string, email: string, phoneNumber?: string | null } };

export type GetCategoriesQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type GetCategoriesQuery = { __typename?: 'Query', categories: { __typename: 'CategoriesSuccess', categories: Array<{ __typename?: 'Category', id: number, name: string, colourHex: string, description?: string | null }> } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type CreateUserMutationVariables = Exact<{
  fname: Scalars['String'];
  lname: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  phone?: InputMaybe<Scalars['String']>;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', signUp: { __typename: 'CreateUserSuccess', passwordHash: string } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type CreateCategoryMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  name: Scalars['String'];
  color: Scalars['String'];
  details?: InputMaybe<Scalars['String']>;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', createCategory: { __typename: 'CategorySuccess', category: { __typename?: 'Category', id: number } } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type UpdateCategoryMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  color: Scalars['String'];
  details?: InputMaybe<Scalars['String']>;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', updateCategory: { __typename: 'CategorySuccess', category: { __typename?: 'Category', id: number } } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type DeleteCategoryMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: { __typename?: 'DeleteSuccess', successMessage?: string | null } | { __typename?: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type GetExpensesQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type GetExpensesQuery = { __typename?: 'Query', expenses: { __typename: 'ExpensesSuccess', expenses: Array<{ __typename?: 'Expense', amount: number, id: number, date: string, description?: string | null, category?: { __typename?: 'Category', colourHex: string, name: string } | null, merchant?: { __typename?: 'Merchant', name: string } | null }> } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type GetExpenseQueryVariables = Exact<{
  passwordHash: Scalars['String'];
  expenseId: Scalars['Int'];
}>;


export type GetExpenseQuery = { __typename?: 'Query', expense: { __typename?: 'ExpenseSuccess', expense: { __typename?: 'Expense', id: number, amount: number, description?: string | null, date: string, category?: { __typename?: 'Category', id: number, name: string, colourHex: string } | null, merchant?: { __typename?: 'Merchant', id: number, name: string } | null } } | { __typename?: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type CreateExpenseMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  amount: Scalars['Float'];
  epochDate: Scalars['Int'];
  merchantId?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  desc?: InputMaybe<Scalars['String']>;
}>;


export type CreateExpenseMutation = { __typename?: 'Mutation', createExpense: { __typename?: 'ExpenseSuccess', expense: { __typename?: 'Expense', id: number } } | { __typename?: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type UpdateExpenseMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
  amount: Scalars['Float'];
  epochDate: Scalars['Int'];
  merchantId?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  desc?: InputMaybe<Scalars['String']>;
}>;


export type UpdateExpenseMutation = { __typename?: 'Mutation', updateExpense: { __typename?: 'ExpenseSuccess', expense: { __typename?: 'Expense', id: number } } | { __typename?: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type DeleteExpenseMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
}>;


export type DeleteExpenseMutation = { __typename?: 'Mutation', deleteExpense: { __typename?: 'DeleteSuccess', successMessage?: string | null } | { __typename?: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type GetMerchantsQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type GetMerchantsQuery = { __typename?: 'Query', merchants: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'MerchantsSuccess', merchants: Array<{ __typename?: 'Merchant', id: number, name: string, description?: string | null, defaultCategory?: { __typename?: 'Category', id: number, name: string, description?: string | null, colourHex: string } | null }> } };

export type CreateMerchantMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  name: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  defaultCategoryId?: InputMaybe<Scalars['Int']>;
}>;


export type CreateMerchantMutation = { __typename?: 'Mutation', createMerchant: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'MerchantSuccess', merchant: { __typename?: 'Merchant', id: number, name: string, description?: string | null, defaultCategory?: { __typename?: 'Category', id: number, name: string, colourHex: string, description?: string | null } | null } } };

export type GetMerchantQueryVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
}>;


export type GetMerchantQuery = { __typename?: 'Query', merchant: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'MerchantSuccess', merchant: { __typename?: 'Merchant', id: number, name: string, description?: string | null, defaultCategory?: { __typename?: 'Category', id: number, name: string, colourHex: string, description?: string | null } | null } } };

export type GetBudgetsQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type GetBudgetsQuery = { __typename?: 'Query', budgets: { __typename: 'BudgetsSuccess', budgets: Array<{ __typename?: 'Budget', id: number, year: number, month: MonthType, budgetCategories?: Array<{ __typename?: 'BudgetCategory', amount: number, id: number, category: { __typename?: 'Category', id: number, name: string, colourHex: string } }> | null }> } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type CreateBudgetMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  month: MonthType;
  year: Scalars['Int'];
}>;


export type CreateBudgetMutation = { __typename?: 'Mutation', createBudget: { __typename: 'BudgetSuccess', budget: { __typename?: 'Budget', id: number, month: MonthType, year: number } } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type CreateBudgetCategoryMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  budgetId: Scalars['Int'];
  categoryId: Scalars['Int'];
  amount: Scalars['Float'];
}>;


export type CreateBudgetCategoryMutation = { __typename?: 'Mutation', createBudgetCategory: { __typename: 'BudgetCategorySuccess', budgetCategory: { __typename?: 'BudgetCategory', id: number, amount: number, category: { __typename?: 'Category', id: number, name: string, colourHex: string }, budget: { __typename?: 'Budget', id: number, month: MonthType, year: number } } } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type UpdateBudgetCategoryMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
  amount: Scalars['Float'];
}>;


export type UpdateBudgetCategoryMutation = { __typename?: 'Mutation', updateBudgetCategory: { __typename: 'BudgetCategorySuccess', budgetCategory: { __typename?: 'BudgetCategory', id: number } } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type UpdateMerchantMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  defaultCategoryId?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateMerchantMutation = { __typename?: 'Mutation', updateMerchant: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'MerchantSuccess', merchant: { __typename?: 'Merchant', id: number, name: string, description?: string | null, defaultCategory?: { __typename?: 'Category', id: number, name: string, colourHex: string, description?: string | null } | null } } };

export type DeleteBudgetCategoryMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
}>;


export type DeleteBudgetCategoryMutation = { __typename?: 'Mutation', deleteBudgetCategory: { __typename: 'DeleteSuccess', successMessage?: string | null } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type GetMonthBreakdownQueryVariables = Exact<{
  passwordHash: Scalars['String'];
  month: MonthType;
  year: Scalars['Int'];
}>;


export type GetMonthBreakdownQuery = { __typename?: 'Query', monthBreakdown: { __typename?: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } | { __typename?: 'MonthBreakdown', totalSpent: number, byCategory: Array<{ __typename?: 'MonthBreakdownCategory', amountSpent: number, category?: { __typename?: 'Category', colourHex: string, name: string, id: number } | null }>, topMerchant?: { __typename?: 'MonthBreakdownMerchant', amountSpent: number, merchant?: { __typename?: 'Merchant', id: number, name: string, defaultCategory?: { __typename?: 'Category', id: number, name: string } | null, expenses?: Array<{ __typename?: 'Expense', id: number, amount: number }> | null } | null } | null, topCategory?: { __typename?: 'MonthBreakdownCategory', category?: { __typename?: 'Category', id: number, name: string, colourHex: string, expenses?: Array<{ __typename?: 'Expense', id: number, amount: number }> | null, merchants?: Array<{ __typename?: 'Merchant', id: number, name: string }> | null } | null } | null } };

export type CopyBudgetMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  month: MonthType;
  year: Scalars['Int'];
  id: Scalars['Int'];
}>;


export type CopyBudgetMutation = { __typename?: 'Mutation', copyBudget: { __typename: 'BudgetSuccess', budget: { __typename?: 'Budget', id: number } } | { __typename: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } };

export type DeleteMerchantMutationVariables = Exact<{
  passwordHash: Scalars['String'];
  id: Scalars['Int'];
}>;


export type DeleteMerchantMutation = { __typename?: 'Mutation', deleteMerchant: { __typename: 'DeleteSuccess', successMessage?: string | null } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };

export type GetMonthTotalsQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type GetMonthTotalsQuery = { __typename?: 'Query', monthsTotals: { __typename?: 'FailurePayload', errorMessage?: string | null, exceptionName?: string | null } | { __typename?: 'MonthsTotals', byMonth: Array<{ __typename?: 'MonthsTotalsItem', amountBudgeted: number, amountSpent: number, month: MonthType, year: number }> } };

export type MerchantsAndCategoriesQueryVariables = Exact<{
  passwordHash: Scalars['String'];
}>;


export type MerchantsAndCategoriesQuery = { __typename: 'Query', merchants: { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } | { __typename: 'MerchantsSuccess', merchants: Array<{ __typename?: 'Merchant', id: number, name: string }> }, categories: { __typename: 'CategoriesSuccess', categories: Array<{ __typename?: 'Category', id: number, name: string, colourHex: string }> } | { __typename: 'FailurePayload', exceptionName?: string | null, errorMessage?: string | null } };


export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SignInSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordHash"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<LoginQuery, LoginQueryVariables>;
export const GetCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategorySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoryQuery, GetCategoryQueryVariables>;
export const GetGreetingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getGreetings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"greeting"}}]}}]} as unknown as DocumentNode<GetGreetingsQuery, GetGreetingsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoriesSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"phone"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"firstName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fname"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lname"}}},{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"phoneNumber"},"value":{"kind":"Variable","name":{"kind":"Name","value":"phone"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordHash"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"details"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"colourHex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"details"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategorySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"color"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"details"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"colourHex"},"value":{"kind":"Variable","name":{"kind":"Name","value":"color"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"details"}}},{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategorySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMessage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const GetExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpensesSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<GetExpensesQuery, GetExpensesQueryVariables>;
export const GetExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expenseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expenseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpenseSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetExpenseQuery, GetExpenseQueryVariables>;
export const CreateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epochDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"merchantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"epochDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epochDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"merchantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"merchantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpenseSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<CreateExpenseMutation, CreateExpenseMutationVariables>;
export const UpdateExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"epochDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"merchantId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desc"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"epochDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"epochDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"merchantId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"merchantId"}}},{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desc"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ExpenseSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"expense"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateExpenseMutation, UpdateExpenseMutationVariables>;
export const DeleteExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMessage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteExpenseMutation, DeleteExpenseMutationVariables>;
export const GetMerchantsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMerchants"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerchantsSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetMerchantsQuery, GetMerchantsQueryVariables>;
export const CreateMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"defaultCategoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"defaultCategoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"defaultCategoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerchantSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<CreateMerchantMutation, CreateMerchantMutationVariables>;
export const GetMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerchantSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<GetMerchantQuery, GetMerchantQueryVariables>;
export const GetBudgetsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getBudgets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetsSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"budgetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<GetBudgetsQuery, GetBudgetsQueryVariables>;
export const CreateBudgetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBudget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MonthType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBudget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBudgetMutation, CreateBudgetMutationVariables>;
export const CreateBudgetCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createBudgetCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"budgetId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBudgetCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"budgetId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"budgetId"}}},{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCategorySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"budget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<CreateBudgetCategoryMutation, CreateBudgetCategoryMutationVariables>;
export const UpdateBudgetCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateBudgetCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBudgetCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetCategorySuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budgetCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateBudgetCategoryMutation, UpdateBudgetCategoryMutationVariables>;
export const UpdateMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updateMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"defaultCategoryId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"defaultCategoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"defaultCategoryId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerchantSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateMerchantMutation, UpdateMerchantMutationVariables>;
export const DeleteBudgetCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteBudgetCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteBudgetCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMessage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteBudgetCategoryMutation, DeleteBudgetCategoryMutationVariables>;
export const GetMonthBreakdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthBreakdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MonthType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthBreakdown"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MonthBreakdown"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"byCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountSpent"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"topMerchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"merchant"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"defaultCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"amountSpent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"topCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}},{"kind":"Field","name":{"kind":"Name","value":"expenses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}},{"kind":"Field","name":{"kind":"Name","value":"merchants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalSpent"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthBreakdownQuery, GetMonthBreakdownQueryVariables>;
export const CopyBudgetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"copyBudget"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MonthType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"copyBudget"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"BudgetSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"budget"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<CopyBudgetMutation, CopyBudgetMutationVariables>;
export const DeleteMerchantDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"deleteMerchant"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMerchant"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"successMessage"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteMerchantMutation, DeleteMerchantMutationVariables>;
export const GetMonthTotalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getMonthTotals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"monthsTotals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MonthsTotals"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"byMonth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amountBudgeted"}},{"kind":"Field","name":{"kind":"Name","value":"amountSpent"}},{"kind":"Field","name":{"kind":"Name","value":"month"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}}]}}]}}]}}]} as unknown as DocumentNode<GetMonthTotalsQuery, GetMonthTotalsQueryVariables>;
export const MerchantsAndCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"merchantsAndCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"merchants"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MerchantsSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"merchants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"passwordHash"},"value":{"kind":"Variable","name":{"kind":"Name","value":"passwordHash"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CategoriesSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"colourHex"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FailurePayload"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"Field","name":{"kind":"Name","value":"exceptionName"}},{"kind":"Field","name":{"kind":"Name","value":"errorMessage"}}]}}]}}]}}]} as unknown as DocumentNode<MerchantsAndCategoriesQuery, MerchantsAndCategoriesQueryVariables>;