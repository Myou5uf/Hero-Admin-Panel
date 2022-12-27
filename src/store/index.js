// import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
// import thunk from "redux-thunk";
// import heroes from "../reducers/heroes";
import heroes from "../components/heroesList/heroesSlice";
import filters from "../components/heroesFilters/filtersSlice";

const stringMiddleware = ({ dispatch, getState }) => {
	return (next) => {
		return (action) => {
			if (typeof action === "string") {
				return next({
					type: action,
				});
			}
			return next(action);
		};
	};
};

const enhancer = (createStore) => {
	return (...args) => {
		const store = createStore(...args);
		const oldDispatch = store.dispatch;
		store.dispatch = (action) => {
			if (typeof action === "string") {
				return oldDispatch({
					type: action,
				});
			}

			return oldDispatch(action);
		};

		return store;
	};
};

// * 1 этап
// const store = createStore(
// 	combineReducers({
// 		heroes,
// 		filters,
// 	}),
// 	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// * 2 этап
// const store = createStore(
// 	combineReducers({
// 		heroes,
// 		filters,
// 	}),
// 	compose(enhancer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// );

// * 3 этап
// const store = createStore(
// 	combineReducers({
// 		heroes,
// 		filters,
// 	}),
// 	compose(applyMiddleware(thunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// );

// * 4 этап c помощью toolkit
const store = configureStore({
	reducer: {
		heroes,
		filters,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(stringMiddleware),
	devTools: process.env.NODE_ENV !== "production",
});

export default store;
