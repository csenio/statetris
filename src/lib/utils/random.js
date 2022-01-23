// pick a random number from a given range
export function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

export function pickRandom(arr) {
	return arr[randomNumber(0, arr.length - 1)]
}
