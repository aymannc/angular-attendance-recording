import {Component, OnInit} from '@angular/core';
import {CamerasTableComponent} from './cameras-table/cameras-table.component';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent implements OnInit {

  tabs: string [] = ['Live streams', 'List of cameras'];
  selectedIndex = 0;

  log(args: any[]): void {
    console.log(args);
  }

  ngOnInit(): void {
  }

}
