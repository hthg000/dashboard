import { Routes } from '@angular/router';
import { DefaultComponent } from '@layouts/index';
import { DashboardComponent } from '@modules/dashboard/components';

export const routes: Routes = [
	{
		path: '',
		component: DefaultComponent,
		children: [
			{
				path: '',
				component: DashboardComponent,
			},
		]
	},

]
