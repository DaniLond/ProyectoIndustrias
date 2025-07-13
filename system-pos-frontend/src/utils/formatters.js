export const formatCurrency = (amount) => {
	if (amount === null || amount === undefined || isNaN(amount)) {
		return '$0';
	}

	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatDate = (date) => {
	if (!date) return '-';

	const dateObj = typeof date === 'string' ? new Date(date) : date;

	if (isNaN(dateObj.getTime())) {
		return '-';
	}

	return new Intl.DateTimeFormat('es-CO', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	}).format(dateObj);
};