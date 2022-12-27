// import { useHttp } from "../../hooks/http.hook";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchFilters } from "../../actions";
import { filtersChanged, fetchFilters, selectAll } from "./filtersSlice";
import classNames from "classnames";
import Spinner from "../spinner/Spinner";
import store from "../../store";

// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {
	const { filtersLoadingStatus, activeFilter } = useSelector((state) => state.filters);
	const filters = selectAll(store.getState());
	const dispatch = useDispatch();

	useEffect(() => {
		// dispatch(fetchFilters(request));
		dispatch(fetchFilters());
	}, []);

	if (filtersLoadingStatus === "loading") {
		return <Spinner />;
	} else if (filtersLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
	}

	const renderFilters = (filters) => {
		return filters.map((filter) => {
			if (filter.length === 0) {
				return <h5 className="text-center mt-5">Фильтры не найдены</h5>;
			}
			const className = classNames("btn", filter.className, {
				active: filter.name === activeFilter,
			});

			return (
				<button
					key={filter.name}
					className={className}
					onClick={() => dispatch(filtersChanged(filter.name))}>
					{filter.label}
				</button>
			);
		});
	};

	const filtersBtns = renderFilters(filters);

	return (
		<div className="card shadow-lg mt-4">
			<div className="card-body">
				<p className="card-text">Отфильтруйте героев по элементам</p>
				<div className="btn-group">{filtersBtns}</div>
			</div>
		</div>
	);
};

export default HeroesFilters;
