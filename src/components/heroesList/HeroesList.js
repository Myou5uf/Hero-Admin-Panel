import { useHttp } from "../../hooks/http.hook";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { heroDelete, fetchHeroes, filteredHeroesSelector } from "./heroesSlice";
// import { fetchHeroes } from "../../actions";
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from "../spinner/Spinner";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./HeroesList.scss";

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
	

	const filteredHeroes = useSelector(filteredHeroesSelector);
	const heroesLoadingStatus = useSelector((state) => state.heroes.heroesLoadingStatus);

	const dispatch = useDispatch();
	const { request } = useHttp();

	useEffect(() => {
		// dispatch(fetchHeroes(request));
		dispatch(fetchHeroes());
	}, []);

	const onDeleteHero = useCallback(
		(id) => {
			request(`http://localhost:3001/heroes/${id}`, "DELETE")
				.then((data) => console.log(data, "Deleted"))
				.then(dispatch(heroDelete(id)))
				.catch((error) => console.log(error));
		},
		[request]
	);

	if (heroesLoadingStatus === "loading") {
		return <Spinner />;
	} else if (heroesLoadingStatus === "error") {
		return <h5 className="text-center mt-5">Ошибка загрузки</h5>;
	}

	const renderHeroesList = (arr) => {
		if (arr.length === 0) {
			return (
				<CSSTransition
					timeout={0}
					classNames="hero">
					<h5 className="text-center mt-5">Героев пока нет</h5>
				</CSSTransition>
			);
		}

		return arr.map(({ id, name, description, element }) => (
			<CSSTransition
				key={id}
				timeout={500}
				classNames="card">
				<HeroesListItem
					name={name}
					description={description}
					element={element}
					onDeleteHero={() => onDeleteHero(id)}
				/>
			</CSSTransition>
		));
	};

	const elements = renderHeroesList(filteredHeroes);
	return <TransitionGroup component="ul">{elements}</TransitionGroup>;
};

export default HeroesList;
