declare global {
	interface Array<T> { random(): T; }
}

Array.prototype.random = function() { return this[Math.floor(Math.random() * this.length)] }

type tailwindable = string | tailwindable[] | { [key: string]: tailwindable }
export const tw = (...classes: string[]) => classes.join("\n");
export const twobj = <T extends tailwindable,>(clobj: T) => clobj;

export module ColorUtils {
	export const colors = ["slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"] as const;
	export type color = (typeof colors)[number];
	
	export const shades = ["light", "mid", "dark"] as const;
	export type shade = (typeof shades)[number];

	// Generated from generate_gradient_classes.py
	// Necessary for Tailwind to compile the needed classes
	const colorShadeMap = {
		lightslate:		"text-black from-slate-200		to-slate-400",
		lightgray:		"text-black from-gray-200		to-gray-400",
		lightzinc:		"text-black from-zinc-200		to-zinc-400",
		lightneutral:	"text-black from-neutral-200	to-neutral-400",
		lightstone:		"text-black from-stone-200		to-stone-400",
		lightred:		"text-black from-red-200		to-red-400",
		lightorange:	"text-black from-orange-200		to-orange-400",
		lightamber:		"text-black from-amber-200		to-amber-400",
		lightyellow:	"text-black from-yellow-200		to-yellow-400",
		lightlime:		"text-black from-lime-200		to-lime-400",
		lightgreen:		"text-black from-green-200		to-green-400",
		lightemerald:	"text-black from-emerald-200	to-emerald-400",
		lightteal:		"text-black from-teal-200		to-teal-400",
		lightcyan:		"text-black from-cyan-200		to-cyan-400",
		lightsky:		"text-black from-sky-200		to-sky-400",
		lightblue:		"text-black from-blue-200		to-blue-400",
		lightindigo:	"text-black from-indigo-200		to-indigo-400",
		lightviolet:	"text-black from-violet-200		to-violet-400",
		lightpurple:	"text-black from-purple-200		to-purple-400",
		lightfuchsia:	"text-black from-fuchsia-200	to-fuchsia-400",
		lightpink:		"text-black from-pink-200		to-pink-500",
		lightrose:		"text-black from-rose-200		to-rose-500",
		midslate:		"text-white from-slate-400		to-slate-600",
		midgray:		"text-white from-gray-400		to-gray-600",
		midzinc:		"text-white from-zinc-400		to-zinc-600",
		midneutral:		"text-white from-neutral-400	to-neutral-600",
		midstone:		"text-white from-stone-400		to-stone-600",
		midred:			"text-white from-red-400		to-red-600",
		midorange:		"text-black from-orange-400		to-orange-600",
		midamber:		"text-black from-amber-400		to-amber-600",
		midyellow:		"text-black from-yellow-400		to-yellow-600",
		midlime:		"text-black from-lime-400		to-lime-600",
		midgreen:		"text-black from-green-400		to-green-600",
		midemerald:		"text-white from-emerald-400	to-emerald-600",
		midteal:		"text-white from-teal-400		to-teal-600",
		midcyan:		"text-white from-cyan-400		to-cyan-600",
		midsky:			"text-white from-sky-400		to-sky-600",
		midblue:		"text-white from-blue-400		to-blue-600",
		midindigo:		"text-white from-indigo-400		to-indigo-600",
		midviolet:		"text-white from-violet-400		to-violet-600",
		midpurple:		"text-white from-purple-400		to-purple-600",
		midfuchsia:		"text-white from-fuchsia-400	to-fuchsia-600",
		midpink:		"text-white from-pink-400		to-pink-600",
		midrose:		"text-white from-rose-400		to-rose-600",
		darkslate:		"text-white from-slate-700		to-slate-900",
		darkgray:		"text-white from-gray-700		to-gray-900",
		darkzinc:		"text-white from-zinc-700		to-zinc-900",
		darkneutral:	"text-white from-neutral-700	to-neutral-900",
		darkstone:		"text-white from-stone-700		to-stone-900",
		darkred:		"text-white from-red-700		to-red-900",
		darkorange:		"text-white from-orange-700		to-orange-900",
		darkamber:		"text-white from-amber-700		to-amber-900",
		darkyellow:		"text-white from-yellow-700		to-yellow-900",
		darklime:		"text-white from-lime-700		to-lime-900",
		darkgreen:		"text-white from-green-700		to-green-900",
		darkemerald:	"text-white from-emerald-700	to-emerald-900",
		darkteal:		"text-white from-teal-700		to-teal-900",
		darkcyan:		"text-white from-cyan-700		to-cyan-900",
		darksky:		"text-white from-sky-700		to-sky-900",
		darkblue:		"text-white from-blue-700		to-blue-900",
		darkindigo:		"text-white from-indigo-700		to-indigo-900",
		darkviolet:		"text-white from-violet-700		to-violet-900",
		darkpurple:		"text-white from-purple-700		to-purple-900",
		darkfuchsia:	"text-white from-fuchsia-700	to-fuchsia-900",
		darkpink:		"text-white from-pink-700		to-pink-900",
		darkrose:		"text-white from-rose-700		to-rose-900",
	}

