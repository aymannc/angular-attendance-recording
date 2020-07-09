import {Component, OnInit} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {ApiService} from '../../../Services/api.service';
import {ActivatedRoute} from '@angular/router';
import {ElementApi} from '../../../Data/ElementsResponse';
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table';

interface DataItem {
  self: string;
  date: string;
  startTime: Date;
  endTime: Date;
  edit: boolean;
}

interface ColumnItem {
  name: string;
  icon: string;
  sortOrder?: NzTableSortOrder;
  sortFn?: NzTableSortFn;
  listOfFilter?: NzTableFilterList;
  filterFn?: NzTableFilterFn;
  filterMultiple?: boolean;
  sortDirections?: NzTableSortOrder[];
}

@Component({
  selector: 'app-upcoming-sessions',
  templateUrl: './upcoming-sessions.component.html',
  styleUrls: ['./upcoming-sessions.component.css']
})
export class UpcomingSessionsComponent implements OnInit {
  listOfColumns: ColumnItem[] = [
    {
      name: 'Date',
      sortFn: (a: DataItem, b: DataItem) => a.date.localeCompare(b.date),
      icon: 'calendar'
    },
    {
      name: 'Start time',
      sortFn: (a: DataItem, b: DataItem) => a.startTime.toString().localeCompare(a.startTime.toString()),
      icon: 'clock-circle'
    }, {
      name: 'End time',
      sortFn: (a: DataItem, b: DataItem) => a.endTime.toString().localeCompare(a.endTime.toString()),
      icon: 'clock-circle'
    }, {
      name: 'Action',
      icon: 'setting'
    },
  ];
  listOfData: DataItem[] = [];
  loading: any;
  element: ElementApi;
  pageLoading: boolean;
  notFound = false;
  private elementId: number;

  constructor(private message: NzMessageService, private apiService: ApiService,
              private route: ActivatedRoute) {
  }

  disabledHours(): number[] {
    return [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23];
  }

  createMessage(type?: string): void {
    this.message.success(`Notification sent successfully to students`);
  }

  startEdit(data: DataItem): void {
    data.edit = true;
  }

  saveEdit(data: DataItem): void {
    data.edit = false;
    this.apiService.editSeance(data.self, data)
      .subscribe(() => {
        this.message.success('Updated successfully');
        this.createMessage();
      }, () => {
        this.message.error('Error while updating the state');
      });
  }

  ngOnInit(): void {
    this.checkForElement();
  }

  private getData() {
    const data = [];
    this.apiService.getSeancesGreaterThanToday(this.elementId).subscribe(response => {
      const today = new Date();
      response.forEach(item => {
        const [h, m, s] = item.heureDebut.split(':');
        const [hh, mm, ss] = item.heureFin.split(':');
        data.push({
          self: item._links.self.href,
          date: item.jour,
          startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), +h, +m, 0),
          endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), +hh, +mm, 0),
          edit: false
        });
      });
    }, () => this.message.error('Error'), () => this.listOfData = [...data]);
  }

  private checkForElement() {
    this.pageLoading = true;
    this.elementId = this.route.snapshot.params.id;
    this.apiService.getElement(null, this.elementId).subscribe(element => {
      this.pageLoading = false;
      this.element = element;
      this.getData();
    }, error => {
      this.message.error('error');
      this.pageLoading = false;
      this.notFound = true;
    });
  }
}
