export interface Report {
	date: Date
	confirmed: number
	deaths: number
	recovered: number
	confirmed_diff: number
	deaths_diff: number
	recovered_diff: number
	last_update: Date
	active: number
	active_diff: number
	fatality_rate: number
	region: {
		iso: string
		name: string
		province: string
		lat: string
		long: string
		cities: {
			name: string
			date: Date
			fips: number
			lat: null | string
			long: null | string
			confirmed: number
			deaths: number
			confirmed_diff: number
			deaths_diff: number
			last_update: Date
		}[]
	}
}
