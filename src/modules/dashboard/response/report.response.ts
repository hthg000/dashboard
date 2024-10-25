import { Report } from "../models"

export interface ReportResponse {
	current_page: number
	first_page_url: string
	last_page_url: string
	next_page_url: null
	prev_page_url: null
	per_page: string
	last_page: number
	from: number
	path: string
	to: number
	total: number
	data: Report[]
}

