import {Component, OnInit} from '@angular/core';
import {multi} from 'src/app/Data/FiliereData';

@Component({
  selector: 'app-student-stats',
  templateUrl: './student-stats.component.html',
  styleUrls: ['./student-stats.component.css']
})
export class StudentStatsComponent implements OnInit {

  semester = '';
  annee = '';
  filiere = '';

  multi: any[];
  view: any[] = [900, 500];
  trimYAxisTicks = false;

  // options
  legendPosition = 'right';
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  yAxisLabel = 'Modules';
  showYAxisLabel = true;
  xAxisLabel = 'Nombre Heure en %';
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  expandSet = new Set<number>();
  listOfData = [
    {
      id: 1,
      objet: 'Abscence Erroné',
      date: '2020-06-03',
      expand: false,
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      objet: 'Abscence Erroné',
      date: '2020-06-03',
      expand: false,
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      objet: 'Abscence Erroné',
      date: '2020-06-03',
      expand: false,
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];

  constructor() {
    Object.assign(this, {multi});
  }

  ngOnInit() {

  }

  onSelect(event) {
    console.log(event);
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
