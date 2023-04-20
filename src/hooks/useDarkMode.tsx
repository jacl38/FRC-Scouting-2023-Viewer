import { useEffect, useState } from "react";

const useLocalStorage = (key: string, initialValue?: string) => {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch(e) {
			console.error(e);
			return initialValue;
		}
	});

	const setValue = (value: string | ((value: string) => string)) => {
		try {
			const newValue = value instanceof Function ? value(storedValue) : value;
			setStoredValue(newValue);
			window.localStorage.setItem(key, JSON.stringify(newValue));
		} catch(e) { console.log(e) }
	}

	return [storedValue, setValue];
}

export const useDarkMode = () => {
	const [enabled, setEnabled] = useLocalStorage("dark-theme");

	useEffect(() => {
		const className = "dark";
		const bodyClass = document.getElementsByTagName("html")[0].classList;

		enabled ? bodyClass.add(className) : bodyClass.remove(className);
	}, [enabled]);

	return [enabled, setEnabled];
}
