import { DateTime } from 'luxon';
import lodash from 'lodash';

export const getCurrentSchoolTerm = () => {
	// Los periodos escolares empiezan el 01/09 y terminan el 30/07 de cada año
	const startSchoolTermDateTime = DateTime.fromFormat(`01/09/${DateTime.now().year}`, 'dd/MM/yyyy');
	const newSchoolTermStarted = startSchoolTermDateTime.diff(DateTime.now()).as('milliseconds') < 0;
	// Buscamos en que periodo escolar estamos, si ya empezo el nuevo año escolar o no
	const currentSchoolTerm = newSchoolTermStarted ?
		`${DateTime.now().year}-${DateTime.now().plus({ years: 1 }).year}`
		:
		`${DateTime.now().minus({ years: 1 }).year}-${DateTime.now().year}`;

	return currentSchoolTerm;
}

export const getFormerSchoolTerm = () => {
	// Los periodos escolares empiezan el 01/09 y terminan el 30/07 de cada año
	const startSchoolTermDateTime = DateTime.fromFormat(`01/09/${DateTime.now().year}`, 'dd/MM/yyyy');
	const newSchoolTermStarted = startSchoolTermDateTime.diff(DateTime.now()).as('milliseconds') < 0;
	// Buscamos en que periodo escolar estamos, si ya empezo el nuevo año escolar o no
	const formerSchoolTerm = newSchoolTermStarted ?
		`${DateTime.now().minus({ years: 1 }).year}-${DateTime.now().year}`
		:
		`${DateTime.now().minus({ years: 2 }).year}-${DateTime.now().minus({ years: 1 }).year}`;

	return formerSchoolTerm;
}

const FORMAT_NUMBER_OPTIONS = {
	style: 'decimal',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
}
export const formatNumber = (value, options = FORMAT_NUMBER_OPTIONS) => {
	const customOptions = lodash.merge(FORMAT_NUMBER_OPTIONS, options)
	const formatter = new Intl.NumberFormat(
		'es-VE',
		{
			...customOptions,
		}
	);

	return formatter.format(value);
}

const FORMAT_CURRENCY_OPTIONS = {
	style: 'currency',
	currency: 'USD',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
}
export const formatCurrency = (value, options = FORMAT_CURRENCY_OPTIONS) => {
	const customOptions = lodash.merge(FORMAT_CURRENCY_OPTIONS, options)
	const formatter = new Intl.NumberFormat(
		'es-VE',
		{
			...customOptions,
			currencyDisplay: 'narrowSymbol',
		}
	);

	return formatter.format(value);
}

const FORMAT_PERCENTAGE_OPTIONS = {
	style: 'percent',
	signDisplay: 'exceptZero',
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
}

export const formatPercentage = (value, options = FORMAT_PERCENTAGE_OPTIONS) => {
	const customOptions = lodash.merge(FORMAT_PERCENTAGE_OPTIONS, options)
	const formatter = new Intl.NumberFormat(
		'es-VE',
		customOptions
	);

	return formatter.format(value);
}