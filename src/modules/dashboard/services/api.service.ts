import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, map, Observable, tap, throwError } from 'rxjs'
import { ProvincesResponse, RegionsResponse, ReportResponse } from '../response'
import ReportDto from '../dtos/report.dto'
import { Province, Regions, Report } from '../models'

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private _enPoint = ' https://covid-api.com/api'
	private readonly _perPage = 1002
	constructor(private readonly _httpClient: HttpClient) { }

	public getRegions(): Observable<Regions[]> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			params: new HttpParams().set('per_page', this._perPage)
		}

		return this._httpClient.get<RegionsResponse>(`${this._enPoint}/regions`, httpOptions).pipe(
			tap((res) => res),
			map((res: RegionsResponse) => {
				return res.data
			}),
			catchError(() => {
				return throwError(() => new Error('Failed to regions. Please try again later.'))
			})
		)
	}

	public getProvinces(iso: string): Observable<Province[]> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			params: new HttpParams().set('per_page', this._perPage)
		}

		return this._httpClient.get<ProvincesResponse>(`${this._enPoint}/provinces/${iso}`, httpOptions).pipe(
			tap((res) => res),
			map((res: ProvincesResponse) => {
				return res.data
			}),
			catchError(() => {
				return throwError(() => new Error('Failed to provinces. Please try again later.'))
			})
		)
	}

	public getReport(reportDto: ReportDto): Observable<Report[]> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json'
			}),
			params: new HttpParams()
				.set('per_page', this._perPage)
				.set('date', reportDto.date)
				.set('region_province', reportDto.region_province)
				.set('iso', reportDto.iso)
		}

		return this._httpClient.get<ReportResponse>(`${this._enPoint}/reports`, httpOptions).pipe(
			tap((res) => res),
			map((res: ReportResponse) => {
				return res.data
			}),
			catchError(() => {
				return throwError(() => new Error('Failed to regions. Please try again later.'))
			})
		)
	}
}
