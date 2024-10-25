import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsideComponent } from '@shared/index';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  standalone: true,
  selector: 'app-layout-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
  imports: [CommonModule, RouterModule, AsideComponent, HeaderComponent],
})
export class DefaultComponent {}
