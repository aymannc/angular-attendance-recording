import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../Services/api.service';
import {SeanceProjection} from '../../Data/SeanceProjectionResponse';

@Component({
  selector: 'app-schedule-component',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  listSeances: SeanceProjection[];
  isLoading: boolean;
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  hours = ['08:30:00', '10:30:00', '14:00:00', '16:00:00'];
  rows = null;

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.isLoading = true;
    this.apiService.getProfessorsSeancesProjection()
      .subscribe(
        data => {
          this.isLoading = false;
          this.listSeances = data;
          this.buildRows();
        }, error => {
          this.isLoading = false;
        }
      );
  }

  private buildRows() {
    this.rows = [];
    console.log(this.listSeances.length);
    for (const day of this.days) {
      const tempRow = [];
      for (const hour of this.hours) {
        let foundIt = false;
        for (const seance of this.listSeances) {
          if (seance.jourSeance === day && seance.heureDebut === hour) {
            foundIt = true;
            tempRow.push({
              link: '/absence/element/' + seance.elementId,
              element: seance.elementName,
              salle: seance.salle.numero
            });
            break;
          }
        }
        if (!foundIt) {
          tempRow.push({});
        }
      }
      this.rows.push(tempRow);

    }
  }
}
