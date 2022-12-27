import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { heroCreate } from "../heroesList/heroesSlice";
import { selectAll } from "../heroesFilters/filtersSlice";
import { useHttp } from "../../hooks/http.hook";
import store from "../../store";
// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [element, setElement] = useState("");
	const { request } = useHttp();
	const filters = selectAll(store.getState());
	const filtersLoadingStatus = useSelector((state) => state.filters.filtersLoadingStatus);
	const dispatch = useDispatch();

	const addNewHero = (e) => {
		e.preventDefault();

		if (!element || element === "Фильтров пока нет" || element === "Ошибка загрузки") {
			return;
		}

		const newHero = {
			id: uuidv4(),
			name,
			description,
			element,
		};

		request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
			.then((response) => console.log(response, "Новый герой создан"))
			.then(dispatch(heroCreate(newHero)))
			.catch((error) => console.log("Произошла ошибка", error));

		setName("");
		setDescription("");
		setElement("");
	};

	const renderFilterItems = () => {
		if (filtersLoadingStatus === "loading") {
			return <option>Загрузка элементов</option>;
		} else if (filtersLoadingStatus === "error") return <option>Ошибка загрузки</option>;

		if (!filters.length) {
			return <option>Фильтров пока нет</option>;
		}

		return filters.map((filter) => {
			// eslint-disable-next-line
			if (filter.name === "all") return;
			return (
				<option
					key={filter.name}
					value={filter.name}>
					{filter.label}
				</option>
			);
		});
	};

	return (
		<form
			className="border p-4 shadow-lg rounded"
			onSubmit={(e) => addNewHero(e)}>
			<div className="mb-3">
				<label
					htmlFor="name"
					className="form-label fs-4">
					Имя нового героя
				</label>
				<input
					required
					type="text"
					name="name"
					className="form-control"
					id="name"
					placeholder="Как меня зовут?"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label
					htmlFor="text"
					className="form-label fs-4">
					Описание
				</label>
				<textarea
					required
					name="text"
					className="form-control"
					id="text"
					placeholder="Что я умею?"
					style={{ height: "130px" }}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div className="mb-3">
				<label
					htmlFor="element"
					className="form-label">
					Выбрать элемент героя
				</label>
				<select
					required
					className="form-select"
					id="element"
					name="element"
					value={element}
					onChange={(e) => setElement(e.target.value)}>
					<option
						value=""
						hidden>
						Я владею элементом...
					</option>
					{renderFilterItems()}
				</select>
			</div>

			<button
				type="submit"
				className="btn btn-primary">
				Создать
			</button>
		</form>
	);
};

export default HeroesAddForm;
