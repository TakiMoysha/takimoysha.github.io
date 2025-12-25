export function parseDate(numdate: Number | String): Date | null {
	if (typeof numdate === "number") numdate = String(numdate);

	if (typeof numdate === "string") {
		let date = `${numdate.slice(0, 4)}-${numdate.slice(4, 6)}-${numdate.slice(6, 8)}`;

		if (numdate.length === 12) {
			date += `T${numdate.slice(8, 10)}:${numdate.slice(10, 12)}`;
		}

		return new Date(date);
	}

	return null;
}
