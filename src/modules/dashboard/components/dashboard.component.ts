import * as am5 from '@amcharts/amcharts5'
import * as am5xy from '@amcharts/amcharts5/xy'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { ChangeDetectionStrategy, Component, Inject, inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSelectModule } from '@angular/material/select'
import ReportDto from '../dtos/report.dto'
import { Province, Regions, Report } from '../models'
import { ApiService } from '../services'
import { YEARS } from './../resources/year.resource'
@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatSelectModule, MatIconModule, MatListModule],
	templateUrl: '../templates/dashboard.component.html',
	styleUrl: '../styles/dashboard.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
	protected regions: Regions[] = []
	protected provinces: Province[] = []
	protected readonly years = YEARS
	protected selectedRegions: string = ''
	protected selectedprovince: Province | null = null
	protected selectedYear = YEARS[2]
	protected dataReport: Report[] = []
	private root: am5.Root | undefined
	protected reportDto: ReportDto = {
		date: `${this.selectedYear}-01-01`,
		iso: '',
		region_province: '',
		per_page: 1000
	}
	private readonly _apiService = inject(ApiService)

	constructor(private readonly _zone: NgZone, @Inject(PLATFORM_ID) private platformId: Object) { }

	ngOnInit(): void {
		this._apiService.getRegions().subscribe((res: Regions[]) => {
			this.regions = res
			this.selectedRegions = this.regions[0].iso
			this.onRegionsChange(this.selectedRegions)
		})
	}

	ngOnDestroy() {
		if (this.root) {
			this.root.dispose()
		}
	}

	protected onRegionsChange(iso: string) {
		this.provinces = []
		this.reportDto.iso = iso
		this._apiService.getProvinces(iso).subscribe((res: Province[]) => {
			this.provinces = res
			this.selectedprovince = res[0]
			this.reportDto.region_province = this.selectedprovince.province
			this._getReport()
		})
	}

	protected onProvinceChange(province: Province) {
		this.reportDto.region_province = province.province
		this.selectedprovince = province
		this._getReport()
	}

	protected onYearChange(year: number) {
		// temporarily take January 1st of that year
		this.reportDto.date = `${year}-01-01`
		this._getReport()
	}

	private _getReport() {
		this._apiService.getReport(this.reportDto).subscribe((res: any[]) => {
			if (res.length > 0) {
				this.dataReport = res
				this._createChart(this.dataReport[0])
			}
		})
	}

	private _createChart(record: Report): void {
		if (isPlatformBrowser(this.platformId)) {
			this._zone.runOutsideAngular(() => {
				// Dispose of the existing root if it exists to avoid multiple instances on the same DOM node
				if (this.root) {
					this.root.dispose()
					this.root = undefined // Reset the root to avoid stale references
				}

				this.root = am5.Root.new('ChartDiv') // Create a new Root instance

				let chart = this.root.container.children.push(
					am5xy.XYChart.new(this.root, {
						panX: true,
						panY: true,
						wheelX: 'panX',
						wheelY: 'zoomX',
						layout: this.root.verticalLayout
					})
				)

				let xAxis = chart.xAxes.push(
					am5xy.CategoryAxis.new(this.root, {
						categoryField: 'category',
						renderer: am5xy.AxisRendererX.new(this.root, {})
					})
				)

				let yAxis = chart.yAxes.push(
					am5xy.ValueAxis.new(this.root, {
						renderer: am5xy.AxisRendererY.new(this.root, {})
					})
				)

				let series = chart.series.push(
					am5xy.ColumnSeries.new(this.root, {
						name: 'Confirmed Cases',
						xAxis: xAxis,
						yAxis: yAxis,
						valueYField: 'value',
						categoryXField: 'category'
					})
				)

				series.columns.template.setAll({
					tooltipText: '{category}: {valueY}',
					width: am5.percent(80),
					tooltipY: 0
				})

				const chartData = [
					{ category: 'Confirmed', value: record?.confirmed },
					{ category: 'Deaths', value: record?.deaths },
					{ category: 'Recovered', value: record?.recovered }
				]

				xAxis.data.setAll(chartData)
				series.data.setAll(chartData)
			})
		}
	}
}