	const colorHoverShadeMap = {
		lightslate:		"hover:from-slate-200		hover:to-slate-400",
		lightgray:		"hover:from-gray-200		hover:to-gray-400",
		lightzinc:		"hover:from-zinc-200		hover:to-zinc-400",
		lightneutral:	"hover:from-neutral-200		hover:to-neutral-400",
		lightstone:		"hover:from-stone-200		hover:to-stone-400",
		lightred:		"hover:from-red-200			hover:to-red-400",
		lightorange:	"hover:from-orange-200		hover:to-orange-400",
		lightamber:		"hover:from-amber-200		hover:to-amber-400",
		lightyellow:	"hover:from-yellow-200		hover:to-yellow-400",
		lightlime:		"hover:from-lime-200		hover:to-lime-400",
		lightgreen:		"hover:from-green-200		hover:to-green-400",
		lightemerald:	"hover:from-emerald-200		hover:to-emerald-400",
		lightteal:		"hover:from-teal-200		hover:to-teal-400",
		lightcyan:		"hover:from-cyan-200		hover:to-cyan-400",
		lightsky:		"hover:from-sky-200			hover:to-sky-400",
		lightblue:		"hover:from-blue-200		hover:to-blue-400",
		lightindigo:	"hover:from-indigo-200		hover:to-indigo-400",
		lightviolet:	"hover:from-violet-200		hover:to-violet-400",
		lightpurple:	"hover:from-purple-200		hover:to-purple-400",
		lightfuchsia:	"hover:from-fuchsia-200		hover:to-fuchsia-400",
		lightpink:		"hover:from-pink-200		hover:to-pink-500",
		lightrose:		"hover:from-rose-200		hover:to-rose-500",
		midslate:		"hover:from-slate-400		hover:to-slate-600",
		midgray:		"hover:from-gray-400		hover:to-gray-600",
		midzinc:		"hover:from-zinc-400		hover:to-zinc-600",
		midneutral:		"hover:from-neutral-400		hover:to-neutral-600",
		midstone:		"hover:from-stone-400		hover:to-stone-600",
		midred:			"hover:from-red-400			hover:to-red-600",
		midorange:		"hover:from-orange-400		hover:to-orange-600",
		midamber:		"hover:from-amber-400		hover:to-amber-600",
		midyellow:		"hover:from-yellow-400		hover:to-yellow-600",
		midlime:		"hover:from-lime-400		hover:to-lime-600",
		midgreen:		"hover:from-green-400		hover:to-green-600",
		midemerald:		"hover:from-emerald-400		hover:to-emerald-600",
		midteal:		"hover:from-teal-400		hover:to-teal-600",
		midcyan:		"hover:from-cyan-400		hover:to-cyan-600",
		midsky:			"hover:from-sky-400			hover:to-sky-600",
		midblue:		"hover:from-blue-400		hover:to-blue-600",
		midindigo:		"hover:from-indigo-400		hover:to-indigo-600",
		midviolet:		"hover:from-violet-400		hover:to-violet-600",
		midpurple:		"hover:from-purple-400		hover:to-purple-600",
		midfuchsia:		"hover:from-fuchsia-400		hover:to-fuchsia-600",
		midpink:		"hover:from-pink-400		hover:to-pink-600",
		midrose:		"hover:from-rose-400		hover:to-rose-600",
		darkslate:		"hover:from-slate-700		hover:to-slate-900",
		darkgray:		"hover:from-gray-700		hover:to-gray-900",
		darkzinc:		"hover:from-zinc-700		hover:to-zinc-900",
		darkneutral:	"hover:from-neutral-700		hover:to-neutral-900",
		darkstone:		"hover:from-stone-700		hover:to-stone-900",
		darkred:		"hover:from-red-700			hover:to-red-900",
		darkorange:		"hover:from-orange-700		hover:to-orange-900",
		darkamber:		"hover:from-amber-700		hover:to-amber-900",
		darkyellow:		"hover:from-yellow-700		hover:to-yellow-900",
		darklime:		"hover:from-lime-700		hover:to-lime-900",
		darkgreen:		"hover:from-green-700		hover:to-green-900",
		darkemerald:	"hover:from-emerald-700		hover:to-emerald-900",
		darkteal:		"hover:from-teal-700		hover:to-teal-900",
		darkcyan:		"hover:from-cyan-700		hover:to-cyan-900",
		darksky:		"hover:from-sky-700			hover:to-sky-900",
		darkblue:		"hover:from-blue-700		hover:to-blue-900",
		darkindigo:		"hover:from-indigo-700		hover:to-indigo-900",
		darkviolet:		"hover:from-violet-700		hover:to-violet-900",
		darkpurple:		"hover:from-purple-700		hover:to-purple-900",
		darkfuchsia:	"hover:from-fuchsia-700		hover:to-fuchsia-900",
		darkpink:		"hover:from-pink-700		hover:to-pink-900",
		darkrose:		"hover:from-rose-700		hover:to-rose-900",
	}

	export const randomColor = (shade?: shade) => {
		shade = shade ?? shades[Math.floor(Math.random() * shades.length)]
	}

	export const hoverableGradient = (colors: { normal: { shade: shade, color: color }, hovered: { shade: shade, color: color} }) => {
		const hoverClasses = extractNotWhitespace(colorHoverShadeMap[`${colors.hovered.shade}${colors.hovered.color}`]).join(" ");
		const normalClasses = colorShadeMap[`${colors.normal.shade}${colors.normal.color}`];
		return `bg-gradient-to-br ${hoverClasses} ${normalClasses}`;
	}

	export const colorToGradient = (shade: shade, color: color) =>
		`bg-gradient-to-br ${colorShadeMap[`${shade}${color}`]}`;
}

const extractNotWhitespace = (text: string) => text.split(/(\s+)/).filter(s => s.trim().length > 0);